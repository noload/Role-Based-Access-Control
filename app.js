const express = require("express");
const createHttpError = require("http-errors");
const morgan = require("morgan");
const { PORT } = require("./config/ServerConfig");

const connectDB = require("./config/db");
const app = express();
app.use(morgan("dev"));

connectDB();
app.get("/", (req, res, next) => {
  res.send("working");
});

app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.send(error);
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
