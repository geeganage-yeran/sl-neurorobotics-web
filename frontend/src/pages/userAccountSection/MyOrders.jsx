import React, { useState, useEffect } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  CreditCard,
  CircleX,
  ExternalLink,
} from "lucide-react";
import CancelModal from "../../components/confirmDialog";
import api from "../../services/api";

function MyOrder({ user }) {
  const [activeTab, setActiveTab] = useState("pending");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/user/${user.id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Fetched orders:", response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      try {
        const response = await api.put(
          `/orders/${selectedOrder.orderId}/cancel`,
          { reason: "Cancelled by user" },
          { withCredentials: true }
        );

        if (response.data.success) {
          // Refresh orders after cancellation
          await fetchUserOrders();
          setCancelDialogOpen(false);
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error("Error cancelling order:", error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-800";
      case "PAID":
        return "bg-purple-100 text-purple-800";
      case "TEMP":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-4 h-4" />;
      case "SHIPPED":
        return <Truck className="w-4 h-4" />;
      case "PROCESSING":
        return <Package className="w-4 h-4" />;
      case "PAID":
        return <Clock className="w-4 h-4" />;
      case "TEMP":
        return <Clock className="w-4 h-4" />;
      case "CANCELLED":
        return <CircleX className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "DELIVERED":
        return "Delivered";
      case "SHIPPED":
        return "Shipped";
      case "PROCESSING":
        return "Processing";
      case "PAID":
        return "Paid";
      case "TEMP":
        return "Pending Payment";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredOrders =
    activeTab === "cancelled"
      ? orders.filter((order) => order.status === "CANCELLED")
      : activeTab === "pending"
      ? orders.filter(
          (order) => order.status === "PAID" || order.status === "PROCESSING"
        )
      : activeTab === "shipped"
      ? orders.filter((order) => order.status === "SHIPPED")
      : orders.filter((order) => order.status === "DELIVERED");

  const getOrderCounts = () => {
    return {
      pending: orders.filter(
        (o) => o.status === "PAID" || o.status === "PROCESSING"
      ).length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
      shipped: orders.filter((o) => o.status === "SHIPPED").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    };
  };

  const counts = getOrderCounts();

  if (loading) {
    return (
      <div className="min-h-screen lg:ml-18 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:ml-18 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mt-3 text-[#003554]">
              My Orders
            </h1>
            <h3 className="mb-3 text-[#5C728A]">View your order history</h3>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Filter Tabs */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "pending"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Pending ({counts.pending})
                  </button>
                  <button
                    onClick={() => setActiveTab("shipped")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "shipped"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Shipped ({counts.shipped})
                  </button>
                  <button
                    onClick={() => setActiveTab("delivered")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "delivered"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Delivered ({counts.delivered})
                  </button>
                  <button
                    onClick={() => setActiveTab("cancelled")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === "cancelled"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Cancelled ({counts.cancelled})
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{order.orderId}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">
                                {getStatusText(order.status)}
                              </span>
                            </span>
                          </div>

                          {/* Order Items */}
                          {order.items && order.items.length > 0 && (
                            <div className="mb-3">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="text-gray-600 text-sm mb-1"
                                >
                                  <span className="font-medium">
                                    {item.productName}
                                  </span>{" "}
                                  - Qty: {item.quantity} × ${item.price}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Order ID:</span>{" "}
                              {order.orderId}
                            </div>
                            <div>
                              <span className="font-medium">Order Date:</span>{" "}
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Total Items:</span>{" "}
                              {order.totalItems || 0}
                            </div>
                          </div>

                          {/* Tracking Information */}
                          {order.trackingNumber && (
                            <div className="mt-2 flex items-center space-x-4 text-sm">
                              <div className="text-gray-500">
                                <span className="font-medium">Tracking:</span>{" "}
                                {order.trackingNumber}
                              </div>
                              {order.trackingLink && (
                                <a
                                  href={order.trackingLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  Track Package
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              )}
                            </div>
                          )}

                          {/* Cancellation Reason */}
                          {order.status === "CANCELLED" &&
                            order.cancellationReason && (
                              <div className="mt-2 text-sm text-red-600">
                                <span className="font-medium">Cancelled:</span>{" "}
                                {order.cancellationReason}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-gray-900 mb-3">
                          ${order.totalAmount}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {order.status === "TEMP" && (
                            <button className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-600 bg-white hover:bg-green-50 transition-colors">
                              <CreditCard className="w-4 h-4 mr-1" />
                              Pay Now
                            </button>
                          )}

                          {(order.status === "PAID" ||
                            order.status === "PROCESSING") && (
                            <button
                              onClick={() => {
                                setSelectedOrder(order);
                                setCancelDialogOpen(true);
                              }}
                              className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-red-600 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors"
                            >
                              <CircleX className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          )}

                          {order.status === "SHIPPED" && order.trackingLink && (
                            <a
                              href={order.trackingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                            >
                              <Truck className="w-4 h-4 mr-1" />
                              Track Package
                            </a>
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    You don't have any orders in this category yet.
                  </p>
                </div>
              )}
            </div>

            {/* Cancel Order Dialog */}
            <CancelModal
              isOpen={cancelDialogOpen}
              onClose={() => {
                setCancelDialogOpen(false);
                setSelectedOrder(null);
              }}
              onConfirm={handleCancelOrder}
              title="Cancel Order"
              message={`Are you sure you want to cancel order #${selectedOrder?.orderId}? This action cannot be undone.`}
              confirmText="Confirm"
              cancelText="Cancel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrder;
