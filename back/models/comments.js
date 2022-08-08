module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define("Comments", {
    commentBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
    Comments.belongsTo(models.Posts, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
  };
  return Comments;
};
