import React, { useState, useMemo } from 'react';
import { Search, Filter, Package, Truck, CheckCircle, Clock, XCircle, Calendar, MapPin, User, Mail, Phone, Archive } from 'lucide-react';

// Mock data generator
const generateMockOrders = () => {
    const statuses = ['pending', 'processing', 'shipped', 'cancelled'];
    const states = ['California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
    const customers = [
        'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
        'Jessica Garcia', 'Christopher Martinez', 'Amanda Anderson', 'Matthew Taylor', 'Ashley Thomas'
    ];
    const items = [
        { name: 'Wireless Headphones', price: 129.99 },
        { name: 'Smartphone Case', price: 29.99 },
        { name: 'Laptop Stand', price: 89.99 },
        { name: 'USB-C Cable', price: 19.99 },
        { name: 'Bluetooth Speaker', price: 79.99 },
        { name: 'Wireless Mouse', price: 49.99 },
        { name: 'Keyboard', price: 159.99 },
        { name: 'Monitor', price: 299.99 }
    ];

    return Array.from({ length: 50 }, (_, i) => {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const state = states[Math.floor(Math.random() * states.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const orderDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        const numItems = Math.floor(Math.random() * 4) + 1;
        const orderItems = Array.from({ length: numItems }, () => {
            const item = items[Math.floor(Math.random() * items.length)];
            return {
                ...item,
                quantity: Math.floor(Math.random() * 3) + 1
            };
        });

        return {
            id: `ORD-${(1000 + i).toString()}`,
            customer: customer,
            email: `${customer.toLowerCase().replace(' ', '.')}@email.com`,
            phone: `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
            address: {
                street: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Park Blvd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}`,
                city: ['Los Angeles', 'Houston', 'New York', 'Miami', 'Chicago'][Math.floor(Math.random() * 5)],
                state: state,
                zip: `${Math.floor(Math.random() * 90000) + 10000}`
            },
            date: orderDate,
            status: status,
            items: orderItems,
            total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
    });
};

const OrderManagement = () => {
    const [orders, setOrders] = useState(generateMockOrders());
    const [completedOrders, setCompletedOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [completedCurrentPage, setCompletedCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        state: '',
        startDate: '',
        endDate: ''
    });
    const [completedFilters, setCompletedFilters] = useState({
        search: '',
        state: '',
        startDate: '',
        endDate: ''
    });
    const ordersPerPage = 6;

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        processing: 'bg-blue-100 text-blue-800 border-blue-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200'
    };

    const statusIcons = {
        pending: Clock,
        processing: Package,
        shipped: Truck,
        delivered: CheckCircle,
        cancelled: XCircle
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const completeOrder = (orderId) => {
        const orderToComplete = orders.find(order => order.id === orderId);
        if (orderToComplete) {
            const completedOrder = {
                ...orderToComplete,
                status: 'delivered',
                completedDate: new Date()
            };
            setCompletedOrders([completedOrder, ...completedOrders]);
            setOrders(orders.filter(order => order.id !== orderId));
        }
    };

    const activeOrders = useMemo(() => {
        return orders.filter(order => order.status !== 'delivered');
    }, [orders]);

    const filteredOrders = useMemo(() => {
        return activeOrders.filter(order => {
            const matchesSearch = !filters.search ||
                order.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.id.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus = !filters.status || order.status === filters.status;
            const matchesState = !filters.state || order.address.state === filters.state;

            const matchesDateRange = (!filters.startDate || order.date >= new Date(filters.startDate)) &&
                (!filters.endDate || order.date <= new Date(filters.endDate));

            return matchesSearch && matchesStatus && matchesState && matchesDateRange;
        });
    }, [activeOrders, filters]);

    const filteredCompletedOrders = useMemo(() => {
        return completedOrders.filter(order => {
            const matchesSearch = !completedFilters.search ||
                order.customer.toLowerCase().includes(completedFilters.search.toLowerCase()) ||
                order.id.toLowerCase().includes(completedFilters.search.toLowerCase());

            const matchesState = !completedFilters.state || order.address.state === completedFilters.state;

            const matchesDateRange = (!completedFilters.startDate || order.completedDate >= new Date(completedFilters.startDate)) &&
                (!completedFilters.endDate || order.completedDate <= new Date(completedFilters.endDate));

            return matchesSearch && matchesState && matchesDateRange;
        });
    }, [completedOrders, completedFilters]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * ordersPerPage;
        return filteredOrders.slice(startIndex, startIndex + ordersPerPage);
    }, [filteredOrders, currentPage]);

    const paginatedCompletedOrders = useMemo(() => {
        const startIndex = (completedCurrentPage - 1) * ordersPerPage;
        return filteredCompletedOrders.slice(startIndex, startIndex + ordersPerPage);
    }, [filteredCompletedOrders, completedCurrentPage]);

    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    const totalCompletedPages = Math.ceil(filteredCompletedOrders.length / ordersPerPage);

    const uniqueStates = [...new Set([...orders, ...completedOrders].map(order => order.address.state))].sort();

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
                    <p className="text-gray-600">Manage and track all your orders in one place</p>
                </div>

                {/* Active Orders Section */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Orders</h2>

                    {/* Filters Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.search}
                                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                />
                            </div>

                            {/* Status Filter */}
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            >
                                <option value="">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            {/* State Filter */}
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.state}
                                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                            >
                                <option value="">All States</option>
                                {uniqueStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            {/* Date Range */}
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.startDate}
                                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                                placeholder="Start Date"
                            />

                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filters.endDate}
                                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                                placeholder="End Date"
                            />
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Showing {filteredOrders.length} of {activeOrders.length} active orders
                            </p>
                        </div>
                    </div>

                    {/* Orders Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {paginatedOrders.map((order) => {
                            const StatusIcon = statusIcons[order.status];
                            return (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                                            <p className="text-sm text-gray-500">
                                                <Calendar className="inline h-4 w-4 mr-1" />
                                                {order.date.toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                                                <StatusIcon className="h-3 w-3" />
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{order.customer}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{order.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">{order.phone}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                                <div className="text-sm text-gray-600">
                                                    <div>{order.address.street}</div>
                                                    <div>{order.address.city}, {order.address.state} {order.address.zip}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Items Ordered:</h4>
                                        <div className="space-y-1">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-600">{item.name} × {item.quantity}</span>
                                                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
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

                                    {/* Status Update */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Update Status:
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                            {order.status === 'shipped' && (
                                                <button
                                                    onClick={() => completeOrder(order.id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination for Active Orders */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mb-12">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-4 py-2 border rounded-lg ${currentPage === page
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Completed Orders Section */}
                <div className="border-t border-gray-200 pt-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Archive className="h-6 w-6 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Completed Orders</h2>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                            {completedOrders.length}
                        </span>
                    </div>

                    {/* Completed Orders Filters */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search completed orders..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    value={completedFilters.search}
                                    onChange={(e) => setCompletedFilters({ ...completedFilters, search: e.target.value })}
                                />
                            </div>

                            {/* State Filter */}
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={completedFilters.state}
                                onChange={(e) => setCompletedFilters({ ...completedFilters, state: e.target.value })}
                            >
                                <option value="">All States</option>
                                {uniqueStates.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>

                            {/* Date Range */}
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={completedFilters.startDate}
                                onChange={(e) => setCompletedFilters({ ...completedFilters, startDate: e.target.value })}
                                placeholder="Start Date"
                            />

                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                value={completedFilters.endDate}
                                onChange={(e) => setCompletedFilters({ ...completedFilters, endDate: e.target.value })}
                                placeholder="End Date"
                            />
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Showing {filteredCompletedOrders.length} of {completedOrders.length} completed orders
                            </p>
                        </div>
                    </div>

                    {/* Completed Orders Table */}
                    {completedOrders.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-green-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedCompletedOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                                        <span className="text-sm font-medium text-gray-900">{order.id}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{order.customer}</div>
                                                    <div className="text-sm text-gray-500">{order.address.city}, {order.address.state}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.date.toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {order.completedDate.toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ${order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">
                                                        {order.items.map((item, index) => (
                                                            <div key={index} className="truncate">
                                                                {item.name} × {item.quantity}
                                                            </div>
                                                        ))}
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
                            <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No completed orders yet</h3>
                            <p className="text-gray-500">Completed orders will appear here once you mark shipped orders as complete.</p>
                        </div>
                    )}

                    {/* Pagination for Completed Orders */}
                    {totalCompletedPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                onClick={() => setCompletedCurrentPage(Math.max(1, completedCurrentPage - 1))}
                                disabled={completedCurrentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>

                            {Array.from({ length: totalCompletedPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCompletedCurrentPage(page)}
                                    className={`px-4 py-2 border rounded-lg ${completedCurrentPage === page
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                onClick={() => setCompletedCurrentPage(Math.min(totalCompletedPages, completedCurrentPage + 1))}
                                disabled={completedCurrentPage === totalCompletedPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderManagement;