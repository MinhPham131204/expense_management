import React, { useState } from "react";
import axios from "axios";
import { HandCoins, Landmark  } from 'lucide-react';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginSignup = () => {
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return;
    }

    console.log(isLogin ? "Logging in" : "Signing up", formData); 
    const url = isLogin ? 'http://localhost:3000/users/login' : 'http://localhost:3000/users/signup'

    
    const fetchLogin = async () => {
      console.log(url);
      
      try {
        const response = await axios.post(
          url,
          formData,
          { withCredentials: true }
        );
        if (response.status === 201) {
          
          // redirect to dashboard
          setIsLoggedIn(true);
          navigate("/");
          
        }
      } catch (error) {
        console.error("Error fetching login:", error);
      }
    };
    fetchLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen min-w-screen bg-gradient-to-r from-[#133046] via-[#12768a] to-[#0e8499]">
      <div className="relative bg-transparent w-[768px] max-w-full min-w-[42%] min-h-[560px] rounded-[30px] shadow-lg shadow-[#93b0b5] overflow-hidden">
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-500 ${
            isLogin ? "left-0 z-10" : "translate-x-full opacity-0 z-0"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 gap-4">
            <h1 className="text-3xl font-bold text-[#51a8b7]">Login</h1>
            <form className="flex flex-col w-full space-y-3 gap-4" onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <button className="bg-[#bebd00] py-2 rounded-md">
                <span className="text-[#004754] font-semibold">Login</span>
              </button>
            </form>
          </div>
        </div>

        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-500 ${
            isLogin ? "translate-x-full opacity-0 z-0" : "left-0 z-10"
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full px-10 gap-4">
            <h1 className="text-3xl font-bold text-[#51a8b7]">Sign Up</h1>
            <form className="flex flex-col w-full space-y-3 gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="h-[40px] text-red-200 outline-none border-2 pl-2 border-b-indigo-600 text-[20px] leading-8"
              />
              <button className="bg-[#bebd00] text-[#004754] font-semibold py-2 rounded-md">
                <span className="text-[#004754] font-semibold">Sign Up</span>
              </button>
            </form>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 w-1/2 h-full transition-all duration-500 bg-transparent text-white flex flex-col items-center justify-center rounded-r-[30px] gap-4 px-20">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-4">{isLogin ? "Hello" : "Welcome Back!"} {isLogin ? <HandCoins size={30}/> : <Landmark size={60} /> }</h1>
          
          <p className="px-6 text-center">
            {isLogin
              ? "Register to use all features in our site"
              : "Provide your personal details to use all features"}
          </p>
          <button
            className="bg-transparent border border-white px-6 py-2 mt-4 rounded-md"
            onClick={() => setIsLogin(!isLogin)}
          >
            <span className="text-gray-800">{isLogin ? "Sign Up" : "Sign In"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
