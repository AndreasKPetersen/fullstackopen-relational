const Blog = require("./blog");
const Reading = require("./reading");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading });
Blog.belongsToMany(User, { through: Reading });

module.exports = {
  Blog,
  Reading,
  User,
};
