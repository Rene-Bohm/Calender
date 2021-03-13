//Das ist eine Node.Js Server Pog
require("dotenv").config();

const express = require("express");

const bucket = require("./BuckerServer");

const app = express();

bucket(app, "/bucket", "Data.json");

app.use(express.static("public"));

let port = process.env.PORT || 5000;

app.listen(port, () => console.log(`starte Server on PORT? ${port}`));
