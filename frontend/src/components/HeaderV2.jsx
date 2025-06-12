import React, { useState } from "react";
import logo from "../assets/image4.png";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { Link, useNavigate, Routes, Route } from "react-router-dom";

const HeaderV2 = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate(); 


  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };


  const handleAccountClick = () => {
    setIsUserDropdownOpen(false); 
    navigate('/dashboard/account/myorders'); 
  };


  const handleSignOut = () => {
    setIsUserDropdownOpen(false);
    console.log("Signing out...");
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 py-3 bg-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="SL Neurorobotics Logo" className="h-8" />
          </Link>
        </div>

        {/* Desktop Right Section */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Shopping Cart */}
          <button className="relative p-2 text-gray-700 cursor-pointer hover:text-[#006494] transition-colors">
            <FaShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#006494] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </button>

          <div className="relative">
            <button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-[#006494] cursor-pointer transition-colors"
            >
              <FaUser />
              <span className="font-medium">Hi, Yeran</span>
              <FaChevronDown
                className={`transition-transform ${
                  isUserDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border cursor-pointer border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button 
                    onClick={handleAccountClick}
                    className="block w-full px-4 py-2 text-left font-semibold cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Account
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left font-semibold cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center space-x-2 md:hidden">
          {/* Mobile Shopping Cart */}
          <button className="relative p-2 text-gray-700 hover:text-[#006494] transition-colors">
            <FaShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-[#006494] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
              0
            </span>
          </button>

          {/* Mobile User Dropdown */}
          <div className="relative">
            <button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-1 p-2 text-gray-700 hover:text-[#006494] transition-colors"
            >
              <FaUser size={16} />
              <span className="text-sm font-medium">Hi, Yeran</span>
              <FaChevronDown
                className={`text-xs transition-transform ${
                  isUserDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <button 
                    onClick={handleAccountClick}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Account
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderV2;