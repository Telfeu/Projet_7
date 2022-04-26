const express = require("express");
const router = express.Router({ mergeParams: true });
const { Comments } = require("../models");
const { Users } = require("../models");
const { validateToken } = require("../middleware/Auth");
const { verifyUser } = require("../middleware/VerifyUser");

router.get("/", validateToken, verifyUser, async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({
    where: { PostId: postId },
    include: Users,
  });
  if (comments.length !== 0) {
    res.json(comments);
  } else {
    console.log("Aucun commentaire");
    res.end();
  }
});

router.post("/", validateToken, verifyUser, async (req, res) => {
  const comment = req.body;
  console.log(req.params);
  comment["UserId"] = req.userId;
  comment["PostId"] = req.params.postId;
  console.log(comment);
  await Comments.create(comment);
  res.json(comment);
});

router.delete("/:commentId", validateToken, verifyUser, async (req, res) => {
  const commentId = req.params.commentId;
  const checkOwnership = await Comments.findOne({
    where: { id: commentId, Userid: req.userId },
  });

  if (checkOwnership || req.userRole === true) {
    await Comments.destroy({
      where: {
        id: commentId,
      },
    });

    res.json("Commentaire supprimé");
  } else {
    res.json("Tu n'as pas le droit");
  }
});

router.put("/:commentId", validateToken, async (req, res) => {
  const commentId = req.params.commentId;
  const modifiedComment = req.body;
  const checkOwnership = await Comments.findOne({
    where: { id: commentId, Userid: req.userId },
  });

  if (checkOwnership || req.userRole === true) {
    Comments.update(
      { commentBody: modifiedComment.commentBody },
      {
        where: { id: commentId },
      }
    );
    res.json("Commentaire modifié");
  } else {
    res.json("Tu n'as pas le droit");
  }
});

module.exports = router;
