import React, { useState } from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import image1 from "../assets/image5.png";
import image2 from "../assets/aboutus.jpg";
import Alert from "../components/Alert";

export default function AboutPage() {
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

  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    country: "",
    message: "",
  });

  const countries = [
    "Select Your Country",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Argentina",
    "Australia",
    "Austria",
    "Bangladesh",
    "Belgium",
    "Brazil",
    "Canada",
    "China",
    "Denmark",
    "Egypt",
    "France",
    "Germany",
    "India",
    "Indonesia",
    "Italy",
    "Japan",
    "Malaysia",
    "Netherlands",
    "New Zealand",
    "Pakistan",
    "Philippines",
    "Singapore",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "United Kingdom",
    "United States",
    "Vietnam",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name ||
      !formData.contactNumber ||
      !formData.email ||
      !formData.country ||
      formData.country === "Select Your Country" ||
      !formData.message
    ) {
      showAlert("Please fill in all fields correctly.", "error", "top-right");
      return;
    }

    console.log("Form submitted:", formData);
    showAlert("Message sent successfully!", "success", "top-right");
    setFormData({
      name: "",
      contactNumber: "",
      email: "",
      country: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Top Bar with Company Name and Brain Logo */}
      <div className="bg-slate-800 text-white mt-16 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center">
            {/* Company Logo Only */}
            <div className="w-80 h-16 sm:w-80 sm:h-20 lg:h-24 xl:w-130 xl:h-28">
              <img
                src={image1}
                alt="SL Neurorobotics Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* About Us Section - Responsive Layout */}
        <div className="mb-12 sm:mb-16">
          {/* Mobile: Image stacked on top, Desktop: Image on left */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
            {/* Image Container */}
            <div className="flex-shrink-0 w-full lg:w-auto">
              <div className="w-full lg:w-96 xl:w-96 h-64 sm:w-100 lg:h-80 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto lg:mx-0">
                <img
                  src={image1}
                  alt="Company Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* About Content */}
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-6 text-center lg:text-left">
                ABOUT US
              </h2>
              <div className="text-gray-700 space-y-3 leading-6 sm:space-y-4  text-sm sm:text-base">
                <p className="text-justify font-medium text-[#5C728A]">
                  At SL Neurorobotics, we are dedicated to advancing and
                  transforming business through Smart PCs based. Our objective
                  is a coherent approach with clear steps that leads us from a
                  traditional business point track to the implementation of
                  intelligent systems based on future technologies.
                </p>
                <p className="text-justify font-medium text-[#5C728A]">
                  In our commitment to supporting businesses that are
                  implementing this new digital change, technologies and tools
                  become very relevant positioning ourselves as an ally in this
                  digital transformation.
                </p>
                <p className="text-justify font-medium text-[#5C728A]">
                  With applications in smart management, retail trade, inventory
                  with technical consulting, our personalized service towards
                  your organization guarantees the technical success. It also
                  results in a significant competitive advantage in the market
                  through innovation, where we lead the path to a digital
                  future, ensuring robust processes of brand building.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Image - Responsive */}
        <div className="mb-12 sm:mb-16">
          <div className="w-full h-auto rounded-xl shadow-md overflow-hidden">
            <img
              src={image2}
              alt="Technology illustration"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Get In Touch Section - Responsive */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#051923] mb-6 sm:mb-8 text-center lg:text-left">
            GET IN TOUCH
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Map Section - Mobile: Full width, Desktop: Left half */}
            <div className="order-2 lg:order-1">
              <div className="rounded-lg h-64 sm:h-80 overflow-hidden">
                {/* Google Maps Embed */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511757686!2d79.85397541532826!3d6.919444295003654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596b5c8c7e91%3A0x1b0a8f5f8f5f8f5f!2sTemple%20Road%2C%20Colombo!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Maps Location"
                ></iframe>
              </div>
            </div>

            {/* Contact Info and Form - Mobile: Full width, Desktop: Right half */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Contact Details - Responsive */}
              <div className="space-y-5 sm:space-y-4">
                <div className="flex items-start sm:items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#003554] flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-700 text-sm font-medium sm:text-base">
                    +94 71 081 9833
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#003554] flex-shrink-0 mt-0.5" />
                  <div className="text-gray-700 text-sm sm:text-base">
                    <div className="font-medium">
                      SL Neurorobotics (PVT) LTD
                    </div>
                    <div className="text-xs sm:text-sm mt-1">
                      80/3/2, Temple Road, Kandukkapatha Batahola, Sri Lanka
                    </div>
                  </div>
                </div>
                <div className="flex items-start sm:items-center space-x-3">
                  <Mail className="w-5 h-5 text-[#003554] flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-700 font-medium text-sm sm:text-base break-all">
                    slneurorobotics@gmail.com
                  </span>
                </div>
                <div className="flex items-start sm:items-center space-x-3">
                  <Globe className="w-5 h-5 text-[#003554] flex-shrink-0 mt-0.5 sm:mt-0" />
                  <span className="text-gray-700 text-sm sm:text-base break-all font-medium">
                    www.slneurorobotics.com
                  </span>
                </div>
              </div>

              {/* Contact Form - Responsive */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#051923] mb-4">
                  SEND US A MESSAGE
                </h3>

                <div className="space-y-4">
                  {/* Name and Email Row - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter Your Name"
                      className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#006494] focus:border-transparent outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Your Email"
                      className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#006494] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Contact Number and Email Row - Responsive */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="Contact Number"
                      className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#006494] focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Country Selection - Responsive */}
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#006494] focus:border-transparent outline-none bg-white"
                  >
                    {countries.map((country, index) => (
                      <option
                        key={index}
                        value={country}
                        disabled={country === "Select Your Country"}
                        className={
                          country === "Select Your Country"
                            ? "text-gray-400"
                            : ""
                        }
                      >
                        {country}
                      </option>
                    ))}
                  </select>

                  {/* Message Field - Responsive */}
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Message"
                    rows="5"
                    className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#006494] focus:border-transparent outline-none resize-none"
                  ></textarea>

                  <button
                    onClick={handleSubmit}
                    className="w-full sm:w-auto bg-[#006494] hover:bg-[#003554] cursor-pointer text-white font-medium py-2.5 sm:py-2 px-6 rounded text-sm transition-colors"
                  >
                    Send Message
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
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
