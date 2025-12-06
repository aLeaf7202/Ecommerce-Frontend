import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function RegistrationForm() {
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState({});

  
  const validateForm = () => {
    let newErrors = {};
    if (!fullName) newErrors.fullName = "Please fill out this field.";
    if (!email) newErrors.email = "Please fill out this field.";
    if (!password) newErrors.password = "Please fill out this field.";
    if (!phoneNumber) newErrors.phoneNumber = "Please fill out this field.";
    if (email && !email.includes("@gmail.com")) {
      newErrors.email = "Please enter a valid email address";
    }
    if (phoneNumber && phoneNumber.length !== 11) {
      newErrors.phoneNumber = "Phone number must be 11 digits ";
    }
    if (password && password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    } else if (password && !/[A-Z]/.test(password)) {
      newErrors.password = "Password must include an uppercase letter.";
    } else if (password && !/[a-z]/.test(password)) {
      newErrors.password = "Password must include a lowercase letter.";
    } else if (password && !/[0-9]/.test(password)) {
      newErrors.password = "Password must include a number.";
    } else if (password && !/[@$!%*?&_#^-]/.test(password)) {
      newErrors.password = "Password must include a special character.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-indigo-500 h-fit">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Register</h2>
          <p className="text-gray-600 text-sm">Create an account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm"
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
            )}
          </div>
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
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 hover:cursor-pointer transition duration-200 shadow-md hover:shadow-lg text-sm"
          >
            Register
          </button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <button
          type="button"
          className="w-full bg-white border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition duration-200 shadow-sm hover:shadow-md hover:cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          <FcGoogle className="w-4 h-4" />
          Continue with Google
        </button>
        <p className="text-center text-xs text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700 cursor-pointer">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}