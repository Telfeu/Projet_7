const express = require("express");
const router = express.Router({ mergeParams: true });

const { validateToken } = require("../middleware/Auth");
const multer = require("../middleware/multer-config");

const users_Ctrl = require("../controllers/users");

router.post("/signup", users_Ctrl.signup);

router.post("/login", users_Ctrl.login);

router.put("/changepassword", validateToken, users_Ctrl.changepassword);

router.put("/changeemail", validateToken, users_Ctrl.changeemail);

router.put(
  "/changepicture",
  validateToken,
  multer.single("picture"),
  users_Ctrl.changepicture
);

router.get("/profile/:id", validateToken, users_Ctrl.getprofile);

router.delete("/delete", validateToken, users_Ctrl.deleteuser);

router.get("/", validateToken, users_Ctrl.getuser);

router.get("/profile/:id/likes", validateToken, users_Ctrl.getLikedPosts);

router.get("/nickname", users_Ctrl.checkNickAvailability);

module.exports = router;
