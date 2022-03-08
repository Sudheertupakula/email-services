const mongoose = require("mongoose");

const mongoUri = process.env.MONGO_HOST;

// connect to mongo db
mongoose.connect(mongoUri);

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});
