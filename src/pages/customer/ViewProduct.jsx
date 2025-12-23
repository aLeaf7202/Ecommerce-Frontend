// src/pages/customer/ViewProduct.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Check, Star } from "lucide-react";

export default function ViewProduct({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!productId) return;

    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        const item = data[productId];
        if (item && item.available === 1) {
          setProduct({ id: productId, ...item });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setLoading(false);
      });
  }, [productId]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  // Mock extra images (in real app, you could add more URLs to products.json)
  const images = product ? [product.image, product.image, product.image] : [];

  if (!productId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 30, stiffness: 400 }}
          className="relative w-full max-w-7xl h-[95vh] bg-white rounded-3xl shadow-3xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Elegant Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-30 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-gray-100 hover:scale-110 transition-all duration-300 hover:cursor-pointer"
          >
            <X className="w-7 h-7 text-gray-800" />
          </button>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-20 w-20 animate-spin rounded-full border-8 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : product ? (
            <>
              {/* Hero Section */}
              <div className="grid lg:grid-cols-2 gap-0 h-full">
                {/* Left: Images */}
                <div className="relative bg-gray-50 flex flex-col">
                  {/* Main Image */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                      <img
                        src={images[selectedImage]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {/*images.length > 1 && (
                    <div className="flex gap-4 justify-center pb-8 px-8">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`w-24 h-24 rounded-xl overflow-hidden border-4 transition-all hover:cursor-pointer ${
                            selectedImage === i ? "border-indigo-600 shadow-lg scale-105" : "border-gray-300"
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )*/}
                </div>

                {/* Right: Content */}
                <div className="flex flex-col p-10 lg:p-16 overflow-y-auto">
                  {/* Badge & Rating */}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="ml-2 text-gray-600">(4.8)</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    {product.title}
                  </h1>

                  {/* Price */}
                  <div className="flex items-baseline gap-4 mb-8">
                    <p className="text-5xl font-bold text-indigo-700">
                      ৳{product.price.toLocaleString()}
                    </p>
                    <del className="text-2xl text-gray-400">৳{(product.price * 1.2).toLocaleString()}</del>
                    <span className="text-lg font-medium text-green-600">-20%</span>
                  </div>

                  {/* Description */}
                  <div className="mb-10">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Features (mock) */}
                  <ul className="space-y-3 mb-10">
                    {["Premium build quality", "Fast performance", "1-year warranty", "Free delivery"].map((feat) => (
                      <li key={feat} className="flex items-center gap-3 text-gray-700">
                        <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <span className="text-lg">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Quantity & CTA */}
                  <div className="mt-auto flex items-center gap-6">
                    <div className="flex items-center bg-gray-100 rounded-2xl shadow-inner">
                      <button
                        onClick={decrement}
                        className="p-5 hover:bg-gray-200 rounded-l-2xl transition hover:cursor-pointer"
                      >
                        <Minus className="w-6 h-6" />
                      </button>
                      <span className="w-24 text-center text-3xl font-bold text-indigo-700">
                        {quantity}
                      </span>
                      <button
                        onClick={increment}
                        className="p-5 hover:bg-gray-200 rounded-r-2xl transition hover:cursor-pointer"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>

                    <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:shadow-indigo-600/50 hover:scale-105 transition-all duration-300 hover:cursor-pointer">
                      Add to Cart
                    </button>
                  </div>

                  {/* Stock Info */}
                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 text-green-700 font-semibold text-lg">
                      <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                      In Stock – Ships Today
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-3xl text-gray-500">Product not found.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}