import React, { useEffect, useState, useCallback } from "react";
import { CreditCard, MapPin, Truck, X, Plus } from "lucide-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import api from "../services/api";
import Alert from "../components/Alert";
import DynamicHeader from "../components/DynamicHeader";
import { loadStripe } from "@stripe/stripe-js";
import { getData } from "country-list";

// Add Address Modal Component
const AddAddressModal = ({ isOpen, onClose, onSave, userId, showAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const countries = getData();

  // Validation function
  const validateAddress = (data) => {
    const errors = {};

    if (!data.name?.trim()) {
      errors.name = "Full name is required";
    } else if (data.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!data.streetAddress?.trim()) {
      errors.streetAddress = "Street address is required";
    } else if (data.streetAddress.trim().length < 5) {
      errors.streetAddress = "Street address must be at least 5 characters";
    }

    if (!data.city?.trim()) {
      errors.city = "City is required";
    } else if (data.city.trim().length < 2) {
      errors.city = "City must be at least 2 characters";
    }

    if (!data.state?.trim()) {
      errors.state = "State is required";
    }

    if (!data.zipCode?.trim()) {
      errors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(data.zipCode.trim())) {
      errors.zipCode = "ZIP code must be 5 digits or 5-4 format";
    }

    if (!data.country?.trim()) {
      errors.country = "Country is required";
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAddress(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        name: formData.name.trim(),
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim().toUpperCase(),
        zipCode: formData.zipCode.trim(),
        country: formData.country,
        defaultAddress: true,
        createdBy: userId,
      };

      const response = await api.post(`/user/addAddress`, dataToSend, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        showAlert("Address added successfully");
        onSave(response.data || dataToSend);
        onClose();
        // Reset form
        setFormData({
          name: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error adding address:", error);
      showAlert("Failed to add address", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold" style={{ color: "#051923" }}>
            Add Shipping Address
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                errors.streetAddress ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter street address"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.streetAddress}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CA"
                maxLength="10"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                  errors.zipCode ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="12345"
              />
              {errors.zipCode && (
                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                  errors.country ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#051923] text-white rounded-md hover:bg-[#002a43] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Shipping Address Selection Modal
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
            className="flex-1 px-4 py-2 bg-[#051923] hover:bg-[#002a43] text-white cursor-pointer font-semibold rounded-md text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Checkout Component
const ProceedToPay = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Order data from navigation state
  const [orderData, setOrderData] = useState({
    subtotal: 0,
    discount: 0,
    appliedPromo: "",
    discountAmount: 0,
  });

  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

  const clearAllState = useCallback(() => {
    setCartItems([]);
    setOrderData({
      subtotal: 0,
      discount: 0,
      appliedPromo: "",
      discountAmount: 0,
    });
    setShippingAddress(null);
    setIsShippingModalOpen(false);
    setIsAddAddressModalOpen(false);
    setIsProcessingPayment(false);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user/me", {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserEmail(response.data.userInfo.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error - maybe redirect to login
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // First clear any existing state
    clearAllState();

    // Then load new data
    if (location.state) {
      setCartItems(location.state.cartItems || []);
      setOrderData({
        subtotal: location.state.subtotal || 0,
        discount: location.state.discount || 0,
        appliedPromo: location.state.appliedPromo || "",
        discountAmount: location.state.discountAmount || 0,
      });

      if (location.state.source === "cart") {
        fetchCartItems();
      }
    } else {
      fetchCartItems();
    }
    fetchAddress();
  }, [userId, location.state, location.pathname]);

  useEffect(() => {
    return () => {
      clearAllState();
    };
  }, [clearAllState]);

  // Additional effect to handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event) => {
      clearAllState();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [clearAllState]);

  // Clear state when location changes (user navigates away)
  useEffect(() => {
    const currentPath = location.pathname;

    return () => {
      // Only clear if we're actually leaving this component
      if (window.location.pathname !== currentPath) {
        clearAllState();
      }
    };
  }, [location.pathname, clearAllState]);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/cart/item/${userId}`);
      if (response.data && response.data.items) {
        setCartItems(response.data.items);
        const subtotal = response.data.items.reduce(
          (sum, item) => sum + (item.unitPrice || 0) * (item.quantity || 1),
          0
        );
        setOrderData((prev) => ({ ...prev, subtotal }));
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      showAlert("Failed to load cart items", "error");
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await api.get(`/user/getAddress/${userId}`, {
        withCredentials: true,
      });

      const addresses = response.data || [];
      const defaultAddress =
        addresses.find((addr) => addr.defaultAddress || addr.isDefault) ||
        addresses[0];

      setShippingAddress(defaultAddress);
    } catch (error) {
      console.error("Error fetch address", error);
      setShippingAddress(null);
    }
  };

  const handleAddNewAddress = async (newAddress) => {
    setShippingAddress(newAddress);
    setIsAddAddressModalOpen(false);
    await fetchAddress();
  };

  const handleSaveAddress = (newAddress) => {
    setShippingAddress(newAddress);
    setIsShippingModalOpen(false);
    showAlert("Address changed successfully!");
  };

  // Calculate totals
  const subtotal = orderData.subtotal;
  const discountAmount = orderData.discountAmount;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  // const tax = (subtotal - discountAmount) * 0.08;
  const total = subtotal - discountAmount + shippingCost;

  // Calculate total items
  const totalItemsCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // const handlePayment = async () => {
  //   if (cartItems.length === 0) {
  //     showAlert("Your cart is empty", "error");
  //     return;
  //   }

  //   if (!shippingAddress) {
  //     showAlert("Please select a shipping address", "error");
  //     return;
  //   }

  //   setIsProcessingPayment(true);

  //   try {
  //     // Create checkout session
  //     const response = await axios.post(
  //       "http://localhost:8080/api/checkout/session",
  //       {
  //         amount: Math.round(total * 100), // Convert to cents and round
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     const { sessionId } = response.data;

  //     if (!sessionId) {
  //       throw new Error("No session ID received from server");
  //     }

  //     // Redirect to Stripe Checkout
  //     const stripe = await stripePromise;
  //     const { error } = await stripe.redirectToCheckout({
  //       sessionId: sessionId,
  //     });

  //     if (error) {
  //       console.error("Stripe redirect error:", error);
  //       showAlert("Payment redirect failed. Please try again.", "error");
  //     }
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     showAlert(
  //       error.response?.data?.message || "Checkout failed. Please try again.",
  //       "error"
  //     );
  //   } finally {
  //     setIsProcessingPayment(false);
  //   }
  // };

  const handlePayment = async () => {
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
      const itemsSubtotal = cartItems.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0
      );

      const orderPayload = {
        userId: parseInt(userId),
        totalAmount: itemsSubtotal,
        source: location.state?.source === "buy_now" ? "BUY_NOW" : "CART",
        customerEmail: userEmail,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
        shippingAddressId: shippingAddress.id,
        appliedPromoCode: orderData.appliedPromo || null,
        discountAmount: discountAmount
      };

      console.log("Sending order payload:", orderPayload);

      const response = await api.post("/checkout/session", orderPayload, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Checkout response:", response.data);

      const { success, sessionId, orderId, sessionUrl } = response.data;

      if (!success || !sessionId) {
        throw new Error("Failed to create checkout session");
      }

      localStorage.setItem("currentOrderId", orderId);
      localStorage.setItem("checkoutSessionId", sessionId);

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
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
      <div className="min-h-screen bg-gray-50 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Header */}
          <div className="flex items-center mb-6 sm:mb-8">
            <CreditCard
              className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3"
              style={{ color: "#051923" }}
            />
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: "#051923" }}
            >
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Shipping & Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <MapPin
                      className="w-5 h-5 mr-2"
                      style={{ color: "#051923" }}
                    />
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: "#051923" }}
                    >
                      Shipping Address
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAddAddressModalOpen(true)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New
                  </button>
                </div>

                {shippingAddress ? (
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p
                          className="font-semibold"
                          style={{ color: "#051923" }}
                        >
                          {shippingAddress.name}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {shippingAddress.streetAddress}
                        </p>
                        <p className="text-gray-600">
                          {shippingAddress.city}, {shippingAddress.state}{" "}
                          {shippingAddress.zipCode}
                        </p>
                        <p className="text-gray-600">
                          {shippingAddress.country}
                        </p>
                      </div>
                      <button
                        onClick={() => setIsShippingModalOpen(true)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-4">
                      No shipping address selected
                    </p>
                    <button
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="bg-[#051923] text-white px-4 py-2 rounded-md hover:bg-[#002a43] transition-colors"
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2
                  className="text-xl font-semibold mb-4"
                  style={{ color: "#051923" }}
                >
                  Order Items ({totalItemsCount})
                </h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center space-x-4 py-4 border-b last:border-b-0"
                    >
                      <img
                        src={item.productImage || "/placeholder-image.jpg"}
                        alt={item.productName}
                        className="w-16 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.jpg";
                        }}
                      />
                      <div className="flex-1">
                        <h3
                          className="font-medium"
                          style={{ color: "#051923" }}
                        >
                          {item.productName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-gray-600 text-sm">
                          ${item.unitPrice?.toFixed(2)} each
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-semibold"
                          style={{ color: "#051923" }}
                        >
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2
                  className="text-xl font-semibold mb-6"
                  style={{ color: "#051923" }}
                >
                  Order Summary
                </h2>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({orderData.discount}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">
                      {shippingCost === 0
                        ? "FREE"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="text-gray-600">${tax.toFixed(2)}</span>
                  </div> */}

                  <div className="border-t pt-4">
                    <div
                      className="flex justify-between text-xl font-bold"
                      style={{ color: "#051923" }}
                    >
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal > 0 && subtotal < 50 && (
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center text-blue-700">
                      <Truck className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span className="text-sm">
                        You're ${(50 - subtotal).toFixed(2)} away from free
                        shipping!
                      </span>
                    </div>
                  </div>
                )}

                {/* Payment Button */}
                <button
                  onClick={handlePayment}
                  disabled={
                    !shippingAddress ||
                    cartItems.length === 0 ||
                    isProcessingPayment
                  }
                  className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Pay Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ShippingAddressModal
          isOpen={isShippingModalOpen}
          onClose={() => setIsShippingModalOpen(false)}
          shippingAddress={shippingAddress}
          onSave={handleSaveAddress}
          userId={userId}
        />

        <AddAddressModal
          isOpen={isAddAddressModalOpen}
          onClose={() => setIsAddAddressModalOpen(false)}
          onSave={handleAddNewAddress}
          userId={userId}
          showAlert={showAlert}
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

export default ProceedToPay;
