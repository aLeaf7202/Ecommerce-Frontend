import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Image } from 'lucide-react';

export default function ViewProduct() {

const product ={
  name:"Beats Studio Pro - Wireless Noise Cancelling Headphone",
  category:"Electronics",
  seller:"TechWorld",
  price:"2000 BDT",
  description:"High-quality wireless noise cancelling headphones with superior sound and comfort."
}

const image = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80",
   
  ];
const [selectedImage] = useState(0);

  const [quantity, setQuantity] = useState(0);
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(0, prev - 1));



  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 ">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">{product.name}</h1>
        </div>
        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Left Column - Product Images & Description */}
          <div className="space-y-6">
            {/* Product Images */}
            <div>
              <h2 className="text-sm font-medium mb-3 text-gray-700">Product Image</h2>
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <img src={image[selectedImage]} alt={product.name}
             className="w-full h-65 object-cover object-center rounded-lg"
              
              />
              </div>
            </div>
            {/* Description */}
            <div>
              <h2 className="text-sm font-medium mb-3 text-gray-700 ">Description</h2>
             
              <div className="bg-gray-200 rounded-lg h-40">
                {product.description}
              </div>
            </div>
          </div>
          



          {/* Right Column - Product Details */}
          <div className="space-y-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">{product.name}</label>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
            {/* Seller Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Seller Name</label>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Price</label>
              <div className="bg-gray-200 h-10 rounded"></div>
            </div>
            {/* Quantity and Add to Cart */}
            <div className="flex items-center justify-end gap-3 pt-8">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}