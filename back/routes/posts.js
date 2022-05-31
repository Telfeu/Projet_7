const express = require("express");
const router = express.Router({ mergeParams: true });
const { Posts } = require("../models");
const { Users } = require("../models");
const { Comments } = require("../models");
const { validateToken } = require("../middleware/Auth");
const multer = require("../middleware/multer-config-post");

router.get("/", validateToken, async (req, res) => {
  const PostsList = await Posts.findAll({
    include: [
      {
        model: Comments,
        include: [Users],
      },
      { model: Users },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.json(PostsList);
});

router.get("/:id", validateToken, async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id, {
    include: [
      {
        model: Comments,
        include: [Users],
      },
      { model: Users },
    ],
  });
  if (post != null) {
    res.json(post);
  } else {
    console.log("Le post n'existe pas");
    res.end("Aucun post");
  }
});

router.post(
  "/",
  validateToken,
  multer.single("postPicture"),
  async (req, res) => {
    console.log(req.body);
    const post = req.body;
    if (req.file) {
      console.log(req.file);
      post["postPicture"] = `${req.protocol}://${req.get(
        "host"
      )}/pictures/postpicture/${req.file.filename}`;
      console.log(post);
    }
    post["UserId"] = req.userId;
    await Posts.create(post);
    res.json(post);
  }
);

router.put(
  "/:postId",
  multer.single("postPicture"),
  validateToken,
  async (req, res) => {
    console.log(req.body);
    const newpost = req.body;
    console.log(newpost.postText);

    const checkOwnership = await Posts.findOne({
      where: { id: req.params.postId, Userid: req.userId },
    });

    if (checkOwnership || req.userRole === true) {
      if (newpost.postText !== null) {
        Posts.update(
          { postText: newpost.postText, title: newpost.title },
          {
            where: { id: req.params.postId },
          }
        );
      }
      if (req.file) {
        console.log("Modification image");
        console.log(newpost);
        newpost["postPicture"] = `${req.protocol}://${req.get(
          "host"
        )}/pictures/postpicture/${req.file.filename}`;
        Posts.update(
          { postPicture: newpost.postPicture, title: newpost.title },
          {
            where: { id: req.params.postId },
          }
        );
      }
      res.json("Post modifié");
    } else {
      res.json("Tu n'as pas le droit");
    }
  }
);

router.delete("/:postId", validateToken, async (req, res) => {
  const checkOwnership = await Posts.findOne({
    where: { id: req.params.postId, Userid: req.userId },
  });
  if (checkOwnership || req.userRole === true) {
    await Posts.destroy({
      where: {
        id: req.params.postId,
      },
    }).then(() => {
      console.log("Post supprimé");
      res.status(200).json({ message: "Success" });
    });
  }
});

module.exports = router;
