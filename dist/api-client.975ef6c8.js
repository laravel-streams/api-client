// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      if (res === false) {
        return {};
      }
      // Synthesize a module to follow re-exports.
      if (Array.isArray(res)) {
        var m = {__esModule: true};
        res.forEach(function (v) {
          var key = v[0];
          var id = v[1];
          var exp = v[2] || v[0];
          var x = newRequire(id);
          if (key === '*') {
            Object.keys(x).forEach(function (key) {
              if (
                key === 'default' ||
                key === '__esModule' ||
                Object.prototype.hasOwnProperty.call(m, key)
              ) {
                return;
              }

              Object.defineProperty(m, key, {
                enumerable: true,
                get: function () {
                  return x[key];
                },
              });
            });
          } else if (exp === '*') {
            Object.defineProperty(m, key, {
              enumerable: true,
              value: x,
            });
          } else {
            Object.defineProperty(m, key, {
              enumerable: true,
              get: function () {
                if (exp === 'default') {
                  return x.__esModule ? x.default : x;
                }
                return x[exp];
              },
            });
          }
        });
        return m;
      }
      return newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"3VwnP":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "890e741a975ef6c8";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"8lqZg":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Client", ()=>(0, _clientJs.Client));
parcelHelpers.export(exports, "Criteria", ()=>(0, _criteriaJs.Criteria));
parcelHelpers.export(exports, "Entries", ()=>(0, _entriesJs.Entries));
parcelHelpers.export(exports, "FetchError", ()=>(0, _fetchErrorJs.FetchError));
parcelHelpers.export(exports, "FetchHeaders", ()=>(0, _fetchHeadersJs.FetchHeaders));
parcelHelpers.export(exports, "FetchRequest", ()=>(0, _fetchRequestJs.FetchRequest));
parcelHelpers.export(exports, "Resource", ()=>(0, _resourceJs.Resource));
parcelHelpers.export(exports, "Streams", ()=>(0, _streamsJs.Streams));
parcelHelpers.export(exports, "AuthorizationMiddleware", ()=>(0, _indexJs.AuthorizationMiddleware));
parcelHelpers.export(exports, "CriteriaMiddleware", ()=>(0, _indexJs.CriteriaMiddleware));
parcelHelpers.export(exports, "ETagMiddleware", ()=>(0, _indexJs.ETagMiddleware));
parcelHelpers.export(exports, "Middleware", ()=>(0, _indexJs.Middleware));
parcelHelpers.export(exports, "QueryMiddleware", ()=>(0, _indexJs.QueryMiddleware));
parcelHelpers.export(exports, "RequestDataMiddleware", ()=>(0, _indexJs.RequestDataMiddleware));
parcelHelpers.export(exports, "ResponseDataMiddleware", ()=>(0, _indexJs.ResponseDataMiddleware));
var _clientJs = require("./Client.js");
var _criteriaJs = require("./Criteria.js");
var _entriesJs = require("./Entries.js");
var _fetchErrorJs = require("./FetchError.js");
var _fetchHeadersJs = require("./FetchHeaders.js");
var _fetchRequestJs = require("./FetchRequest.js");
var _resourceJs = require("./Resource.js");
var _streamsJs = require("./Streams.js");
var _indexJs = require("./middleware/index.js");
// Make available globally if in browser
if (typeof window !== 'undefined') window.streams_api = {
    Client,
    Criteria,
    Entries,
    FetchError,
    FetchHeaders,
    FetchRequest,
    Resource,
    Streams,
    AuthorizationMiddleware,
    CriteriaMiddleware,
    ETagMiddleware,
    Middleware,
    QueryMiddleware,
    RequestDataMiddleware,
    ResponseDataMiddleware
};

},{"./Client.js":"ceaCL","./Criteria.js":"2hQD2","./Entries.js":"lAAsV","./FetchError.js":"2kb0u","./FetchHeaders.js":"77rJM","./FetchRequest.js":"j6JUZ","./Resource.js":"3l2lV","./Streams.js":"8sGQi","./middleware/index.js":"jlYqR","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"ceaCL":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Main API Client class
 */ parcelHelpers.export(exports, "Client", ()=>Client);
var _utilsJs = require("./utils.js");
var _streamsJs = require("./Streams.js");
var _entriesJs = require("./Entries.js");
var _fetchRequestJs = require("./FetchRequest.js");
var _fetchErrorJs = require("./FetchError.js");
var _indexJs = require("./middleware/index.js");
class Client {
    constructor(options){
        options = {
            middlewares: [],
            defaultMiddlewares: [
                new (0, _indexJs.RequestDataMiddleware)(),
                new (0, _indexJs.CriteriaMiddleware)(),
                new (0, _indexJs.QueryMiddleware)(),
                new (0, _indexJs.ResponseDataMiddleware)()
            ],
            ...options
        };
        this.options = {
            baseURL: '',
            request: {
                mode: 'cors',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }
        };
        const { middlewares, defaultMiddlewares, ...opts } = options;
        this.options = (0, _utilsJs.mergeObjects)(this.options, opts);
        this.middlewares = defaultMiddlewares.concat(middlewares);
        this.streams = new (0, _streamsJs.Streams)(this);
        this.entries = new (0, _entriesJs.Entries)(this);
    }
    /**
     * Add a middleware to the client
     */ use(middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Make an HTTP request
     */ async request(method, uri, config = {}) {
        let url = (0, _utilsJs.Str).ensureRight(this.options.baseURL, '/') + (0, _utilsJs.Str).stripLeft(uri, '/');
        config.method = method;
        config = (0, _utilsJs.mergeObjects)(this.options.request, config);
        let request = new (0, _fetchRequestJs.FetchRequest)(url, config);
        request = await (0, _indexJs.Middleware).run(this, request, 'request');
        return request.fetch().then(async (request)=>{
            if (!request.response.ok) throw new (0, _fetchErrorJs.FetchError)(request);
            request.response = await (0, _indexJs.Middleware).run(this, request.response, 'response');
            return request.response;
        }).catch(async (error)=>{
            error = await (0, _indexJs.Middleware).run(this, error, 'error');
            throw error;
        });
    }
}

},{"./utils.js":"en4he","./Streams.js":"8sGQi","./Entries.js":"lAAsV","./FetchRequest.js":"j6JUZ","./FetchError.js":"2kb0u","./middleware/index.js":"jlYqR","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"en4he":[function(require,module,exports,__globalThis) {
/**
 * String utility class
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Str", ()=>Str);
parcelHelpers.export(exports, "objectify", ()=>objectify);
/**
 * Convert parameters to query string
 */ parcelHelpers.export(exports, "paramsToQueryString", ()=>paramsToQueryString);
parcelHelpers.export(exports, "mergeObjects", ()=>mergeObjects);
parcelHelpers.export(exports, "isObject", ()=>isObject);
/**
 * Create a custom Map with additional utility methods
 */ parcelHelpers.export(exports, "createCustomMap", ()=>createCustomMap);
/**
 * Simple query string builder (replaces 'qs' dependency)
 */ parcelHelpers.export(exports, "stringify", ()=>stringify);
class Str {
    static random(length = 15) {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < length; i++)text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    static ensureLeft(str, left) {
        if (!str.startsWith(left)) return left + str;
        return str;
    }
    static ensureRight(str, right) {
        if (!str.endsWith(right)) return str + right;
        return str;
    }
    static stripLeft(str, left) {
        if (str.startsWith(left)) return str.substring(left.length);
        return str;
    }
    static stripRight(str, right) {
        if (str.endsWith(right)) return str.substring(0, str.length - right.length);
        return str;
    }
    static ucfirst(string) {
        return string[0].toUpperCase() + string.slice(1);
    }
    static lcfirst(string) {
        return string[0].toLowerCase() + string.slice(1);
    }
    static parameters(str, params) {
        Object.entries(params).forEach(([key, value])=>{
            str = str.replace(new RegExp(':' + key, 'g'), value);
        });
        return str;
    }
}
const objectify = (obj, [k, v])=>({
        ...obj,
        [k]: v
    });
function paramsToQueryString(params) {
    return encodeURIComponent(btoa(JSON.stringify(params)));
}
const mergeObjects = (target, ...sources)=>{
    if (!sources.length) return target;
    const source = sources.shift();
    if (source === undefined) return target;
    if (isMergeableObject(target) && isMergeableObject(source)) Object.keys(source).forEach(function(key) {
        if (isMergeableObject(source[key])) {
            if (!target[key]) target[key] = {};
            mergeObjects(target[key], source[key]);
        } else target[key] = source[key];
    });
    return mergeObjects(target, ...sources);
};
const isObject = (item)=>{
    return item !== null && typeof item === 'object';
};
/**
 * Check if object is mergeable
 */ const isMergeableObject = (item)=>{
    return isObject(item) && !Array.isArray(item);
};
function createCustomMap(obj = {}) {
    const map = new class extends Map {
        toObject() {
            return Array.from(this.entries()).map((kv)=>[
                    kv[0],
                    kv[1]
                ]).reduce(objectify, {});
        }
        toKeys() {
            return Array.from(this.keys());
        }
        merge(obj) {
            obj = mergeObjects(this.toObject(), obj);
            Object.entries(obj).forEach(([k, v])=>this.set(k, v));
            return this;
        }
        empty() {
            return this.size === 0;
        }
    }();
    map.merge(obj);
    return map;
}
function stringify(obj, options = {}) {
    const encodeValuesOnly = options.encodeValuesOnly !== false;
    const encode = (str)=>{
        if (encodeValuesOnly) return String(str);
        return encodeURIComponent(str);
    };
    const buildParams = (prefix, value)=>{
        if (value === null || value === undefined) return '';
        if (Array.isArray(value)) return value.map((v, i)=>buildParams(`${prefix}[${i}]`, v)).join('&');
        if (typeof value === 'object') return Object.keys(value).map((key)=>buildParams(`${prefix}[${key}]`, value[key])).join('&');
        return `${prefix}=${encode(value)}`;
    };
    return Object.keys(obj).map((key)=>{
        const value = obj[key];
        if (value === null || value === undefined) return '';
        if (Array.isArray(value) || typeof value === 'object') return buildParams(key, value);
        return `${key}=${encode(value)}`;
    }).filter(Boolean).join('&');
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports,__globalThis) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"8sGQi":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Streams resource class for managing streams
 */ parcelHelpers.export(exports, "Streams", ()=>Streams);
var _resourceJs = require("./Resource.js");
class Streams extends (0, _resourceJs.Resource) {
    async get(config = {}) {
        return this.client.request('get', '/streams', config);
    }
    async find(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}`, config);
    }
    async post(data, config = {}) {
        return this.client.request('post', '/streams', config);
    }
    async patch(config = {}) {
        return this.client.request('patch', '/streams', config);
    }
    async put(config = {}) {
        return this.client.request('put', '/streams', config);
    }
    async delete(stream, config = {}) {
        return this.client.request('delete', `/streams/${stream}`, config);
    }
}

},{"./Resource.js":"3l2lV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"3l2lV":[function(require,module,exports,__globalThis) {
/**
 * Base Resource class
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Resource", ()=>Resource);
class Resource {
    constructor(client){
        this.client = client;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"lAAsV":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Entries resource class for managing stream entries
 */ parcelHelpers.export(exports, "Entries", ()=>Entries);
var _resourceJs = require("./Resource.js");
class Entries extends (0, _resourceJs.Resource) {
    async get(stream, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries`, config);
    }
    async find(stream, entry, config = {}) {
        return this.client.request('get', `/streams/${stream}/entries/${entry}`, config);
    }
    async post(stream, data, config = {}) {
        config.data = data;
        return this.client.request('post', `/streams/${stream}/entries`, config);
    }
    async patch(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('patch', `/streams/${stream}/entries/${entry}`, config);
    }
    async put(stream, entry, data, config = {}) {
        config.data = data;
        return this.client.request('put', `/streams/${stream}/entries/${entry}`, config);
    }
    async delete(stream, entry, config = {}) {
        return this.client.request('delete', `/streams/${stream}/entries/${entry}`, config);
    }
}

},{"./Resource.js":"3l2lV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"j6JUZ":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Extended Request class with additional functionality
 */ parcelHelpers.export(exports, "FetchRequest", ()=>FetchRequest);
var _fetchHeadersJs = require("./FetchHeaders.js");
var _utilsJs = require("./utils.js");
class FetchRequest extends Request {
    constructor(input, init = {}){
        super(input, init);
        this.responseType = init.responseType || 'json';
        this.query = (0, _utilsJs.createCustomMap)(init.query || {});
        this.criteria = init.criteria;
        this.data = init.data;
        this.response = null;
        // Create custom headers
        Object.defineProperty(this, 'headers', {
            value: new (0, _fetchHeadersJs.FetchHeaders)(init.headers),
            writable: false
        });
    }
    isResponseType(responseType) {
        return this.responseType === responseType;
    }
    async fetch() {
        const response = await fetch(this.url, this);
        this.response = response;
        response.request = this;
        return this;
    }
    setUrl(url) {
        Object.defineProperty(this, 'url', {
            value: url,
            writable: false
        });
        return this;
    }
}

},{"./FetchHeaders.js":"77rJM","./utils.js":"en4he","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"77rJM":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Custom Headers class with convenient methods
 */ parcelHelpers.export(exports, "FetchHeaders", ()=>FetchHeaders);
var _utilsJs = require("./utils.js");
class FetchHeaders extends Headers {
    constructor(init){
        super(init && init instanceof FetchHeaders ? init.toObject() : init);
    }
    accept(mime) {
        this.set('Accept', mime);
        return this;
    }
    contentType(mime) {
        this.set('Content-Type', mime);
        return this;
    }
    ifNoneMatch(etag) {
        this.set('If-None-Match', etag);
        return this;
    }
    basic(...args) {
        return this.authorization('Basic', args[1] === undefined ? args[0] : btoa(args[0] + ':' + args[1]));
    }
    bearer(token) {
        return this.authorization('Bearer', token);
    }
    authorization(key, value) {
        this.set('Authorization', key + ' ' + value);
        return this;
    }
    toObject() {
        const result = {};
        this.forEach((value, key)=>{
            result[key] = value;
        });
        return result;
    }
}

},{"./utils.js":"en4he","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2kb0u":[function(require,module,exports,__globalThis) {
/**
 * Custom error for HTTP fetch failures
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "FetchError", ()=>FetchError);
class FetchError extends Error {
    constructor(request){
        super(`HTTP ${request.response.status} error:\n ${request.response.statusText}`);
        this.request = request;
        this.status = request.response.status;
        this.statusText = request.response.statusText;
        this.url = request.response.url;
    }
    get response() {
        return this.request.response;
    }
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"jlYqR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Middleware", ()=>(0, _middlewareJs.Middleware));
parcelHelpers.export(exports, "AuthorizationMiddleware", ()=>(0, _authorizationMiddlewareJs.AuthorizationMiddleware));
parcelHelpers.export(exports, "CriteriaMiddleware", ()=>(0, _criteriaMiddlewareJs.CriteriaMiddleware));
parcelHelpers.export(exports, "ETagMiddleware", ()=>(0, _etagMiddlewareJs.ETagMiddleware));
parcelHelpers.export(exports, "QueryMiddleware", ()=>(0, _queryMiddlewareJs.QueryMiddleware));
parcelHelpers.export(exports, "RequestDataMiddleware", ()=>(0, _requestDataMiddlewareJs.RequestDataMiddleware));
parcelHelpers.export(exports, "ResponseDataMiddleware", ()=>(0, _responseDataMiddlewareJs.ResponseDataMiddleware));
var _middlewareJs = require("./Middleware.js");
var _authorizationMiddlewareJs = require("./AuthorizationMiddleware.js");
var _criteriaMiddlewareJs = require("./CriteriaMiddleware.js");
var _etagMiddlewareJs = require("./ETagMiddleware.js");
var _queryMiddlewareJs = require("./QueryMiddleware.js");
var _requestDataMiddlewareJs = require("./RequestDataMiddleware.js");
var _responseDataMiddlewareJs = require("./ResponseDataMiddleware.js");

},{"./Middleware.js":"53V7M","./AuthorizationMiddleware.js":"1Q1bo","./CriteriaMiddleware.js":"l7yCR","./ETagMiddleware.js":"5fSNb","./QueryMiddleware.js":"9z8QY","./RequestDataMiddleware.js":"hYfV2","./ResponseDataMiddleware.js":"k33wH","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"53V7M":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Base Middleware class
 */ parcelHelpers.export(exports, "Middleware", ()=>Middleware);
var _utilsJs = require("../utils.js");
class Middleware {
    static defaultOptions = {
        priority: {
            request: 50,
            response: 50,
            error: 50
        }
    };
    constructor(options = {}){
        this.options = this.constructor.getDefaultOptions(this.constructor, options);
    }
    /**
     * Get middlewares for a specific kind sorted by priority
     */ static get(middlewares, kind) {
        return middlewares.filter((middleware)=>typeof middleware[kind] === 'function').sort((a, b)=>{
            return a.options.priority[kind] - b.options.priority[kind];
        });
    }
    /**
     * Run all middlewares of a specific kind
     */ static async run(client, target, kind) {
        const middlewares = Middleware.get(client.middlewares, kind);
        for (const middleware of middlewares)target = await middleware[kind](target, client);
        return target;
    }
    /**
     * Get default options with inheritance
     */ static getDefaultOptions(t, options = {}) {
        if ((0, _utilsJs.isObject)(t.defaultOptions)) options = (0, _utilsJs.mergeObjects)(t.defaultOptions, options);
        let parent = Object.getPrototypeOf(t);
        if (parent && (0, _utilsJs.isObject)(parent.defaultOptions)) options = this.getDefaultOptions(parent, options);
        return options;
    }
    /**
     * Set priority for middleware execution
     */ priority(priority, kind = false) {
        let kinds = [
            'request',
            'response',
            'error'
        ];
        kind = kind !== undefined && kinds.includes(kind?.toString()) ? kind : false;
        if (!kind) kinds.forEach((kind)=>this.options[kind] = priority);
        else this.options[kind] = priority;
        return this;
    }
}

},{"../utils.js":"en4he","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"1Q1bo":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to handle authorization headers
 */ parcelHelpers.export(exports, "AuthorizationMiddleware", ()=>AuthorizationMiddleware);
var _middlewareJs = require("./Middleware.js");
class AuthorizationMiddleware extends (0, _middlewareJs.Middleware) {
    constructor(options = {}){
        super(options);
        this.token = options.token || null;
        this.type = options.type || 'Bearer';
    }
    async request(request, client) {
        if (this.token) request.headers.authorization(this.type, this.token);
        return request;
    }
    setToken(token, type = 'Bearer') {
        this.token = token;
        this.type = type;
        return this;
    }
}

},{"./Middleware.js":"53V7M","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"l7yCR":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to handle criteria parameters
 */ parcelHelpers.export(exports, "CriteriaMiddleware", ()=>CriteriaMiddleware);
var _middlewareJs = require("./Middleware.js");
class CriteriaMiddleware extends (0, _middlewareJs.Middleware) {
    static defaultOptions = {
        priority: {
            request: 40
        }
    };
    async request(request, client) {
        if (request.criteria) {
            const criteria = request.criteria;
            request.query.merge(criteria.standardizeParameters());
        }
        return request;
    }
}

},{"./Middleware.js":"53V7M","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"5fSNb":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to handle ETag caching
 */ parcelHelpers.export(exports, "ETagMiddleware", ()=>ETagMiddleware);
var _middlewareJs = require("./Middleware.js");
class ETagMiddleware extends (0, _middlewareJs.Middleware) {
    static defaultOptions = {};
    async request(request, client) {
        // ETag support can be added here
        return request;
    }
    async response(response, client) {
        // ETag support can be added here
        return response;
    }
}

},{"./Middleware.js":"53V7M","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"9z8QY":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to convert query parameters to query string
 */ parcelHelpers.export(exports, "QueryMiddleware", ()=>QueryMiddleware);
var _middlewareJs = require("./Middleware.js");
var _utilsJs = require("../utils.js");
var _fetchRequestJs = require("../FetchRequest.js");
class QueryMiddleware extends (0, _middlewareJs.Middleware) {
    static defaultOptions = {
        stringify: {
            encodeValuesOnly: true
        }
    };
    async request(request, client) {
        if (!request.query.empty()) {
            const queryString = (0, _utilsJs.stringify)(request.query.toObject(), this.options.stringify);
            const url = request.url + '?' + queryString;
            request = new (0, _fetchRequestJs.FetchRequest)(url, request);
        }
        return request;
    }
}

},{"./Middleware.js":"53V7M","../utils.js":"en4he","../FetchRequest.js":"j6JUZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hYfV2":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to handle request data/body
 */ parcelHelpers.export(exports, "RequestDataMiddleware", ()=>RequestDataMiddleware);
var _middlewareJs = require("./Middleware.js");
var _fetchRequestJs = require("../FetchRequest.js");
class RequestDataMiddleware extends (0, _middlewareJs.Middleware) {
    static defaultOptions = {};
    async request(request, client) {
        if (request.data) request = new (0, _fetchRequestJs.FetchRequest)(request, {
            body: JSON.stringify(request.data)
        });
        return request;
    }
}

},{"./Middleware.js":"53V7M","../FetchRequest.js":"j6JUZ","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"k33wH":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
/**
 * Middleware to parse response data based on responseType
 */ parcelHelpers.export(exports, "ResponseDataMiddleware", ()=>ResponseDataMiddleware);
var _middlewareJs = require("./Middleware.js");
class ResponseDataMiddleware extends (0, _middlewareJs.Middleware) {
    static defaultOptions = {};
    async response(response, client) {
        const request = response.request;
        if (request.isResponseType('arraybuffer')) response.data = await response.arrayBuffer();
        else if (request.isResponseType('blob')) response.data = await response.blob();
        else if (request.isResponseType('document')) response.data = await response.formData();
        else if (request.isResponseType('json')) response.data = await response.json();
        else if (request.isResponseType('stream')) response.data = await response.body;
        else if (request.isResponseType('text')) response.data = await response.text();
        return response;
    }
}

},{"./Middleware.js":"53V7M","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"2hQD2":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "comparisonOperators", ()=>comparisonOperators);
parcelHelpers.export(exports, "logicalOperators", ()=>logicalOperators);
parcelHelpers.export(exports, "operators", ()=>operators);
/**
 * Criteria builder class - similar to PHP Laravel query builder
 */ parcelHelpers.export(exports, "Criteria", ()=>Criteria);
var _utilsJs = require("./utils.js");
const comparisonOperators = [
    '>',
    '<',
    '==',
    '!=',
    '>=',
    '<=',
    '!<',
    '!>',
    '<>'
];
const logicalOperators = [
    'BETWEEN',
    'EXISTS',
    'OR',
    'AND',
    'NOT',
    'IN',
    'ALL',
    'ANY',
    'LIKE',
    'IS NULL',
    'UNIQUE'
];
const operators = [].concat(comparisonOperators).concat(logicalOperators);
/**
 * Check if value is a valid operator
 */ const isOperator = (value)=>operators.includes(value);
class Criteria {
    constructor(){
        this.parameters = [];
    }
    static make() {
        return new this();
    }
    /**
     * Find an entry by ID
     */ find(id) {
        return this.where('id', id).first();
    }
    /**
     * Return the first result
     */ first() {
        return this.limit(1);
    }
    /**
     * Order the query by field/direction
     */ orderBy(key, direction = 'desc') {
        this.addParameter('orderBy', [
            key,
            direction
        ]);
        return this;
    }
    /**
     * Limit the entries returned
     */ limit(value) {
        this.addParameter('limit', value);
        return this;
    }
    /**
     * Constrain the query by field, operator, value
     * Supports multiple signatures:
     * - where(key, value)
     * - where(key, operator, value)
     * - where(key, operator, value, nested)
     */ where(...args) {
        let key, operator, value, nested = null;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else if (args.length === 3) {
            key = args[0];
            operator = args[1];
            value = args[2];
        } else if (args.length === 4) {
            key = args[0];
            operator = args[1];
            value = args[2];
            nested = args[3];
        }
        if (!isOperator(operator)) throw new Error(`Criteria where() operator "${operator}" not valid`);
        this.addParameter('where', [
            key,
            operator,
            value,
            nested
        ]);
        return this;
    }
    /**
     * Add an OR WHERE clause
     */ orWhere(...args) {
        let key, operator, value;
        if (args.length === 2) {
            key = args[0];
            operator = '==';
            value = args[1];
        } else {
            key = args[0];
            operator = args[1];
            value = args[2];
        }
        if (!isOperator(operator)) throw new Error(`Criteria orWhere() operator "${operator}" not valid`);
        this.addParameter('where', [
            key,
            operator,
            value,
            'or'
        ]);
        return this;
    }
    /**
     * Get paginated criteria results
     */ paginate(per_page = 100, page = 1) {
        this.addParameter('paginate', true);
        this.addParameter('per_page', per_page);
        this.addParameter('page', page);
        return this;
    }
    /**
     * Get the parameters
     */ getParameters() {
        return this.parameters;
    }
    /**
     * Set the parameters
     */ setParameters(parameters) {
        this.parameters = parameters;
        return this;
    }
    /**
     * Add a parameter
     */ addParameter(name, value) {
        this.parameters.push({
            name,
            value
        });
        return this;
    }
    /**
     * Return standardized parameters
     */ standardizeParameters() {
        return this.parameters.map((kv)=>[
                kv['name'],
                kv['value']
            ]).reduce((obj, [k, v], i, data)=>{
            if (Array.isArray(v)) data.slice().filter((kv)=>kv['name'] === k);
            return {
                ...obj,
                [k]: v
            };
        }, {});
    }
    /**
     * Compile criteria to query string
     */ compile() {
        return (0, _utilsJs.paramsToQueryString)(this.standardizeParameters());
    }
}

},{"./utils.js":"en4he","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["3VwnP"], null, "parcelRequire237a", {})

//# sourceMappingURL=api-client.975ef6c8.js.map
