import { useNavigate } from "react-router-dom";
import "./Login.css";
import React,{ useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister]= useState(false);
  const navigate = useNavigate();
  const handleSubmit=(e)=>{
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      
   
      <div className="login-left">
        <div className="brand">
          <h1>SmartSpend</h1>
          <p>Track smart. Spend smarter.</p>
        </div>
        <img src="login.png" alt="login" className="login-image floating"/>
        
      </div>

 
      <div className="login-right">
        <div className="login-box">

          <h2>{isRegister ? "Create Account" : "Welcome Back"}</h2>
          <p>{isRegister ? "Register to get started" : "Please Login to continue."}</p>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <input type="text" placeholder="Name" required/>
            )}
          <input type="email" placeholder="Email" required/>
          <input type="password" placeholder="Password" required/>

          <button type ="submit"className="login-btn">
            {isRegister ? "Register" : "Login"}
          </button>
          </form>

          <p className="signup-text">
            {isRegister? "Already have an account?":"New to SmartSpend?"}
             <span onClick={()=>setIsRegister(!isRegister)}>{isRegister ? "Login" : "Sign Up"}</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
