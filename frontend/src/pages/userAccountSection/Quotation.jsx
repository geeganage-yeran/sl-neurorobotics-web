import React, { useState } from 'react';
import { Download } from 'lucide-react';

function Quotation() {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const quotations = [
        {
            id: 'Q001',
            date: '12/03/2024',
            client: 'Tech Solutions Ltd',
            amount: '$15,240.00',
            status: 'Pending'
        },
        {
            id: 'Q002',
            date: '11/03/2024',
            client: 'Innovation Corp',
            amount: '$8,950.00',
            status: 'Approved'
        },
        {
            id: 'Q003',
            date: '10/03/2024',
            client: 'Future Systems',
            amount: '$22,680.00',
            status: 'Draft'
        },
        {
            id: 'Q004',
            date: '09/03/2024',
            client: 'Digital Dynamics',
            amount: '$12,340.00',
            status: 'Rejected'
        },
        {
            id: 'Q005',
            date: '08/03/2024',
            client: 'Smart Industries',
            amount: '$18,750.00',
            status: 'Approved'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Draft': return 'bg-gray-100 text-gray-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDownload = (quotationId) => {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `quotation-${quotationId}.pdf`;
        link.click();
        alert(`Downloading quotation ${quotationId}...`);
    };

    const exportAllQuotations = () => {
        alert('Exporting all quotations...');
    };

    return (
        <div className="min-h-screen lg:ml-18 bg-[#F5F5F5]">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <div className="flex-1">
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotations</h1>
                                    <p className="text-gray-600">Manage and track your quotations</p>
                                </div>
                                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={exportAllQuotations}
                                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        <span>Export All</span>
                                    </button>
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        New Quotation
                                    </button>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-gray-900">5</div>
                                    <div className="text-sm text-gray-600">Total Quotations</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-green-600">2</div>
                                    <div className="text-sm text-gray-600">Approved</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-yellow-600">1</div>
                                    <div className="text-sm text-gray-600">Pending</div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border">
                                    <div className="text-2xl font-bold text-gray-900">$77,960</div>
                                    <div className="text-sm text-gray-600">Total Value</div>
                                </div>
                            </div>

                            {/* Quotations Table */}
                            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Recent Quotations</h2>
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {quotations.map((quote) => (
                                                <tr key={quote.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.id}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{quote.date}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quote.client}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{quote.amount}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                                                            {quote.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button
                                                            onClick={() => handleDownload(quote.id)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                            <span>Download</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Cards */}
                                <div className="md:hidden">
                                    {quotations.map((quote) => (
                                        <div key={quote.id} className="p-4 border-b border-gray-200 last:border-b-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="font-medium text-gray-900">{quote.id}</div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                                                    {quote.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 mb-1">{quote.client}</div>
                                            <div className="text-sm text-gray-500 mb-2">{quote.date}</div>
                                            <div className="flex justify-between items-center">
                                                <div className="font-medium text-gray-900">{quote.amount}</div>
                                                <button
                                                    onClick={() => handleDownload(quote.id)}
                                                    className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    <span>Download</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Quotation