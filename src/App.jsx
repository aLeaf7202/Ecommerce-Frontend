import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Login from './components/common/auth/LoginForm.jsx'
import RegistrationForm from './components/common/auth/RegistrationForm.jsx'
import CustomerProfile from './pages/customer/Profile.jsx'
import Landing from './pages/customer/Landing.jsx'
import Profile from './pages/seller/Profile.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/customerprofile" element={<CustomerProfile />} />
        <Route path="/" element={<Landing />} />
        <Route path="/seller/profile" element={<Profile />} />

      </Routes>
    </Router>
  )
}

export default App