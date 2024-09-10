const mongoose = require("mongoose");

const LocalUrl = process.env.LOCAL_URL_FOR_DB_CONNECTION;
mongoose.connect(LocalUrl);

const db = mongoose.connection;

db.on("connected", () => {
  console.log(`db is connected`);
});
db.on("error", (error) => {
  console.log(`db having error while connection ${error}`);
});
db.on("disconnected", () => {
  console.log("Disconnected from the database");
});

module.exports = db;
