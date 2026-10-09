
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");

const app = express();

// Cho phép API nhận dữ liệu JSON
app.use(express.json());
app.use("/api/products", productRoutes);

// Kiểm tra API và kết nối MongoDB
app.get("/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  if (connected) {
    return res.status(200).json({
      status: "ok",
      mongodb: "connected"
    });
  }

  return res.status(503).json({
    status: "error",
    mongodb: "disconnected"
  });
});

// Cổng chạy ứng dụng
const PORT = process.env.PORT || 3000;

// Kết nối MongoDB
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
