const express = require("express");
const router = express.Router({ mergeParams: true });
const { Users } = require("../models");
const { Posts } = require("../models");
const bcrypt = require("bcrypt");
const { validateToken } = require("../middleware/Auth");
const multer = require("../middleware/multer-config");

const { sign } = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
    });
    res.json("Utilisateur ajouté");
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.json({ error: "Utilisateur inconnu" });

  bcrypt.compare(password, user.password).then(async (match) => {
    console.log(match);
    if (!match) res.json({ error: "Mauvais nom d'utilistateur/mot de passe" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.json({ token: accessToken, username: username, id: user.id });
  });
});

router.put("/changepassword", validateToken, async (req, res) => {
  console.log(req.body);
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword);

  const user = await Users.findOne({ where: { id: req.userId } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.json({ error: "Mauvais mot de passe" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update({ password: hash }, { where: { id: req.userId } });
      res.json("Mot de passe modifié");
    });
  });
});

router.put("/changeemail", validateToken, async (req, res) => {
  const { newEmail } = req.body;

  Users.update({ email: newEmail }, { where: { id: req.userId } });
  res.json("Email modifié");
});

router.put(
  "/changepicture",
  validateToken,
  multer.single("picture"),
  async (req, res) => {
    console.log(req.file);
    console.log(
      `${req.protocol}://${req.get("host")}/pictures/userpicture/${
        req.file.filename
      }`
    );
    const newProfilePicture = `${req.protocol}://${req.get(
      "host"
    )}/pictures/userpicture/${req.file.filename}`;

    console.log(newProfilePicture);

    Users.update(
      { userPicture: newProfilePicture },
      { where: { id: req.userId } }
    );
    res.json("Photo modifié");
  }
);
router.get("/profile/:id", validateToken, async (req, res) => {
  const id = req.params.id;

  const profile = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
    include: [
      {
        model: Posts,
        include: [Users],
      },
    ],
  });

  res.json(profile);
});

router.delete("/delete", validateToken, async (req, res) => {
  await Users.destroy({
    where: {
      id: req.userId,
    },
  });

  res.json("Compte supprimé");
});

router.get("/", validateToken, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
