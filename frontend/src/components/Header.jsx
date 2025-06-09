import React, { useState } from "react";
import logo from "../assets/image4.png";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa"; // Importing icons
import { Link } from "react-router-dom";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle the search box visibility
  const [searchTerm, setSearchTerm] = useState(""); // State to hold the search term
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  // Function to toggle the search box visibility
  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Function to toggle mobile menu
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to close mobile menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md py-4 px-6 fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="SL Neurorobotics Logo" className="h-8" />
          </Link>
        </div>

        {/* Desktop Navigation - Hidden on mobile/tablet */}
        <nav className="hidden lg:flex space-x-12">
          <a
            href="/"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Home
          </a>
          <a
            href=""
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
            href="#"
            className="font-semibold text-[#003554] hover:text-[#006494] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Right Section - Desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Search Icon Button */}
          <button
            onClick={handleSearchToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2 cursor-pointer"
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>

          {/* Conditional Rendering of Search Box */}
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

          {/* Account Button */}
          <button className="px-5 py-2 bg-[#006494] text-white rounded-md hover:bg-[#003554] font-semibold transition-all duration-300 ease-in-out cursor-pointer">
            Account
          </button>
        </div>

        {/* Mobile/Tablet Right Section */}
        <div className="flex lg:hidden items-center space-x-4">
          {/* Search Icon for Mobile */}
          <button
            onClick={handleSearchToggle}
            className="text-gray-700 hover:text-[#006494] transition-colors p-2"
            aria-label="Toggle search"
          >
            <FaSearch />
          </button>

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

      {/* Mobile Search Box - Shows below header when open */}
      {isSearchOpen && (
        <div className="lg:hidden mt-4 px-4">
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

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t z-50">
          <nav className="flex flex-col py-4">
            <a
              href="#"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Home
            </a>
            <a
              href="#"
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
              href="#"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              About Us
            </a>
            <a
              href="#"
              className="px-6 py-3 font-medium text-[#003554] hover:text-[#006494] hover:bg-gray-100 transition-colors border-b border-gray-100"
              onClick={handleLinkClick}
            >
              Contact
            </a>

            {/* Account Button in Mobile Menu */}
            <div className="px-6 py-3">
              <button
                className="w-full px-4 py-2 bg-[#006494] text-white rounded-md hover:bg-[#003554] transition-all duration-300 ease-in-out"
                onClick={handleLinkClick}
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
