const handleRegister = (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  const passwordHash = bcrypt.hashSync(password, (saltRounds = 10));

  db.transaction((trx) => {
    return db
      .insert({ hash: passwordHash, email: email }, "email")
      .into("login")
      .transacting(trx)
      .then(function (loginEmail) {
        return db("users")
          .insert(
            { name: name, email: loginEmail[0].email, joined: new Date() },
            ["id", "name", "email", "entries", "joined"]
          )
          .transacting(trx);
      })
      .then(trx.commit)
      .catch(trx.rollback);
  })
    .then((user) => {
      res.json(user[0]);
    })
    .catch(function (error) {
      res.status(400).json("error while user registration");
    });
};

module.exports = {
  handleRegister: handleRegister,
};
