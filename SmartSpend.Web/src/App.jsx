import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



import AuthPage from './Pages/AuthPage'
import Dashboard from './Pages/Dashboard'
import Budgets from './Pages/Budgets.jsx';


function App() {
  return (
  
   <>
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/budgets" element={<Budgets/>} />
      </Routes>
    </Router>
    </>
     
  )
}
export default App;