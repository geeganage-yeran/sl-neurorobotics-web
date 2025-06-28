import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SButton from "../../components/SecondaryButton";
import Alert from "../../components/Alert";
import ConfirmDialog from "../../components/confirmDialog";
import {
  validateFAQForm,
  sanitizeFAQFormData,
  hasFieldError,
  hasFAQErrors,
  validateFAQDuplication,
  validateFAQQuestion,
  validateFAQAnswer,
} from "../../utils/FAQValidation";
import api from "../../services/api";

function FQApage({ user }) {
  const [faqs, setFaqs] = useState([]);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedPreview, setExpandedPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    faqToDelete: null,
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
    position: "top-right",
  });

  {
    /* Handling alerts section */
  }
  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const hasFetched = useRef(false);

  const [newFAQ, setNewFAQ] = useState({
    question: "",
    answer: "",
  });

  useEffect(() => {
    if (hasFetched.current) return;
    fetchAllFAQs();
    hasFetched.current = true;
  }, []);

  const fetchAllFAQs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/getFaq`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        setFaqs(response.data);
      } else {
        setFaqs([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewFAQChange = (e) => {
    const { name, value } = e.target;
    setNewFAQ((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleEditFAQChange = (e) => {
    const { name, value } = e.target;
    setEditingFAQ((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (fieldName, isEditing = false) => {
    const currentData = isEditing ? editingFAQ : newFAQ;

    let fieldError = "";
    if (fieldName === "question") {
      fieldError = validateFAQQuestion(currentData.question);
      if (!fieldError) {
        const duplicateError = validateFAQDuplication(
          currentData.question,
          faqs,
          isEditing ? editingFAQ.id : null
        );
        if (duplicateError) fieldError = duplicateError;
      }
    } else if (fieldName === "answer") {
      fieldError = validateFAQAnswer(currentData.answer);
    }

    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  };

  const handleCreateFAQ = async () => {
    const sanitizedData = sanitizeFAQFormData(newFAQ);
    const validationErrors = validateFAQForm(sanitizedData);

    const duplicateError = validateFAQDuplication(sanitizedData.question, faqs);
    if (duplicateError) {
      validationErrors.question = duplicateError;
    }

    if (hasFAQErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...sanitizedData,
        createdBy: user.id,
      };
      const response = await api.post(`/admin/addFaq`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        showAlert(
          "FAQ added to the system successfully",
          "success",
          "top-right"
        );
      } else {
        showAlert(
          "Unexpected error occur please try again",
          "error",
          "top-right"
        );
      }

      // Reset form
      setNewFAQ({ question: "", answer: "" });
      setErrors({});
      setIsCreating(false);
      fetchAllFAQs();

      console.log("FAQ created successfully");
    } catch (error) {
      console.error("Error creating FAQ:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return;

    const sanitizedData = sanitizeFAQFormData(editingFAQ);
    const validationErrors = validateFAQForm(sanitizedData);

    const duplicateError = validateFAQDuplication(
      sanitizedData.question,
      faqs,
      editingFAQ.id
    );
    if (duplicateError) {
      validationErrors.question = duplicateError;
    }

    if (hasFAQErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const FaqUpdateToSend = {
        ...sanitizedData,
        createdBy: user.id,
      };
      const response = await api.put(
        `/admin/updateFaq/${editingFAQ.id}`,
        FaqUpdateToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        showAlert("Successfully updated");
      } else {
        showAlert("Failed to update", "error");
      }

      // Update FAQ in local state
      setFaqs((prevFaqs) =>
        prevFaqs.map((faq) => (faq.id === editingFAQ.id ? response.data : faq))
      );

      setEditingFAQ(null);
      setErrors({});
    } catch (error) {
      console.error("Error updating FAQ:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  // Updated delete function to open confirmation dialog
  const handleDeleteFAQ = (faq) => {
    setConfirmDialog({
      isOpen: true,
      faqToDelete: faq,
    });
  };

  // Function to handle the actual deletion after confirmation
  const confirmDeleteFAQ = async () => {
    if (!confirmDialog.faqToDelete) return;

    setLoading(true);
    try {
      await api.delete(`/admin/deleteFaq/${confirmDialog.faqToDelete.id}`, {
        withCredentials: true,
      });

      // Remove FAQ from local state
      setFaqs((prevFaqs) =>
        prevFaqs.filter((faq) => faq.id !== confirmDialog.faqToDelete.id)
      );

      showAlert("FAQ deleted successfully", "success", "top-right");
      console.log("FAQ deleted successfully");
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      showAlert("Error deleting FAQ. Please try again.", "error", "top-right");
    } finally {
      setLoading(false);
    }
  };

  // Function to close the confirmation dialog
  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      faqToDelete: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
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
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Add New FAQ Button */}
        <SButton
          text="Add New FAQ"
          icon={<Plus className="h-5 w-5 mr-2" />}
          onClick={() => setIsCreating(true)}
          py="py-3"
          className="mb-4"
          disabled={loading}
        />

        {/* Create New FAQ Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-gray-500/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#003554]">
                  Create New FAQ
                </h2>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setErrors({});
                    setNewFAQ({ question: "", answer: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={newFAQ.question}
                    onChange={handleNewFAQChange}
                    onBlur={() => handleBlur("question")}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554] ${
                      hasFieldError(errors, "question")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter the question..."
                    disabled={loading}
                  />
                  {hasFieldError(errors, "question") && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.question}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer *
                  </label>
                  <textarea
                    name="answer"
                    value={newFAQ.answer}
                    onChange={handleNewFAQChange}
                    onBlur={() => handleBlur("answer")}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554] ${
                      hasFieldError(errors, "answer")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter the answer..."
                    disabled={loading}
                  />
                  {hasFieldError(errors, "answer") && (
                    <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setErrors({});
                    setNewFAQ({ question: "", answer: "" });
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFAQ}
                  disabled={loading}
                  className="px-4 py-2 bg-[#006494] text-white rounded-lg hover:bg-[#003554] disabled:opacity-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create FAQ"}
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
                <h2 className="text-xl font-bold text-[#003554]">Edit FAQ</h2>
                <button
                  onClick={() => {
                    setEditingFAQ(null);
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question *
                  </label>
                  <input
                    type="text"
                    name="question"
                    value={editingFAQ.question}
                    onChange={handleEditFAQChange}
                    onBlur={() => handleBlur("question", true)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554] ${
                      hasFieldError(errors, "question")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {hasFieldError(errors, "question") && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.question}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Answer *
                  </label>
                  <textarea
                    name="answer"
                    value={editingFAQ.answer}
                    onChange={handleEditFAQChange}
                    onBlur={() => handleBlur("answer", true)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554] ${
                      hasFieldError(errors, "answer")
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                  {hasFieldError(errors, "answer") && (
                    <p className="mt-1 text-sm text-red-600">{errors.answer}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditingFAQ(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFAQ}
                  disabled={loading}
                  className="px-4 py-2 bg-[#006494] text-white rounded-lg hover:bg-[#003554] disabled:opacity-50 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Updating..." : "Update FAQ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ List */}
        <div className="space-y-4">
          {loading && faqs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <p className="text-gray-600">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No FAQs found
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first FAQ to get started.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="bg-[#006494] text-white px-4 py-2 rounded-lg hover:bg-[#003554] transition-colors duration-200"
              >
                Create your first FAQ
              </button>
            </div>
          ) : (
            faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h3>

                      {faq.createdAt && (
                        <div className="text-sm text-gray-600 mb-3">
                          <p>
                            Created:{" "}
                            {new Date(faq.createdAt).toLocaleDateString()}
                            {faq.updatedAt &&
                              faq.updatedAt !== faq.createdAt &&
                              ` | Updated: ${new Date(
                                faq.updatedAt
                              ).toLocaleDateString()}`}
                          </p>
                        </div>
                      )}

                      {/* Preview Toggle */}
                      <button
                        onClick={() =>
                          setExpandedPreview(
                            expandedPreview === faq.id ? null : faq.id
                          )
                        }
                        className="text-[#006494] hover:text-[#003554] text-sm font-medium flex items-center"
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
                        className="p-2 text-gray-600 hover:text-[#006494] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit FAQ"
                        disabled={loading}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete FAQ"
                        disabled={loading}
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

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        title="Delete FAQ"
        message={
          confirmDialog.faqToDelete
            ? `Are you sure you want to delete the FAQ: "${confirmDialog.faqToDelete.question}"? This action cannot be undone.`
            : "Are you sure you want to delete this FAQ? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteFAQ}
        confirmButtonClass="bg-red-600 hover:bg-red-500"
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
  );
}

export default FQApage;
