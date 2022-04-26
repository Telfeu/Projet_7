const express = require("express");
const router = express.Router({ mergeParams: true });
const { Posts } = require("../models");
const { Users } = require("../models");
const { Comments } = require("../models");
const { validateToken } = require("../middleware/Auth");

router.get("/", validateToken, async (req, res) => {
  const PostsList = await Posts.findAll({
    include: {
      model: Users,
      attributes: { exclude: ["password", "email", "createdAt", "updatedAt"] },
    },
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

router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post["UserId"] = req.userId;
  await Posts.create(post);
  res.json(post);
});

router.put("/:postId", validateToken, async (req, res) => {
  console.log(req.body);
  const newpost = req.body;
  console.log(newpost.postText);

  const checkOwnership = await Posts.findOne({
    where: { id: req.params.postId, Userid: req.userId },
  });

  if (checkOwnership || req.userRole === true) {
    Posts.update(
      { postText: newpost.postText, title: newpost.title },
      {
        where: { id: req.params.postId },
      }
    );
    res.json("Post modifié");
  } else {
    res.json("Tu n'as pas le droit");
  }
});

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
