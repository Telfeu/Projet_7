const { Users } = require("../models");
const { Posts } = require("../models");
const { Comments } = require("../models");
const { Likes } = require("../models");
const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { Op } = require("sequelize");
const fs = require("fs");

exports.signup = async (req, res) => {
  const { username, password, email } = req.body;

  const user = await Users.findOne({
    where: {
      [Op.or]: [{ username: username }, { email: email }],
    },
  });

  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
      email: email,
    })
      .then(() => {
        res.status(200).json("Utilisateur ajouté");
      })
      .catch((error) =>
        res.status(400).json({ error: "Nom d'utilisateur ou email déjà pris" })
      );
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ where: { username: username } });

  if (!user) res.status(400).json({ error: "Utilisateur inconnu" });

  bcrypt.compare(password, user.password).then(async (match) => {
    if (!match)
      res
        .status(400)
        .json({ error: "Mauvais nom d'utilistateur/mot de passe" });

    const accessToken = sign(
      { username: user.username, id: user.id },
      "importantsecret"
    );
    res.status(200).json({
      token: accessToken,
      username: username,
      id: user.id,
      role: user.role,
    });
  });
};

exports.checkNickAvailability = async (req, res) => {
  const Available = await Users.findOne({
    where: { username: req.body.username },
  });
  if (!Available) {
    res.status(200).json(true);
  }
  if (Available) {
    res.status(400).json(false);
  }
};

exports.changepassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await Users.findOne({ where: { id: req.userId } });

  bcrypt.compare(oldPassword, user.password).then(async (match) => {
    if (!match) res.status(400).json({ error: "Mauvais mot de passe" });

    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update({ password: hash }, { where: { id: req.userId } });
      res.status(200).json("Mot de passe modifié");
    });
  });
};

exports.changeemail = async (req, res) => {
  const { newEmail } = req.body;

  Users.update({ email: newEmail }, { where: { id: req.userId } })
    .then(() => {
      res.status(200).json("Email modifié");
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.changepicture = async (req, res) => {
  const user = await Users.findOne({ where: { id: req.userId } });

  const filename = user.userPicture.split("/userpicture/")[1];

  if (filename == "default.png") {
    const newProfilePicture = `${req.protocol}://${req.get(
      "host"
    )}/pictures/userpicture/${req.file.filename}`;

    Users.update(
      { userPicture: newProfilePicture },
      { where: { id: req.userId } }
    );
  } else {
    const newProfilePicture = `${req.protocol}://${req.get(
      "host"
    )}/pictures/userpicture/${req.file.filename}`;

    fs.unlink(`pictures/userpicture/${filename}`, () => {
      Users.update(
        { userPicture: newProfilePicture },
        { where: { id: req.userId } }
      );
    });
  }

  res.status(200).json("Photo modifié");
};

exports.getprofile = async (req, res) => {
  const id = req.params.id;

  const profile = await Users.findByPk(id, {
    attributes: { exclude: ["password"] },
    order: [[{ model: Posts }, "createdAt", "DESC"]],
    include: [
      {
        model: Posts,
        include: [{ model: Users }, { model: Comments }, { model: Likes }],
      },
      { model: Likes },
    ],
  });

  res.status(200).json(profile);
};

exports.getLikedPosts = async (req, res) => {
  const id = req.params.id;

  const PostsList = await Posts.findAll({
    include: [
      { model: Likes, required: true },
      {
        model: Comments,
        include: [Users],
      },
      { model: Users },
      { model: Likes },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json(PostsList);
};

exports.deleteuser = async (req, res) => {
  await Users.destroy({
    where: {
      id: req.userId,
    },
  });

  res.status(200).json("Compte supprimé");
};
exports.getuser = async (req, res) => {
  res.status(200).json(req.user);
};
