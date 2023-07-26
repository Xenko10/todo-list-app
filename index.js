import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const list = [];
const list2 = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { text: list });
});

app.get("/work", (req, res) => {
  res.render("work.ejs", { text: list2 });
});

app.post("/submit", (req, res) => {
  list.push(req.body.input);
  res.render("index.ejs", { text: list });
});

app.post("/submit2", (req, res) => {
  list2.push(req.body.input);
  res.render("work.ejs", { text: list2 });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
