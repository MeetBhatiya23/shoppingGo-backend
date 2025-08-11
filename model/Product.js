  

  const mongoose = require('mongoose');

  const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    modelName: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    description:  [String] ,
    category: { type: String },
    feature: { type: Boolean  },
    shipping: { type: Boolean ,default: false },
    stars: { type: Number },
    stock: { type: Number },
    review: { type: Number },
    colours: [String], // Available colors
    images: {          // Store an array of images for each color
      type: Map,
      of: [String]      // Each color has an array of image URLs
    },
    offers:{type:Number},
    productType:{type:String ,required: true},
    dis_images:[String],
    size:[String]
  });

  const Product = mongoose.model('Product', productSchema);
  module.exports = Product;
