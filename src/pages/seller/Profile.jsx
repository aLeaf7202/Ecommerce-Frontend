import { FaChevronLeft, FaUser, FaEdit } from "react-icons/fa";
import { useState } from "react";

export default function SellerProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [sellerInfo, setSellerInfo] = useState({
    name: "Company Name",
    phone: "  Phone Number",
    email: "  Email",
    address: "  Address",
    website: "  Website"
  });

  const [editForm, setEditForm] = useState({ ...sellerInfo });

  const handleEdit = () => {
    if (isEditing) setSellerInfo(editForm);
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditForm(sellerInfo);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-gray-100 transition">
              <FaChevronLeft className="text-lg" />
            </button>
            <h1 className="text-3xl font-semibold">Seller Profile</h1>
          </div>

          <button className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-cyan-600 transition">
            Log Out
          </button>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Side Profile  */}
          <div className="lg:col-span-1 bg-white shadow-md rounded-xl p-8 min-h-[600px] flex flex-col items-center">
            
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-52 h-52 rounded-full bg-gray-200 border-8 border-gray-300 flex items-center justify-center">
                <FaUser className="w-24 h-24 text-gray-600" />
              </div>

              <button
                onClick={handleEdit}
                className="absolute bottom-3 right-3 w-12 h-12 bg-white border-2 border-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="w-full mt-8 space-y-3">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Customer Name"
                  />
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Phone Number"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-3 border rounded-lg"
                    placeholder="Address"
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleEdit}
                      className="flex-1 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                    {sellerInfo.name}
                  </div>
                  <div className="px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                    {sellerInfo.phone}
                  </div>
                  <div className="px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                    {sellerInfo.email}
                  </div>
                  <div className="px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                    {sellerInfo.address}
                  </div>
                  <div className="px-4 py-3 bg-gray-200 rounded-lg text-center font-medium">
                    {sellerInfo.website}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Side Dashboard */}
          <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-8">

            {/* Dashboard Button */}
            <div className="flex justify-end mb-6">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                Dashboard
              </button>
            </div>

            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {["Products", "Total Sale", "Profit", "Orders", "Best Sellers", "Blogs","Campaign"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-gray-200 rounded-lg p-6 flex items-center justify-center min-h-[130px] shadow-sm"
                  >
                    <span className="text-gray-700 font-semibold text-lg">{item}</span>
                  </div>
                )
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
