const retryableStatuses = new Set([408, 429, 500, 502, 503, 504]);
const idempotentMethods = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);
const maxTimerDelay = 2147483647;

export function requestPolicy(config) {
    const retries = config.retries ?? 0;
    const retryDelay = config.retryDelay ?? 250;
    const maxRetryDelay = config.maxRetryDelay ?? 30000;
    const timeout = config.timeout ?? 0;
    if (!Number.isInteger(retries) || retries < 0 || retries > 10) {
        throw new RangeError('retries must be an integer between 0 and 10');
    }
    for (const [name, value] of Object.entries({ retryDelay, maxRetryDelay, timeout })) {
        if (!Number.isFinite(value) || value < 0 || value > maxTimerDelay) {
            throw new RangeError(`${name} must be between 0 and ${maxTimerDelay} milliseconds`);
        }
    }
    if (config.idempotencyKey !== undefined &&
        (typeof config.idempotencyKey !== 'string' || !config.idempotencyKey.trim())) {
        throw new TypeError('idempotencyKey must be a nonempty string');
    }
    return { retries, retryDelay, maxRetryDelay, timeout };
}

export function canRetry(request, response) {
    const safe = idempotentMethods.has(request.method) || Boolean(request.headers.get('Idempotency-Key')?.trim());
    return safe && (!response || retryableStatuses.has(response.status));
}

export function retryDelay(policy, attempt, response) {
    const header = response?.headers.get('Retry-After');
    let delay = policy.retryDelay * 2 ** attempt;
    if (header !== null && header !== undefined) {
        const seconds = /^\d+(\.\d+)?$/.test(header.trim()) ? Number(header) : NaN;
        const requested = Number.isFinite(seconds) ? seconds * 1000 : Date.parse(header) - Date.now();
        if (Number.isFinite(requested)) delay = Math.max(delay, requested);
    }
    return Math.min(policy.maxRetryDelay, Math.max(0, delay));
}

/** One deadline for preparation, all attempts, backoff, and response parsing. */
export function requestScope(signal, timeout) {
    const controller = new AbortController();
    const abort = () => controller.abort(signal.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener('abort', abort, { once: true });
    const timer = timeout > 0 ? setTimeout(() => {
        controller.abort(new DOMException(`Request timed out after ${timeout}ms`, 'TimeoutError'));
    }, timeout) : undefined;
    return {
        signal: controller.signal,
        dispose() {
            clearTimeout(timer);
            signal?.removeEventListener('abort', abort);
        },
    };
}

export async function withSignal(operation, signal) {
    signal.throwIfAborted();
    let abort;
    try {
        return await Promise.race([
            operation(),
            new Promise((resolve, reject) => {
                abort = () => reject(signal.reason);
                signal.addEventListener('abort', abort, { once: true });
                if (signal.aborted) abort();
            }),
        ]);
    } finally {
        if (abort) signal.removeEventListener('abort', abort);
    }
}

export async function backoff(delay, signal) {
    let timer;
    try {
        await withSignal(() => new Promise(resolve => { timer = setTimeout(resolve, delay); }), signal);
    } finally {
        clearTimeout(timer);
    }
}
