import React, { useState } from 'react';
import { Search, Bell, User, ShoppingCart, MessageCircle, X, Send, Package, MapPin, Edit3, Plus, Trash2 } from 'lucide-react';
import Footer from './Footer';
import logo from './assets/image4.png';
const ShippingAddressDashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: 'Sophia Clark',
            address: '123 Maple Street, Anytown, CA 90254',
            isDefault: true
        },
        {
            id: 2,
            name: 'Sam Carter',
            address: '456 Oak Avenue, Newcity, CA 90234',
            isDefault: false
        }
    ]);

    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your NeuroTechX assistant. How can I help you today?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Form state for add/edit modal
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
    });

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

            setTimeout(() => {
                const botResponse = {
                    id: messages.length + 2,
                    text: "Thanks for your message! Our team will get back to you shortly with information about shipping addresses.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const openEditModal = (address) => {
        setEditingAddress(address);
        setFormData({
            name: address.name,
            address: address.address.split(',')[0],
            city: address.address.split(',')[1]?.trim() || '',
            state: address.address.split(',')[2]?.trim().split(' ')[0] || '',
            zipCode: address.address.split(',')[2]?.trim().split(' ')[1] || '',
            isDefault: address.isDefault
        });
        setIsEditModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        });
        setIsAddModalOpen(true);
    };

    const closeModals = () => {
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
        setEditingAddress(null);
        setFormData({
            name: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

        if (isEditModalOpen && editingAddress) {
            // Update existing address
            setAddresses(prev => prev.map(addr =>
                addr.id === editingAddress.id
                    ? {
                        ...addr,
                        name: formData.name,
                        address: fullAddress,
                        isDefault: formData.isDefault
                    }
                    : formData.isDefault ? { ...addr, isDefault: false } : addr
            ));
        } else {
            // Add new address
            const newAddress = {
                id: Date.now(),
                name: formData.name,
                address: fullAddress,
                isDefault: formData.isDefault
            };

            setAddresses(prev => {
                if (formData.isDefault) {
                    return [...prev.map(addr => ({ ...addr, isDefault: false })), newAddress];
                }
                return [...prev, newAddress];
            });
        }

        closeModals();
    };

    const deleteAddress = (id) => {
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    };

    const setDefaultAddress = (id) => {
        setAddresses(prev => prev.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
    };

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
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <ShoppingCart className="w-6 h-6" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <User className="w-6 h-6" />
                            </button>
                            <span className="text-sm text-gray-600">Hi, Yeran</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account</h2>
                            <nav className="space-y-2">
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Package className="w-5 h-5 mr-3" />
                                    My Orders
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <User className="w-5 h-5 mr-3" />
                                    Settings
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg font-medium">
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
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Header */}
                            <div className="px-6 py-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Shipping Address</h1>
                                    </div>
                                    <button
                                        onClick={openAddModal}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Address
                                    </button>
                                </div>
                            </div>

                            {/* Saved Addresses Section */}
                            <div className="px-6 py-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Address</h2>
                                <p className="text-gray-600 text-sm mb-6">Manage your shipping addresses</p>

                                {/* Address List */}
                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className="mt-1">
                                                        <MapPin className="w-5 h-5 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                                            {address.isDefault && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-gray-600">{address.address}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(address)}
                                                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Edit3 className="w-4 h-4 mr-1" />
                                                        Edit
                                                    </button>
                                                    {!address.isDefault && (
                                                        <>
                                                            <button
                                                                onClick={() => setDefaultAddress(address.id)}
                                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                            >
                                                                Set Default
                                                            </button>
                                                            <button
                                                                onClick={() => deleteAddress(address.id)}
                                                                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit/Add Address Modal */}
            {(isEditModalOpen || isAddModalOpen) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isEditModalOpen ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                onClick={closeModals}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.zipCode}
                                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                                    Set as default address
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {isEditModalOpen ? 'Update Address' : 'Add Address'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer */}
            <Footer />

            {/* Chatbot Widget */}
            <div className="fixed bottom-6 right-6 z-40">
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
                                    <h3 className="font-semibold">SL Neurorobotics Support</h3>
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

export default ShippingAddressDashboard;