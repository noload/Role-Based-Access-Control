const mongoose = require("mongoose");
const { DB_URL } = require("./ServerConfig");

connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://notesafe:vaibhav%40123K@cluster0.fsxrugd.mongodb.net/rbac_db_dev"
    );

    console.log("connected to database");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
