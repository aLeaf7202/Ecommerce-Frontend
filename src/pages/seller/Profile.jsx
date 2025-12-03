
import { User, Edit , ChevronLeft } from 'lucide-react';

export default function SellerProfile() {
 

  return (
   <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button className="flex items-center text-gray-600 hover:text-gray-800">
            <span className="mr-2">←</span>
            <span>Seller Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="relative w-40 h-40 mx-auto">
              <div className="w-full h-full rounded-full border-4 border-gray-800 flex items-center justify-center bg-gray-100">
                <User size={80} className="text-gray-800" />
              </div>
              <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50">
                <Edit size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Profile Fields */}
            <div className="space-y-3">
              <div className="bg-gray-200 rounded px-4 py-3 text-center text-gray-600">
                Company Name
              </div>
              <div className="bg-gray-200 rounded px-4 py-3 text-center text-gray-600">
                Phone Number
              </div>
              <div className="bg-gray-200 rounded px-4 py-3 text-center text-gray-600">
                Email
              </div>
              <div className="bg-gray-200 rounded px-4 py-3 text-center text-gray-600">
                Address
              </div>
              <div className="bg-gray-200 rounded px-4 py-3 text-center text-gray-600">
                Website
              </div>
            </div>
          </div>

          {/* Right Column - Stats Grid */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded text-sm">
                Subscription
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              {/* Row 1 */}
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Products</span>
              </div>
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Total Sale</span>
              </div>
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Profit</span>
              </div>

              {/* Row 2 */}
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Orders</span>
              </div>
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Best Sellers</span>
              </div>
              <div className="bg-gray-200 rounded-lg p-8 flex items-center justify-center min-h-[140px]">
                <span className="text-gray-600 font-medium">Blogs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}