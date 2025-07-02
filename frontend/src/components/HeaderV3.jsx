import React, { useState } from "react";
import logo from "../assets/image4.png";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const HeaderV3 = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate("/admin");
  };

  // Function toggle mobile menu
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function close mobile menu
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full px-6 py-4 bg-white shadow-md">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="SL Neurorobotics Logo" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-12 lg:flex">
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

        <div className="items-center hidden space-x-4 lg:flex">
          <button
            className="px-5 py-2 bg-[#006494] text-white rounded-md hover:bg-[#003554] font-semibold transition-all duration-300 ease-in-out cursor-pointer"
            onClick={handleAccountClick}
          >
            Admin Panel
          </button>
        </div>

        <div className="flex items-center space-x-4 lg:hidden">
          {/* Hamburger Menu */}
          <button
            onClick={handleMobileMenuToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

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

            <div className="px-6 py-3">
              <button
                className="w-full px-4 py-2 bg-[#006494] text-white rounded-md hover:bg-[#003554] transition-all duration-300 ease-in-out"
                onClick={handleAccountClick}
              >
                Admin Panel
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderV3;
