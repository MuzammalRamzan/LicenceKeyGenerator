require("dotenv").config(); // This line should be at the very top

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes");
const cors = require("cors");
// const cronJob = require("./cronjob");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI; // Ensure this variable is defined in your .env file

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");

    // Start the Express server only after the database connection is established
    app.use(express.json());
    app.use(cors());

    // Add root route handler
    app.get("/", (req, res) => {
      res.send("Welcome to the API!"); // You can customize this message
    });

    app.use("/api", routes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1); // Exit the process if unable to connect to the database
  });
