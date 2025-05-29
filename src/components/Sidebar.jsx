import React from "react";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RedeemIcon from "@mui/icons-material/Redeem";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import nodadoHospitalImage from '../images/logo.png';

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0 w-64" : "-translate-x-full w-20"
      } transition-all duration-300 ease-in-out z-50`}
    >
      <div className="flex flex-col items-center p-4 mt-2">
        <img 
          src={nodadoHospitalImage} 
          alt="Nodado Hospital" 
          className={`transition-all duration-300 ${isOpen ? "w-32" : "w-12"}`} 
        />
        <h1 className={`text-lg text-gray-800 font-bold mt-2 text-center ${!isOpen && "hidden"}`}>
          Nodado General Hospital
        </h1>
      </div>

      <nav className="flex flex-col p-4 space-y-1">
        {/* Dashboard Section */}
        <div className="px-3 pt-5">
          <span className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen && "hidden"}`}>
            Dashboard
          </span>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <GridViewIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Dashboard
          </span>
        </Link>

        {/* Compensation Section */}
        <div className="px-3 pt-5">
          <span className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen && "hidden"}`}>
            Compensation
          </span>
        </div>
        <Link
          to="/overtimemanagement"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <AccessTimeIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Overtime
          </span>
        </Link>
        <Link
          to="/shift"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <AvTimerIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Shift
          </span>
        </Link>
        <Link
          to="/incentives"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <RedeemIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Incentives
          </span>
        </Link>

        {/* Benefits Section */}
        <div className="px-3 pt-5">
          <span className={`text-xs font-semibold text-gray-500 uppercase tracking-wider ${!isOpen && "hidden"}`}>
            Benefits
          </span>
        </div>
        <Link
          to="/benefits"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <MedicalServicesOutlinedIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Benefits
          </span>
        </Link>
        <Link
          to="/leave"
          className="flex items-center p-3 rounded-lg hover:bg-[#090367] hover:text-white transition-colors duration-200 group"
        >
          <CalendarMonthIcon className="text-gray-600 group-hover:text-white" />
          <span className={`ml-4 font-medium text-gray-700 group-hover:text-white ${!isOpen && "hidden"}`}>
            Leave
          </span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;