import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import Alert from "../components/Alert";
import DynamicHeader from "../components/DynamicHeader";
import { loadStripe } from "@stripe/stripe-js";

const ShippingAddressModal = ({
  isOpen,
  onClose,
  shippingAddress,
  onSave,
  userId,
}) => {
  const [availableAddresses, setAvailableAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableAddresses();
    }
  }, [isOpen, userId]);

  const fetchAvailableAddresses = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/user/getAddress/${userId}`, {
        withCredentials: true,
      });
      setAvailableAddresses(response.data || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setAvailableAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    onSave(address);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <h2 className="text-xl font-semibold" style={{ color: "#051923" }}>
            Select Shipping Address
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <X className="w-6 cursor-pointer h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading addresses...</p>
            </div>
          ) : availableAddresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No addresses found</p>
            </div>
          ) : (
            availableAddresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  shippingAddress?.id === address.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300"
                }`}
                onClick={() => handleSelectAddress(address)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <p className="font-semibold" style={{ color: "#051923" }}>
                        {address.name}
                      </p>
                      {address.isDefault && (
                        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {address.streetAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                  <div className="ml-4">
                    {shippingAddress?.id === address.id ? (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#003554] hover:bg-[#002a43] text-white cursor-pointer font-semibold rounded-md text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const { userId } = useParams();
  const navigate = useNavigate();

  const stripePromise = loadStripe(
    "pk_test_51Ry9B9DDcyLBjfrUlgMNVbELmrwSEsAM1zquvhN80FSPDGPe58WXzVDPdRu81LuWsw8TdU7dia0oqBXk2wlta9el00OtAhxZXl"
  );

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
    position: "top-right",
  });

  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const continueShopping = () => {
    navigate("/shop");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Updated handleSaveAddress - only frontend changes, no API call
  const handleSaveAddress = (newAddress) => {
    // Update local state only
    setShippingAddress(newAddress);
    setIsModalOpen(false);
    showAlert("Address changed successfully!");
  };

  useEffect(() => {
    fetchAddToCart();
    fetchAddress();
  }, [userId]);

  const fetchAddToCart = async () => {
    try {
      const response = await api.get(`/cart/item/${userId}`);
      
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        setCartData(response.data);
      } else {
        setCartItems([]);
        setCartData(null);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]);
      setCartData(null);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put(`/cart/update/${cartItemId}`, newQuantity, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCartItems((items) =>
        items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );

      if (window.refreshCartCount) {
        window.refreshCartCount();
      }

      if (cartData) {
        const oldItem = cartItems.find(
          (item) => item.cartItemId === cartItemId
        );
        const quantityDiff = newQuantity - (oldItem?.quantity || 0);
        setCartData((prev) => ({
          ...prev,
          totalItems: (prev.totalItems || 0) + quantityDiff,
        }));
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      showAlert("Failed to update quantity", "error");
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);

      const removedItem = cartItems.find(
        (item) => item.cartItemId === cartItemId
      );

      setCartItems((items) =>
        items.filter((item) => item.cartItemId !== cartItemId)
      );

      // Add this line to refresh header cart count
      if (window.refreshCartCount) {
        window.refreshCartCount();
      }

      // Update cartData totalItems
      if (cartData && removedItem) {
        setCartData((prev) => ({
          ...prev,
          totalItems: Math.max(
            0,
            (prev.totalItems || 0) - (removedItem.quantity || 1)
          ),
        }));
      }

      showAlert("Item removed successfully", "success");
    } catch (error) {
      console.error("Error removing item:", error);
      showAlert("Failed to remove item", "error");
    }
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setAppliedPromo(promoCode);
      setDiscount(10);
      setPromoCode("");
      showAlert("Promo code applied successfully!", "success");
    } else {
      showAlert("Invalid promo code", "error");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo("");
    setDiscount(0);
    showAlert("Promo code removed", "success");
  };

  const fetchAddress = async () => {
    try {
      const response = await api.get(`/cart/getAddress/${userId}`);
      setShippingAddress(response.data);
    } catch (error) {
      console.error("Error fetch address");
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingCost + tax;

  // Calculate total items dynamically
  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Fixed Stripe payment function
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      showAlert("Your cart is empty", "error");
      return;
    }

    if (!shippingAddress) {
      showAlert("Please select a shipping address", "error");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Create checkout session
      const response = await axios.post(
        "http://localhost:8080/api/checkout/session",
        {
          amount: Math.round(total * 100), // Convert to cents and round
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const { sessionId } = response.data;

      if (!sessionId) {
        throw new Error("No session ID received from server");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) {
        console.error("Stripe redirect error:", error);
        showAlert("Payment redirect failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      showAlert(
        error.response?.data?.message || "Checkout failed. Please try again.",
        "error"
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <>
      <DynamicHeader />
      <div className="min-h-screen bg-white mt-14">
        {/* Cart Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="flex items-center mb-6 sm:mb-8">
            <ShoppingBag
              className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
              style={{ color: "#051923" }}
            />
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "#051923" }}
            >
              My Cart
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-2">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-500">
                    Add some items to get started!
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
                      <img
                        src={item.productImage || "/placeholder-image.jpg"}
                        alt={item.productName}
                        className="w-32 h-36 sm:w-24 sm:h-28 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex-1 mb-4 lg:mb-0">
                          <h3
                            className="text-lg font-semibold mb-2 text-center sm:text-left"
                            style={{ color: "#051923" }}
                          >
                            {item.productName}
                          </h3>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center justify-center sm:justify-start space-x-3">
                              <span className="text-sm text-gray-600">
                                Quantity:
                              </span>
                              <div className="flex items-center border border-gray-300 rounded">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity - 1
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.cartItemId,
                                      item.quantity + 1
                                    )
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="text-center sm:text-right">
                              <p className="text-sm text-gray-600">Each</p>
                              <p
                                className="text-lg font-semibold"
                                style={{ color: "#051923" }}
                              >
                                ${item.unitPrice?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-center sm:justify-start mt-4">
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="text-red-600 hover:text-red-800 flex items-center space-x-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm cursor-pointer">
                                Remove
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="text-center lg:text-right lg:ml-4">
                          <p className="text-sm text-gray-600 mb-1">Total</p>
                          <p
                            className="text-xl font-bold"
                            style={{ color: "#051923" }}
                          >
                            $
                            {(item.unitPrice * (item.quantity || 1)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {cartItems.length > 0 && (
                <div className="flex justify-between items-center pt-4 sm:pt-6 border-t">
                  <span
                    className="text-lg font-semibold"
                    style={{ color: "#051923" }}
                  >
                    {totalItemsCount} {totalItemsCount === 1 ? "Item" : "Items"}
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "#051923" }}
                  >
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 sticky top-4 sm:top-24">
                <h2
                  className="text-xl font-semibold mb-4 sm:mb-6"
                  style={{ color: "#051923" }}
                >
                  Order Summary
                </h2>

                {/* Promo Code */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <Tag className="w-4 h-4 inline mr-1" />
                      Apply
                    </button>
                  </div>
                  {appliedPromo && (
                    <div className="mt-2 flex items-center justify-between text-sm text-green-600">
                      <span>✓ {appliedPromo} applied</span>
                      <button
                        onClick={removePromoCode}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4 sm:mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping cost</span>
                    <span className="text-gray-600">
                      {shippingCost === 0
                        ? "FREE"
                        : `$${shippingCost.toFixed(2)}`}
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
                    <div
                      className="flex justify-between text-lg sm:text-xl font-bold"
                      style={{ color: "#051923" }}
                    >
                      <span>Estimated Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal > 0 && subtotal < 50 && (
                  <div className="mb-4 sm:mb-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-700">
                      <Truck className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        You're ${(50 - subtotal).toFixed(2)} away from free
                        shipping!
                      </span>
                    </div>
                  </div>
                )}

                {/* Shipping Address */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "#051923" }}
                    >
                      Shipping Address
                    </h3>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-4 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      {shippingAddress ? (
                        <div className="flex-1">
                          <p
                            className="font-semibold"
                            style={{ color: "#051923" }}
                          >
                            {shippingAddress.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {shippingAddress.streetAddress}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.city}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.state}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.zipCode}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Loading address...
                        </p>
                      )}
                      <button
                        onClick={openModal}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto sm:ml-4 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  onClick={handleCheckout}
                  style={{ backgroundColor: "#051923", color: "white" }}
                  disabled={cartItems.length === 0 || isProcessingPayment}
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>🔒 Checkout</span>
                  )}
                </button>

                {/* Continue Shopping */}
                <button
                  className="w-full mt-4 py-3 px-6 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={continueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address Modal */}
        <ShippingAddressModal
          isOpen={isModalOpen}
          onClose={closeModal}
          shippingAddress={shippingAddress}
          onSave={handleSaveAddress}
          userId={userId}
        />

        <Alert
          open={alert.open}
          onClose={closeAlert}
          message={alert.message}
          type={alert.type}
          position={alert.position}
          autoHideDuration={3000}
        />
      </div>
    </>
  );
};

export default AddToCart;