import React, { useState } from 'react';
import { Search, ShoppingCart, User, Package, MapPin, Bell, MessageCircle, Menu, X, Send, ChevronDown, ChevronRight } from 'lucide-react';
import Footer from './Footer';
import logo from './assets/image4.png';

const HelpCenter = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
    ]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [expandedFAQ, setExpandedFAQ] = useState(null);

    const faqItems = [
        {
            id: 1,
            category: "Account & Billing",
            questions: [
                {
                    question: "How do I update my billing information?",
                    answer: "You can update your billing information by going to your account settings and selecting the billing section. From there, you can edit your payment methods and billing address."
                },
                {
                    question: "Can I cancel my subscription anytime?",
                    answer: "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers."
                }
            ]
        },
        {
            id: 2,
            category: "Technical Support",
            questions: [
                {
                    question: "How do I contact technical support?",
                    answer: "You can contact our technical support team through live chat, email at support@slneurorobotics.com, or by calling our support hotline during business hours."
                },
                {
                    question: "What are the support hours?",
                    answer: "Our support team is available Monday through Friday, 9 AM to 6 PM (EST). For urgent technical issues, we also provide 24/7 emergency support."
                },
                {
                    question: "Do you offer 24/7 support?",
                    answer: "We offer 24/7 emergency technical support for critical issues. For general inquiries, our standard support hours are Monday-Friday, 9 AM to 6 PM EST."
                }
            ]
        }
    ];

    const handleSendMessage = () => {
        if (currentMessage.trim()) {
            const newMessage = {
                id: chatMessages.length + 1,
                text: currentMessage,
                sender: "user"
            };
            setChatMessages([...chatMessages, newMessage]);

            setTimeout(() => {
                const botResponse = {
                    id: chatMessages.length + 2,
                    text: "Thanks for your message! Our support team will get back to you shortly. You can also check our FAQ section for quick answers.",
                    sender: "bot"
                };
                setChatMessages(prev => [...prev, botResponse]);
            }, 1000);

            setCurrentMessage('');
        }
    };

    const toggleFAQ = (questionIndex) => {
        setExpandedFAQ(expandedFAQ === questionIndex ? null : questionIndex);
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

                        {/* Search Bar - Hidden on mobile */}
                        <div className="hidden md:block flex-1 max-w-md mx-8">
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search help articles..."
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
                                placeholder="Search help articles..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
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
                            <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                <Bell className="w-5 h-5 mr-3" />
                                Quotations
                            </a>
                            <a href="#" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
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
                                <a href="#" className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                                    <Bell className="w-5 h-5 mr-3" />
                                    Quotations
                                </a>
                                <a href="#" className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium">
                                    <MessageCircle className="w-5 h-5 mr-3" />
                                    Help Center
                                </a>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1">
                        {/* Help Center Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
                            <p className="text-gray-600">Find answers to common questions about our neurorobotics and products.</p>
                        </div>

                        {/* FAQ Sections */}
                        <div className="space-y-8">
                            {faqItems.map((category) => (
                                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h2 className="text-xl font-semibold text-gray-900">{category.category}</h2>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {category.questions.map((item, index) => {
                                                const questionIndex = `${category.id}-${index}`;
                                                return (
                                                    <div key={index} className="border border-gray-200 rounded-lg">
                                                        <button
                                                            onClick={() => toggleFAQ(questionIndex)}
                                                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                                        >
                                                            <span className="font-medium text-gray-900">{item.question}</span>
                                                            {expandedFAQ === questionIndex ? (
                                                                <ChevronDown className="w-5 h-5 text-gray-500" />
                                                            ) : (
                                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                                            )}
                                                        </button>
                                                        {expandedFAQ === questionIndex && (
                                                            <div className="px-4 pb-3">
                                                                <div className="pt-2 border-t border-gray-100">
                                                                    <p className="text-gray-600">{item.answer}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact Support Section */}
                        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Support</h2>
                            <p className="text-gray-600 mb-6">
                                If you need help or have questions looking for our support team is here to help you get back on track
                                without any delays.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Contact Support
                            </button>
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

export default HelpCenter;