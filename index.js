require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT =process.env.PORT;
// Middleware to parse incoming JSON
app.use(express.json());
app.use(
  cors({
    origin: "https://shippin-go-client.vercel.app/",
  })
);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error: ", err));

// Use the user routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
// app.use("/api", otpRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
