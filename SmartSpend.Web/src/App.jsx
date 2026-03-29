import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import LandingPage from "./Pages/LandingPage";

import AuthPage from "./Pages/AuthPage";
import Dashboard from "./Pages/Dashboard";
import UploadReceipt from "./Pages/UploadReceipt";
import Budgets from "./Pages/Budgets";
import Setting from "./Pages/Setting";
import { NotificationProvider } from "./context/NotificationContext";


function App() {
  return (
    <Router>
      <NotificationProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/uploadreceipt" element={<UploadReceipt />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Setting />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}

export default App;