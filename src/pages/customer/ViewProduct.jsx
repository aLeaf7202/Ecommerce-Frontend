// src/pages/customer/ViewProduct.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Truck, Shield, RefreshCw, Star } from "lucide-react";

export default function ViewProduct({ productId, onClose }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

  if (!productId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 30 }}
          transition={{ type: "spring", damping: 28, stiffness: 380 }}
          className="relative w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-4xl overflow-hidden flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-30 p-3 bg-white/95 backdrop-blur rounded-full shadow-xl hover:bg-gray-100 hover:scale-110 transition-all duration-300 hover:cursor-pointer"
          >
            <X className="w-7 h-7 text-gray-800" />
          </button>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="h-20 w-20 animate-spin rounded-full border-8 border-indigo-600 border-t-transparent"></div>
            </div>
          ) : product ? (
            <>
              {/* Left: Image Section */}
              <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8 md:p-12">
                <div className="relative max-w-xl w-full">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-5 py-3 rounded-full shadow-lg">
                    <span className="text-sm font-bold text-indigo-700 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Details Section */}
              <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 lg:p-16 overflow-y-auto">
                {/* Title & Rating */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">(4.9 • 324 reviews)</span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-10">
                  <p className="text-5xl md:text-6xl font-bold text-indigo-700">
                    ৳{product.price.toLocaleString()}
                  </p>
                  <p className="text-xl text-gray-500 line-through mt-2">
                    ৳{(product.price * 1.15).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                  <span className="inline-block mt-3 px-4 py-2 bg-red-100 text-red-700 font-bold rounded-full text-lg">
                    Save 15%
                  </span>
                </div>

                {/* Description */}
                <div className="mb-10">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">About this item</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                  <div className="flex flex-col items-center text-center">
                    <Truck className="w-10 h-10 text-indigo-600 mb-3" />
                    <p className="font-semibold">Free Delivery</p>
                    <p className="text-sm text-gray-600">Across Bangladesh</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <Shield className="w-10 h-10 text-indigo-600 mb-3" />
                    <p className="font-semibold">100% Authentic</p>
                    <p className="text-sm text-gray-600">Guaranteed</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <RefreshCw className="w-10 h-10 text-indigo-600 mb-3" />
                    <p className="font-semibold">7-Day Return</p>
                    <p className="text-sm text-gray-600">Easy & hassle-free</p>
                  </div>
                </div>

                {/* Quantity & Add to Cart */}
                <div className="mt-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-xl font-medium text-gray-800">Quantity</span>
                      <div className="flex items-center bg-gray-100 rounded-2xl shadow-lg">
                        <button
                          onClick={decrement}
                          className="p-4 hover:bg-gray-200 rounded-l-2xl transition hover:cursor-pointer"
                        >
                          <Minus className="w-7 h-7 text-gray-700" />
                        </button>
                        <span className="w-24 text-center text-3xl font-bold text-indigo-700">
                          {quantity}
                        </span>
                        <button
                          onClick={increment}
                          className="p-4 hover:bg-gray-200 rounded-r-2xl transition hover:cursor-pointer"
                        >
                          <Plus className="w-7 h-7 text-gray-700" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-6 rounded-3xl text-2xl font-bold shadow-2xl hover:shadow-indigo-600/40 hover:-translate-y-1 transition-all duration-300 hover:cursor-pointer">
                    Add to Cart
                  </button>

                  <div className="text-center">
                    <span className="inline-flex items-center gap-3 text-green-600 font-bold text-lg">
                      <span className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></span>
                      In Stock – Ready to ship today
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-3xl font-medium text-gray-500">Product not found.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}