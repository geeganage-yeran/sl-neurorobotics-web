import React, { useState } from 'react';
import { Download, MessageCircle, X, Send, Menu, User, Bell, Search, Package, MapPin, ShoppingCart } from 'lucide-react';
import Footer from './Footer';
import logo from './assets/image4.png';


const QuotationsDashboard = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const quotations = [
        {
            id: 'Q001',
            date: '12/03/2024',
            client: 'Tech Solutions Ltd',
            amount: '$15,240.00',
            status: 'Pending'
        },
        {
            id: 'Q002',
            date: '11/03/2024',
            client: 'Innovation Corp',
            amount: '$8,950.00',
            status: 'Approved'
        },
        {
            id: 'Q003',
            date: '10/03/2024',
            client: 'Future Systems',
            amount: '$22,680.00',
            status: 'Draft'
        },
        {
            id: 'Q004',
            date: '09/03/2024',
            client: 'Digital Dynamics',
            amount: '$12,340.00',
            status: 'Rejected'
        },
        {
            id: 'Q005',
            date: '08/03/2024',
            client: 'Smart Industries',
            amount: '$18,750.00',
            status: 'Approved'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = {
                id: chatMessages.length + 1,
                text: currentMessage,
                sender: "user"
            };
            setChatMessages([...chatMessages, newMessage]);

            // Simulate bot response
            setTimeout(() => {
                const botResponse = {
                    id: chatMessages.length + 2,
                    text: "Thanks for your message! I'm here to help with any questions about your quotations or dashboard.",
                    sender: "bot"
                };
                setChatMessages(prev => [...prev, botResponse]);
            }, 1000);

            setCurrentMessage('');
        }
    };

    const handleDownload = (quotationId) => {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `quotation-${quotationId}.pdf`;
        link.click();
        alert(`Downloading quotation ${quotationId}...`);
    };

    const exportAllQuotations = () => {
        alert('Exporting all quotations...');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        {/* Logo */}
                        <div className="flex items-center">
                            <img
                                src={logo}
                                alt="SL Neurorobotics Logo"
                                className="h-8"
                            />
                        </div>

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search quotations..."
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
                            <span className="hidden sm:block text-sm text-gray-600">Hi, Yeran</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b shadow-sm">
                    <div className="px-4 py-2 space-y-2">
                        <div className="relative mb-4">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search quotations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        {/* Mobile Navigation */}
                        <nav className="space-y-2">
                            <a href="#" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                                <Package className="w-5 h-5 mr-3" />
                                Quotations
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
                            <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <MapPin className="w-5 h-5 mr-3" />
                                Shipping Address
                            </a>
                            <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <MessageCircle className="w-5 h-5 mr-3" />
                                Help Center
                            </a>
                        </nav>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <MapPin className="w-5 h-5 mr-3" />
                                    Shipping Address
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg font-medium">
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

                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotations</h1>
                                    <p className="text-gray-600">Manage and track your quotations</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={exportAllQuotations}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Export All</span>
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        New Quotation
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-gray-900">5</div>
                                    <div className="text-sm text-gray-600">Total Quotations</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-green-600">2</div>
                                    <div className="text-sm text-gray-600">Approved</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-yellow-600">1</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-gray-900">$77,960</div>
                                    <div className="text-sm text-gray-600">Total Value</div>
                                </div>
                            </div>

                            {/* Quotations Table */}
                            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Quotations</h2>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {quotations.map((quote) => (
                                                <tr key={quote.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.client}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                                                            {quote.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            onClick={() => handleDownload(quote.id)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            <span>Download</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden">
                                    {quotations.map((quote) => (
                                        <div key={quote.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium text-gray-900">{quote.id}</div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                                                    {quote.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">{quote.client}</div>
                                            <div className="text-sm text-gray-500 mb-2">{quote.date}</div>
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-gray-900">{quote.amount}</div>
                                                <button
                                                    onClick={() => handleDownload(quote.id)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />

            {/* Chatbot */}
            <div className="fixed bottom-6 right-6 z-50">
                {!isChatOpen ? (
                    <button
                        onClick={() => setIsChatOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border">
                        <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                            <h3 className="font-semibold">Chat Support</h3>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="text-white hover:text-gray-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto">
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                                >
                                    <div
                                        className={`inline-block p-2 rounded-lg max-w-xs ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t flex space-x-2">
                            <input
                                type="text"
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuotationsDashboard;