
const slugify = s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const position = {
    'false': 'push',
    'true': 'unshift'
};

const permalinkHref = slug => `#${slug}`;

const permalinkAttrs = slug => ({});

function renderPermalink(slug, opts, state, idx) {
    const space = () => Object.assign(new state.Token('text', '', 0), {
        content: ' '
    });

    const linkTokens = [Object.assign(new state.Token('link_open', 'a', 1), {
        attrs: [...(opts.permalinkClass ? [['class', opts.permalinkClass]] : []), ['href', opts.permalinkHref(slug, state)], ...Object.entries(opts.permalinkAttrs(slug, state))]
    }), Object.assign(new state.Token('html_block', '', 0), {
        content: opts.permalinkSymbol
    }), new state.Token('link_close', 'a', -1)]; // `push` or `unshift` according to position option.
    // Space is at the opposite side.

    if (opts.permalinkSpace) {
        // @ts-ignore
        linkTokens[position[!opts.permalinkBefore]](space());
    }

    for (let j = idx + 1, iK = state.tokens.length; j < iK; j++) {
        const token = state.tokens[j];

        if (token.type === 'heading_close') {
            break;
        }

        if (!token.children) {
            continue;
        }

        token.children[position[opts.permalinkBefore]](...linkTokens);
        break;
    }
}

function uniqueSlug(slug, slugs, failOnNonUnique, startIndex) {
    // If first slug, return as is.
    let key = slug;
    let n = startIndex;

    if (slugs.has(key) && failOnNonUnique) {
        throw new Error(`The ID attribute '${slug}' defined by user or other markdown-it plugin is not unique. Please fix it in your markdown to continue.`);
    }

    while (slugs.has(key)) {
        // Duplicate slug, add a `-1`, `-2`, etc. to keep ID unique.
        key = `${slug}-${n++}`;
    } // Mark this slug as used in the environment.


    slugs.set(key, true);
    return key;
}

const isLevelSelectedNumber = selection => level => level <= selection;

const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
    opts = Object.assign({}, anchor.defaults, opts);
    md.core.ruler.push('anchor', state => {
        const slugs = new Map();
        const tokens = state.tokens;
        const isLevelSelected = Array.isArray(opts.level) ? isLevelSelectedArray(opts.level) : isLevelSelectedNumber(opts.level);
        tokens.forEach((token, i) => {
            if (token.type !== 'heading_open') {
                return;
            } // Before we do anything, we must collect all previously defined ID attributes to ensure we won't generate any duplicates:


            let slug = token.attrGet('id');

            if (slug != null) {
                // mark existing slug/ID as unique, at least.
                // IFF it collides, FAIL!
                // @ts-ignore
                slug = uniqueSlug(slug, slugs, true);
            }
        });
        tokens.forEach((token, i) => {
            if (token.type !== 'heading_open') {
                return;
            }

            if (!isLevelSelected(Number(token.tag.substr(1)))) {
                return;
            } // Aggregate the next token children text.


            let keyparts = [];

            for (let j = i + 1, iK = tokens.length; j < iK; j++) {
                const _token = tokens[j];

                if (_token.type === 'heading_close') {
                    break;
                }

                if (!_token.children) {
                    continue;
                }

                const keypart = _token.children.filter(token => token.type === 'text' || token.type === 'code_inline').reduce((acc, t) => acc + t.content, '').trim();

                if (keypart.length > 0) {
                    keyparts.push(keypart);
                }
            }

            const title = keyparts.join(' ');
            let slug = token.attrGet('id');

            if (slug == null) {
                slug = uniqueSlug(opts.slugify(title), slugs, false, opts.uniqueSlugStartIndex);
                token.attrSet('id', slug);
            }

            if (opts.permalink) {
                opts.renderPermalink(slug, opts, state, i);
            }

            if (opts.callback) {
                opts.callback(token, {
                    slug,
                    title
                });
            }
        });
    });
};

anchor.defaults = {
    level: 6,
    // **max** level or array of levels
    slugify,
    uniqueSlugStartIndex: 1,
    permalink: false,
    renderPermalink,
    permalinkClass: 'header-anchor',
    permalinkSpace: true,
    permalinkSymbol: '¶',
    permalinkBefore: false,
    permalinkHref,
    permalinkAttrs
};

export default anchor;
