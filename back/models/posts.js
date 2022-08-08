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
      foreignKey: { allowNull: false },
      hooks: true,
    });
    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
    Posts.belongsTo(models.Users, {
      onDelete: "cascade",
      foreignKey: { allowNull: false },
      hooks: true,
    });
  };
  return Posts;
};
