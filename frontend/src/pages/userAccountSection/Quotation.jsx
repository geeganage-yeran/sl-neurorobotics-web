import React, { useState } from "react";
import {
  Download,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  Send,
} from "lucide-react";
import SecondaryButton from "../../components/SecondaryButton";

function Quotation() {
  const orders = [
    { id: "Q123KLI", date: "05/12/2025", status: "Sent", canDownload: true },
    {
      id: "Q123KLI",
      date: "05/12/2025",
      status: "Processing",
      canDownload: true,
    },
    {
      id: "Q123KLI",
      date: "05/12/2025",
      status: "Finalized",
      canDownload: true,
    },
    { id: "Q123KLI", date: "05/12/2025", status: "Sent", canDownload: true },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "Sent":
        return <Send className="w-4 h-4" />;
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Finalized":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Sent":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Processing":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Finalized":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen lg:ml-24.5 bg-[#F5F5F5] ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl mt-3 font-semibold text-[#003554]">
          Requested Quotations
        </h1>
        <h3 className="mb-3 text-[#5C728A]">Price Estimates</h3>
        <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#0582CA] rounded-full"></div>
                      Quotation ID
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      Date
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="hover:bg-blue-50/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8rounded-lg flex items-center justify-center transition-colors duration-300">
                          <span className="text-xs font-semibold text-gray-600 group-hover:text-[#0582CA]">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600 font-medium">
                        {order.date}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {order.status === "Finalized" ? (
                        <>
                          <SecondaryButton
                            variant="filled"
                            color="#0582CA"
                            text="Download"
                            hoverColor="#006494"
                            py="py-2"
                            px="px-6"
                            icon={
                              <Download className="w-4 mr-3 h-4 opacity-50" />
                            }
                          />
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md font-medium bg-gray-100 text-gray-500 border border-gray-200">
                          <Download className="w-4 h-4 opacity-50" />
                          Not Available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quotation;
