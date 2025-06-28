import React, { useState, useEffect } from "react";
import { Plus, Home, X, Trash2 } from "lucide-react";
import api from "../../services/api";
import Alert from "../../components/Alert";
import ConfirmDialog from "../../components/confirmDialog";

// Validation utility functions
const validateAddress = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name?.trim()) {
    errors.name = "Full name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
    errors.name = "Name can only contain letters and spaces";
  }

  // Street address validation
  if (!formData.streetAddress?.trim()) {
    errors.streetAddress = "Street address is required";
  } else if (formData.streetAddress.trim().length < 5) {
    errors.streetAddress = "Street address must be at least 5 characters";
  }

  // City validation
  if (!formData.city?.trim()) {
    errors.city = "City is required";
  } else if (formData.city.trim().length < 2) {
    errors.city = "City must be at least 2 characters";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.city.trim())) {
    errors.city = "City can only contain letters and spaces";
  }

  // State validation
  if (!formData.state?.trim()) {
    errors.state = "State is required";
  } else if (!/^[A-Z]/.test(formData.state.trim().toUpperCase())) {
    errors.state = "State must be 2 letters (e.g., CA)";
  }

  // ZIP code validation
  if (!formData.zipCode?.trim()) {
    errors.zipCode = "ZIP code is required";
  } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode.trim())) {
    errors.zipCode =
      "ZIP code must be 5 digits or 5-4 format (e.g., 12345 or 12345-6789)";
  }

  return errors;
};

// Sanitization utility
const sanitizeFormData = (formData) => {
  return {
    name: formData.name?.trim() || "",
    streetAddress: formData.streetAddress?.trim() || "",
    city: formData.city?.trim() || "",
    state: formData.state?.trim().toUpperCase() || "",
    zipCode: formData.zipCode?.trim() || "",
    isDefault: formData.isDefault || false,
  };
};

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Shipping({ user }) {
  const [addresses, setAddresses] = useState([]);
  const [isNewAddressOpen, setIsNewAddressOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    addressToDelete: null,
  });

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

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      addressToDelete: null,
    });
  };

  // Fetch addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      if (user) {
        const response = await api.get("/user/getAddress");
        console.log(response.data);
        setAddresses(response.data);
      } else {
        // Mock data for demo when user is not available
        const mockAddresses = [
          {
            id: 1,
            name: "Sophia Clark",
            streetAddress: "123 Maple Street",
            city: "Anytown",
            state: "CA",
            zipCode: "91234",
            isDefault: true,
          },
          {
            id: 2,
            name: "Liam Carter",
            streetAddress: "456 Oak Avenue",
            city: "Anytown",
            state: "CA",
            zipCode: "91234",
            isDefault: false,
          },
        ];
        setAddresses(mockAddresses);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      showAlert("Failed to fetch addresses", "error");
    } finally {
      setLoading(false);
    }
  };

  const addNewAddress = async (addressData) => {
    try {
      if (user) {
        const dataToSend = {
          ...addressData,
          createdBy: user.id,
        };
        const response = await api.post(`/user/addAddress`, dataToSend, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        
        if (response.status === 200 || response.status === 201) {
          showAlert("Shipping address added successfully");
          await fetchAddresses();
        } else {
          showAlert("Unexpected error occurred, please try again", "error");
        }
      } else {
        // Mock response for demo
        const newAddress = {
          id: Date.now(),
          ...addressData,
        };
        setAddresses((prev) => [...prev, newAddress]);
        showAlert("Shipping address added successfully");
      }
    } catch (error) {
      console.error("Error adding address:", error);
      showAlert("Failed to add address", "error");
    }
  };

  const updateAddress = async (addressId, addressData) => {
    try {
      if (user) {
        const response = await api.put(`/user/updateAddress/${addressId}`, addressData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        
        if (response.status === 200) {
          showAlert("Address updated successfully");
          await fetchAddresses();
          return response.data;
        } else {
          showAlert("Failed to update address", "error");
        }
      } else {
        // Mock update for demo
        setAddresses((prev) =>
          prev.map((addr) =>
            addr.id === addressId ? { ...addr, ...addressData } : addr
          )
        );
        showAlert("Address updated successfully");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      showAlert("Failed to update address", "error");
    }
  };

  const deleteAddress = async () => {
    if (!confirmDialog.addressToDelete) return;
    
    setLoading(true);
    try {
      if (user) {
        const response = await api.delete(
          `/user/deleteAddress/${confirmDialog.addressToDelete}`
        );
        
        if (response.status === 200) {
          showAlert("Address deleted successfully");
          await fetchAddresses();
        } else {
          showAlert("Failed to delete address", "error");
        }
      } else {
        // Mock delete for demo
        setAddresses((prev) => prev.filter((addr) => addr.id !== confirmDialog.addressToDelete));
        showAlert("Address deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      showAlert("Failed to delete address", "error");
    } finally {
      setLoading(false);
      closeConfirmDialog();
    }
  };

  const handleEditClick = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (addressId) => {
    setConfirmDialog({ isOpen: true, addressToDelete: addressId });
  };

  const closeModals = () => {
    setIsNewAddressOpen(false);
    setIsEditModalOpen(false);
    setEditingAddress(null);
  };

  const AddressModal = ({
    isEdit = false,
    address = null,
    isOpen,
    onClose,
    title,
  }) => {
    const [formData, setFormData] = useState({
      name: address?.name || "",
      streetAddress: address?.streetAddress || "",
      city: address?.city || "",
      state: address?.state || "",
      zipCode: address?.zipCode || "",
      isDefault: address?.isDefault || false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form data when address changes
    useEffect(() => {
      if (isOpen) {
        setFormData({
          name: address?.name || "",
          streetAddress: address?.streetAddress || "",
          city: address?.city || "",
          state: address?.state || "",
          zipCode: address?.zipCode || "",
          isDefault: address?.isDefault || false,
        });
        setErrors({});
      }
    }, [address, isOpen]);

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Real-time validation
      const tempFormData = { ...formData, [field]: value };
      const sanitizedData = sanitizeFormData(tempFormData);
      const fieldErrors = validateAddress(sanitizedData);

      if (fieldErrors[field]) {
        setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
      } else {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const sanitizedData = sanitizeFormData(formData);
      const validationErrors = validateAddress(sanitizedData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        if (isEdit) {
          await updateAddress(address.id, sanitizedData);
        } else {
          await addNewAddress(sanitizedData);
        }
        
        onClose();
        // Reset form
        setFormData({
          name: "",
          streetAddress: "",
          city: "",
          state: "",
          zipCode: "",
          isDefault: false,
        });
        setErrors({});
      } catch (error) {
        console.error("Error saving address:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              value={formData.streetAddress}
              onChange={(e) =>
                handleInputChange("streetAddress", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                errors.streetAddress ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter street address"
            />
            {errors.streetAddress && (
              <p className="mt-1 text-sm text-red-600">
                {errors.streetAddress}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter city"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                  errors.state ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CA"
                maxLength="10"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code *
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#003554] focus:border-transparent ${
                errors.zipCode ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="12345"
            />
            {errors.zipCode && (
              <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="setDefault"
              checked={formData.isDefault}
              onChange={(e) =>
                handleInputChange("isDefault", e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="setDefault"
              className="ml-2 block text-sm text-gray-700"
            >
              Set as default address
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 cursor-pointer py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-[#003554] cursor-pointer text-white rounded-md hover:bg-[#002744] transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Update Address"
                : "Save Address"}
            </button>
          </div>
        </form>
      </Modal>
    );
  };

  return (
    <div className="max-w-4xl lg:ml-25 mx-auto bg-[#F5F5F5] min-h-screen">
      <div className="mb-2 mt-2">
        <h1 className="text-2xl font-semibold text-[#003554]">Saved Address</h1>
        <h3 className="text-gray-600">Manage your shipping addresses</h3>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* New Address Button */}
        <button
          onClick={() => setIsNewAddressOpen(true)}
          className="flex items-center gap-2 px-3 py-1 border border-[#003554] text-[#003554] rounded-md hover:bg-[#bac1c54e] cursor-pointer transition-colors mb-6"
        >
          <Plus size={16} />
          New Address
        </button>

        {/* Address List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading addresses...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No addresses found. Add your first address above.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="p-2 bg-white rounded-md shadow-sm">
                  <Home size={20} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {address.name}
                  </h3>
                  <span className="inline-block px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full mb-2">
                    {address.isDefault ? "Default" : "Not Default"}
                  </span>
                  <p className="text-gray-600">
                    {`${address.streetAddress}, ${address.city}, ${address.state} ${address.zipCode}`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(address)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(address.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Address Modal */}
      <AddressModal
        isOpen={isNewAddressOpen}
        onClose={closeModals}
        isEdit={false}
        title="Add New Address"
      />

      {/* Edit Address Modal */}
      <AddressModal
        isOpen={isEditModalOpen}
        onClose={closeModals}
        isEdit={true}
        address={editingAddress}
        title="Edit Address"
      />

      <Alert
        open={alert.open}
        onClose={closeAlert}
        message={alert.message}
        type={alert.type}
        position={alert.position}
        autoHideDuration={3000}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        title="Delete Shipping address"
        message={"Are you sure you want to delete the Shipping address?"}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteAddress}
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />
    </div>
  );
}