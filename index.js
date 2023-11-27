import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const todayList = [];
const workList = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (_req, res) => {
  res.redirect("/today");
});

app.get("/today", (_req, res) => {
  res.render("index.ejs", { text: todayList });
});

app.get("/work", (_req, res) => {
  res.render("work.ejs", { text: workList });
});

app.post("/today", (req, res) => {
  todayList.push(req.body.input);
  res.render("index.ejs", { text: todayList });
});

app.post("/work", (req, res) => {
  workList.push(req.body.input);
  res.render("work.ejs", { text: workList });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
