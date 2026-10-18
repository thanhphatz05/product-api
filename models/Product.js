
const mongoose = require("mongoose");

// Định nghĩa cấu trúc Product
const productSchema = new mongoose.Schema(
  {
    pid: {
      type: String,
      required: true,
      unique: true
    },
    pname: {
    type: String,
    required: false
   },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    quantity: {
      type: Number,
      required: true
    ,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be an integer"
      }
    }
  },
  {
    timestamps: true
  }
);

// Tạo Model Product
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
