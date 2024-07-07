const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const morgan = require("morgan");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/main.js", (req, res) => {
  res.type("javascript");
  res.send(
    fs
      .readFileSync(path.join(__dirname, "public/main.js"), "utf8")
      .replace(
        "//////INCLUDE//////",
        fs.readFileSync(path.join(__dirname, "code.js"), "utf8"),
      ),
  );
});

let imageCounter = 0;
app.post("/image", (req, res) => {
  const imageURL = req.body.image;
  const filename = `image-${imageCounter++}.png`;
  const filepath = `./public/images/${filename}`;
  fs.writeFile(
    filepath,
    imageURL.replace(/^data:image\/png;base64,/, ""),
    "base64",
    (err) => {
      !err
        ? res.send({ filename })
        : res.status(500).send("Error saving image");
    },
  );
});

app.get("/done", () => {
  process.exit();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
