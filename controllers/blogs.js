const { Op } = require("sequelize");
const router = require("express").Router();

const { Blog, User } = require("../models");

const tokenExtractor = require("../util/tokenExtractor");

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase(); // Convert the search term to lowercase

    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${searchTerm}%`, // Use Op.iLike for case-insensitive search
        },
      },
      {
        author: {
          [Op.iLike]: `%${searchTerm}%`, // Use Op.iLike for case-insensitive search
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]], // Order by "likes" field in descending order
  });
  res.json(blogs);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

router.post("/", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog && blog.userId === req.decodedToken.id) {
    await blog.destroy();
  }
  res.status(204).end();
});

router.put("/:id", async (req, res) => {
  if (!req.body.likes) {
    return res.status(400).end();
  }

  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    blog.likes = req.body.likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
