import React, { useState, useEffect } from "react";

function Card({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const item = data[productId];
          // Only render if available === 1
          if (item && item.available === 1) {
            setProduct(item);
          } else {
            setProduct(null);
          }
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

  // Loading placeholder
  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto p-2">
        <div className="bg-gray-200 border border-gray-300 rounded-lg h-72 animate-pulse"></div>
      </div>
    );
  }

  // Do NOT render if unavailable
  if (!product) {
    return null;
  }

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 h-72 flex flex-col transition-all duration-200 hover:scale-105 hover:shadow-xl">
        {/* Image - Smaller height */}
        <div className="relative w-full h-32 flex-shrink-0">
          <img
            className="w-full h-full object-cover"
            src={product.image}
            alt={product.title}
          />
        </div>
        {/* Details - Compact spacing */}
        <div className="p-2.5 flex flex-col flex-grow">
          {/* Title - Line clamp without fixed height */}
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
            {product.title}
          </h3>
          {/* Category */}
          <p className="text-xs text-indigo-600 font-medium mb-0.5">
            {product.category}
          </p>
          {/* Spacer to push content to bottom */}
          <div className="flex-grow"></div>
          {/* Price & In Stock */}
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-base font-bold text-indigo-700">
              ৳{product.price.toLocaleString()}
            </p>
            <span className="text-xs font-medium text-green-700">
              In Stock
            </span>
          </div>
          {/* View Details Button */}
          <button className="w-full bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-md hover:bg-indigo-700 transition">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;