import React, { useState } from 'react';
import { Search, Bell, User, ShoppingCart, MessageCircle, X, Send, Package, Clock, CheckCircle, Truck, Eye } from 'lucide-react';
import Footer from './Footer';
import logo from './assets/image4.png';

const MyOrdersDashboard = () => {
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
    const [activeTab, setActiveTab] = useState('all');

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
                    text: "Thanks for your message! Our team will get back to you shortly with information about your orders.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botResponse]);
            }, 1000);
        }
    };

    const orders = [
        {
            id: 'ORD-001',
            date: '2025-05-15',
            product: 'Apex X EEG Headset',
            category: 'EEG Headset with Wireless EEG',
            price: '$2,499.00',
            status: 'delivered',
            statusText: 'Delivered',
            estimatedDelivery: '2025-05-20',
            trackingNumber: 'NT12345678',
            image: '/api/placeholder/80/80'
        },
        {
            id: 'ORD-002',
            date: '2025-05-18',
            product: 'Chair X Ergonomic',
            category: 'Ergonomic Brain Chair',
            price: '$899.00',
            status: 'shipped',
            statusText: 'Shipped',
            estimatedDelivery: '2025-06-10',
            trackingNumber: 'NT87654321',
            image: '/api/placeholder/80/80'
        },
        {
            id: 'ORD-003',
            date: '2025-06-01',
            product: 'Emotiv Flex 2',
            category: 'Wireless Brain Monitoring',
            price: '$1,299.00',
            status: 'processing',
            statusText: 'Processing',
            estimatedDelivery: '2025-06-15',
            trackingNumber: 'NT11223344',
            image: '/api/placeholder/80/80'
        },
        {
            id: 'ORD-004',
            date: '2025-06-05',
            product: 'NeuroLink Pro',
            category: 'Advanced Brain Interface',
            price: '$3,299.00',
            status: 'pending',
            statusText: 'Pending',
            estimatedDelivery: '2025-06-20',
            trackingNumber: 'NT99887766',
            image: '/api/placeholder/80/80'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'pending': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="w-4 h-4" />;
            case 'shipped': return <Truck className="w-4 h-4" />;
            case 'processing': return <Package className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const filteredOrders = activeTab === 'all' ? orders : orders.filter(order => order.status === activeTab);

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
                        <div className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">Account</h2>
                                <nav className="space-y-2">
                                    <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg font-medium">
                                        <Package className="w-5 h-5 mr-3" />
                                        My Orders
                                    </a>
                                    <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
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
                                <a href="#" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                                    <Package className="w-5 h-5 mr-3" />
                                    My Orders
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <User className="w-5 h-5 mr-3" />
                                    Profile Settings
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Bell className="w-5 h-5 mr-3" />
                                    Notifications
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <ShoppingCart className="w-5 h-5 mr-3" />
                                    Wishlist
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                                <p className="text-gray-600 mt-1">Track and manage your orders</p>
                            </div>

                            {/* Filter Tabs */}
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex space-x-8">
                                    <button
                                        onClick={() => setActiveTab('all')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'all'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        All Orders ({orders.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Pending ({orders.filter(o => o.status === 'pending').length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('processing')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'processing'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Processing ({orders.filter(o => o.status === 'processing').length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('shipped')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'shipped'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Shipped ({orders.filter(o => o.status === 'shipped').length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('delivered')}
                                        className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'delivered'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Delivered ({orders.filter(o => o.status === 'delivered').length})
                                    </button>
                                </div>
                            </div>

                            {/* Orders List */}
                            <div className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                {/* Product Image */}
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-8 h-8 text-gray-400" />
                                                </div>

                                                {/* Order Details */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{order.product}</h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            <span className="ml-1">{order.statusText}</span>
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{order.category}</p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                                                        <div>
                                                            <span className="font-medium">Order ID:</span> {order.id}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Order Date:</span> {new Date(order.date).toLocaleDateString()}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Estimated Delivery:</span> {new Date(order.estimatedDelivery).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    {order.trackingNumber && (
                                                        <div className="mt-2 text-sm text-gray-500">
                                                            <span className="font-medium">Tracking:</span> {order.trackingNumber}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price and Actions */}
                                            <div className="text-right flex-shrink-0">
                                                <div className="text-xl font-bold text-gray-900 mb-3">{order.price}</div>
                                                <div className="flex flex-col space-y-2">
                                                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View Details
                                                    </button>
                                                    {order.status === 'shipped' && (
                                                        <button className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
                                                            <Truck className="w-4 h-4 mr-1" />
                                                            Track Order
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {filteredOrders.length === 0 && (
                                <div className="p-12 text-center">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                                    <p className="text-gray-500">You don't have any orders in this category yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

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

export default MyOrdersDashboard;