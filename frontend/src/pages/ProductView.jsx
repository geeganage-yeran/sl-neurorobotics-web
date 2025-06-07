import React, { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';

export default function ProductViewPage() {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const productImages = [
        'https://images.unsplash.com/photo-1559163499-413811fb2344?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=400&fit=crop&crop=center'
    ];

    const specifications = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "14 Channel EEG Headset",
            description: "up to 16-30 System"
        },
        {
            icon: <Headphones className="w-6 h-6" />,
            title: "Wireless Bluetooth",
            description: "Connects over Bluetooth with your device"
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Research Grade",
            description: "Fast and reliable real-time brain activity monitoring"
        },
        {
            icon: <RotateCcw className="w-6 h-6" />,
            title: "Real-time Feedback",
            description: "Get instant feedback from your brain activity"
        },
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Long Battery Life",
            description: "Capture high-quality neurofeedback data"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Premium Design",
            description: "Built for comfort and precision"
        }
    ];

    // Star rating component
    const StarRating = ({ rating = 4.5, maxStars = 5 }) => {
        return (
            <div className="flex items-center space-x-1">
                {[...Array(maxStars)].map((_, index) => (
                    <Star
                        key={index}
                        className={`w-5 h-5 ${index < Math.floor(rating)
                            ? 'text-yellow-400 fill-current'
                            : index < rating
                                ? 'text-yellow-400 fill-current opacity-50'
                                : 'text-gray-300'
                            }`}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-2">{rating}</span>
            </div>
        );
    };

    // Simple Footer component
    const Footer = () => (
        <footer className="bg-gray-900 text-white py-12 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">SL Neurorobotics</h3>
                        <p className="text-gray-400">
                            Leading provider of advanced EEG technology and neurofeedback solutions.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Products</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>EEG Headsets</li>
                            <li>Software Solutions</li>
                            <li>Research Tools</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>Documentation</li>
                            <li>Contact Us</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>About Us</li>
                            <li>Careers</li>
                            <li>Privacy Policy</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 SL Neurorobotics. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <div className="h-8 w-32 bg-blue-950 rounded flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SL Neurorobotics</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <button className="p-2 text-gray-400 hover:text-gray-500">
                                    <ShoppingCart className="w-6 h-6" />
                                </button>
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                                    3
                                </span>
                            </div>
                            <button className="bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
                            <img
                                src={productImages[selectedImage]}
                                alt="EPOC X EEG Headset"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {productImages.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                                        ? 'border-blue-600'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`Product view ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                EPOC X - 14 Channel Wireless EEG Headset
                            </h1>
                            <div className="flex items-center space-x-2 mb-4">
                                <StarRating rating={4.5} />
                                <span className="text-gray-600">(128 reviews)</span>
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">$999.00</div>
                            <p className="text-gray-600">
                                Experience cutting-edge neurotechnology with our professional-grade
                                EEG headset. Perfect for researchers, developers, and neurofeedback
                                enthusiasts seeking precise brain activity monitoring.
                            </p>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Buy Now
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    Add to Cart
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 pt-6 border-t border-gray-200">
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <Truck className="w-5 h-5" />
                                <span>Free shipping on orders over $500</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <Shield className="w-5 h-5" />
                                <span>2-year warranty included</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-gray-600">
                                <RotateCcw className="w-5 h-5" />
                                <span>30-day return policy</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Specifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {specifications.map((spec, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="text-blue-600 mb-3">
                                    {spec.icon}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{spec.title}</h3>
                                <p className="text-gray-600 text-sm">{spec.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
                    <h3 className="text-2xl font-bold mb-4">Want to discover more about this product?</h3>
                    <p className="text-blue-100 mb-6">
                        Join thousands of researchers and developers already using our EEG technology
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                        Learn More
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}