module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define("Likes", {});
  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
    Likes.belongsTo(models.Posts, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
  };
  return Likes;
};
