import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";

const app = express();
const port = 3000;

app.use(cors());

const list = [];
const list2 = [];

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    let data = await selectFrom("tasks");
    res.render("index.ejs", { text: data });
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.get("/work", (req, res) => {
  res.render("work.ejs", { text: list2 });
});

app.post("/submit", async (req, res) => {
  try {
    await insertInto(req.body.input);
    let data = await selectFrom("tasks");
    res.render("index.ejs", { text: data });
  } catch (error) {
    console.error("Error retrieving data: ", error);
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

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "secret",
  database: "tododb",
});

connection.connect((err) => {
  if (err) throw new Error(err);
  console.log("Connected");
  connection.query("CREATE DATABASE IF NOT EXISTS tododb", (err) => {
    if (err) throw new Error(err);
    console.log("Database created/exists");
    connection.changeUser({ database: "tododb" }, (err) => {
      if (err) throw new Error(err);
      createTable();
    });
  });
});

function createTable() {
  connection.query(
    `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    task VARCHAR(100),
    isDone BOOLEAN
  )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Table created/exists");
    }
  );
}

function insertInto(value) {
  if (value.length !== 0 && value.length < 100) {
    connection.query(
      `INSERT INTO tasks SET ?`,
      {
        task: value,
        isDone: 0,
      },
      (err) => {
        if (err) throw new Error(err);
        console.log("1 record inserted");
      }
    );
  } else {
    console.log("0 records inserted");
  }
}

function selectFrom(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
