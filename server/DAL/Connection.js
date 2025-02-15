const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.CONNECTION_STRING;

const connectDB = () => {
    mongoose.connect(mongoURI)
      .then(async () => {
        console.log("connected to no-sql database:: ", mongoose.connection.db.databaseName);
        let collections = await mongoose.connection.db.listCollections();
        let collectionNames = (await collections.toArray()).map(_ => _.name);
        console.log("Collections available: ", collectionNames);
      })
  }

  module.exports = { connectDB };