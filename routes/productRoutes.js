const express = require("express");
const router = express.Router();
const Product = require("../model/Product");

// Get All Products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving products",
            error: error?.error?.message,
        });
    }
});

// Get Single Product by ID
router.get("/products/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving product", error });
    }
});

// Create a New Product
router.post("/products", async (req, res) => {
    console.log(req.body);
    const {
        title,
        modelName,
        company,
        price,
        description,
        category,
        feature,
        shipping,
        stars,
        stock,
        colours,
        images,
        offers,
        productType,
        dis_images,
        size,
    } = req.body;

    try {
        const newProduct = new Product({
            title,
            modelName,
            company,
            price,
            description,
            category,
            feature,
            shipping,
            stars,
            stock,
            colours, // Array of available colors
            images, // Array of images based on the color selected
            offers,
            productType,
            dis_images,
            size,
        });

        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error });
    }
});

// Update a Product by ID
router.put("/products/:id", async (req, res) => {
    const {
        title,
        modelName,
        company,
        price,
        description,
        category,
        feature,
        shipping,
        stars,
        stock,
        colours,
        images,
        offers,
        productType,
        dis_images,
        size,
    } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                title,
                modelName,
                company,
                price,
                description,
                category,
                feature,
                shipping,
                stars,
                stock,
                colours, // Ensure colours array is updated
                images, // Ensure images array is updated
                offers,
                productType,
                dis_images,
                size,
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

// Delete a Product by ID
router.delete("/products/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

// Search products by title
router.get("/search", async (req, res) => {
    const { q } = req.query;
    try {
        // Perform case-insensitive search using a regex
        const products = await Product.find({
            title: { $regex: q, $options: "i" },
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
