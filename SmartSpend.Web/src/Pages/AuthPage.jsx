import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';


function AuthPage() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  
  // Create a reference to the username input
  const loginUserRef = useRef(null);

  const handleRegisterClick = () => setIsActive(true);
  const handleLoginClick = () => setIsActive(false);

  // Handle Login Submission
  const handleLoginSubmit = async(e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log("LOGIN DATA: ",email,password);
    // Save the name to browser memory
    //localStorage.setItem("userName", username);
    try{
      const response = await axios.post("https://localhost:5030/api/auth/login", {
        email:email,
        password:password
        
      }
      
      );
    const token= response.data.token;
    localStorage.setItem("token",token);
    const decode = jwtDecode(token);
    const name= decode.name || decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    console.log(decode);
    localStorage.setItem("userName",name);
    
    // Go to dashboard
    navigate("/dashboard");

    }
    catch(error){
      const message= error.response?.data;
      if(message==="Invalid Credentials"){
        alert("Either your memory is bad or your typing is worse 💀");
      }else{
        alert(message || "Something broke… not your fault tho 😤")
      }
      console.error(error);
    }
  };

  const handleRegisterSubmit = async(e) => {
    e.preventDefault();
    const form = e.target;
    const formName= form.name.value;
    const email = form.email.value;
    const password= form.password.value;
    console.log("REGISTER DATA: ",formName,email,password);

    try{
      const response = await axios.post("https://localhost:5030/api/auth/register", {
        name:formName,
        email:email,
        password:password
      }
      );
    const token = response.data.token;
    localStorage.setItem("token",token);
    
    const decode= jwtDecode(token);
    const name= decode.name || decode["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    console.log(decode);
    localStorage.setItem("userName",name);

    // Go to dashboard
    navigate("/dashboard");
    }
    catch(error){
      const message= error.response?.data;
      if(message==="User Already Exists"){
        alert("You’re already on the list 👀 go log in.");
      }else{
        alert(message || "Something broke… not your fault tho 😤")
      }
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-50 to-green-100 font-['Poppins'] p-5">
      <div className="relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden">
        
        {/* Login Form Section */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-[1] transition-all duration-[600ms] 
          ${isActive ? "-translate-x-full opacity-0 invisible" : "translate-x-0 opacity-100 visible"}`}>
          <form className="w-full" onSubmit={handleLoginSubmit}>
            <h1 className="text-4xl font-bold mb-4">Login</h1>
            
            <div className="relative my-8">
              <input 
                name="email"
                type="text" 
                placeholder="Email" 
                className="w-full py-3 px-5 pr-12 bg-[#eee] rounded-lg outline-none font-medium" 
                required 
              />
              <i className='bx bxs-user absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>

            <div className="relative my-8">
              <input name ="password" type="password" placeholder="Password" className="w-full py-3 px-5 pr-12 bg-[#eee] rounded-lg outline-none font-medium" required />
              <i className='bx bxs-lock-alt absolute right-5 top-1/2 -translate-y-1/2 text-xl'></i>
            </div>

            <div className="mb-4 text-sm text-left">
              <a href="#" className="text-gray-700">Forgot Password?</a>
            </div>

            <button type="submit" className="w-full h-12 bg-green-500 text-white rounded-lg shadow-md font-semibold hover:bg-green-600 transition-colors">
                Login
            </button>

            <p className="text-[14.5px] my-4 text-gray-600">Or</p>
            <button type="button" onClick={()=> window.location.href="https://localhost:5030/api/auth/login"} className="w-full h-12 bg-green-500 text-white rounded-lg shadow-md font-semibold hover:bg-green-600 transition-colors">
              Login with Google
            </button>
          </form>
        </div>

        {/* Registration Form Section */}
        <div className={`absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-[1] transition-all duration-[600ms] 
          ${isActive ? "translate-x-[-100%] opacity-100 visible" : "translate-x-0 opacity-0 invisible"}`}>
          <form className="w-full" onSubmit={handleRegisterSubmit}>
            <h1 className="text-4xl font-bold mb-4">Registration</h1>
            <div className="relative my-8"><input name ="name" type="text" placeholder="Username" className="w-full py-3 px-5 bg-[#eee] rounded-lg outline-none" required /></div>
            <div className="relative my-8"><input name ="email" type="email" placeholder="Email" className="w-full py-3 px-5 bg-[#eee] rounded-lg outline-none" required /></div>
            <div className="relative my-8"><input name ="password" type="password" placeholder="Password" className="w-full py-3 px-5 bg-[#eee] rounded-lg outline-none" required /></div>
            <button type="submit" className="w-full h-12 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">Register</button>
          </form>
        </div>

        {/* Toggle Panels */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className={`absolute top-0 w-[300%] h-full bg-green-500 rounded-[150px] transition-all duration-[1.8s] ease-in-out z-[2] 
            ${isActive ? "left-1/2" : "-left-[250%]"}`}></div>

          <div className={`absolute left-0 w-1/2 h-full flex flex-col justify-center items-center text-white z-[2] transition-all duration-[600ms] pointer-events-auto
            ${isActive ? "-translate-x-full delay-[600ms]" : "translate-x-0 delay-[1200ms]"}`}>
            <h1 className="text-4xl font-bold mb-2">Hello, Welcome!</h1>
            <p className="mb-5">Don't have an account?</p>
            <button onClick={handleRegisterClick} className="w-40 h-[46px] border-2 border-white rounded-lg font-semibold hover:bg-green-600 bg-green-500 transition-all">
                Register
            </button>
          </div>

          <div className={`absolute right-0 w-1/2 h-full flex flex-col justify-center items-center text-white z-[2] transition-all duration-[600ms] pointer-events-auto
            ${isActive ? "translate-x-0 delay-[1200ms]" : "translate-x-[100%] delay-[600ms]"}`}>
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="mb-5">Already have an account?</p>
            <button onClick={handleLoginClick} className="w-40 h-[46px] border-2 border-white rounded-lg font-semibold hover:bg-green-500 bg-green-600 transition-all">
                Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;