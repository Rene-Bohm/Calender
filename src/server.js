//Das ist eine Node.Js Server Pog

require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.static("public"));
app.use("/bucket", require("./BucketServer"));

let port = process.env.PORT || 8000;
app.listen(port, () => console.log(`starte Server on PORT? ${port}`));
