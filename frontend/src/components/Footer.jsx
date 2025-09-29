import React, { useState, useEffect } from 'react';
import logo2 from '../assets/image5.png';
import api from "../services/api";

const Footer = () => {
    const [latestProducts, setLatestProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLatestProducts();
    }, []);

    const fetchLatestProducts = async () => {
        try {
            // Change to GET request and handle response properly
            const response = await api.get("/public/getLatestProducts");

            // If using axios (most common), response data is in response.data
            if (response && response.data) {
                setLatestProducts(response.data);
            } else {
                console.error('No data received from API');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductClick = (productId, productName) => {
        // Navigate to product detail page
        window.location.href = `/products/${productId}`;
        // Or if using React Router:
        // navigate(`/products/${productId}`);
    };

    return (
        <footer className="px-6 py-12 text-white bg-[#121212]">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <div className="flex items-center">
                                <img
                                    src={logo2}
                                    alt="SL Neurorobotics Logo"
                                    className="h-8"
                                />
                            </div>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                            <p>SL Neurorobotics (PVT) LTD</p>
                            <p>80/3/2, Temple Road, Wanawasala, Badulla,</p>
                            <p>Sri Lanka</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Latest Products</h3>
                        {loading ? (
                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                            </div>
                        ) : (
                            <ul className="space-y-2 text-sm text-gray-400">
                                {latestProducts.length > 0 ? (
                                    latestProducts.map((product) => (
                                        <li key={product.id}>
                                            <a
                                                href="/shop"
                                                className="text-left transition-colors hover:text-white hover:underline focus:outline-none focus:text-white cursor-pointer"
                                            >
                                                {product.name && product.name.length > 30
                                                    ? `${product.name.substring(0, 30)}...`
                                                    : product.name || 'Unnamed Product'}
                                            </a>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No products available</li>
                                )}
                            </ul>

                        )}
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold text-white">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="transition-colors hover:text-white">About</a></li>
                            <li><a href="/about#contactUs" className="transition-colors hover:text-white">Contact</a></li>
                            <li><a href="/shop" className="transition-colors hover:text-white">Shop</a></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 mt-8 border-t border-gray-800">
                    <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="mb-2 font-semibold text-white">Follow</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 transition-colors hover:text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div className="flex space-x-6 text-sm text-gray-400">
                            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
                            <a href="#" className="transition-colors hover:text-white">Terms of Use</a>
                        </div>
                    </div>
                </div>

                <div className="pt-4 mt-6 border-t border-gray-800">
                    <div className="text-sm text-center text-gray-400">
                        <p>© 2025 SL Neurorobotics. All rights reserved.</p>
                        <p className="mt-2">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                            dummy text ever since me.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;