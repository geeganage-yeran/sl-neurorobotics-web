import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Settings,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const initialFAQs = [
  {
    id: 1,
    question: "How do I create an account?",
    answer:
      "To create an account, click the 'Sign Up' button in the top right corner of our homepage. Fill in your email address, create a secure password, and verify your email. The entire process takes less than 2 minutes.",
    category: "Account",
    status: "published",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    views: 1250,
  },
  {
    id: 2,
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and bank transfers. All payments are processed securely through our encrypted payment gateway.",
    category: "Billing",
    status: "published",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    views: 890,
  },
  {
    id: 3,
    question: "How can I reset my password?",
    answer:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a secure reset link. The link expires in 24 hours for security reasons.",
    category: "Account",
    status: "draft",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-22",
    views: 0,
  },
  {
    id: 4,
    question: "Is there a mobile app available?",
    answer:
      "Yes! Our mobile app is available for both iOS and Android devices. You can download it from the App Store or Google Play Store.",
    category: "Technical",
    status: "published",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-16",
    views: 2100,
  },
  {
    id: 5,
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 30 days.",
    category: "Billing",
    status: "archived",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-12",
    views: 450,
  },
];

const categories = ["All", "Account", "Billing", "Technical", "General"];
const statuses = ["All", "published", "draft", "archived"];

function FQApage() {
  const [faqs, setFaqs] = useState(initialFAQs);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(null);

  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
  });

  const filteredFAQs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [searchTerm, faqs]);

  const handleCreateFAQ = () => {
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      const faq = {
        id: Math.max(...faqs.map((f) => f.id)) + 1,
        ...newFAQ,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        views: 0,
      };
      setFaqs([faq, ...faqs]);
      setNewFAQ({
        question: "",
        answer: "",
        category: "General",
        status: "draft",
      });
      setIsCreating(false);
    }
  };

  const handleUpdateFAQ = () => {
    if (editingFAQ) {
      setFaqs(
        faqs.map((faq) =>
          faq.id === editingFAQ.id
            ? {
                ...editingFAQ,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : faq
        )
      );
      setEditingFAQ(null);
    }
  };

  const handleDeleteFAQ = (id) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      setFaqs(faqs.filter((faq) => faq.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div>
                <h1 className="text-4xl font-bold text-[#003554]">
                  FAQ Management
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage frequently asked questions
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New FAQ
        </button>
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredFAQs.length} of {faqs.length} FAQs
          </div>
        </div>

        {/* Create New FAQ Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New FAQ
                </h2>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) =>
                      setNewFAQ({ ...newFAQ, question: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the question..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) =>
                      setNewFAQ({ ...newFAQ, answer: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter the answer..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFAQ}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Create FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit FAQ Modal */}
        {editingFAQ && (
          <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Edit FAQ</h2>
                <button
                  onClick={() => setEditingFAQ(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={editingFAQ.question}
                    onChange={(e) =>
                      setEditingFAQ({ ...editingFAQ, question: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer
                  </label>
                  <textarea
                    value={editingFAQ.answer}
                    onChange={(e) =>
                      setEditingFAQ({ ...editingFAQ, answer: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setEditingFAQ(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFAQ}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Update FAQ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Create your first FAQ
              </button>
            </div>
          ) : (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2"></div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>

                      <div className="text-sm text-gray-600 mb-3">
                        <p>
                          Created: {faq.createdAt} | Updated: {faq.updatedAt}
                        </p>
                      </div>

                      {/* Preview Toggle */}
                      <button
                        onClick={() =>
                          setExpandedPreview(
                            expandedPreview === faq.id ? null : faq.id
                          )
                        }
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
                      >
                        {expandedPreview === faq.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Show Answer
                          </>
                        )}
                      </button>

                      {expandedPreview === faq.id && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setEditingFAQ(faq)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit FAQ"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete FAQ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FQApage;
