const express = require("express");
const router = express.Router({ mergeParams: true });
const { Comments } = require("../models");
const { Users } = require("../models");
const { validateToken } = require("../middleware/Auth");
const { verifyUser } = require("../middleware/VerifyUser");

const comments_Ctrl = require("../controllers/comments");

router.get("/", validateToken, verifyUser, comments_Ctrl.getAllComments);

router.post("/", validateToken, verifyUser, comments_Ctrl.postComment);

router.delete(
  "/:commentId",
  validateToken,
  verifyUser,
  comments_Ctrl.deleteComment
);

router.put("/:commentId", validateToken, comments_Ctrl.editComment);

module.exports = router;
