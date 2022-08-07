const express = require("express");
const router = express.Router({ mergeParams: true });
const { Posts } = require("../models");
const { Users } = require("../models");
const { Comments } = require("../models");
const { Likes } = require("../models");
const fs = require("fs");

exports.getPosts = async (req, res) => {
  const PostsList = await Posts.findAll({
    include: [
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

exports.getOnePost = async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id, {
    include: [
      {
        model: Comments,
        include: [Users],
      },
      { model: Users },
      { model: Likes },
    ],
  });
  if (post != null) {
    res.status(200).json(post);
  } else {
    console.log("Le post n'existe pas");
    res.status(400).end("Aucun post");
  }
};

exports.createPost = async (req, res) => {
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
  res.status(200).json(post);
};

exports.editPost = async (req, res) => {
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
    if (newpost.postText == null) {
      if (req.file) {
        console.log("Modification image");
        console.log(newpost);
        newpost["postPicture"] = `${req.protocol}://${req.get(
          "host"
        )}/pictures/postpicture/${req.file.filename}`;
        const filename = checkOwnership.postPicture.split("/postpicture/")[1];
        fs.unlink(`pictures/postpicture/${filename}`, () => {
          Posts.update(
            { postPicture: newpost.postPicture, title: newpost.title },
            {
              where: { id: req.params.postId },
            }
          );
        });
      } else {
        Posts.update(
          { title: newpost.title },
          {
            where: { id: req.params.postId },
          }
        );
      }
    }
    res.status(200).json("Post modifié");
  } else {
    res.status(400).json("Tu n'as pas le droit");
  }
};

exports.deletePost = async (req, res) => {
  const checkOwnership = await Posts.findOne({
    where: { id: req.params.postId, Userid: req.userId },
  });
  if (checkOwnership || req.userRole === true) {
    const filename = checkOwnership.postPicture.split("/postpicture/")[1];
    fs.unlink(`pictures/postpicture/${filename}`, () => {
      Posts.destroy({
        where: {
          id: req.params.postId,
        },
      }).then(() => {
        console.log("Post supprimé");

        res.status(200).json({ message: "Success" });
      });
    });
  }
};

exports.likePost = async (req, res) => {
  console.log(req.body);
  const checkLike = await Likes.findOne({
    where: { PostId: req.body.postId, UserId: req.userId },
  });
  console.log();
  console.log(checkLike);
  if (checkLike) {
    Posts.increment("numberLike", {
      by: -1,
      where: { id: req.body.postId, Userid: req.userId },
    });
    await Likes.destroy({
      where: {
        PostId: req.body.postId,
        Userid: req.userId,
      },
    });
  }
  if (!checkLike) {
    Posts.increment("numberLike", { by: 1, where: { id: req.body.postId } });
    const like = req.body;
    like["UserId"] = req.userId;
    like["PostId"] = req.body.postId;
    await Likes.create(like);
  }
  const LikeNumber = await Likes.count({
    where: { PostId: req.body.postId },
  });
  res.status(200).json(LikeNumber);
};
