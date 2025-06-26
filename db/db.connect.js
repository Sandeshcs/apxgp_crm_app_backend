const mongoose = require("mongoose");
require("dotenv").config();

const mongouri = process.env.MONGODB;
const connectTODb = async () => {
    await mongoose.
    connect(mongouri)
    .then(() => console.log("DB is connected successfully."))
    .catch((error) => console.log("error while connecting to db, ", error));
}

module.exports = {connectTODb};