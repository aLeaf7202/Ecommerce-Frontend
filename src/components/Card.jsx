import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";

function Card({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/products.json")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          const item = data[productId];
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

  if (loading) {
    return (
      <div className="w-full max-w-xs mx-auto p-2">
        <div className="bg-gray-200 border border-gray-300 rounded-lg h-72 animate-pulse"></div>
      </div>
    );
  }

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
              src={product.image}
              alt={product.title}
            />
          </div>

          <div className="p-2.5 flex flex-col flex-grow">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">
              {product.title}
            </h3>

            <p className="text-xs text-indigo-600 font-medium mt-1">
              {product.category}
            </p>

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

            <button
              onClick={() => setShowDetail(true)}
              className="w-full bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-md hover:bg-indigo-700 transition"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <ViewProductModal
            product={{ id: productId, ...product }}
            onClose={() => setShowDetail(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* Inline Modal Component (no need for separate file) */
function ViewProductModal({ product, onClose }) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-6 h-6 text-gray-700" />
        </button>

        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image & Description */}
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Product Image</h2>
              <div className="overflow-hidden rounded-xl bg-gray-100">
                <img
                  src={product.image}
                  alt={product.title}
                  className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-gray-800">Description</h2>
              <div className="rounded-xl bg-gray-50 p-6 text-gray-700 leading-relaxed">
                {product.description}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Product Name</label>
                <div className="rounded-lg bg-gray-100 px-5 py-4 text-lg font-semibold text-gray-900">
                  {product.title}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                <div className="rounded-lg bg-indigo-50 px-5 py-4 text-indigo-700 font-medium">
                  {product.category}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
                <div className="rounded-lg bg-gray-100 px-5 py-4 text-2xl font-bold text-indigo-700">
                  ৳{product.price.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Availability</label>
                <div className="rounded-lg bg-green-50 px-5 py-4 text-green-700 font-medium">
                  In Stock
                </div>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-6">
              <div className="flex items-center rounded-lg bg-gray-100 p-2">
                <button onClick={decrement} className="p-2 rounded hover:bg-gray-200 transition">
                  <Minus className="w-5 h-5" />
                </button>
                <span className="mx-6 w-12 text-center text-lg font-semibold">{quantity}</span>
                <button onClick={increment} className="p-2 rounded hover:bg-gray-200 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button className="flex-1 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-indigo-700">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Card;