import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import product1 from "../assets/landing.png";
import product2 from "../assets/chairbed.png";
import Alert from "../components/Alert";
import ChatBot from "../components/ChatBot"


export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
    position: "top-right",
  });

  {
    /* Handling alerts section */
  }
  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleSearch = () => {
    console.log("Search query:", searchQuery);
  };

  const handleSubscribe = () => {
    if (!email) {
      showAlert("Please enter a valid email address.", "error", "top-right");
      return;
    }
    console.log("Subscribe email:", email);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="relative w-full h-screen">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 object-cover w-full h-full"
        >
          <source src="../src/assets/1080.mp4 " type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Content */}
        <div className="absolute text-2xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <div className="text-center">
            <h1 className="mb-8 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
              Powering
              <br />
              The Future Through
              <br />
              Brainwaves
            </h1>
            <Button variant="primary" px="px-6" size="large">
              View All Products
            </Button>
          </div>
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

          <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              <div className="flex items-center justify-center p-8 bg-gray-100 lg:p-12 min-h-96">
                <div className="relative">
                  <img
                    src={product1}
                    alt="SL Neurorobotics prouduct1"
                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <h3 className="text-3xl lg:text-4xl font-bold text-[#006494] mb-6 leading-tight">
                  X - 14 Channel Wireless
                  <br />
                  EEG Headset
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-justify text-gray-600">
                  Lorem ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book. It has survived not only five centuries, but
                  also the leap into electronic typesetting, remaining
                  essentially unchanged.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
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
        <div data-aos="fade-up" className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-[#051923] rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid items-center gap-0 lg:grid-cols-2">
              <div className="p-8 lg:p-12 bg-[#051923] flex items-center justify-center min-h-96">
                <div className="relative">
                  {/* Container with your image */}

                  <img
                    src={product2}
                    alt="product2"
                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
              </div>
              <div className="p-8 lg:p-12">
                <span className="text-[#0582CA] text-2xl font-bold uppercase tracking-wider animate-pulse">
                  New Arrivals
                </span>
                <h3
                  className="mb-6 text-3xl font-bold leading-tight lg:text-4xl"
                  style={{ color: "#FFFFFF" }}
                >
                  EEG Controlled Chairbed
                </h3>
                <p className="mb-8 text-lg leading-relaxed text-justify text-gray-300">
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
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl text-all-ca font-bold text-[#051923] leading-9 mb-8 uppercase">
            Subscribe to Our Newsletter
          </h2>
          <div className="flex flex-col max-w-lg mx-auto sm:flex-row">
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
          <Alert
            open={alert.open}
            onClose={closeAlert}
            message={alert.message}
            type={alert.type}
            position={alert.position}
            autoHideDuration={3000}
          />
        </div>
      </section>

      <ChatBot/>
      <Footer />
    </div>
  );
}
