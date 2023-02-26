const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");

const saltRounds = 10;

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "neiljaitly",
    password: "",
    database: "face_recognition",
  },
});

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json("working");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      if (bcrypt.compareSync(password, data[0].hash)) {
        db.select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => res.json(user[0]));
      } else {
        res.status(400).json("email and password might be wrong");
      }
    })
    .catch((err) => res.status(400).json("some error"));
});

app.post("/register", (req, res) =>
  register.handleRegister(req, res, db, bcrypt)
);

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("unable to get entries"));
});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
