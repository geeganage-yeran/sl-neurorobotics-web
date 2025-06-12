import React, { useState } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import SecondaryButton from "../../components/SecondaryButton";
import DeleteModal from "../../components/confirmDialog";

function Settings() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDeleteAccount = () => {
    console.log("Account deleted!");
  };

  const defaultFormData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    contact: "+1 234567890",
    country: "USA",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetFrom = () => {
    setFormData(defaultFormData);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen lg:ml-18 bg-[#F5F5F5]">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-semibold mt-3 text-[#003554]">
              Settings
            </h1>
            <h3 className="mb-3 text-[#5C728A]">Account Prefferences</h3>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {/* Profile Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact
                      </label>
                      <input
                        type="tel"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>USA</option>
                        <option>Canada</option>
                        <option>UK</option>
                        <option>Australia</option>
                        <option>Germany</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <SecondaryButton
                      variant="outline"
                      bordercolor="#051923"
                      text="Cancel"
                      py="py-2"
                      px="px-6"
                      onClick={resetFrom}
                    />
                    <SecondaryButton
                      variant="filled"
                      color="#051923"
                      text="Update"
                      py="py-2"
                      px="px-6"
                    />
                  </div>
                </div>

                {/* Update Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Update your password
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Old Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.oldPassword ? "text" : "password"}
                          name="oldPassword"
                          value={formData.oldPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("oldPassword")
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.oldPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={
                            showPasswords.confirmPassword ? "text" : "password"
                          }
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.newPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <SecondaryButton
                      variant="outline"
                      bordercolor="#051923"
                      text="Cancel"
                      py="py-2"
                      px="px-6"
                    />
                    <SecondaryButton
                      variant="filled"
                      color="#051923"
                      text="Update"
                      py="py-2"
                      px="px-6"
                    />
                  </div>
                </div>

                {/* Delete Account */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delete Your Account
                  </h3>
                  <SecondaryButton
                    variant="filled"
                    color="#FF4D4D"
                    text="Deactivate Account"
                    hoverColor="#FF1A1A"
                    py="py-2"
                    px="px-6"
                    onClick={() => setDeleteDialogOpen(true)}
                  />
                  {/* Delete Account Dialog */}
                  <DeleteModal
                    isOpen={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDeleteAccount}
                    title="Deactivate account"
                    message="Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."
                    confirmText="Deactivate"
                    cancelText="Cancel"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
