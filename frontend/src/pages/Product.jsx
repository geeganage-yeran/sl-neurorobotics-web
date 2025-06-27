import React, { useEffect, useState } from "react";
import epoc from "../img/epoc.png";
import ar from "../img/ar.gif";
import Footer from "../components/Footer";
import Header from "../components/Header";
import api from "../services/api";
import axios from "axios";

function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/public/getProduct",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Search function
  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.description &&
            product.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()))
      );
      setFilteredProducts(filtered);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Search is already handled by onChange, but you can add additional logic here if needed
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Update filtered products when products change
  useEffect(() => {
    handleSearch(search);
  }, [products]);

  return (
    <div className="mt-16 sm:mt-20 md:mt-24">
      <div className="px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        {/* Header Section */}
        <div className="flex flex-col text-center gap-3 sm:gap-4 md:gap-6">
          <h1 className="font-semibold text-[#051923] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Shop
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Check out our full collection of products tailored to your needs.
          </p>
          
          {/* Search Form */}
          <div className="mt-4 sm:mt-6">
            <form
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-transparent"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-3 sm:p-3.5 md:p-4 ps-4 sm:ps-5 pr-12 sm:pr-14 text-sm sm:text-base border border-black rounded-2xl sm:rounded-3xl focus:ring-2 focus:ring-[#003554] focus:border-transparent outline-none transition-all"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute end-1 sm:end-1.5 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Search Results Info */}
        {search && (
          <div className="text-center py-3 sm:py-4 md:py-6">
            <p className="text-gray-600 text-sm sm:text-base">
              {filteredProducts.length > 0
                ? `Found ${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } for "${search}"`
                : `No products found for "${search}"`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 pt-6 sm:pt-8 pb-8 sm:pb-12">
          {filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full max-w-sm mx-auto rounded-lg shadow-sm bg-[#00355412] hover:shadow-md transition-shadow duration-300"
                >
                  {/* Product Header */}
                  <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-black truncate sm:whitespace-normal sm:line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 text-center">
                        <a href="" className="block">
                          <img
                            src={ar}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-[58px] lg:h-[58px] mx-auto"
                            alt="AR View"
                          />
                        </a>
                        <span className="font-medium text-[8px] sm:text-[9px] md:text-[10px] text-gray-600 block mt-1">
                          View with AR
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="px-3 sm:px-4 md:px-5">
                    <span className="text-lg sm:text-xl md:text-[20px] font-bold text-[#003554]">
                      $ {product.price}
                    </span>
                  </div>

                  {/* Product Image */}
                  <a href={`/productview/${product.id}`} className="block">
                    <div className="p-4 sm:p-6 md:p-8">
                      <img
                        className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-contain rounded-t-lg transition-all duration-300 hover:scale-105"
                        src={
                          product.images
                            ?.find((img) => img.displayOrder === 1)
                            ?.imageUrl?.replace(
                              "C:\\Users\\USER",
                              "http://localhost:8080"
                            ) || epoc
                        }
                        alt={product.name}
                      />
                    </div>
                  </a>

                  {/* Action Buttons */}
                  <div className="px-3 sm:px-4 md:px-5 pb-4 sm:pb-5">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <a
                        href="#"
                        className="flex-1 text-white font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554] transition-colors"
                      >
                        Buy now
                      </a>
                      <a
                        href="#"
                        className="flex-1 text-[#003554] font-medium rounded-lg text-xs sm:text-sm px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white transition-colors"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              ))
            : search && (
                <div className="col-span-full text-center py-8 sm:py-12 md:py-16">
                  <div className="text-gray-500 max-w-md mx-auto px-4">
                    <svg
                      className="mx-auto h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-gray-400 mb-3 sm:mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <h3 className="text-base sm:text-lg md:text-xl font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-sm sm:text-base mb-4 sm:mb-6">
                      Try adjusting your search terms or browse all products.
                    </p>
                    <button
                      onClick={() => handleSearch("")}
                      className="px-4 sm:px-6 py-2 sm:py-3 bg-[#003554] text-white text-sm sm:text-base rounded-lg hover:bg-[#002a43] transition-colors"
                    >
                      Show all products
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Product;