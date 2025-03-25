import React, { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/bg.jpg'; // Adjust the path as necessary

const LandingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const handleLoginRedirect = () => {
    setLoading(true); // Set loading to true when button is clicked
    setTimeout(() => {
      navigate('/login'); // Redirect to the Login page after a delay
      setLoading(false); // Reset loading state
    }, 2000); // Simulate a loading delay (2 seconds)
  };

  return (
    <div 
      className="relative flex h-screen bg-cover bg-center" 
      style={{ backgroundImage: `url(${backgroundImage})` }} // Use the imported image
    >
      {/* Dark Background Overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Left Side Content */}
      <div className="flex flex-col items-center justify-center w-2/3 p-8 relative z-10">
        <h1 className="text-2xl font-extrabold text-white text-center mb-4 fade-in">Welcome to</h1>
        <h1 className="text-5xl font-extrabold text-white text-center mb-4 shadow-md fade-in">Nodado General Hospital</h1>
        <h2 className="text-3xl font-semibold text-white text-center mb-8 fade-in">Compensation and Benefits</h2>
        <p className="text-lg text-white text-center mb-6 max-w-md fade-in">
          Welcome to the HR portal for Compensation and Benefits. Here you can find all the information you need regarding your compensation, benefits, and more.
        </p>
      </div>

      {/* Right Side Admin Panel */}
      <div className="flex items-center justify-center w-1/4 p-8 relative z-10">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4 fade-in">Admin Panel</h2>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLoginRedirect}
            className="mt-4 shadow-lg transition-transform transform hover:scale-105 bg-blue-900"
            disabled={loading} // Disable button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Admin Panel'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;