const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("connected");
  }
);

//import routes
const authRoute = require("./routes/auth");

app.use(express.json());

//middlewares
app.use("/api/user", authRoute);

app.listen(4000, () => {
  console.log("Up and running");
});
