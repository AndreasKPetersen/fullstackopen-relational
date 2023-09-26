const { ValidationError } = require("sequelize");

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    const validationErrors = err.errors.map((error) => error.message);
    return res.status(400).json({ error: validationErrors });
  }

  return res.status(400).send({ error: err.message });
};

module.exports = errorHandler;
