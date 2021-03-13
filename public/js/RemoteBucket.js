class RemoteBucket {
    /**
     * Creates a new bucket with LocalStorageLike functions.
     * @param {string} anchor The acces point for the remote storage.
     * @param {any} options
     */
    constructor(anchor, options) {
        this.anchor = anchor;
        this.auth = (options || {}).auth;
        this.timeout = (options || {}).timeout || 5000;

        let xhr = new XMLHttpRequest();
        xhr.open("PUT", this.anchor);
        xhr.send();
    }

    /**
     * Returns the current value associated with the given key,
     * or null if the given key does not exist in the list associated with the object.
     * @param {string} key
     * @returns {string | null}
     */
    async getItem(key) {
        if (!key) return null;
        return this._withTimeout((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (
                    this.readyState == XMLHttpRequest.DONE &&
                    this.status == 200
                ) {
                    resolve(this.responseText);
                }
            };
            xhr.open("GET", this.anchor + "?key=" + encodeURIComponent(key));
            xhr.send();
        });
    }

    /**
     * Sets the value of the pair identified by key to value,
     * creating a new key/value pair if none existed for key previously.
     * @param {string} key
     * @param {string} value
     */
    async setItem(key, value) {
        if (!key) return;
        if (!value) return;
        return this._withTimeout((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (
                    this.readyState == XMLHttpRequest.DONE &&
                    this.status == 200
                ) {
                    resolve();
                }
            };
            xhr.open("POST", this.anchor);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    key: key,
                    value: value,
                })
            );
        });
    }

    /**
     * Removes the key/value pair with the given key from the list associated with the object,
     * if a key/value pair with the given key exists.
     * @param {string} key
     */
    async removeItem(key) {
        if (!key) return;
        return this._withTimeout((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (
                    this.readyState == XMLHttpRequest.DONE &&
                    this.status == 200
                ) {
                    resolve();
                }
            };
            xhr.open("DELETE", this.anchor);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    key: key,
                })
            );
        });
    }

    /**
     * Empties the list associated with the object of all key/value pairs, if there are any.
     */
    async clear() {
        return this._withTimeout((resolve) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (
                    this.readyState == XMLHttpRequest.DONE &&
                    this.status == 200
                ) {
                    resolve();
                }
            };
            xhr.open("DELETE", this.anchor);
            xhr.setRequestHeader("content-type", "application/json");
            xhr.send(
                JSON.stringify({
                    all: true,
                })
            );
        });
    }

    async _withTimeout(callback) {
        return Promise.race([
            new Promise((_, r) => setTimeout(r, this.timeout)),
            new Promise(callback),
        ]);
    }
}
