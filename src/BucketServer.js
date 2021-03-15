const fs = require("fs");
const express = require("express");

const router = express.Router();
module.exports = router;

const fexists = fs.existsSync("data.json");
if (!fexists) fs.writeFileSync("data.json", "{}");

const buckets = JSON.parse(fs.readFileSync("data.json"));

// Get Data
router.get("/:id", (req, res) => {
	if (!buckets[req.params.id]) buckets[req.params.id] = [];
	res.json(buckets[req.params.id]);
});

// New event
router.post(
	"/:id",
	express.json(),
	express.urlencoded({ extended: false }),
	(req, res) => {
		const date = req.body.date;
		const title = req.body.title;

		if (!date) return res.status(400).end("Error");
		if (!title) return res.status(400).end("Error");

		if (
			buckets[req.params.id] === undefined ||
			!Array.isArray(buckets[req.params.id])
		)
			buckets[req.params.id] = [];

		if (buckets[req.params.id].find((v) => v.date === date))
			return res.end("Ok");

		buckets[req.params.id].push({ date: date, title: title });
		res.end("OK");

		fs.writeFile("data.json", JSON.stringify(buckets), (e) => {
			if (e) console.error(e);
		});
	}
);

// Delete
router.delete(
	"/:id",
	express.json(),
	express.urlencoded({ extended: false }),
	(req, res) => {
		const date = req.body.date;

		if (!date) return res.status(400).end("Error");

		if (
			buckets[req.params.id] === undefined ||
			!Array.isArray(buckets[req.params.id])
		)
			buckets[req.params.id] = [];

		buckets[req.params.id] = buckets[req.params.id].filter((v) => {
			return v.date !== date;
		});
		res.end("OK");

		fs.writeFile("data.json", JSON.stringify(buckets), (e) => {
			if (e) console.error(e);
		});
	}
);
