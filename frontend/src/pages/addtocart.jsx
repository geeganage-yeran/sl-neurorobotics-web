import React, { useEffect, useState } from "react";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Truck, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Alert from "../components/Alert";
import DynamicHeader from "../components/DynamicHeader";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAddToCart();
    fetchAddress();
  }, [userId]);

  const fetchAddToCart = async () => {
    try {
      const response = await api.get(`/cart/item/${userId}`);
      // console.log(response.data);

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
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"></div>
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
                      <div className="flex-1">
                        <p
                          className="font-semibold"
                          style={{ color: "#051923" }}
                        >
                          Test user
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          123 Main Street
                        </p>
                        <p className="text-sm text-gray-600">Apartment 4B</p>
                        <p className="text-sm text-gray-600">
                          New York, NY 10001
                        </p>
                        <p className="text-sm text-gray-600">United States</p>
                        <p className="text-sm text-gray-600 mt-2">
                          (555) 123-4567
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto sm:ml-4">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <label
                      htmlFor="sameBilling"
                      className="ml-2 text-sm text-gray-600 leading-5"
                    >
                      ✓ Billing Address is same as Shipping Address
                    </label>
                  </div>
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
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"></div>
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
                          <p className="text-sm text-gray-600">{shippingAddress.city}</p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.state}
                          </p>
                          <p className="text-sm text-gray-600">{shippingAddress.zipCode}</p>
                         
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">
                          Loading address...
                        </p>
                      )}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium self-start sm:self-auto sm:ml-4 cursor-pointer">
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex items-start">
                    <input
                      type="checkbox"
                      id="sameBilling"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <label
                      htmlFor="sameBilling"
                      className="ml-2 text-sm text-gray-600 leading-5"
                    >
                      ✓ Billing Address is same as Shipping Address
                    </label>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  className="w-full py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  style={{ backgroundColor: "#051923", color: "white" }}
                  disabled={cartItems.length === 0}
                >
                  <span>🔒 Checkout</span>
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
        </div>

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
