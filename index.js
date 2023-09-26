const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const express = require("express");
require("express-async-errors");
const app = express();

const authorsRouter = require("./controllers/authors");
const blogsRouter = require("./controllers/blogs");
const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");

const errorHandler = require("./util/errorHandler");

app.use(express.json());

app.use("/api/authors", authorsRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
