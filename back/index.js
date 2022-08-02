const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

app.use(cookieParser());

const db = require("./models");

// Routers
app.use("/pictures", express.static(path.join(__dirname, "pictures")));

app.use((error, req, res, next) => {
  const message = `Mauvais champ : "${error.field}"`;
  console.log(message);
  return res.status(500).send(message);
});

const postRouter = require("./routes/Posts");
app.use("/posts", postRouter);
const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);
const commentsRouter = require("./routes/Comments");
app.use("/posts/:postId/comments", commentsRouter);

app.use("/userpicture", express.static("uploads"));

db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log("Serveur lancé port 3001");
  });
});
