const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var cors = require("cors");

dotenv.config();

app.use(cors());
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
const itemRoute = require("./routes/item");
const menuItemRoute = require("./routes/menu");
const orderRoute = require("./routes/order");

app.use(express.json());

//middlewares
app.use("/api/user", authRoute);
app.use("/api/item", itemRoute);
app.use("/api/menu", menuItemRoute);
app.use("/api/order", orderRoute);

app.listen(4000, () => {
  console.log("Up and running");
});
