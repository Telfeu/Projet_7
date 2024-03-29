const { Users } = require("../models");
const { Comments } = require("../models");

exports.getAllComments = async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({
    where: { PostId: postId },
    include: Users,
  });
  if (comments.length !== 0) {
    res.status(200).json(comments);
  } else {
    res.status(400).end();
  }
};

exports.postComment = async (req, res) => {
  const comment = req.body;

  comment["UserId"] = req.userId;
  comment["PostId"] = req.params.postId;

  await Comments.create(comment);
  res.status(200).json(comment);
};

exports.deleteComment = async (req, res) => {
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

    res.status(200).json("Commentaire supprimé");
  } else {
    res.status(400).json("Tu n'as pas le droit");
  }
};

exports.editComment = async (req, res) => {
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
    res.status(200).json("Commentaire modifié");
  } else {
    res.status(400).json("Tu n'as pas le droit");
  }
};
