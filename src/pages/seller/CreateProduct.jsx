import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ChevronLeft, Image as ImageIcon, UploadCloud, Plus } from 'lucide-react';

export default function CreateProduct() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredDuration, setFeaturedDuration] = useState('');
  const [productImage, setProductImage] = useState(''); // Just keeping state for demo
  const [featuredImage, setFeaturedImage] = useState('');

  useEffect(() => {
    if (!user || (user.role !== 'SELLER' && user.role !== 'ADMIN')) {
      navigate('/login');
      return;
    }

    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data);
        if(data.length > 0) setCategory(data[0].name);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    
    fetchCategories();
  }, [user, navigate]);

  const handleSaveProduct = async () => {
    if(!productName || !price || !category) {
      alert("Please fill in the required fields (Name, Price, Category).");
      return;
    }

    try {
      const productData = {
        name: productName,
        category: category,
        price: parseFloat(price),
        description: description,
        featured: isFeatured,
        featuredDuration: isFeatured ? featuredDuration : null,
        // Mock image URL for now
        imageUrl: productImage || 'https://via.placeholder.com/150',
        featuredImage: featuredImage
      };

      await api.post('/products', productData);
      alert("Product created successfully!");
      navigate('/seller-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="w-10 h-10 rounded-full border border-gray-800 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-medium text-gray-800">Create New Product</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="flex flex-col gap-6">
            
            {/* Product Image */}
            <div>
              <p className="text-gray-800 mb-2">Add Product Images</p>
              <div className="bg-[#f0f0f0] w-full h-64 rounded-sm flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                <UploadCloud className="w-12 h-12 text-gray-800" />
              </div>
            </div>

            {/* Product Name */}
            <div>
              <p className="text-gray-800 mb-2">Product Name</p>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-[#e3e3e3] h-10 px-4 rounded-sm outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <p className="text-gray-800 mb-2">Category</p>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#e3e3e3] h-10 px-4 rounded-sm outline-none appearance-none"
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <p className="text-gray-800 mb-2">Price</p>
              <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-[#e3e3e3] h-10 px-4 rounded-sm outline-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Description */}
            <div>
              <p className="text-gray-800 mb-2">Description</p>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#e3e3e3] h-64 p-4 rounded-sm outline-none resize-none"
              ></textarea>
            </div>

            {/* Featured Product */}
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded-sm"
              />
              <label htmlFor="featured" className="text-gray-800 cursor-pointer">Featured Product</label>
            </div>

            {/* Duration Dropdown */}
            <div>
              <select 
                disabled={!isFeatured}
                value={featuredDuration}
                onChange={(e) => setFeaturedDuration(e.target.value)}
                className="w-full bg-[#e3e3e3] h-10 px-4 rounded-sm outline-none text-sm disabled:opacity-50 appearance-none"
              >
                <option value="">Duration (Drop Down Menu)</option>
                <option value="1 Week">1 Week</option>
                <option value="1 Month">1 Month</option>
              </select>
            </div>

            {/* Add Featured Image */}
            <div className={!isFeatured ? 'opacity-50 pointer-events-none' : ''}>
              <p className="text-gray-800 text-sm mb-2">Add Featured Image</p>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-[#f0f0f0] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition">
                  <UploadCloud className="w-8 h-8 text-gray-800" />
                </div>
                <div className="w-8 h-8 bg-[#f0f0f0] rounded-sm flex items-center justify-center self-center cursor-pointer hover:bg-gray-200 transition">
                  <Plus className="w-5 h-5 text-gray-800" />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-auto pt-8">
              <button 
                onClick={() => navigate(-1)}
                className="bg-[#ff4d4d] text-white px-8 py-2 rounded-md hover:bg-red-600 transition"
              >
                Discard
              </button>
              <button 
                onClick={handleSaveProduct}
                className="bg-[#6b9dff] text-white px-8 py-2 rounded-md hover:bg-blue-500 transition"
              >
                Save Product
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
