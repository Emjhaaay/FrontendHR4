import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon, AccountCircle, ExpandMore, Person, ExitToApp } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const navigate = useNavigate();

  // Clock function
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      
      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
    };

    // Update immediately and then every second
    updateClock();
    const intervalId = setInterval(updateClock, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    setOpenLogoutDialog(true);
    setTimeout(() => {
      setShowDialog(true);
    }, 100);
  };

  const handleLogout = () => {
    setShowDialog(false);
    setTimeout(() => {
      onLogout();
      navigate("/login");
    }, 300);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setTimeout(() => {
      setOpenLogoutDialog(false);
    }, 300);
  };

  return (
    <header className="bg-white shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left section - Menu button */}
      <div className="flex items-center">
        <IconButton 
          onClick={toggleSidebar} 
          sx={{ 
            color: "text-gray-700",
            '&:hover': {
              backgroundColor: 'rgba(48, 73, 148, 0.08)'
            }
          }}
          className="mr-2"
        >
          <MenuIcon />
        </IconButton>
      </div>

      {/* Right section - Time and profile */}
      <div className="flex items-center space-x-6">
        {/* Clock Display */}
        <div className="bg-blue-50 px-4 py-2 rounded-full">
          <span className="text-[#090367] font-medium text-sm md:text-base">
            {currentTime}
          </span>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={handleMenuClick}
            className="flex items-center space-x-1 focus:outline-none"
          >
            <AccountCircle className="text-gray-600" />
            <ExpandMore className="text-gray-500 text-sm" />
          </button>

          {/* Dropdown Menu */}
          {anchorEl && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl py-1 z-50 border border-gray-100"
              onMouseLeave={handleCloseMenu}
            >
              <Link 
                to="/adminprofile" 
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150"
              >
                <Person className="mr-3 text-gray-500" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
              <button
                className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-blue-50 transition-colors duration-150"
                onClick={handleLogoutClick}
              >
                <ExitToApp className="mr-3 text-gray-500" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}

          {/* Logout Confirmation Dialog */}
          {openLogoutDialog && (
            <div
              className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 transition-opacity duration-300 ${showDialog ? 'opacity-100' : 'opacity-0'}`}
            >
              <div
                className={`bg-white p-6 rounded-lg shadow-xl w-96 transform transition-all duration-300 ${showDialog ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">
                  You will be redirected to the login page after logging out.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseDialog}
                    className="px-5 py-2 rounded-md text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;