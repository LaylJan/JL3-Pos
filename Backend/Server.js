import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const port = 5000; // Backend will run on localhost:5000

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's URL
    optionsSuccessStatus: 200,
  })
); // Allows your React frontend to access the backend
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB (local MongoDB instance, PointOfSale database)
mongoose
  .connect("mongodb://localhost:27017/PointOfSale", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB database "PointOfSale"'))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Define schema and model for the products collection
const productSchema = new mongoose.Schema({
  Product: String,
  Price: Number,
  Category: String,
  Stock: Number,
  Supplier: {
    Name: String,
    Contact: String,
  },
  LastUpdatedDate: Date,
});

const Product = mongoose.model("product", productSchema, "Products"); // Specify the collection name explicitly

// Routes
app.get("/api/Products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/Products", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
