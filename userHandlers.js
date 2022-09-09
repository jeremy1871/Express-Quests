const database = require("./database");

const getUsers = (req, res) => {
  let sql = "select id, firstname, lastname, email, city, language from users";
  const sqlValues = [];

  if (req.query.language != null) {
    sql += " where language = ?";
    sqlValues.push(req.query.language);

    if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }

  database
  .query(sql, sqlValues)
  .then(([users]) => {
    res.status(200).json(users);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);
  database
  .query("select id, firstname, lastname, email, city, language from users where id = ?", [id])
  .then(([users]) => {
    if (users[0] != null) {
      res.status(200).json(users[0]);
    } else {
      res.status(404).send("Not Found");
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  });
};
const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const email = req.body.email;
  database
  .query("select * from users WHERE email = ?", [email])
  .then(([users]) => {
    if (users[0] != null) {
req.users = users[0];
next();
  } else {
    res.sendStatus(401);
  }})
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  });

};
const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language, hashedPassword } =req.body;
    database
    .query(
        "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language, hashedPassword]
        )
    .then(([result]) => {
        res.location(`/api/users/${result.insertId}`).sendStatus(201);
    });
};  
const putUsers = (req, res) => {
  const id = parseInt(req.params.id);
  const { firstname, lastname, email, city, language } = req.body;

  database
    .query(
      "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ? where id = ?",
      [firstname, lastname, email, city, language, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the user");
    });
};

const deleteUsers = (req, res) => {
  const id = parseInt(req.params.id);

  database
  .query(
    "DELETE from users where id = ?", [id]
  )
  .then(([result]) => {
    if (result.affectedRows === 0){
      res.status(404).send("Not Found");
    } else {
      res.sendStatus(204);
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error deleting user");
  });
};
module.exports = {
  getUsers,
  getUsersById,
  postUsers,
  putUsers,
  deleteUsers,
  getUserByEmailWithPasswordAndPassToNext,
};
