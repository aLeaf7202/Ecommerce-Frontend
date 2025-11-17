import { useState } from "react";

export default function RegistrationForm() {

  // States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState({});

  // Validation function
  const validateForm = () => {
    let newErrors = {};

    // Required fields
    if (!fullName) 
       newErrors.fullName = "Please fill out this field.";
      
    if (!email) newErrors.email = "Please fill out this field.";
    if (!password) newErrors.password = "Please fill out this field.";
    if (!phoneNumber) newErrors.phoneNumber = "Please fill out this field.";

    
    if (email && !email.includes("@gmail.com")) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone must be 11 digits 
    if (phoneNumber && (phoneNumber.length !== 11 )) {
      newErrors.phoneNumber = "Phone number must be 11 digits ";
    }

    // Password strong rules
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

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm(); // just validate (no alert)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white rounded-lg border border-gray-900 p-8 max-w-md w-full relative ">

        <h2 className="text-2xl font-bold text-gray-800 text-center">Register</h2>
        <h2 className="text-m mb-6 text-gray-800 text-center">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name */}
          
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-full"
          />
          {errors.fullName && (
            <p className="text-black-500 text-sm">{errors.fullName}</p>
          )}

          {/* Email */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-full"
          />
          {errors.email && (
            <p className="text-black-500 text-sm">{errors.email}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-full"
          />
          {errors.password && (
            <p className="text-black-500 text-sm">{errors.password}</p>
          )}

          {/* Phone Number */}
          <input
            type="text"
            placeholder="Phone Number "
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded-full"
          />
          {errors.phoneNumber && (
            <p className="text-black-500 text-sm">{errors.phoneNumber}</p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-cyan-400 text-white py-2 rounded-full hover:bg-stone-500 transition"
          >
            Register
          </button>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition font-medium"
          >
            Continue with Google
          </button>

        </form>

      </div>
    </div>
  );
}
