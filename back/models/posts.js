module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    postPicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberLike: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });
    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Posts.belongsTo(models.Users);
  };
  return Posts;
};
