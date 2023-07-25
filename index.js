import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const list = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { text: list });
});

app.post("/submit", (req, res) => {
  list.push(req.body.input);
  res.render("index.ejs", { text: list });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
