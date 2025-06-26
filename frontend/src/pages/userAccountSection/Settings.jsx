import React, { useEffect, useState, useRef } from "react";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import SecondaryButton from "../../components/SecondaryButton";
import DeleteModal from "../../components/confirmDialog";
import api from "../../services/api";
import Alert from "../../components/Alert";

function Settings({ user }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const fetchedRef = useRef(false);

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

  const handleDeleteAccount = () => {
    console.log("Account deleted!");
  };

  useEffect(() => {
    const fetchUserSettings = async () => {
      if (fetchedRef.current || !user?.id || isLoading) return;

      setIsLoading(true);
      fetchedRef.current = true;

      try {
        const response = await api.get(`/user/settings/${user.id}`, {
          withCredentials: true,
          timeout: 10000,
        });

        setFormData((prevData) => ({
          ...prevData,
          firstName: response.data.first_name || user.first_name || "",
          lastName: response.data.last_name || user.last_name || "",
          email: response.data.email || user.email || "",
          contact: response.data.contact || user.contact || "",
          country: response.data.country || user.country || "USA",
        }));
      } catch (err) {
        console.error("Settings API call failed:", err);
        setError("Failed to load user settings");
        fetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
  }, [user?.id]);

  const defaultFormData = {
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    country: user?.country || "USA",
  };

  const [formData, setFormData] = useState(defaultFormData);

  
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  
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

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setError(null);
  };

  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);

    try {
      const response = await api.put(
        `/user/settings/${user.id}`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          contact: formData.contact,
          country: formData.country,
        },
        { withCredentials: true }
      );

      console.log("Profile updated successfully:", response.data);
      setFormData({
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        email: response.data.email,
        contact: response.data.contact,
        country: response.data.country,
      });

      showAlert("Profile Updated Successfully");
    } catch (err) {
      showAlert("Failed to update profile","error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert("New password and confirm password do not match", "error");
      setIsUpdatingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showAlert("Password must be at least 8 characters long", "error");
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const response = await api.put(
        `/user/password/${user.id}`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setPasswordSuccess(true);
        resetPasswordForm();
        showAlert("Password Updated Successfully");
      }
    } catch (err) {
      let errorMessage = "Failed to update password";
      if (err.response && err.response.status === 400) {
        errorMessage = err.response.data || "Failed to update password";
      } else if (err.response && err.response.status === 404) {
        errorMessage = "User not found";
      }
      showAlert(errorMessage, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
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
            <h3 className="mb-3 text-[#5C728A]">Account Preferences</h3>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    {error}
                  </div>
                )}

                {/* Profile Information Form */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h3>
                  <form onSubmit={handleProfileUpdate}>
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
                          autoComplete="given-name"
                          required
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
                          autoComplete="family-name"
                          required
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
                          autoComplete="email"
                          required
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
                          autoComplete="tel"
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
                          autoComplete="country"
                        >
                          <option value="USA">USA</option>
                          <option value="Canada">Canada</option>
                          <option value="UK">UK</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="IN">India</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <SecondaryButton
                        type="button"
                        variant="outline"
                        bordercolor="#051923"
                        text="Cancel"
                        py="py-2"
                        px="px-6"
                        onClick={resetForm}
                        disabled={isUpdating}
                      />
                      <SecondaryButton
                        type="submit"
                        variant="filled"
                        color="#051923"
                        text={isUpdating ? "Updating..." : "Update"}
                        py="py-2"
                        px="px-6"
                        disabled={isUpdating}
                      />
                    </div>
                  </form>
                </div>

                {/* Update Password */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Update your password
                  </h3>

                  <form onSubmit={handlePasswordUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Old Password
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords.oldPassword ? "text" : "password"
                            }
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
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
                              showPasswords.confirmPassword
                                ? "text"
                                : "password"
                            }
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
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
                            type={
                              showPasswords.newPassword ? "text" : "password"
                            }
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
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
                        <p className="mt-1 text-sm text-gray-500">
                          Password must be at least 8 characters long and
                          contain uppercase, lowercase, numbers, and special
                          characters.
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <SecondaryButton
                        type="button"
                        variant="outline"
                        bordercolor="#051923"
                        text="Cancel"
                        py="py-2"
                        px="px-6"
                        onClick={resetPasswordForm}
                        disabled={isUpdatingPassword}
                      />
                      <SecondaryButton
                        type="submit"
                        variant="filled"
                        color="#051923"
                        text={
                          isUpdatingPassword ? "Updating..." : "Update Password"
                        }
                        py="py-2"
                        px="px-6"
                        disabled={isUpdatingPassword}
                      />
                    </div>
                  </form>
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
              <Alert
                open={alert.open}
                onClose={closeAlert}
                message={alert.message}
                type={alert.type}
                position={alert.position}
                autoHideDuration={3000}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
