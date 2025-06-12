import React, { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  Eye,
  CreditCard,
  CircleX,
} from "lucide-react";
import CancelModal from "../../components/confirmDialog";

function MyOrder() {
  const [activeTab, setActiveTab] = useState("all");

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const handleCancelOrder = () => {
    console.log("Account deleted!");
  };

  const orders = [
    {
      id: "ORD-001",
      date: "2025-05-15",
      product: "Apex X EEG Headset",
      category: "EEG Headset with Wireless EEG",
      price: "$2,499.00",
      status: "delivered",
      statusText: "Delivered",
      estimatedDelivery: "2025-05-20",
      trackingNumber: "NT12345678",
      image: "/api/placeholder/80/80",
    },
    {
      id: "ORD-002",
      date: "2025-05-18",
      product: "Chair X Ergonomic",
      category: "Ergonomic Brain Chair",
      price: "$899.00",
      status: "shipped",
      statusText: "Shipped",

      trackingNumber: "NT87654321",
      image: "/api/placeholder/80/80",
    },
    {
      id: "ORD-003",
      date: "2025-06-01",
      product: "Emotiv Flex 2",
      category: "Wireless Brain Monitoring",
      price: "$1,299.00",
      status: "processing",
      statusText: "Processing",
      trackingNumber: "NT11223344",
      image: "/api/placeholder/80/80",
    },
    {
      id: "ORD-004",
      date: "2025-06-05",
      product: "NeuroLink Pro",
      category: "Advanced Brain Interface",
      price: "$3,299.00",
      status: "pending",
      statusText: "Pending",
      trackingNumber: "NT99887766",
      image: "/api/placeholder/80/80",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "processing":
        return <Package className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);
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
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "all"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    All Orders ({orders.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "pending"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Pending (
                    {orders.filter((o) => o.status === "pending").length})
                  </button>
                  <button
                    onClick={() => setActiveTab("processing")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "processing"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Processing (
                    {orders.filter((o) => o.status === "processing").length})
                  </button>
                  <button
                    onClick={() => setActiveTab("shipped")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "shipped"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Shipped (
                    {orders.filter((o) => o.status === "shipped").length})
                  </button>
                  <button
                    onClick={() => setActiveTab("delivered")}
                    className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === "delivered"
                        ? "border-[#003554] text-[#003554]"
                        : "border-transparent text-gray-500 hover:text-gray-700 cursor-pointer"
                    }`}
                  >
                    Delivered (
                    {orders.filter((o) => o.status === "delivered").length})
                  </button>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
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
                              {order.product}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.statusText}</span>
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{order.category}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                            <div>
                              <span className="font-medium">Order ID:</span>{" "}
                              {order.id}
                            </div>
                            <div>
                              <span className="font-medium">Order Date:</span>{" "}
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                          </div>
                          {order.trackingNumber && (
                            <div className="mt-2 text-sm text-gray-500">
                              <span className="font-medium">Tracking:</span>{" "}
                              {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-xl font-bold text-gray-900 mb-3">
                          {order.price}
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>
                          {order.status === "pending" && (
                            <button className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-green-600 rounded-lg text-sm font-medium text-green-600 bg-white hover:bg-green-50 transition-colors">
                              <CreditCard className="w-4 h-4 mr-1" />
                              Pay Now
                            </button>
                          )}
                          {order.status === "processing" && (
                            <button onClick={() => setCancelDialogOpen(true)} className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-red-600 rounded-lg text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors">
                              <CircleX className="w-4 h-4 mr-1" />
                              Cancel
                            </button>
                          )}
                          {order.status === "shipped" && (
                            <button className="inline-flex cursor-pointer items-center px-3 py-1.5 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    You don't have any orders in this category yet.
                  </p>
                </div>
              )}
            </div>
            {/* Delete Account Dialog */}
            <CancelModal
              isOpen={cancelDialogOpen}
              onClose={() => setCancelDialogOpen(false)}
              onConfirm={handleCancelOrder}
              title="Cancel Order"
              message="Are you sure you want to cancel this order?This action cannot be undone."
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
