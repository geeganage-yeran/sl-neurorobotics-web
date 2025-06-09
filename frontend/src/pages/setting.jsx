import React, { useState } from 'react';
import { Search, ShoppingCart, User, MessageCircle, X, AlertTriangle, Send, Package, MapPin, Bell } from 'lucide-react';
import Footer from './Footer';
import logo from './assets/image4.png';

const SettingsPage = () => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { type: 'bot', message: 'Hello! How can I help you today?' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        contact: '+1 234567890',
        country: 'USA',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setChatMessages([
                ...chatMessages,
                { type: 'user', message: newMessage },
                { type: 'bot', message: 'Thank you for your message! Our team will get back to you soon.' }
            ]);
            setNewMessage('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="SL Neurorobotics Logo"
                                className="h-8"
                            />
                        </div>

                        <div className="flex-1 max-w-lg mx-8">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <ShoppingCart className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
                            <User className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
                            <span className="text-sm text-gray-600">Hi John!</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account</h2>
                            <nav className="space-y-2">
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Package className="w-5 h-5 mr-3" />
                                    My Orders
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg font-medium">
                                    <User className="w-5 h-5 mr-3" />
                                    Settings
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <MapPin className="w-5 h-5 mr-3" />
                                    Shipping Address
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Bell className="w-5 h-5 mr-3" />
                                    Quotations
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <MessageCircle className="w-5 h-5 mr-3" />
                                    Help Center
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-sm">
                            <div className="p-6">
                                {/* Profile Information */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Contact
                                            </label>
                                            <input
                                                type="tel"
                                                name="contact"
                                                value={formData.contact}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Country
                                            </label>
                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option>USA</option>
                                                <option>Canada</option>
                                                <option>UK</option>
                                                <option>Australia</option>
                                                <option>Germany</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* Update Password */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Update your password</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Old Password
                                            </label>
                                            <input
                                                type="password"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                            Update
                                        </button>
                                    </div>
                                </div>

                                {/* Delete Account */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Your Account</h3>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                    >
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center space-x-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Deactivate account</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Deactivate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chatbot Button */}
            <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-40"
            >
                {showChatbot ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chatbot Window */}
            {showChatbot && (
                <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl border z-40">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                        <h3 className="font-semibold">SL Neurobotics Support</h3>
                        <p className="text-sm text-blue-100">We're here to help!</p>
                    </div>
                    <div className="h-64 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs px-3 py-2 rounded-lg ${msg.type === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p className="text-sm">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;