// src/pages/customer/ViewProduct.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Check, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ReactMarkdown from 'react-markdown';
import api from "../../api/axios";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ViewProduct({ product: initialProduct, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [product, setProduct] = useState(initialProduct);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (initialProduct?.id) {
      api.get(`/products/${initialProduct.id}`).then((res) => setProduct(res.data)).catch(console.error);
    }
  }, [initialProduct?.id]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const submitReview = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setIsSubmittingReview(true);
      await api.post(`/products/${product.id}/reviews`, { rating: reviewRating, comment: reviewText });
      setReviewText("");
      setReviewRating(5);
      const res = await api.get(`/products/${product.id}`);
      setProduct(res.data);
      alert("Review added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Mock extra images (in real app, you could add more URLs to products table)
  const images = product ? [product.imageUrl] : [];

  if (!product) return null;

  const avgRating = product.reviews && product.reviews.length > 0
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

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

              {/* Hero Section */}
              <div className="grid lg:grid-cols-2 gap-0 h-full">
                {/* Left: Images */}
                <div className="relative bg-gray-50 flex flex-col">
                  {/* Main Image */}
                  <div className="flex-1 flex items-center justify-center p-8">
                    <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden shadow-2xl bg-white">
                      <img
                        src={images[selectedImage]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none"></div>
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
                  {/* Badge, Shop Name & Rating */}
                  <div className="flex items-center flex-wrap gap-4 mb-4">
                    <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                      {product.category}
                    </span>
                    {product.seller && (
                      <span className="px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        Shop: {product.seller.storeName || product.seller.name}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-gray-600 font-medium">{avgRating > 0 ? `${avgRating} (${product.reviews?.length || 0} reviews)` : 'No reviews'}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                    {product.name}
                  </h1>

                  {/* Price */}
                  <div className="flex items-baseline gap-4 mb-8">
                    <p className="text-5xl font-bold text-indigo-700">
                      ৳{product.price.toLocaleString()}
                    </p>
                    {product.discountPercentage > 0 && (
                      <>
                        <del className="text-2xl text-gray-400">
                          ৳{Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString()}
                        </del>
                        <span className="text-lg font-medium text-green-600">-{product.discountPercentage}%</span>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-10 flex-grow">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
                    <div className="prose prose-indigo max-w-none text-gray-700 text-lg leading-relaxed">
                      <ReactMarkdown>{product.description}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Reviews Section */}
                  <div className="mb-10 border-t pt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h2>
                    
                    {/* Add Review Form */}
                    {user && (
                      <div className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-3">Write a Review</h3>
                        <div className="flex gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              onClick={() => setReviewRating(star)} 
                              className={`w-6 h-6 cursor-pointer ${reviewRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="What did you like or dislike?"
                          className="w-full p-3 border border-gray-300 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows="3"
                        />
                        <button 
                          onClick={submitReview}
                          disabled={isSubmittingReview || !reviewText.trim()}
                          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="space-y-4">
                      {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                          <div key={review.id} className="bg-white border border-gray-100 shadow-sm p-5 rounded-2xl">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-bold text-gray-800">{review.user?.name || "Customer"}</p>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                      )}
                    </div>
                  </div>

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

                    <button 
                      onClick={handleAddToCart}
                      className={`flex-1 ${isAdded ? 'bg-green-600' : 'bg-linear-to-r from-indigo-600 to-purple-700'} text-white py-6 rounded-2xl text-2xl font-bold shadow-2xl hover:scale-105 transition-all duration-300 hover:cursor-pointer flex items-center justify-center gap-3`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-8 h-8" />
                          Added to Cart
                        </>
                      ) : (
                        "Add to Cart"
                      )}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}