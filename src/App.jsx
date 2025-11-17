import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import Login from './components/common/auth/LoginForm.jsx'
import RegistrationForm from './components/common/auth/RegistrationForm.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistrationForm />} />
      </Routes>
    </Router>
  )
}

export default App