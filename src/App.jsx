import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./components/common/auth/LoginForm.jsx";
import RegistrationForm from "./components/common/auth/RegistrationForm.jsx";
import CustomerProfile from "./pages/customer/Profile.jsx";
import Landing from "./pages/customer/Landing.jsx";
import Profile from "./pages/seller/Profile.jsx";
import ViewProduct from "./pages/customer/ViewProduct.jsx";
import Blogs from "./pages/customer/Blogs.jsx";
import ViewBlog from "./pages/customer/ViewBlog.jsx";
import Products from "./pages/customer/Products.jsx";
import Cart from "./pages/customer/Cart.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/" element={<Landing />} />
        <Route path="/seller/profile" element={<Profile />} />
        <Route path="/product/view" element={<ViewProduct />} />
        <Route path="/products" element={<Products />} />

        {/*  Blogs */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<ViewBlog />} /> 
      </Routes>
    </Router>
  );
}

export default App;
