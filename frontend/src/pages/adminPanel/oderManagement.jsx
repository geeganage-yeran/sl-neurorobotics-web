import React, { useState, useMemo, useEffect } from "react";
import api from "../../services/api";
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Archive,
  Edit3,
  ExternalLink,
} from "lucide-react";

// API calls

const fetchAllOrders = async () => {
  try {
    const response = await api.get("/admin/orders/all", {
      withCredentials: true,
    });

    const data = response.data;
    if (data.success) {
      return data.data.map((order) => ({
        id: order.orderId,
        customer: order.userEmail ? order.userEmail.split("@")[0] : "Unknown",
        email: order.userEmail,
        phone: order.userPhone,
        address: order.shippingAddress
          ? {
              street: order.shippingAddress.streetAddress,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              zip: order.shippingAddress.zipCode,
            }
          : {},
        date: new Date(order.createdAt),
        status: order.status.toLowerCase(),
        trackingNumber: order.trackingNumber || "",
        trackingLink: order.trackingLink || "",
        items: order.items
          ? order.items.map((item) => ({
              name: item.productName,
              price: item.price,
              quantity: item.quantity,
            }))
          : [],
        total: order.totalAmount,
        completedDate: order.status === "DELIVERED" ? new Date() : null,
        cancelledDate: order.status === "CANCELLED" ? new Date() : null,
        cancellationReason: order.cancellationReason,
      }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

const cancelOrderAPI = async (orderId, reason) => {
  try {
    const response = await api.put(
      `/admin/orders/${orderId}/cancel`,
      { reason },
      { withCredentials: true }
    );

    const data = response.data;
    return data.success;
  } catch (error) {
    console.error("Error cancelling order:", error);
    return false;
  }
};

const completeOrderAPI = async (orderId) => {
  try {
    const response = await api.put(
      `/admin/orders/${orderId}/complete`,
      {},
      { withCredentials: true }
    );
    const data = response.data;
    return data.success;
  } catch (error) {
    console.error("Error completing order:", error);
    return false;
  }
};

const updateTrackingAPI = async (orderId, trackingNumber, trackingLink) => {
  try {
    const response = await api.put(
      `/admin/orders/${orderId}/tracking`,
      { trackingNumber, trackingLink },
      { withCredentials: true }
    );

    const data = response.data;
    return data.success;
  } catch (error) {
    console.error("Error updating tracking:", error);
    return false;
  }
};

// Cancel Modal Component
const CancelModal = ({ isOpen, onClose, onConfirm, orderIds }) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cancel Order
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows="3"
              placeholder="Please provide a reason for cancelling this order..."
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Cancelling..." : "Confirm Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Tracking Input Component
const TrackingInput = ({ order, onUpdateTracking, onMarkComplete }) => {
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [trackingLink, setTrackingLink] = useState(order.trackingLink || "");
  const [isEditing, setIsEditing] = useState(
    !order.trackingNumber || !order.trackingLink
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasTrackingData = order.trackingNumber && order.trackingLink;

  const handleSubmit = async () => {
    if (!trackingNumber.trim() || !trackingLink.trim()) return;

    setIsSubmitting(true);
    await onUpdateTracking(order.id, trackingNumber, trackingLink);
    setIsSubmitting(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-medium text-gray-900">Tracking Information</h4>

      {!isEditing && hasTrackingData ? (
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-mono text-gray-900 font-medium">
                  {order.trackingNumber}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div>
                <p className="text-sm text-gray-600">Tracking Link</p>
                <p className="text-gray-900 font-medium break-all">
                  {order.trackingLink}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 p-1"
                title="Edit tracking information"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onMarkComplete(order.id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Mark as Completed
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tracking Link
              </label>
              <input
                type="url"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                placeholder="Enter tracking link (https://...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={
                !trackingNumber.trim() || !trackingLink.trim() || isSubmitting
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {isSubmitting
                ? "Saving..."
                : hasTrackingData
                ? "Update"
                : "Submit"}
            </button>
            {hasTrackingData && (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setTrackingNumber(order.trackingNumber);
                  setTrackingLink(order.trackingLink);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    state: "",
    startDate: "",
    endDate: "",
  });

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const fetchedOrders = await fetchAllOrders();

    // Separate orders by status
    const activeOrdersList = fetchedOrders.filter(
      (order) => !["delivered", "cancelled"].includes(order.status)
    );
    const completedOrdersList = fetchedOrders.filter(
      (order) => order.status === "delivered"
    );
    const cancelledOrdersList = fetchedOrders.filter(
      (order) => order.status === "cancelled"
    );

    setOrders(activeOrdersList);
    setCompletedOrders(completedOrdersList);
    setCancelledOrders(cancelledOrdersList);
    setLoading(false);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-purple-100 text-purple-800 border-purple-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const statusIcons = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: XCircle,
  };

  const updateTrackingNumber = async (
    orderId,
    trackingNumber,
    trackingLink
  ) => {
    const success = await updateTrackingAPI(
      orderId,
      trackingNumber,
      trackingLink
    );
    if (success) {
      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, trackingNumber, trackingLink, status: "shipped" }
            : order
        )
      );
    }
  };

  const completeOrder = async (orderId) => {
    const orderToComplete = orders.find((order) => order.id === orderId);
    if (orderToComplete) {
      const success = await completeOrderAPI(orderToComplete.id);
      if (success) {
        const completedOrder = {
          ...orderToComplete,
          status: "delivered",
          completedDate: new Date(),
        };
        setCompletedOrders([completedOrder, ...completedOrders]);
        setOrders(orders.filter((order) => order.id !== orderToComplete.id));
      }
    }
  };

  const cancelOrder = async (reason) => {
    if (orderToCancel) {
      const success = await cancelOrderAPI(orderToCancel.id, reason);
      if (success) {
        const cancelledOrder = {
          ...orderToCancel,
          status: "cancelled",
          cancelledDate: new Date(),
          cancellationReason: reason,
        };
        setCancelledOrders([cancelledOrder, ...cancelledOrders]);
        setOrders(orders.filter((order) => order.id !== orderToCancel.id));
      }
    }
  };

  const handleCancelClick = (order) => {
    setOrderToCancel(order);
    setCancelModalOpen(true);
  };

  const activeOrders = useMemo(() => {
    return orders;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return activeOrders.filter((order) => {
      const matchesSearch =
        !filters.search ||
        order.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.id
          .toString()
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      const matchesStatus = !filters.status || order.status === filters.status;
      const matchesState =
        !filters.state || order.address?.state === filters.state;

      const matchesDateRange =
        (!filters.startDate || order.date >= new Date(filters.startDate)) &&
        (!filters.endDate || order.date <= new Date(filters.endDate));

      return matchesSearch && matchesStatus && matchesState && matchesDateRange;
    });
  }, [activeOrders, filters]);

  const totalPages = Math.ceil(filteredOrders.length / 10);
  const uniqueStates = [
    ...new Set(
      [...orders, ...completedOrders, ...cancelledOrders]
        .map((order) => order.address?.state)
        .filter((state) => state)
    ),
  ].sort();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#003554] mb-2">
            Order Management
          </h1>
          <p className="text-gray-600">
            Manage and track all your orders in one place
          </p>
        </div>

        {/* Active Orders Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#003554] mb-6">
            Active Orders
          </h2>

          {/* Filters Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
              </select>

              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.state}
                onChange={(e) =>
                  setFilters({ ...filters, state: e.target.value })
                }
              >
                <option value="">All States</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>

              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredOrders.length} of {activeOrders.length} active
                orders
              </p>
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="col-span-2 text-center py-8">No orders found</div>
            ) : (
              filteredOrders.map((order) => {
                const StatusIcon = statusIcons[order.status];
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {order.id}
                        </h3>
                        <p className="text-sm text-gray-500">
                          <Calendar className="inline h-4 w-4 mr-1" />
                          {order.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[order.status]
                          }`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span> */}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {order.customer || "Customer"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {order.phone}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div className="text-sm text-gray-600">
                            <div>{order.address.street}</div>
                            <div>
                              {order.address.city}, {order.address.state}{" "}
                              {order.address.zip}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Items Ordered:
                      </h4>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600">
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total:</span>
                          <span>${order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleCancelClick(order)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Cancel Order
                      </button>
                    </div>

                    {/* Tracking Section */}
                    <TrackingInput
                      order={order}
                      onUpdateTracking={updateTrackingNumber}
                      onMarkComplete={completeOrder}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed Orders Section */}
        <div className="border-t border-gray-200 pt-12 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Completed Orders
            </h2>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
              {completedOrders.length}
            </span>
          </div>

          {completedOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Completed Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {completedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.completedDate?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No completed orders yet
              </h3>
              <p className="text-gray-500">
                Completed orders will appear here once you mark them as
                complete.
              </p>
            </div>
          )}
        </div>

        {/* Cancelled Orders Section */}
        <div className="border-t border-gray-200 pt-12">
          <div className="flex items-center gap-3 mb-6">
            <XCircle className="h-6 w-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Cancelled Orders
            </h2>
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-medium">
              {cancelledOrders.length}
            </span>
          </div>

          {cancelledOrders.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-red-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Cancelled Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cancelledOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.cancelledDate?.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm text-gray-500 max-w-xs truncate"
                            title={order.cancellationReason}
                          >
                            {order.cancellationReason}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No cancelled orders
              </h3>
              <p className="text-gray-500">
                Cancelled orders will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onConfirm={cancelOrder}
        orderIds={orderToCancel?.id}
      />
    </div>
  );
};

export default OrderManagement;
