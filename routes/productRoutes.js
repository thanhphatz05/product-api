
const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// 1. CREATE - Thêm sản phẩm
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// 2. READ - Lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 3. READ - Tìm sản phẩm theo pid
router.get("/:pid", async (req, res) => {
  try {
    const product = await Product.findOne({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// 4. UPDATE - Cập nhật sản phẩm
router.put("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { pid: req.params.pid },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// 5. DELETE - Xóa sản phẩm
router.delete("/:pid", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      pid: req.params.pid
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
