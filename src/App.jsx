import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./components/common/auth/LoginForm.jsx";
import RegistrationForm from "./components/common/auth/RegistrationForm.jsx";
import CustomerProfile from "./pages/customer/Profile.jsx";
import Landing from "./pages/customer/Landing.jsx";
import ViewProduct from "./pages/customer/ViewProduct.jsx";
import Blogs from "./pages/customer/Blogs.jsx";
import ViewBlog from "./pages/customer/ViewBlog.jsx";
import Products from "./pages/customer/Products.jsx";
import Cart from "./pages/customer/Cart.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import SellerDashboard from "./pages/seller/SellerDashboard.jsx";
import CreateProduct from "./pages/seller/CreateProduct.jsx";
import EditProduct from "./pages/seller/EditProduct.jsx";
import Invoice from "./pages/customer/Invoice.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller/create-product" element={<CreateProduct />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/invoice/:orderId" element={<Invoice />} />
        <Route path="/" element={<Landing />} />
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
