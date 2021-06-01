const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  instructions: {
    type: String,
  },
  type: {
    type: String,
  },
  ingredients: {
    type: [Number],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Menu", menuSchema);
