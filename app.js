require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const { validateMovie } = require("./validators.js");
const userHandlers = require("./userHandlers");
const { validateUser } = require("./validators.js");
const { hashPassword, verifyPassword, verifyToken, verifyId } = require("./auth");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);
app.post("/api/users", validateUser, hashPassword, userHandlers.postUsers);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);


app.use(
  verifyToken
);
app.post("/api/movies", verifyToken, validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validateMovie, movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put("/api/users/:id", validateUser, verifyId, userHandlers.putUsers);
app.delete("/api/users/:id", verifyId, userHandlers.deleteUsers);
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
