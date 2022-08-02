module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.Users);
    Likes.belongsTo(models.Posts);
  };
  return Likes;
};
