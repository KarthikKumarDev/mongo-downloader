const mongoose = require("mongoose");
const fs = require("fs");
const json2csv = require("json2csv");

const YourSchema = require("./model.js");

const encodedUsername = encodeURIComponent(process.env.MONGO_USERNAME);
const encodedPassword = encodeURIComponent(process.env.MONGO_PASSWORD);
const encodedHost = encodeURIComponent(process.env.MONGO_HOST);
const port = encodeURIComponent(process.env.MONGO_PORT);
const encodedDatabase = encodeURIComponent(process.env.MONGO_DB);

// Construct the MongoDB connection string
const mongoURI = `mongodb://${encodedUsername}:${encodedPassword}@${encodedHost}:${port}/`;

const collectionName = process.env.COLLECTION_NAME; // Update with your collection name
const csvFileName = process.env.EXPORTED_FILE_NAME; // Update with your desired file name
console.log(mongoURI);
// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const activeDB = mongoose.connection.useDb(encodedDatabase);

const YourModel = activeDB.model(
  collectionName,
  YourSchema,
  collectionName
);
console.log(YourModel)
// Fetch data from MongoDB collection using Mongoose
YourModel.find({})
  .exec()
  .then((data) => {
    console.log(`Successfully fetched ${data.length} documents from ${collectionName} in ${process.env.MONGO_DB}.`);

    let result = [];

    data.forEach((element) => {
        result.push(element._doc)

    });

    // Convert data to Excel format
    const csv = json2csv.parse(result, { header: true });

    // Save CSV file
    fs.writeFileSync(csvFileName, csv);

    console.log(`Data exported to ${csvFileName}`);

    // Close Mongoose connection
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
    // Close Mongoose connection on error
    mongoose.connection.close();
  });
