import React, { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const QuotationManagement = () => {
    // Dummy data
    const [quotations, setQuotations] = useState([
        {
            id: 1,
            clientName: 'John Smith',
            clientEmail: 'john.smith@email.com',
            requestedDate: '2024-01-15',
            status: 'Pending'
        },
        {
            id: 3,
            clientName: 'Michael Brown',
            clientEmail: 'michael.brown@business.com',
            requestedDate: '2024-01-20',
            status: 'Under Review'
        },
        {
            id: 4,
            clientName: 'Emily Davis',
            clientEmail: 'emily.davis@corp.com',
            requestedDate: '2024-01-22',
            status: 'Rejected'
        },
        {
            id: 5,
            clientName: 'David Wilson',
            clientEmail: 'david.wilson@enterprise.com',
            requestedDate: '2024-01-25',
            status: 'Pending'
        },
        {
            id: 6,
            clientName: 'Lisa Anderson',
            clientEmail: 'lisa.anderson@solutions.com',
            requestedDate: '2024-01-28',
            status: 'Approved'
        },
        {
            id: 7,
            clientName: 'James Taylor',
            clientEmail: 'james.taylor@tech.com',
            requestedDate: '2024-02-01',
            status: 'Under Review'
        },
        {
            id: 8,
            clientName: 'Maria Garcia',
            clientEmail: 'maria.garcia@consulting.com',
            requestedDate: '2024-02-03',
            status: 'Pending'
        },
        {
            id: 9,
            clientName: 'Robert Miller',
            clientEmail: 'robert.miller@services.com',
            requestedDate: '2024-02-05',
            status: 'Approved'
        },
        {
            id: 10,
            clientName: 'Jennifer Lee',
            clientEmail: 'jennifer.lee@group.com',
            requestedDate: '2024-02-08',
            status: 'Rejected'
        },
        {
            id: 11,
            clientName: 'Christopher White',
            clientEmail: 'chris.white@innovations.com',
            requestedDate: '2024-02-10',
            status: 'Under Review'
        },
        {
            id: 12,
            clientName: 'Amanda Clark',
            clientEmail: 'amanda.clark@digital.com',
            requestedDate: '2024-02-12',
            status: 'Pending'
        },
        {
            id: 13,
            clientName: 'Kevin Rodriguez',
            clientEmail: 'kevin.rodriguez@ventures.com',
            requestedDate: '2024-02-15',
            status: 'Approved'
        },
        {
            id: 14,
            clientName: 'Michelle Thompson',
            clientEmail: 'michelle.thompson@systems.com',
            requestedDate: '2024-02-18',
            status: 'Under Review'
        },
        {
            id: 15,
            clientName: 'Daniel Martinez',
            clientEmail: 'daniel.martinez@partners.com',
            requestedDate: '2024-02-20',
            status: 'Rejected'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const statusColors = {
        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
        'Approved': 'bg-green-100 text-green-800 border-green-200',
        'Under Review': 'bg-blue-100 text-blue-800 border-blue-200',
        'Rejected': 'bg-red-100 text-red-800 border-red-200'
    };

    const statusOptions = ['Pending', 'Approved', 'Under Review', 'Rejected'];

    // Format date from YYYY-MM-DD to DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    // Filter quotations based on search term
    const filteredQuotations = useMemo(() => {
        return quotations.filter(quotation =>
            quotation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quotation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [quotations, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentQuotations = filteredQuotations.slice(startIndex, endIndex);

    // Handle status update
    const handleStatusUpdate = (id, newStatus) => {
        setQuotations(prev => prev.map(quotation =>
            quotation.id === id ? { ...quotation, status: newStatus } : quotation
        ));
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Pagination handlers
    const goToPage = (page) => {
        setCurrentPage(page);
    };

    const goToPrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const goToNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotation Management</h1>
                    <p className="text-gray-600">Manage and track quotation requests from clients</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by client name or email..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Requested Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentQuotations.length > 0 ? (
                                    currentQuotations.map((quotation) => (
                                        <tr key={quotation.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {quotation.clientName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {quotation.clientEmail}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {formatDate(quotation.requestedDate)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={quotation.status}
                                                    onChange={(e) => handleStatusUpdate(quotation.id, e.target.value)}
                                                    className={`text-sm font-medium rounded-full px-3 py-1 border-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${statusColors[quotation.status]} cursor-pointer`}
                                                >
                                                    {statusOptions.map(status => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            {searchTerm ? 'No quotations found matching your search.' : 'No quotations available.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredQuotations.length > 0 && (
                        <div className="bg-white px-4 py-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={goToPrevious}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={goToNext}
                                        disabled={currentPage === totalPages}
                                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing{' '}
                                            <span className="font-medium">{startIndex + 1}</span>
                                            {' '}to{' '}
                                            <span className="font-medium">
                                                {Math.min(endIndex, filteredQuotations.length)}
                                            </span>
                                            {' '}of{' '}
                                            <span className="font-medium">{filteredQuotations.length}</span>
                                            {' '}results
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                            <button
                                                onClick={goToPrevious}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>
                                            {[...Array(totalPages)].map((_, index) => {
                                                const page = index + 1;
                                                const isCurrentPage = page === currentPage;
                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${isCurrentPage
                                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}
                                            <button
                                                onClick={goToNext}
                                                disabled={currentPage === totalPages}
                                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuotationManagement;