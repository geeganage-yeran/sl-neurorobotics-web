import React, { useEffect, useState } from "react";
import ar from "../assets/ar.gif";
import Footer from "../components/Footer";
import { Search } from "lucide-react";
import axios from "axios";
import DynamicHeader from "../components/DynamicHeader";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

function Product() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartLoading, setCartLoading] = useState({});
  const { isAuthenticated, user } = useAuth();
  const Navigate = useNavigate();


    const [alert, setAlert] = useState({
      open: false,
      message: "",
      type: "success",
      position: "top-right",
    });
  
    const showAlert = (message, type = "success", position = "top-right") => {
      setAlert({ open: true, message, type, position });
    };
  
    const closeAlert = () => {
      setAlert((prev) => ({ ...prev, open: false }));
    };

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

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return Navigate("/login");
    }
    const userId = user.id;
    const dataTosend = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };
    try {
      const response = await api.post(
        `/cart/add`,dataTosend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials:true,
        }
      );

      if (response.status === 200) {
        showAlert("Item added to cart successfully");
      }
    } catch (error) {
      showAlert("Product already in cart", "error");
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
    <div className="min-h-screen bg-white">
      <DynamicHeader />
      <div className="relative overflow-hidden mt-10 sm:mt-5 md:mt-5 gradient-background">
        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-gradient-to-br from-[#87c1e5]/15 to-transparent rounded-full blur-3xl animate-float-slow top-10 -left-20"></div>
          <div className="absolute w-80 h-80 bg-gradient-to-br from-[#b8d4f1]/20 to-transparent rounded-full blur-2xl animate-float-reverse bottom-10 -right-16"></div>
          <div className="absolute w-64 h-64 bg-gradient-to-br from-[#e6f3ff]/25 to-transparent rounded-full blur-xl animate-pulse-slow top-1/3 right-1/4"></div>

          {/* Floating particles */}
          <div className="absolute w-2 h-2 bg-[#87c1e5]/40 rounded-full animate-particle-1"></div>
          <div className="absolute w-1 h-1 bg-[#b8d4f1]/50 rounded-full animate-particle-2"></div>
          <div className="absolute w-3 h-3 bg-[#e6f3ff]/35 rounded-full animate-particle-3"></div>
          <div className="absolute w-1 h-1 bg-[#87c1e5]/45 rounded-full animate-particle-4"></div>
          <div className="absolute w-2 h-2 bg-[#d1e9ff]/40 rounded-full animate-particle-5"></div>

          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-3">
            <div className="grid-pattern"></div>
          </div>
        </div>

        {/* Original gradient overlay - now with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ffffff]/20 to-[#f8fbff]/10 animate-overlay-pulse"></div>

        <div className="relative pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#051923] leading-tight mb-6 animate-fade-in-up relative z-10">
                Discover Our
                <span className="block text-[#003554] animate-fade-in-up-delay">
                  Collection
                </span>
              </h1>

              <p className="text-md sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up-delay-2 relative z-10">
                Explore premium products crafted with precision and designed for
                modern living
              </p>

              <div className="max-w-2xl mx-auto animate-fade-in-up-delay-3 relative z-10">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#003554] to-[#051923] rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity animate-glow-pulse"></div>
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300">
                      <input
                        type="search"
                        id="default-search"
                        className="w-full px-6 py-4 text-[#051923] placeholder-gray-500 bg-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#003554]/20 transition-all text-lg"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-[#003554] text-white rounded-xl hover:bg-[#002a43] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <Search />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .gradient-background {
            background: linear-gradient(
              182deg,
              #ffffff,
              #f8fbff,
              #e6f3ff,
              #d1e9ff,
              #87c1e5,
              #b8d4f1
            );
            background-size: 200% 200%;
            animation: gradient-animation 15s ease infinite;
            position: relative;
          }

          @keyframes gradient-animation {
            0% {
              background-position: 0% 50%;
            }
            25% {
              background-position: 100% 25%;
            }
            50% {
              background-position: 100% 75%;
            }
            75% {
              background-position: 0% 100%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes float-slow {
            0%,
            100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-20px) translateX(10px) rotate(90deg);
            }
            50% {
              transform: translateY(-30px) translateX(-15px) rotate(180deg);
            }
            75% {
              transform: translateY(-10px) translateX(20px) rotate(270deg);
            }
          }

          @keyframes float-reverse {
            0%,
            100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }
            25% {
              transform: translateY(15px) translateX(-20px) rotate(-90deg);
            }
            50% {
              transform: translateY(25px) translateX(10px) rotate(-180deg);
            }
            75% {
              transform: translateY(5px) translateX(-25px) rotate(-270deg);
            }
          }

          @keyframes pulse-slow {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.1);
            }
          }

          @keyframes particle-1 {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            25% {
              transform: translateY(-100px) translateX(50px);
              opacity: 0.7;
            }
            50% {
              transform: translateY(-150px) translateX(-30px);
              opacity: 0.5;
            }
            75% {
              transform: translateY(-80px) translateX(80px);
              opacity: 0.8;
            }
          }

          @keyframes particle-2 {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.4;
            }
            33% {
              transform: translateY(-80px) translateX(-60px);
              opacity: 0.8;
            }
            66% {
              transform: translateY(-120px) translateX(40px);
              opacity: 0.6;
            }
          }

          @keyframes particle-3 {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.25;
            }
            50% {
              transform: translateY(-200px) translateX(-100px);
              opacity: 0.6;
            }
          }

          @keyframes particle-4 {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.35;
            }
            40% {
              transform: translateY(-60px) translateX(70px);
              opacity: 0.7;
            }
            80% {
              transform: translateY(-140px) translateX(-20px);
              opacity: 0.5;
            }
          }

          @keyframes particle-5 {
            0%,
            100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0.3;
            }
            30% {
              transform: translateY(-90px) translateX(-80px);
              opacity: 0.6;
            }
            70% {
              transform: translateY(-160px) translateX(60px);
              opacity: 0.8;
            }
          }

          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes overlay-pulse {
            0%,
            100% {
              opacity: 0.3;
            }
            50% {
              opacity: 0.1;
            }
          }

          @keyframes glow-pulse {
            0%,
            100% {
              opacity: 0.1;
              transform: scale(1);
            }
            50% {
              opacity: 0.2;
              transform: scale(1.02);
            }
          }

          .animate-float-slow {
            animation: float-slow 20s ease-in-out infinite;
          }

          .animate-float-reverse {
            animation: float-reverse 25s ease-in-out infinite;
            animation-delay: -5s;
          }

          .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
            animation-delay: -3s;
          }

          .animate-particle-1 {
            animation: particle-1 12s ease-in-out infinite;
            top: 80%;
            left: 10%;
          }

          .animate-particle-2 {
            animation: particle-2 15s ease-in-out infinite;
            top: 60%;
            right: 20%;
            animation-delay: -3s;
          }

          .animate-particle-3 {
            animation: particle-3 18s ease-in-out infinite;
            top: 40%;
            left: 60%;
            animation-delay: -6s;
          }

          .animate-particle-4 {
            animation: particle-4 10s ease-in-out infinite;
            top: 20%;
            right: 40%;
            animation-delay: -2s;
          }

          .animate-particle-5 {
            animation: particle-5 14s ease-in-out infinite;
            top: 70%;
            left: 80%;
            animation-delay: -8s;
          }

          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }

          .animate-fade-in-up-delay {
            animation: fade-in-up 0.8s ease-out 0.2s both;
          }

          .animate-fade-in-up-delay-2 {
            animation: fade-in-up 0.8s ease-out 0.4s both;
          }

          .animate-fade-in-up-delay-3 {
            animation: fade-in-up 0.8s ease-out 0.6s both;
          }

          .animate-overlay-pulse {
            animation: overlay-pulse 6s ease-in-out infinite;
          }

          .animate-glow-pulse {
            animation: glow-pulse 4s ease-in-out infinite;
          }

          .grid-pattern {
            background-image: linear-gradient(
                rgba(135, 193, 229, 0.08) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(135, 193, 229, 0.08) 1px,
                transparent 1px
              );
            background-size: 60px 60px;
            width: 100%;
            height: 100%;
            animation: grid-move 20s linear infinite;
          }

          @keyframes grid-move {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(60px, 60px);
            }
          }
        `}</style>
      </div>

      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        {search && (
          <div className="mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
              <p className="text-gray-600 text-center">
                {filteredProducts.length > 0
                  ? `Found ${filteredProducts.length} product${
                      filteredProducts.length !== 1 ? "s" : ""
                    } for "${search}"`
                  : `No products found for "${search}"`}
              </p>
            </div>
          </div>
        )}

        <div className="pb-16 sm:pb-20">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200"
                >
                  {/* Product Card */}
                  <div className="relative">
                    {/* Product Header */}
                    <div className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h3 className="text-2xl sm:text-3xl font-bold text-[#051923] mb-2 group-hover:text-[#003554] transition-colors">
                            {product.name}
                          </h3>
                          <div className="text-2xl sm:text-3xl font-semibold text-[#006494]">
                            ${product.price}
                          </div>
                        </div>

                        {/* AR Button */}
                        <div className="flex-shrink-0 text-center">
                          <a href="" className="block group/ar">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-[#003554] to-[#051923] rounded-2xl blur opacity-10 group-hover/ar:opacity-20 transition-opacity"></div>
                              <div className="relative bg-[#00355412] p-3 rounded-2xl border border-[#00355420] hover:border-[#00355440] transition-all">
                                <img
                                  src={ar}
                                  className="w-8 h-8 sm:w-10 sm:h-10"
                                  alt="AR View"
                                />
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-600 mt-2 block">
                              AR View
                            </span>
                          </a>
                        </div>
                      </div>

                      {/* Product Image Container with Fixed Aspect Ratio */}
                      <a href={`/productview/${product.id}`} className="block">
                        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden group-hover:shadow-inner transition-all">
                          {/* Fixed aspect ratio container (16:10) */}
                          <div className="aspect-[16/10] relative overflow-hidden">
                            <img
                              className="absolute inset-0 w-full h-full object-cover p-4 transition-transform duration-500 group-hover:scale-105"
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
                        </div>
                      </a>

                      {/* Action Buttons */}
                      <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <a
                          href="#"
                          className="flex-1 bg-[#003554] hover:bg-[#002a43] text-white font-semibold py-4 px-6 rounded-xl text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                          Buy Now
                        </a>
                        <button
                          onClick={() => addToCart(product.id)}
                          disabled={cartLoading[product.id]}
                          href="#"
                          className="cursor-pointer  flex-1 bg-white hover:bg-gray-50 text-[#003554] font-semibold py-4 px-6 rounded-xl text-center border-2 border-[#003554] hover:border-[#002a43] transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            search && (
              <div className="text-center py-16 sm:py-24">
                <div className="max-w-md mx-auto">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full blur opacity-20"></div>
                    <div className="relative bg-gradient-to-r from-slate-100 to-slate-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
                      <Search />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    No products found
                  </h3>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    We couldn't find any products matching your search. Try
                    different keywords or explore our full collection.
                  </p>
                  <button
                    onClick={() => handleSearch("")}
                    className="bg-[#003554] hover:bg-[#002a43] cursor-pointer text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Show All Products
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
      <Alert
        open={alert.open}
        onClose={closeAlert}
        message={alert.message}
        type={alert.type}
        position={alert.position}
        autoHideDuration={3000}
      />

      <Footer />
    </div>
  );
}

export default Product;
