import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Menu, X, User, Globe, MessageSquare } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import image1 from './assets/image7.png';
import image2 from './assets/image6.jpg';

export default function AboutPage() {
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        email: '',
        country: '',
        message: ''
    });

    const countries = [
        'Select Your Country',
        'Afghanistan',
        'Albania',
        'Algeria',
        'Argentina',
        'Australia',
        'Austria',
        'Bangladesh',
        'Belgium',
        'Brazil',
        'Canada',
        'China',
        'Denmark',
        'Egypt',
        'France',
        'Germany',
        'India',
        'Indonesia',
        'Italy',
        'Japan',
        'Malaysia',
        'Netherlands',
        'New Zealand',
        'Pakistan',
        'Philippines',
        'Singapore',
        'South Korea',
        'Spain',
        'Sri Lanka',
        'Sweden',
        'Switzerland',
        'Thailand',
        'Turkey',
        'United Kingdom',
        'United States',
        'Vietnam'
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name || !formData.contactNumber || !formData.email || !formData.country || formData.country === 'Select Your Country' || !formData.message) {
            alert('Please fill in all fields');
            return;
        }

        console.log('Form submitted:', formData);
        alert('Message sent successfully!');
        setFormData({
            name: '',
            contactNumber: '',
            email: '',
            country: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <Header />

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">

                {/* About Us Section */}
                <div className="mb-16">
                    <div className="flex items-start space-x-6">
                        {/* Brain Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-45 h-60 bg-blue-100 rounded-lg flex items-center justify-center overflow-hidden">
                                <img src={image1} alt="Custom icon" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* About Content */}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">ABOUT US</h2>
                            <div className="text-gray-700 space-y-4 leading-relaxed">
                                <p>
                                    At SL Neurorobotics, we are dedicated to advancing and transforming business
                                    through Smart PCs based. Our objective is a coherent approach with clear steps that
                                    leads us from a traditional business point track to the implementation of
                                    intelligent systems based on future technologies.
                                </p>
                                <p>
                                    In our commitment to supporting businesses that are implementing this new digital
                                    change, technologies and tools become very relevant positioning ourselves as an ally in this digital transformation.
                                </p>
                                <p>
                                    With applications in smart management, retail trade, inventory with technical consulting,
                                    our personalized service towards your organization guarantees the technical success. It also
                                    results in a significant competitive advantage in the market through innovation, where we lead
                                    the path to a digital future, ensuring robust processes of brand building.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Technology Image */}
                {/* Technology Image */}
                <div className="mb-16">
                    <div className="w-full h-auto rounded-xl shadow-md overflow-hidden">
                        <img
                            src={image2}
                            alt="Technology illustration"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>
                {/* Get In Touch Section */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">GET IN TOUCH</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Side - Map */}
                        <div>
                            <div className="rounded-lg h-80 overflow-hidden">
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

                        {/* Right Side - Contact Info and Form */}
                        <div className="space-y-6">
                            {/* Contact Details */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">+94 71 081 9833</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <MapPin className="w-5 h-5 text-gray-600" />
                                    <div className="text-gray-700">
                                        <div className="font-medium">SL Neurorobotics (PVT) LTD</div>
                                        <div className="text-sm">80/3/2, Temple Road, Kandukkapatha Batahola, Sri Lanka</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">slneurorobotics@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Globe className="w-5 h-5 text-gray-600" />
                                    <span className="text-gray-700">www.slneurorobotics.com</span>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">SEND US A MESSAGE</h3>

                                <div className="space-y-4">
                                    {/* Top Row - Name and Phone */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter Your Name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter Your Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    {/* Second Row - Contact and Email */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            value={formData.contactNumber}
                                            onChange={handleInputChange}
                                            placeholder="Contact Number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Write Your Email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>

                                    {/* Country Selection */}
                                    <select
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                                    >
                                        {countries.map((country, index) => (
                                            <option
                                                key={index}
                                                value={country}
                                                disabled={country === 'Select Your Country'}
                                                className={country === 'Select Your Country' ? 'text-gray-400' : ''}
                                            >
                                                {country}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Message Field */}
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        placeholder="Message"
                                        rows="6"
                                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                    ></textarea>

                                    <button
                                        onClick={handleSubmit}
                                        className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded text-sm transition-colors"
                                    >
                                        Send Message
                                    </button>
                                </div>
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