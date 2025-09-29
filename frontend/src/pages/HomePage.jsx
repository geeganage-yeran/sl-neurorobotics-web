import React, { useState, useEffect, use } from "react";
import Footer from "../components/Footer";
import { useNavigate, Navigate } from "react-router-dom";
import Button from "../components/Button";
import product1 from "../assets/landing.png";
import product2 from "../assets/chairbed.png";
import Alert from "../components/Alert";
import DynamicHeader from "../components/DynamicHeader"
import carsol1 from "../assets/carsol1.jpg"
import carsol2 from "../assets/carsol2.jpg"
import api from "../services/api";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestProduct, setLatestProduct] = useState(null);
  const [latestProductLoading, setLatestProductLoading] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
    position: "top-right",
  });

  // Background images for carousel
  const backgroundImages = [
    carsol1,
    carsol2,
  ];

  const Navigate = useNavigate();
  
  const buttonClick = () => {
    Navigate("/about#contactUs");
  }


  const getAllProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "/public/getHomePageDevice",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
   
      setProducts(response.data);
    } catch (error) {
      console.error(error);
      showAlert("Failed to load products", "error", "top-right");
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest product for New Arrivals section
  const getLatestProduct = async () => {
    try {
      setLatestProductLoading(true);
      const response = await api.get("/public/getLatestProduct", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLatestProduct(response.data);
    } catch (error) {
      console.error("Error fetching latest product:", error);
      showAlert("Failed to load latest product", "error", "top-right");
    } finally {
      setLatestProductLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
    getLatestProduct(); // Fetch latest product on component mount
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  {/* Handling alerts section */}
  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // const handleSearch = () => {
  //   console.log("Search query:", searchQuery);
  // };

  // const handleSubscribe = () => {
  //   if (!email) {
  //     showAlert("Please enter a valid email address.", "error", "top-right");
  //     return;
  //   }
  //   console.log("Subscribe email:", email);
  //   setEmail("");
  // };

  // Get upcoming product
  const upcomingProduct = products.find(product => product.category === "upcoming") || products[0];

  return (
    <div className="min-h-screen bg-white">
      <DynamicHeader/>
      
      {/* Hero Section with Image Carousel */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Background Images Carousel */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Content */}
        <div className="absolute text-2xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10">
          <div className="text-center">
            <h1 className="mb-8 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Powering
              <br />
              The Future Through
              <br />
              Brainwaves
            </h1>
            <a href="/shop">
              <Button variant="primary" px="px-6" size="large">
                View All Products
              </Button>
            </a>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Upcoming Devices Section */}
      <section className="py-12 bg-gray-50">
        <div data-aos="fade-up" className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-4xl sm:text-4xl lg:text-5xl font-bold text-[#003554] mb-6">
              Upcoming Device
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 lg:text-xl">
              Our upcoming products are designed to push the boundaries of
              brain-tech integration blending human experience with tech.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006494]"></div>
            </div>
          ) : upcomingProduct ? (
            <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
              <div className="grid items-center gap-0 lg:grid-cols-2">
                <div className="flex items-center justify-center p-8 bg-gray-100 lg:p-12 min-h-96">
                  <div className="relative">
                    <img
                      src={upcomingProduct.imageUrl}
                      alt={upcomingProduct.imageUrl}
                      className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-8 lg:p-12">
                  <h3 className="text-3xl lg:text-4xl font-bold text-[#006494] mb-6 leading-tight">
                    {upcomingProduct.title}
                  </h3>
                  <p className="mb-8 text-lg leading-relaxed text-justify text-gray-600">
                    {upcomingProduct.description}
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button variant="primary" onClick={buttonClick} size="medium">
                      More About
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No upcoming products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals Section - Dynamic Latest Product */}
      <section className="py-20 bg-[#051923]">
        <div data-aos="fade-up" className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-[#051923] rounded-2xl shadow-2xl overflow-hidden">
            {latestProductLoading ? (
              <div className="flex items-center justify-center min-h-96">
                <div className="w-12 h-12 border-4 border-t-[#0582CA] border-gray-600 rounded-full animate-spin"></div>
              </div>
            ) : latestProduct ? (
              <div className="grid items-center gap-0 lg:grid-cols-2">
                {/* Product Image */}
                <div className="p-8 lg:p-12 bg-[#051923] flex items-center justify-center min-h-96">
                  <div className="relative overflow-hidden rounded-lg">
                    <img
                      src={
                        latestProduct.images && latestProduct.images.length > 0
                          ? latestProduct.images[0].imageUrl
                          : product2
                      }
                      alt={latestProduct.name}
                      className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
                      onError={(e) => {
                        e.target.src = product2;
                      }}
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-8 lg:p-12">
                  <span className="text-[#0582CA] text-2xl font-bold uppercase tracking-wider animate-pulse">
                    New Arrivals
                  </span>
                  <h3 className="mb-6 text-3xl font-bold leading-tight text-white lg:text-4xl">
                    {latestProduct.name}
                  </h3>
                  <p className="mb-8 text-lg leading-relaxed text-justify text-gray-300">
                    {latestProduct.description || 'No description available.'}
                  </p>
                  <Button 
                    variant="primary" 
                    size="medium"
                    onClick={() => window.location.href = `/productview/${latestProduct.id}`}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-96">
                <p className="text-gray-400">No products available.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}