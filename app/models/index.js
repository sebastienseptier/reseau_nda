const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("./post.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.tags = require("./tag.model.js")(sequelize, Sequelize);
db.roles = require("./role.model.js")(sequelize, Sequelize);

// Role - user association

db.roles.belongsToMany(db.users, {
  through: "user_role",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.users.belongsToMany(db.roles, {
  through: "user_role",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["user", "admin", "moderator"];

// One-to-Many Association for users - posts tables

db.users.hasMany(db.posts, { as: "posts" }, { onDelete: 'SET NULL' });
db.posts.belongsTo(db.users, {
  as: "user",
  foreignKey: "userId",
});

// Many-to-Many Association for tags - posts tables

db.posts.belongsToMany(db.tags, {
  through: "post_tag",
  as: "tags",
  foreignKey: "postId",
});
db.tags.belongsToMany(db.posts, {
  through: "post_tag",
  as: "posts",
  foreignKey: "tagId",
});

module.exports = db;
