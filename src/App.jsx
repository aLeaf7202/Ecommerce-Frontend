import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import RegistrationForm from './components/common/auth/RegistrationForm'

function App() {
 

  return (
   
      <Router>
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
       
        
      </Routes>
    </Router>
    
  )
}

export default App
