const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleSignin: handleSignin,
};
