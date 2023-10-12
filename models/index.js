const Blog = require("./blog");
const Reading = require("./reading");
const Session = require("./session");
const User = require("./user");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading, as: "reading_blogs" });
Blog.belongsToMany(User, { through: Reading, as: "blog_readings" });

module.exports = {
  Blog,
  Reading,
  Session,
  User,
};
