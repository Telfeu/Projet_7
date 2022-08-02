const express = require("express");
const router = express.Router({ mergeParams: true });
const { Posts } = require("../models");
const { Users } = require("../models");
const { Comments } = require("../models");
const { validateToken } = require("../middleware/Auth");
const multer = require("../middleware/multer-config-post");

const posts_Ctrl = require("../controllers/posts");

router.get("/", validateToken, posts_Ctrl.getPosts);

router.get("/:id", validateToken, posts_Ctrl.getOnePost);

router.post(
  "/",
  validateToken,
  multer.single("postPicture"),
  posts_Ctrl.createPost
);

router.put(
  "/:postId",
  multer.single("postPicture"),
  validateToken,
  posts_Ctrl.editPost
);

router.delete("/:postId", validateToken, posts_Ctrl.deletePost);

router.post("/like", validateToken, posts_Ctrl.likePost);

module.exports = router;
