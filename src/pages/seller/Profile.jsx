import { useState } from 'react';
import { Edit2 } from 'lucide-react';

export default function SellerProfile() {
  //const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    companyName: '',
    phoneNumber: '',
    email: '',
    address: '',
    website: ''
  });

  const stats = [
    { label: 'Products', value: '0' },
    { label: 'Total Sale', value: '0' },
    { label: 'Profit', value: '0' },
    { label: 'Orders', value: '0' },
    { label: 'Best Sellers', value: '0' },
    { label: 'Blogs', value: '0' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-lg font-medium">Seller Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Profile Info */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-40 h-40 rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Fields */}
              <div className="w-full space-y-3">
                {Object.keys(profile).map((key) => (
                  <div key={key} className="w-full">
                    <input
                      type={key === 'email' ? 'email' : 'text'}
                      placeholder={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={profile[key]}
                      onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Stats */}
          <div className="lg:col-span-2">
            <div className="flex justify-end mb-6">
              <button className="px-6 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors">
                Dashboard
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-gray-100 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px]"
                >
                  <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                  <p className="text-3xl font-semibold text-gray-800">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}