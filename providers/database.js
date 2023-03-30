const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGO_URI}/${process.env.DB}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("[mongoose]: connected to mongo-db.");
  } catch (error) {
    console.log("[mongoose]: failed to connect to database.");
    process.exit(1);
  }
}

module.exports = {
  connectDB,
};
