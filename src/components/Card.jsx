import React, { useState } from "react";
import ViewProduct from "../pages/customer/ViewProduct";
import { Star } from "lucide-react";

function Card({ product }) {
  const [showDetail, setShowDetail] = useState(false);

  if (!product) {
    return null;
  }

  return (
    <>
      <div className="w-full max-w-xs mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-300 h-75 flex flex-col transition-all duration-200 hover:scale-105 hover:shadow-xl">
          
          <div className="relative w-full h-32 flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>

          <div className="p-2.5 flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
              {product.name}
            </h3>

            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-indigo-600 font-medium">
                {product.category}
              </p>
              {product.seller && (
                <p className="text-xs text-gray-500 font-medium truncate ml-2">
                  Shop: {product.seller.storeName || product.seller.name}
                </p>
              )}
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-600 font-medium">
                  {(product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)}
                  <span className="text-gray-400 ml-1">({product.reviews.length})</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-gray-300" />
                <span className="text-xs text-gray-400 font-medium">No reviews</span>
              </div>
            )}

            <p className="text-xs text-gray-600 line-clamp-2 leading-snug mt-1">
              {product.description}
            </p>

            <div className="flex-grow"></div>

            <div className="flex items-center justify-between mb-1.5">
              <p className="text-base font-bold text-indigo-700">
                ৳{product.price.toLocaleString()}
              </p>
              <span className="text-xs font-medium text-green-700">
                In Stock
              </span>
            </div>

            <button onClick={() => setShowDetail(true)} className="w-full bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-md hover:bg-indigo-700 transition hover:cursor-pointer">
              View Details
            </button>
          </div>
        </div>
      </div>
      {showDetail && (
        <ViewProduct
          product={product}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );

  

}

export default Card;