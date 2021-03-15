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
	}

	async getItems() {
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
			xhr.open("GET", this.anchor);
			xhr.send();
		});
	}

	async newEvent(date, title) {
		if (!date) return;
		if (!title) return;
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
					date: date,
					title: title,
				})
			);
		});
	}

	async removeItem(date) {
		if (!date) return;
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
					date: date,
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
