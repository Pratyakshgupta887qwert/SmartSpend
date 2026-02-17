import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";

import Dashboard from "./Pages/Dashboard";

// const Dashboard=()=>{
//   return <h1>Hii I amDashboard</h1>
// };
function App() {
  return (
    <>
   
    <Side />
     <Router>
       <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/dashboard" element={<Dashboard />} />
   
       </Routes>
     </Router>
     </>
     
  );
}

export default App;
