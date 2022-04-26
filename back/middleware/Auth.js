const { verify } = require("jsonwebtoken");
const { Users } = require("../models");

const validateToken = async (req, res, next) => {
  const accessToken = req.header("accessToken");
  console.log("Infos Token " + verify(accessToken, "importantsecret"));

  if (!accessToken) return res.json({ error: "Non connecté" });

  try {
    const validToken = verify(accessToken, "importantsecret");
    if (validToken) {
      req.user = validToken;
      console.log("Infos token ", validToken);
      req.userId = validToken.id;
      const verifyUser = await Users.findByPk(req.userId);
      if (verifyUser === null) {
        console.log("Erreur");
        res.end("Utilisateur non enregistré");
      } else {
        req.userRole = verifyUser.role;
        req.user["role"] = req.userRole;
        console.log(req.user);
        return next();
      }
    }
  } catch (err) {
    return res.json({ error: err });
  }
};

module.exports = { validateToken };
