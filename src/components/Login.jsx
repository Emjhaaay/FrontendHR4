import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { CircularProgress } from '@mui/material';
import Nodado from "../images/logo.png";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [verifyingCredentials, setVerifyingCredentials] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPassword || "");
      setRememberMe(true);
    }
    
    // Simulate page loading (remove timeout in production)
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifyingCredentials(true);
    setErrorMessage("");

    try {
      const response = await axios.post("https://backendhr4.vercel.app/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        onLogin();
        navigate("/dashboard");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.message || 
        "An error occurred. Please try again later."
      );
    } finally {
      setVerifyingCredentials(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToLanding = () => {
    navigate("/");
  };

  // Full page preloader (initial load)
  if (pageLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
          <img 
            src={Nodado} 
            alt="Loading" 
            className="h-20 w-20 mb-4 animate-pulse" 
          />
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#090367] mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      {/* Credential verification overlay */}
      {verifyingCredentials && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-40">
          <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-xl border border-gray-200">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#090367] mb-4"></div>
            <h3 className="text-lg font-medium text-gray-800">Authenticating</h3>
            <p className="text-gray-600 mt-2">Please wait while we verify your credentials</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-100 relative">
        {/* Back button (top-left corner) */}
        <button
          onClick={handleBackToLanding}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={Nodado}
            alt="Nodado General Hospital"
            className="h-20 w-20 mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-1">HR Department</h1>
          <h2 className="text-lg text-[#090367] font-medium">Admin Portal</h2>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center border border-red-100">
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="your.email@example.com"
              autoComplete="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verifyingCredentials}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              verifyingCredentials ? 'bg-blue-400' : 'bg-[#090367] hover:bg-[#090367]'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center`}
          >
            {verifyingCredentials ? (
              <>
                <CircularProgress size={20} color="inherit" className="mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;