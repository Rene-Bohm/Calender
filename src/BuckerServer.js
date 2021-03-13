const fs = require("fs");
const express = require("express");

module.exports = function handleBuckets(app, prefix, saveFile) {
	const exists = fs.existsSync(saveFile);
	if (!exists) fs.writeFileSync(saveFile, JSON.stringify({}));

	const buckets = JSON.parse(fs.readFileSync(saveFile).toString());

	app.put(prefix + "/:id", (req, res) => {
		const bucket = req.params.id;
		if (!buckets[bucket]) buckets[bucket] = {};
		res.end();
	});

	app.get(prefix + "/:id", (req, res) => {
		const bucket = req.params.id;
		const key = req.query.key;
		if (!key) return res.status(400).end();
		res.end(buckets[bucket][key]);
	});

	app.post(prefix + "/:id", express.json(), (req, res) => {
		const bucket = req.params.id;
		const key = req.body.key;
		const value = req.body.value;
		if (!key) return res.status(400).end();
		if (!value) return res.status(400).end();
		try {
			const Valeru = JSON.parse(value);
			if (!Array.isArray(Valeru)) {
				return res.status(400).end();
			}
		} catch {
			return res.status(400).end();
		}
		buckets[bucket][key] = value;
		fs.writeFile(saveFile, JSON.stringify(buckets), () => {
			res.end();
		});
	});

	app.delete(prefix + "/:id", express.json(), (req, res) => {
		const bucket = req.params.id;
		const key = req.body.key;
		if (!key) {
			if (req.body.all === true) {
				buckets[bucket] = {};
				return res.end();
			} else {
				return res.status(400).end();
			}
		}
		delete buckets[bucket][key];
		fs.writeFile(saveFile, JSON.stringify(buckets), () => {
			res.end();
		});
	});
};
