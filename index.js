import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";

const app = express();
const port = 3000;

app.use(cors());

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

app.get("/work", async (req, res) => {
  try {
    let data = await selectFrom("work");
    res.render("work.ejs", { text: data });
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/submit", async (req, res) => {
  try {
    await insertInto("tasks", req.body.input);
    let data = await selectFrom("tasks");
    res.render("index.ejs", { text: data });
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/submit2", async (req, res) => {
  try {
    await insertInto("work", req.body.input);
    let data = await selectFrom("work");
    res.render("work.ejs", { text: data });
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  deleteFrom("tasks", checkedItemId);
  res.redirect("/");
});

app.post("/delete2", (req, res) => {
  const checkedItemId = req.body.checkbox;
  deleteFrom("work", checkedItemId);
  res.redirect("/work");
});

app.get("/submit", (req, res) => {
  res.redirect("/");
});

app.get("/submit2", (req, res) => {
  res.redirect("/work");
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tododb",
  port: "4306",
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
  connection.query(
    `CREATE TABLE IF NOT EXISTS work (
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

function insertInto(name, value) {
  if (value.length !== 0 && value.length < 100) {
    connection.query(
      `INSERT INTO ${name} SET ?`,
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

function deleteFrom(table, id) {
  connection.query(`DELETE FROM ${table} WHERE id = ${id}`, (err) => {
    if (err) throw new Error(err);
    console.log("1 record deleted");
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
