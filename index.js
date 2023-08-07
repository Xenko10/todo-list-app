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
  let arrayLength = list.length;
  if (arrayLength === 1) {
    res.render("index.ejs", { text: list });
  } else if (list[arrayLength - 2] == req.body.input || req.body.input == "") {
    list.pop();
    res.render("index.ejs", { text: list });
  } else {
    res.render("index.ejs", { text: list });
  }
});

app.post("/submit2", (req, res) => {
  list2.push(req.body.input);
  let arrayLength = list2.length;
  if (arrayLength === 1) {
    res.render("work.ejs", { text: list2 });
  } else if (list2[arrayLength - 2] == req.body.input || req.body.input == "") {
    list2.pop();
    res.render("work.ejs", { text: list2 });
  } else {
    res.render("work.ejs", { text: list2 });
  }
});

app.get("/submit", (req, res) => {
  res.render("index.ejs", { text: list });
});

app.get("/submit2", (req, res) => {
  res.render("work.ejs", { text: list2 });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
