import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import product1 from "../assets/landing.png";
import product2 from "../assets/chairbed.png";

export default function SLNeuroroboticsLanding() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const handleSubscribe = () => {
    console.log("Subscribe email:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <Header />

      {/* Hero Section 
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8">
              Powering
              <br />
              the Future Through
              <br />
              <span className="text-blue-400">Brainwaves</span>
            </h1>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105">
              View All Products
            </button>
          </div>
        </div>
      </section>*/}

      <div className="relative w-full h-screen">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="../src/assets/1080.mp4 " type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Content */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Powering
              <br />
              The Future Through
              <br />
              Brainwaves
            </h1>
            <button className="bg-[#006494] hover:bg-[#003554] text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105 cursor-pointer">
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Devices Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#003554] mb-6">
              Upcoming Devices
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Our upcoming products are designed to push the boundaries of
              brain-tech integration blending human experience with tech.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="p-8 lg:p-12 bg-gray-100 flex items-center justify-center min-h-96">
                <div className="relative">
                  <img
                    src={product1}
                    alt="SL Neurorobotics prouduct1"
                    className="w-full h-full transition-transform object-cover duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-[#006494] mb-6 leading-tight">
                  X - 14 Channel Wireless
                  <br />
                  EEG Headset
                </h3>
                <p className="text-gray-600 text-lg mb-8 text-justify leading-relaxed">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="primary" size="medium">
                    More About
                  </Button>
                  <Button variant="secondary" size="medium">
                    Get a Quotation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-20 bg-[#051923]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#051923] rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="p-8 lg:p-12 bg-[#051923] flex items-center justify-center min-h-96">
                <div className="relative">
                  {/* Container with your image */}
                  <div className="w-100 h-100 rounded-2xl relative  overflow-hidden">
                    <img
                      src={product2}
                      alt="product2"
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-110"
                    />
                  </div>
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <span className="text-[#0582CA] text-lg font-bold uppercase tracking-wider">
                  New Arrivals
                </span>
                <h3
                  className="text-3xl lg:text-4xl font-bold mb-6 leading-tight"
                  style={{ color: "#FFFFFF" }}
                >
                  EEG Controlled Chairbed
                </h3>
                <p className="text-gray-300 text-justify text-lg mb-8 leading-relaxed">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <Button variant="primary" size="medium">
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl text-all-ca font-bold text-[#051923] leading-9 mb-8 uppercase">
            Subscribe to Our Newsletter
          </h2>
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border border-gray-300 rounded-l-lg sm:rounded-r-none rounded-r-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#006494] focus:border-transparent"
            />
            <button
              onClick={handleSubscribe}
              className="bg-[#006494] hover:bg-[#003554] text-white px-8 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg transition-all duration-300 ease-in-out cursor-pointer  font-semibold mt-2 sm:mt-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
