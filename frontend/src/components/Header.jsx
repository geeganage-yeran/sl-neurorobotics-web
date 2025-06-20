import React, { useState } from "react";
import logo from "../assets/image4.png";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigate=useNavigate();

  const handleAccountClick=()=>{
    navigate("/user-log");
  }

  // Function to toggle the search box
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Function handle changes in search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
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
            href="#"
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
            onClick={handleSearchToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2 cursor-pointer"
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>

          {isSearchOpen && (
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="px-8 py-2 bg-white text-[#003554] rounded-md focus:outline-none focus:ring-2 focus:ring-[#006494] transition-all"
              autoFocus
            />
          )}

          <button className="px-5 py-2 bg-[#006494] text-white rounded-md hover:bg-[#003554] font-semibold transition-all duration-300 ease-in-out cursor-pointer" onClick={handleAccountClick}>
            Account
          </button>
        </div>

        <div className="flex items-center space-x-4 lg:hidden">
          <button
            onClick={handleSearchToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2"
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>

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

      {isSearchOpen && (
        <div className="max-w-6xl px-6 mx-auto mt-4 lg:hidden">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full px-4 py-2 bg-white text-[#003554] rounded-md focus:outline-none focus:ring-2 focus:ring-[#006494]"
            autoFocus
          />
        </div>
      )}

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
              href="#"
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
                Account
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
