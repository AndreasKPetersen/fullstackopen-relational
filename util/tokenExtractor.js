const jwt = require("jsonwebtoken");

const Session = require("../models/session");
const User = require("../models/user");

const { SECRET } = require("../util/config");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }

    const serverToken = await Session.findOne({
      where: {
        token: authorization.substring(7),
      },
    });

    if (!serverToken) {
      return res.status(401).json({ error: "token invalid" });
    }

    if (req.baseUrl === "/api/logout") {
      await serverToken.destroy();
      return res.status(200).end();
    }

    const user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res.status(401).json({ error: "user no longer exists" });
    }

    if (user.disabled) {
      return res.status(401).json({ error: "user has been disabled" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = tokenExtractor;
