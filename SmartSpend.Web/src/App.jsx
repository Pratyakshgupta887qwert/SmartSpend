import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadReceipt from './Pages/UploadReceipt';
import AuthPage from './Pages/AuthPage'
import Dashboard from './Pages/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path ="/uploadreceipt" element={<UploadReceipt />}/>
      </Routes>
    </Router>
  )
}
export default App;