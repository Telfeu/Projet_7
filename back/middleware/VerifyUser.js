const { Users } = require("../models");

const verifyUser = async (req, res, next) => {
  const verifyUser = await Users.findByPk(req.userId);
  console.log(verifyUser);
  if (verifyUser === null) {
    console.log("Erreur");
    res.status(400).end("Utilisateur non enregistré");
  } else {
    next();
  }
};

module.exports = { verifyUser };
