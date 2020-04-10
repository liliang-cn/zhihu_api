const mongoose = require("mongoose");

const { connectionStr } = require("../config");

function initDB() {
  mongoose.connect(
    connectionStr,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    },
    () => {
      console.log("MongoDB connected");
    }
  );

  mongoose.connection.on("error", console.error);
}

module.exports = initDB;
