import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';


function AuthPage() {
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff7f2,_#f7fbf8_42%,_#edf6f1_100%)] px-3 py-4 font-['Manrope'] sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <div className="relative grid w-full overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_35px_120px_-45px_rgba(15,23,42,0.45)] backdrop-blur lg:grid-cols-2 lg:rounded-[32px]">
          <div className="relative min-h-[620px] overflow-hidden bg-[#faf7f5] sm:min-h-[680px]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(197,58,55,0.08),_transparent_42%)]" />
            <div className="relative flex h-full flex-col p-5 sm:p-8 lg:p-10">
              <div className="mb-6 flex items-center justify-between sm:mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-[#c53a37]" />
                  <span className="text-lg font-bold tracking-tight text-[#201b1c]">
                    SmartSpend
                  </span>
                </div>

                <button
                  type="button"
                  onClick={isActive ? handleLoginClick : handleRegisterClick}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-[#201b1c] transition hover:bg-black/5"
                >
                  {isActive ? "Log in" : "Sign up"}
                </button>
              </div>

              <div className="relative flex-1 overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-[700ms] ease-out ${
                    isActive
                      ? "-translate-x-8 opacity-0 pointer-events-none z-0"
                      : "translate-x-0 opacity-100 pointer-events-auto z-10"
                  }`}
                >
                  <form className="flex h-full flex-col" onSubmit={handleLoginSubmit}>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-[#201b1c] sm:text-5xl">
                        Welcome back
                      </h1>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-[#6d6768] sm:text-base">
                        Log in to continue managing your expenses.
                      </p>
                    </div>

                    <div className="mt-7 space-y-4 sm:mt-10 sm:space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#2d2728]">
                          Email
                        </label>
                        <div className="relative">
                          <input 
                            name="email"
                            type="text" 
                            placeholder="johndoe@gmail.com" 
                            className="w-full rounded-2xl border border-[#e7deda] bg-white px-4 py-3.5 pr-12 text-sm text-[#201b1c] outline-none transition placeholder:text-[#aba3a0] focus:border-[#c53a37] focus:ring-4 focus:ring-[#c53a37]/10" 
                            required 
                          />
                          <i className='bx bxs-user absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#908786]'></i>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#2d2728]">
                          Password
                        </label>
                        <div className="relative">
                          <input name ="password" type="password" placeholder="********" className="w-full rounded-2xl border border-[#e7deda] bg-white px-4 py-3.5 pr-12 text-sm text-[#201b1c] outline-none transition placeholder:text-[#aba3a0] focus:border-[#c53a37] focus:ring-4 focus:ring-[#c53a37]/10" required />
                          <i className='bx bxs-lock-alt absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#908786]'></i>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-left">
                      <a href="#" className="font-medium text-[#7a7374] transition hover:text-[#201b1c]">Forgot your password?</a>
                    </div>

                    <div className="mt-6 space-y-4">
                      <button type="submit" className="w-full rounded-2xl bg-[#c53a37] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-18px_rgba(197,58,55,0.9)] transition hover:bg-[#d04743]">
                          Log in
                      </button>

                      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-[#a29a98]">
                        <span className="h-px flex-1 bg-[#e7deda]" />
                        <span>Or continue with</span>
                        <span className="h-px flex-1 bg-[#e7deda]" />
                      </div>

                      <button type="button" onClick={()=> window.location.href="https://localhost:5030/api/auth/login"} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#e7deda] bg-white px-5 py-3.5 text-sm font-semibold text-[#201b1c] shadow-sm transition hover:border-[#d9ceca] hover:bg-[#fcfbfa]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#4285F4] shadow-sm">
                          G
                        </span>
                        Continue with Google
                      </button>
                    </div>

                    <div className="mt-auto pt-7 text-center text-sm text-[#7a7374] lg:text-left">
                      New here?{" "}
                      <button
                        type="button"
                        onClick={handleRegisterClick}
                        className="font-semibold text-[#c53a37] transition hover:text-[#a93330]"
                      >
                        Create an account
                      </button>
                    </div>
                  </form>
                </div>

                <div
                  className={`absolute inset-0 transition-all duration-[700ms] ease-out ${
                    isActive
                      ? "translate-x-0 opacity-100 pointer-events-auto z-10"
                      : "translate-x-8 opacity-0 pointer-events-none z-0"
                  }`}
                >
                  <form className="flex h-full flex-col" onSubmit={handleRegisterSubmit}>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight text-[#201b1c] sm:text-5xl">
                        Get Started
                      </h1>
                      <p className="mt-3 max-w-sm text-sm leading-6 text-[#6d6768] sm:text-base">
                        Create your account and start managing your expenses.
                      </p>
                    </div>

                    <div className="mt-7 space-y-4 sm:mt-10 sm:space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#2d2728]">
                          Full Name
                        </label>
                        <input name ="name" type="text" placeholder="Your full name" className="w-full rounded-2xl border border-[#e7deda] bg-white px-4 py-3.5 text-sm text-[#201b1c] outline-none transition placeholder:text-[#aba3a0] focus:border-[#c53a37] focus:ring-4 focus:ring-[#c53a37]/10" required />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#2d2728]">
                          Email
                        </label>
                        <input name ="email" type="email" placeholder="johndoe@gmail.com" className="w-full rounded-2xl border border-[#e7deda] bg-white px-4 py-3.5 text-sm text-[#201b1c] outline-none transition placeholder:text-[#aba3a0] focus:border-[#c53a37] focus:ring-4 focus:ring-[#c53a37]/10" required />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[#2d2728]">
                          Password
                        </label>
                        <div className="relative">
                          <input name ="password" type="password" placeholder="********" className="w-full rounded-2xl border border-[#e7deda] bg-white px-4 py-3.5 pr-12 text-sm text-[#201b1c] outline-none transition placeholder:text-[#aba3a0] focus:border-[#c53a37] focus:ring-4 focus:ring-[#c53a37]/10" required />
                          <i className='bx bxs-lock-alt absolute right-4 top-1/2 -translate-y-1/2 text-xl text-[#908786]'></i>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-left">
                      <a href="#" className="font-medium text-[#7a7374] transition hover:text-[#201b1c]">Forgot your password?</a>
                    </div>

                    <div className="mt-6 space-y-4">
                      <button type="submit" className="w-full rounded-2xl bg-[#c53a37] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_35px_-18px_rgba(197,58,55,0.9)] transition hover:bg-[#d04743]">Sign up</button>

                      <div className="flex items-center gap-4 text-xs uppercase tracking-[0.24em] text-[#a29a98]">
                        <span className="h-px flex-1 bg-[#e7deda]" />
                        <span>Or continue with</span>
                        <span className="h-px flex-1 bg-[#e7deda]" />
                      </div>

                      <button type="button" onClick={()=> window.location.href="https://localhost:5030/api/auth/login"} className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#e7deda] bg-white px-5 py-3.5 text-sm font-semibold text-[#201b1c] shadow-sm transition hover:border-[#d9ceca] hover:bg-[#fcfbfa]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#4285F4] shadow-sm">
                          G
                        </span>
                        Continue with Google
                      </button>
                    </div>

                    <div className="mt-auto pt-7 text-center text-sm text-[#7a7374] lg:text-left">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={handleLoginClick}
                        className="font-semibold text-[#c53a37] transition hover:text-[#a93330]"
                      >
                        Log in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden overflow-hidden bg-[#f4efec] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(50,171,113,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(197,58,55,0.12),_transparent_36%)]" />
            <div className="absolute -bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[#dcd3cf]/70 blur-sm" />
            <div className="absolute bottom-0 right-[-8%] h-64 w-64 rounded-full bg-[#d8cfcb]/70" />
            <div className="absolute bottom-12 left-[-10%] h-48 w-48 rounded-full bg-[#e7dfdb]/80" />

            <div className="relative flex h-full flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={isActive ? handleLoginClick : handleRegisterClick}
                  className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#201b1c] shadow-sm ring-1 ring-black/5 transition hover:bg-white"
                >
                  {isActive ? "Log in" : "Sign up"}
                </button>
              </div>

              <div className="mt-8 max-w-md">
                <h2 className="text-4xl font-bold leading-tight tracking-tight text-[#201b1c] sm:text-5xl">
                  Smarter Finance,
                  <br />
                  Made Simple
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-[#6d6768] sm:text-base">
                  Track expenses, monitor your budget, and stay in control with
                  a clean workspace designed for everyday money decisions.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Track and categorise expenses.",
                    "Set and monitor budgets.",
                    "Gain insights on your spending.",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-[#4a4445] sm:text-base">
                      <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-md bg-white text-xs font-bold text-[#32ab71] shadow-sm ring-1 ring-black/5">
                        +
                      </span>
                      <span className="max-w-xs leading-6">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative mt-12 flex min-h-[340px] items-end justify-center pb-4 sm:min-h-[420px]">
                <div className="absolute left-6 top-10 hidden w-44 rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_22px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur sm:block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#201b1c]">SmartSpend</span>
                    <span className="rounded-full bg-[#c53a37] px-2 py-0.5 text-[10px] font-semibold text-white">
                      Budget
                    </span>
                  </div>
                  <p className="mt-4 text-xs text-[#8b8382]">Total balance</p>
                  <p className="mt-1 text-2xl font-bold text-[#201b1c]">$12,245.41</p>
                  <div className="mt-4 h-20 rounded-2xl bg-[linear-gradient(180deg,#fff4f2_0%,#ffffff_100%)] p-3">
                    <div className="flex h-full items-end gap-2">
                      <span className="h-8 w-2 rounded-full bg-[#f0cdca]" />
                      <span className="h-12 w-2 rounded-full bg-[#e7b4ae]" />
                      <span className="h-10 w-2 rounded-full bg-[#d85f5a]" />
                      <span className="h-16 w-2 rounded-full bg-[#c53a37]" />
                      <span className="h-11 w-2 rounded-full bg-[#eab3ad]" />
                    </div>
                  </div>
                </div>

                <div className="relative z-10 w-[220px] rounded-[2.4rem] border-[10px] border-[#232022] bg-white p-3 shadow-[0_35px_80px_-30px_rgba(15,23,42,0.65)] sm:w-[250px]">
                  <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-[#d7d0cc]" />

                  <div className="rounded-[1.4rem] bg-[#faf7f5] p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8b8382]">
                          SmartSpend
                        </p>
                        <p className="mt-1 text-lg font-bold text-[#201b1c]">$12,245.41</p>
                      </div>
                      <span className="rounded-full bg-[#c53a37] px-2 py-1 text-[10px] font-semibold text-white">
                        +2.8%
                      </span>
                    </div>

                    <div className="mt-4 rounded-[1.2rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
                      <div className="flex items-end gap-2">
                        <span className="h-7 w-2 rounded-full bg-[#f0cdca]" />
                        <span className="h-10 w-2 rounded-full bg-[#ebb1ab]" />
                        <span className="h-9 w-2 rounded-full bg-[#e5827d]" />
                        <span className="h-14 w-2 rounded-full bg-[#c53a37]" />
                        <span className="h-11 w-2 rounded-full bg-[#ecbdb7]" />
                        <span className="h-16 w-2 rounded-full bg-[#32ab71]" />
                        <span className="h-9 w-2 rounded-full bg-[#d9d3d0]" />
                      </div>
                    </div>

                    <div className="mt-4 rounded-[1.2rem] bg-[#c53a37] p-3 text-white shadow-[0_20px_35px_-22px_rgba(197,58,55,1)]">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                            Available
                          </p>
                          <p className="mt-1 text-xl font-bold">$12,245.41</p>
                        </div>
                        <div className="h-12 w-12 rounded-full border border-white/20 bg-white/10" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {[
                        ["D", "Dribbble", "-$10.67", "bg-[#201b1c]"],
                        ["N", "Netflix", "-$12.01", "bg-[#c53a37]"],
                        ["A", "Airbnb", "-$112.43", "bg-[#32ab71]"],
                      ].map(([badge, label, value, color]) => (
                        <div key={label} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
                          <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold text-white ${color}`}>
                              {badge}
                            </span>
                            <span className="text-sm font-semibold text-[#201b1c]">{label}</span>
                          </div>
                          <span className="text-xs font-semibold text-[#201b1c]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 right-4 hidden rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_22px_50px_-24px_rgba(15,23,42,0.45)] backdrop-blur sm:block">
                  <p className="text-xs font-semibold text-[#8b8382]">Spending</p>
                  <p className="mt-1 text-3xl font-bold text-[#201b1c]">84%</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c53a37]" />
                    <span className="text-xs text-[#6d6768]">Budget used</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
