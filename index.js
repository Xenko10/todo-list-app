import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const host_name = process.env.HOST_NAME;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const database_port = process.env.PORT;

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
    res.redirect("/");
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/submit2", async (req, res) => {
  try {
    await insertInto("work", req.body.input);
    res.redirect("/work");
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    await deleteFrom("tasks", checkedItemId);
    res.redirect("/");
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.post("/delete2", async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    await deleteFrom("work", checkedItemId);
    res.redirect("/work");
  } catch (error) {
    console.error("Error retrieving data: ", error);
  }
});

app.get("/submit", (req, res) => {
  res.redirect("/");
});

app.get("/submit2", (req, res) => {
  res.redirect("/work");
});

const connection = mysql.createConnection({
  host: host_name,
  user: user,
  password: password,
  database: database,
  port: database_port,
});

connection.connect((err) => {
  if (err) throw new Error(err);
  console.log("Connected");
  connection.query("CREATE DATABASE IF NOT EXISTS ??", [database], (err) => {
    if (err) throw new Error(err);
    console.log("Database created/exists");
    connection.changeUser({ database: database }, (err) => {
      if (err) throw new Error(err);
      createTable();
    });
  });
});

function createTable() {
  connection.query(
    `CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    task VARCHAR(100)
  )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Table created/exists");
    }
  );
  connection.query(
    `CREATE TABLE IF NOT EXISTS work (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    task VARCHAR(100)
  )`,
    (err) => {
      if (err) throw new Error(err);
      console.log("Table created/exists");
    }
  );
}

function insertInto(name, value) {
  if (value.length !== 0 && value.length < 100) {
    const input = {
      task: value,
    };
    const query = "INSERT INTO ?? SET ?";
    connection.query(query, [name, input], (err) => {
      if (err) throw new Error(err);
      console.log("1 record inserted");
    });
  } else {
    console.log("0 records inserted");
  }
}

function selectFrom(table) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT id, task FROM ??`,
      [table],
      function (err, result, fields) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
}

function deleteFrom(table, id) {
  connection.query(`DELETE FROM ?? WHERE id = ?`, [table, id], (err) => {
    if (err) throw new Error(err);
    console.log("1 record deleted");
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
