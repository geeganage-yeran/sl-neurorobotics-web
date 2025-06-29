import React, { useEffect, useState } from "react";
import logo from "../assets/image4.png";
import { handleSignOut } from "../services/logout";
import api from "../services/api";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HeaderV2 = ({ user }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [count,setCount] = useState(0);

  const navigate = useNavigate();

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleAddToCartPage = () =>{
    navigate(`/cart/${user.id}`)
  }

  const handleAccountClick = () => {
    setIsUserDropdownOpen(false);
    navigate("/dashboard/account/myorders");
  };

  const handleSignOutClick = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await handleSignOut(navigate);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    fetchAddItemCount();
  }, [user.id]);

  const fetchAddItemCount= async () => {
    try {
      if (user) {
        const response = await api.get(`/cart/count/${user.id}`,{
          withCredentials:true,
        });
         setCount(response.data.count);
      }
    } catch (error) {
      console.error("Error fetching addtocartcount:", error);
    } 
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-4 py-3 bg-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="SL Neurorobotics Logo" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-12">
          <a
            href="/"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Home
          </a>
          <a
            href="/resources"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Resources
          </a>
          <a
            href="/shop"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Shop
          </a>
          <a
            href="/about"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            About Us
          </a>
          <a
            href="/about#contactUs"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Desktop Right Section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Shopping Cart */}
          <button className="relative p-2 text-gray-700 cursor-pointer hover:text-[#006494] transition-colors" onClick={()=>handleAddToCartPage()}>
            <FaShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#006494] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {count}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-[#006494] cursor-pointer transition-colors"
            >
              <FaUser />
              <span className="font-medium">Hi, {user.firstName}</span>
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
                    onClick={handleSignOutClick}
                    disabled={isLoggingOut}
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
        <div className="flex items-center space-x-2 lg:hidden">
          {/* Mobile Shopping Cart */}
          <button className="relative p-2 text-gray-700 hover:text-[#006494] transition-colors" onClick={()=>handleAddToCartPage()}>
            <FaShoppingCart size={18} />
            <span className="absolute -top-1 -right-1 bg-[#006494] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
              {count}
            </span>
          </button>

          {/* Mobile User Dropdown */}
          <div className="relative">
            <button
              onClick={handleUserDropdownToggle}
              className="flex items-center space-x-1 p-2 text-gray-700 hover:text-[#006494] transition-colors"
            >
              <FaUser size={16} />
              <span className="text-sm font-medium">Hi, {user.firstName}</span>
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
                    onClick={handleSignOutClick}
                    disabled={isLoggingOut}
                    className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 z-50 bg-white border-t shadow-lg lg:hidden top-full">
          <nav className="flex flex-col max-w-6xl py-4 mx-auto">
            <a
              href="/"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Home
            </a>
            <a
              href="/resources"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Resources
            </a>
            <a
              href="/shop"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Shop
            </a>
            <a
              href="/about"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              About Us
            </a>
            <a
              href="/about#contactUs"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Contact
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderV2;
