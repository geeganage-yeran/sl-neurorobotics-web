import React, { useState } from 'react';
import { Search, Bell, User, ShoppingCart, Star, MessageCircle, X, Send } from 'lucide-react';
import logo from './assets/image4.png';
import Footer from './Footer';

const Dashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your NeuroTechX assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const userMessage = {
                id: messages.length + 1,
                text: newMessage,
                sender: 'user',
                timestamp: new Date()
            };

            setMessages([...messages, userMessage]);
            setNewMessage('');

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Thanks for your message! Our team will get back to you shortly with information about our brain-computer interface products.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const products = [
        {
            id: 1,
            name: 'Apex X',
            category: 'EEG Headset with Wireless EEG',
            price: '$2,499.00',
            rating: 4.8,
            reviews: 124,
            image: '/api/placeholder/300/200',
            badge: 'Bestseller'
        },
        {
            id: 2,
            name: 'Apex X',
            category: 'EEG Headset with Wireless EEG',
            price: '$2,499.00',
            rating: 4.8,
            reviews: 124,
            image: '/api/placeholder/300/200',
            badge: 'New Arrival'
        },
        {
            id: 3,
            name: 'Chair X',
            category: 'Ergonomic Brain Chair',
            price: '$899.00',
            rating: 4.9,
            reviews: 89,
            image: '/api/placeholder/300/200',
            badge: 'Popular'
        },
        {
            id: 4,
            name: 'Emotiv Flex 2',
            category: 'Wireless Brain Monitoring',
            price: '$1,299.00',
            rating: 4.7,
            reviews: 156,
            image: '/api/placeholder/300/200',
            badge: 'Featured'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="SL Neurorobotics Logo"
                                className="h-8"
                            />
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-2xl mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search products, categories..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Bell className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <ShoppingCart className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <User className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 mb-12 text-white">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl font-bold mb-4">Welcome, Yeran</h1>
                        <h2 className="text-3xl font-light mb-6">
                            Powering<br />
                            the Future Through<br />
                            Brainwaves
                        </h2>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Products Section */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Explore Our Products</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                                <div className="relative">
                                    <div className="aspect-w-16 aspect-h-12 bg-gray-100 rounded-t-xl">
                                        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-xl flex items-center justify-center">
                                            <div className="w-24 h-24 bg-gray-300 rounded-lg flex items-center justify-center">
                                                <span className="text-gray-500 text-sm font-medium">Product</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                            {product.badge}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{product.category}</p>

                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="ml-1 text-sm font-medium text-gray-900">{product.rating}</span>
                                        </div>
                                        <span className="text-gray-500 text-sm ml-2">({product.reviews} reviews)</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xl font-bold text-gray-900">{product.price}</span>
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Orders</h3>
                        <p className="text-3xl font-bold text-blue-600">127</p>
                        <p className="text-sm text-gray-600 mt-2">+12% from last month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Devices</h3>
                        <p className="text-3xl font-bold text-green-600">8</p>
                        <p className="text-sm text-gray-600 mt-2">2 devices online</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Sessions</h3>
                        <p className="text-3xl font-bold text-purple-600">1,847</p>
                        <p className="text-sm text-gray-600 mt-2">+24% this week</p>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <Footer />

            {/* Chatbot Widget */}
            <div className="fixed bottom-6 right-6 z-50">
                {/* Chat Window */}
                {isChatOpen && (
                    <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                    <MessageCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">NeuroTechX Support</h3>
                                    <p className="text-xs text-blue-100">Usually replies instantly</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white hover:text-blue-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="h-64 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs rounded-lg p-3 ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                                            }`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Toggle Button */}
                <button
                    onClick={() => setIsChatOpen(!isChatOpen)}
                    className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                    {isChatOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <MessageCircle className="w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default Dashboard;