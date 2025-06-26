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
    <div className="mt-24">
      <div className="px-4 md:px-12">
        <div className="flex flex-col text-center gap-4">
          <h1 className="font-semibold text-[#051923] text-5xl md:text-7xl">
            Shop
          </h1>
          <h1>
            Check out our full collection of products tailored to your needs.
          </h1>
          <div>
            <form
              className="md:w-[450px] mx-auto bg-transparent"
              onSubmit={handleSubmit}
            >
              <div className="relative">
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-2 ps-4 pr-12 text-sm border border-black rounded-3xl"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute end-1 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-100"
                >
                  <svg
                    className="w-4 h-4"
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

        {/* Search results info */}
        {search && (
          <div className="text-center py-4">
            <p className="text-gray-600">
              {filteredProducts.length > 0
                ? `Found ${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } for "${search}"`
                : `No products found for "${search}"`}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 pb-8">
          {filteredProducts.length > 0
            ? filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-full max-w-sm rounded-lg shadow-sm bg-[#00355412]"
                >
                  {/* <div className="px-5 p-3">
                    <span className="text-2xl font-semibold text-black">
                      {product.name}
                    </span>
                  </div> */}
                  <div className="px-5 py-2">
                    <div className="flex items-center justify-between">
                      <div className="">
                        <span className="text-2xl font-semibold text-black">
                          {product.name}
                        </span>
                      </div>
                      <div className="px-5 py-2.5">
                        <a href="">
                          <img
                            src={ar}
                            className="w-[58px] h-[58px]"
                            alt="AR View"
                          />
                        </a>
                        <span className="font-medium text-[9px]">
                          View with AR
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5">
                    <span className="text-[20px] font-bold text-[#003554]">
                      $ {product.price}
                    </span>
                  </div>

                  <a href={`/productview/${product.id}`}>
                    <img
                      className="p-8 rounded-t-lg transition-all duration-300 hover:scale-110"
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
                  </a>
                  <div className="px-5 pb-5">
                    <div className="flex items-center gap-2">
                      <a
                        href="#"
                        className="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554] transition-colors"
                      >
                        Buy now
                      </a>
                      <a
                        href="#"
                        className="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white transition-colors"
                      >
                        Add to cart
                      </a>
                    </div>
                  </div>
                </div>
              ))
            : search && (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
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
                    <h3 className="text-lg font-medium mb-2">
                      No products found
                    </h3>
                    <p>
                      Try adjusting your search terms or browse all products.
                    </p>
                    <button
                      onClick={() => handleSearch("")}
                      className="mt-4 px-4 py-2 bg-[#003554] text-white rounded-lg hover:bg-[#002a43] transition-colors"
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
