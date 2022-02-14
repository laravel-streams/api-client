export class ETagCache {
    constructor(streams, storage) {
        this.streams = streams;
        this.storage = storage;
    }
    get manifestKey() { return this.streams.config.etag.manifestKey; }
    get(key) {
        return this.storage.get(key);
    }
    set(key, etag, value) {
        this.addToUuidManifest(key);
        return this.storage.set(key, { etag, value });
    }
    reset() {
        this.getUuidManifest().forEach(uuid => this.storage.unset(uuid));
    }
    getUuidManifest() {
        if (!this.storage.has(this.manifestKey)) {
            this.storage.set(this.manifestKey, []);
        }
        return this.storage.get(this.manifestKey, []);
    }
    addToUuidManifest(uuid) {
        let manifest = this.getUuidManifest();
        manifest.push(uuid);
        this.storage.set(this.manifestKey, manifest);
    }
}
