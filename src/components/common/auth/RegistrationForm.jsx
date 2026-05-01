import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../Header";

export default function RegistrationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loginType, setLoginType] = useState('customer'); // 'customer', 'seller', or 'admin'
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};
    if (!fullName) newErrors.fullName = "Please fill out this field.";
    if (!email) newErrors.email = "Please fill out this field.";
    if (!password) newErrors.password = "Please fill out this field.";
    if (!phoneNumber) newErrors.phoneNumber = "Please fill out this field.";
    
    if (loginType === 'seller') {
      if (!storeName) newErrors.storeName = "Please fill out this field.";
      if (!storeDescription) newErrors.storeDescription = "Please fill out this field.";
      if (!address) newErrors.address = "Please fill out this field.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (phoneNumber && phoneNumber.length !== 11) {
      newErrors.phoneNumber = "Phone number must be 11 digits";
    }
    
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      let role = 'CUSTOMER';
      if (loginType === 'admin') role = 'ADMIN';
      if (loginType === 'seller') role = 'SELLER';
      
      const extraData = loginType === 'seller' ? { storeName, storeDescription, address } : {};
      
      const response = await register(fullName, email, password, phoneNumber, role, extraData);
      
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (role === 'SELLER') {
        alert("Registration successful! Your account is pending admin approval.");
        navigate('/login');
      } else {
        navigate("/");
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 border border-gray-100 shadow-xl my-8">
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setLoginType('customer')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                loginType === 'customer' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setLoginType('seller')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                loginType === 'seller' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                loginType === 'admin' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1 capitalize">
              {loginType} Registration
            </h2>
            <p className="text-gray-600 text-sm capitalize">Create a new {loginType} account</p>
          </div>

          {apiError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-lg text-xs text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                {loginType === 'seller' ? 'Seller Manager Name' : 'Full Name'}
              </label>
              <input
                id="fullName"
                type="text"
                placeholder={loginType === 'seller' ? "Enter manager name" : "Enter your full name"}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
              )}
            </div>

            {loginType === 'seller' && (
              <>
                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    id="storeName"
                    type="text"
                    placeholder="Enter store name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  />
                  {errors.storeName && (
                    <p className="mt-1 text-xs text-red-600">{errors.storeName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Description
                  </label>
                  <textarea
                    id="storeDescription"
                    placeholder="Describe your store"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm resize-none h-20"
                  />
                  {errors.storeDescription && (
                    <p className="mt-1 text-xs text-red-600">{errors.storeDescription}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="Enter store address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="text"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 hover:cursor-pointer transition duration-200 shadow-md hover:shadow-lg text-sm mt-4"
            >
              Register
            </button>
          </form>
          <p className="text-center text-xs text-gray-600 mt-4">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}