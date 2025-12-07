import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

function Card({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data[productId] && data[productId].available === 1) {
          setProduct(data[productId]);
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading product:", err);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    setWishlist((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto p-4">
        <div className="bg-gray-200 border border-gray-300 rounded-xl h-80 animate-pulse"></div>
      </div>
    );
  }

  if (!product) {
    return null; // Only render if product is available
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-300 flex flex-col relative cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-xl">
        {/* Product Image */}
        <div className="relative">
          <img
            className="w-full h-56 object-contain bg-gray-50 p-4"
            src={product.image}
            alt={product.title}
          />
          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md hover:scale-110 transition-all duration-200 border border-gray-300"
          >
            <FaHeart
              className={`text-lg transition-colors ${
                wishlist ? "text-red-500" : "text-gray-400"
              }`}
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-indigo-600 font-medium">
            {product.category}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xl font-bold text-indigo-700">
              ৳{product.price.toLocaleString()}
            </p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;