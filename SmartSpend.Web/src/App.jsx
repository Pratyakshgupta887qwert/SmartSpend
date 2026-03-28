import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LandingPage from "./Pages/LandingPage";

import AuthPage from "./Pages/AuthPage";
import Dashboard from "./Pages/Dashboard";
import UploadReceipt from "./Pages/UploadReceipt";
import Budgets from "./Pages/Budgets";
import Setting from "./Pages/Setting";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/uploadreceipt" element={<UploadReceipt />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
    </Router>
  );
}

export default App;