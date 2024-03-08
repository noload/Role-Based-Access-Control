const mongoose = require("mongoose");
const { DB_URL } = require("./ServerConfig");

connectDB = async () => {
  await mongoose.connect(DB_URL);

  console.log("connected");
};

module.exports = connectDB;
