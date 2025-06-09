import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, X } from 'lucide-react';

const AddToCart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Plaid Shirt & Buttoned Skirt Set",
            color: "OLIVE/MULTI",
            size: "S",
            price: 39.99,
            quantity: 1,
            image: "/api/placeholder/100/120",
            inStock: true
        },
        {
            id: 2,
            name: "Premium Cotton T-Shirt",
            color: "Navy Blue",
            size: "M",
            price: 25.99,
            quantity: 2,
            image: "/api/placeholder/100/120",
            inStock: true
        }
    ]);

    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState('');
    const [discount, setDiscount] = useState(0);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(items =>
            items.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(items => items.filter(item => item.id !== id));
    };

    const applyPromoCode = () => {
        if (promoCode.toLowerCase() === 'save10') {
            setAppliedPromo(promoCode);
            setDiscount(10);
            setPromoCode('');
        }
    };

    const removePromoCode = () => {
        setAppliedPromo('');
        setDiscount(0);
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discount) / 100;
    const shippingCost = subtotal > 50 ? 0 : 9.99;
    const tax = (subtotal - discountAmount) * 0.08;
    const total = subtotal - discountAmount + shippingCost + tax;

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}


            {/* Cart Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <ShoppingBag className="w-8 h-8 mr-3" style={{ color: '#051923' }} />
                    <h1 className="text-3xl font-bold" style={{ color: '#051923' }}>My Cart</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-12">
                                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
                                <p className="text-gray-500">Add some items to get started!</p>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex items-start space-x-4 p-6 border border-gray-200 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-24 h-28 object-cover rounded-lg"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold mb-2" style={{ color: '#051923' }}>
                                            {item.name}
                                        </h3>
                                        <div className="text-sm text-gray-600 mb-3">
                                            <p>Color: {item.color}</p>
                                            <p>Size: {item.size}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-sm text-gray-600">Quantity:</span>
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Each</p>
                                                <p className="text-lg font-semibold" style={{ color: '#051923' }}>
                                                    ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex space-x-4 text-sm">
                                                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                                                <button className="text-blue-600 hover:text-blue-800">Move to Wishlist</button>
                                                <button className="text-blue-600 hover:text-blue-800">Save for Later</button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-600 hover:text-red-800 flex items-center space-x-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="text-sm">Remove</span>
                                            </button>
                                        </div>

                                        {item.inStock && (
                                            <p className="text-sm text-green-600 mt-2">✓ In Stock</p>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Total</p>
                                        <p className="text-xl font-bold" style={{ color: '#051923' }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}

                        {cartItems.length > 0 && (
                            <div className="flex justify-between items-center pt-6 border-t">
                                <span className="text-lg font-semibold" style={{ color: '#051923' }}>
                                    {cartItems.length} Items
                                </span>
                                <span className="text-xl font-bold" style={{ color: '#051923' }}>
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold mb-6" style={{ color: '#051923' }}>Order Summary</h2>

                            {/* Promo Code */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2" style={{ color: '#051923' }}>
                                    ENTER PROMO CODE
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Promo Code"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={applyPromoCode}
                                        className="px-4 py-2 text-white rounded font-medium"
                                        style={{ backgroundColor: '#051923' }}
                                    >
                                        Submit
                                    </button>
                                </div>
                                {appliedPromo && (
                                    <div className="mt-2 flex items-center justify-between text-sm text-green-600">
                                        <span>✓ {appliedPromo} applied</span>
                                        <button onClick={removePromoCode} className="text-red-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping cost</span>
                                    <span className="text-gray-600">
                                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount}%)</span>
                                        <span>-${discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-600">${tax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between text-xl font-bold" style={{ color: '#051923' }}>
                                        <span>Estimated Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Free Shipping Notice */}
                            {subtotal < 50 && (
                                <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center text-blue-700">
                                        <Truck className="w-5 h-5 mr-2" />
                                        <span className="text-sm">
                                            You're ${(50 - subtotal).toFixed(2)} away from free shipping!
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Payment Options */}
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 mb-2">
                                    or 4 interest-free payments of ${(total / 4).toFixed(2)} with
                                    <span className="font-semibold text-green-600"> afterpay</span>
                                </p>
                            </div>

                            {/* Shipping Address */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold" style={{ color: '#051923' }}>Shipping Address</h3>
                                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                        Add a new address
                                    </button>
                                </div>

                                <div className="border border-gray-300 rounded-lg p-4 bg-white">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="font-semibold" style={{ color: '#051923' }}>John Doe</p>
                                            <p className="text-sm text-gray-600 mt-1">123 Main Street</p>
                                            <p className="text-sm text-gray-600">Apartment 4B</p>
                                            <p className="text-sm text-gray-600">New York, NY 10001</p>
                                            <p className="text-sm text-gray-600">United States</p>
                                            <p className="text-sm text-gray-600 mt-2">📱 +1 (555) 123-4567</p>
                                        </div>
                                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4">
                                            Change
                                        </button>
                                    </div>
                                </div>

                                {/* Billing Address Checkbox */}
                                <div className="mt-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="sameBilling"
                                        defaultChecked
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="sameBilling" className="ml-2 text-sm text-gray-600">
                                        ✓ Billing Address is same as Shipping Address
                                    </label>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                                style={{ backgroundColor: '#051923', color: 'white' }}
                                disabled={cartItems.length === 0}
                            >
                                <span>🔒 Checkout</span>
                            </button>

                            {/* Continue Shopping */}
                            <button className="w-full mt-4 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddToCart;