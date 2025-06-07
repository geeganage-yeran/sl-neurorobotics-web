import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import product1 from './assets/image2.png';
import product2 from './assets/image3.png';

export default function SLNeuroroboticsLanding() {
    const [searchQuery, setSearchQuery] = useState('');
    const [email, setEmail] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleSearch = () => {
        console.log('Search query:', searchQuery);
    };

    const handleSubscribe = () => {
        console.log('Subscribe email:', email);
        setEmail('');
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Navigation */}
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-black text-white py-20 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-8">
                            Powering<br />
                            the Future Through<br />
                            <span className="text-blue-400">Brainwaves</span>
                        </h1>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors transform hover:scale-105">
                            View All Products
                        </button>
                    </div>
                </div>
            </section>


            {/* Upcoming Devices Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#003554] mb-6">Upcoming Devices</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our upcoming products are designed to push the boundaries of brain-tech integration
                            blending human experience with tech.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        <div className="grid lg:grid-cols-2 gap-0 items-center">
                            <div className="p-8 lg:p-12 bg-gray-100 flex items-center justify-center min-h-96">
                                <div className="relative">
                                    {/* Replace the abstract design with your image */}
                                    <img
                                        src={product1}
                                        alt="SL Neurorobotics prouduct1"
                                        className="w-64 h-64"
                                    />
                                </div>
                            </div>
                            <div className="p-8 lg:p-12">
                                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                    X - 14 Channel Wireless<br />
                                    EEG Headset
                                </h3>
                                <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                    Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the
                                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                                    into electronic typesetting, remaining essentially unchanged.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                                        More About
                                    </button>
                                    <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
                                        Get a Quotation
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="py-20 bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0 items-center">
                            <div className="p-8 lg:p-12 bg-slate-600 flex items-center justify-center min-h-96">
                                <div className="relative">
                                    {/* Container with your image */}
                                    <div className="w-80 h-80 rounded-2xl relative  overflow-hidden">
                                        <img
                                            src={product2}
                                            alt="product2"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 lg:p-12">
                                <span className="text-[#0582CA] text-sm font-bold uppercase tracking-wider">New Arrivals</span>
                                <h3 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight" style={{ color: '#FFFFFF' }}>
                                    EEG Controlled Chairbed
                                </h3>
                                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                    Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the
                                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap
                                    into electronic typesetting, remaining essentially unchanged.
                                </p>
                                <button
                                    className="bg-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-transform transform hover:scale-105"
                                    style={{ color: '#051923' }}
                                >

                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Newsletter Section */}
            < section className="py-16 bg-white" >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Subscribe to Our Newsletter</h2>
                    <div className="flex flex-col sm:flex-row max-w-lg mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 border border-gray-300 rounded-l-lg sm:rounded-r-none rounded-r-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        <button
                            onClick={handleSubscribe}
                            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-r-lg sm:rounded-l-none rounded-l-lg font-semibold transition-colors mt-2 sm:mt-0"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section >

            {/* Footer */}
            < Footer />
        </div >
    );
}