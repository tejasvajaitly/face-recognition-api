const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");

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

app.get("/", (req, res) => res.json("working"));

app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt));
app.post("/register", (req, res) => register.handleRegister(req, res, db, bcrypt));
app.put("/imageentries", (req, res) => image.handleImageEntries(req, res, db));
app.post("/detectface", (req, res) => image.handleClarifaiApiCall(req, res));

app.listen(process.env.PORT || 3001, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
