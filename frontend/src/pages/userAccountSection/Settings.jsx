import React, { useEffect, useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import SecondaryButton from "../../components/SecondaryButton";
import Alert from "../../components/Alert";
import ConfirmDialog from "../../components/confirmDialog";
import { handleSignOut } from "../../services/logout";
import api from "../../services/api";
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validateContact,
  validateCountry,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/SignupValidation";
import { useNavigate } from "react-router-dom";

function Settings({ user }) {
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const fetchedRef = useRef(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    accountToDelete: null,
  });

  const navigate = useNavigate(); 

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      accountToDelete: null,
    });
  };

  const handleDeleteAccount = (id) => {
    setConfirmDialog({
      isOpen: true,
      accountToDelete: id,
    });
  };

  const confirmDeleteAccount = async () => {
    if (!confirmDialog.accountToDelete) return;
    setIsLoading(true);

    try {
      const response = await api.put(
        `/user/deactivateAccount/${confirmDialog.accountToDelete}`,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204) {

        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
          await handleSignOut(navigate);
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          setIsLoggingOut(false);
        }

      } else {
        showAlert("Failed to delete account", "error");
      }
    } catch (error) {
      showAlert("Failed to delete account", "error");
    }
  };

  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    country: "",
  });

  // Form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    country: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Validation errors and touched state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Password visibility
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Alert state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
    position: "top-right",
  });

  // Alert handlers
  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  // Input class helpers
  const getInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554]";
    const errorClass =
      touched[fieldName] && errors[fieldName]
        ? "border-red-500"
        : "border-gray-300";
    return `${baseClass} ${errorClass}`;
  };

  const getPasswordInputClassName = (fieldName) => {
    const baseClass =
      "w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#003554] focus:border-[#003554]";
    const errorClass =
      passwordTouched[fieldName] && passwordErrors[fieldName]
        ? "border-red-500"
        : "border-gray-300";
    return `${baseClass} ${errorClass}`;
  };

  // Check if data has changed
  const hasDataChanged = () => {
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );
  };

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchUserSettings = async () => {
      if (fetchedRef.current || !user?.id || isLoading) return;

      setIsLoading(true);
      fetchedRef.current = true;

      try {
        const response = await api.get(`/user/getProfile/${user.id}`, {
          withCredentials: true,
          timeout: 10000,
        });

        const userData = {
          firstName: response.data.first_name || user.first_name || "",
          lastName: response.data.last_name || user.last_name || "",
          email: response.data.email || user.email || "",
          contact: response.data.contact || user.contact || "",
          country: response.data.country || user.country || "",
        };

        setFormData(userData);
        setOriginalData(userData);
      } catch (err) {
        console.error("Settings API call failed:", err);
        showAlert("Failed to load user settings", "error");
        fetchedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSettings();
  }, [user?.id]);

  // Input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validation on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    let error = "";
    switch (name) {
      case "firstName":
        error = validateFirstName(formData.firstName);
        break;
      case "lastName":
        error = validateLastName(formData.lastName);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "contact":
        error = validateContact(formData.contact);
        break;
      case "country":
        error = validateCountry(formData.country);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handlePasswordBlur = (e) => {
    const { name } = e.target;
    setPasswordTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    let error = "";
    switch (name) {
      case "oldPassword":
        error = !passwordData.oldPassword ? "Current password is required" : "";
        break;
      case "newPassword":
        error = validatePassword(passwordData.newPassword);
        break;
      case "confirmPassword":
        error = validateConfirmPassword(
          passwordData.newPassword,
          passwordData.confirmPassword
        );
        break;
      default:
        break;
    }

    setPasswordErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Form reset handlers
  const resetProfileForm = () => {
    setFormData({ ...originalData });
    setErrors({});
    setTouched({});
  };

  const resetPasswordForm = () => {
    setPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setPasswordTouched({});
  };

  // Password visibility toggle
  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Validate only changed fields or all fields if requested
  const validateChangedFields = () => {
    const newErrors = {};
    let hasErrors = false;

    // Only validate fields that have been touched or changed
    Object.keys(formData).forEach((fieldName) => {
      if (
        touched[fieldName] ||
        formData[fieldName] !== originalData[fieldName]
      ) {
        let error = "";
        switch (fieldName) {
          case "firstName":
            error = validateFirstName(formData.firstName);
            break;
          case "lastName":
            error = validateLastName(formData.lastName);
            break;
          case "email":
            error = validateEmail(formData.email);
            break;
          case "contact":
            error = validateContact(formData.contact);
            break;
          case "country":
            error = validateCountry(formData.country);
            break;
          default:
            break;
        }

        if (error) {
          newErrors[fieldName] = error;
          hasErrors = true;
        }
      }
    });

    // Update errors state
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));

    // Mark changed fields as touched
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) {
        changedFields[key] = true;
      }
    });

    setTouched((prev) => ({
      ...prev,
      ...changedFields,
    }));

    return !hasErrors;
  };

  // Form submission handlers
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    // Check if any data has actually changed
    if (!hasDataChanged()) {
      showAlert("No changes detected", "info");
      return;
    }

    // Validate only changed fields first, then all fields if needed
    if (!validateChangedFields()) {
      showAlert("Please fix the errors in the form", "error");
      return;
    }

    setIsUpdating(true);

    try {
      // Sanitize data before sending
      const sanitizedData = {
        firstName: sanitizeInput(formData.firstName),
        lastName: sanitizeInput(formData.lastName),
        email: sanitizeEmail(formData.email),
        contact: sanitizePhone(formData.contact),
        country: formData.country,
      };

      const response = await api.put(
        `/user/updateProfile/${user.id}`,
        sanitizedData,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setOriginalData({ ...formData });
        setTouched({});
        showAlert("Profile updated successfully");
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        showAlert(err.response.data, "error");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    // Validate all password fields
    const newPasswordErrors = {};

    if (!passwordData.oldPassword) {
      newPasswordErrors.oldPassword = "Current password is required";
    }

    newPasswordErrors.newPassword = validatePassword(passwordData.newPassword);
    newPasswordErrors.confirmPassword = validateConfirmPassword(
      passwordData.newPassword,
      passwordData.confirmPassword
    );

    // Set all fields as touched
    setPasswordTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    setPasswordErrors(newPasswordErrors);

    // Check if there are any errors
    const hasValidationErrors = Object.values(newPasswordErrors).some(
      (error) => error !== ""
    );

    if (hasValidationErrors) {
      showAlert("Please fix the errors in the password form", "error");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      const response = await api.put(
        `/user/updatePassword/${user.id}`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        },
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      // Clear form and errors on success
      resetPasswordForm();
      showAlert("Password updated successfully");
    } catch (err) {
      let errorMessage = "Failed to update password";
      if (err.response?.status === 400) {
        errorMessage =
          err.response.data?.message || "Current password is incorrect";
      } else if (err.response?.status === 404) {
        errorMessage = "User not found";
      } else if (err.response?.status === 422) {
        errorMessage = "Password validation failed on server";
      }
      showAlert(errorMessage, "error");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#003554]"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto px-4 md:ml-17 sm:px-6 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-semibold mt-3 text-[#003554]">
              Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage Account Preferences
            </p>

            <div className="bg-white mt-5 rounded-lg shadow-sm">
              <div className="p-6">
                {/* Profile Information Form */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h3>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={getInputClassName("firstName")}
                          autoComplete="given-name"
                        />
                        {touched.firstName && errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={getInputClassName("lastName")}
                          autoComplete="family-name"
                        />
                        {touched.lastName && errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={getInputClassName("email")}
                          autoComplete="email"
                        />
                        {touched.email && errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
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
                          onBlur={handleBlur}
                          className={getInputClassName("contact")}
                          autoComplete="tel"
                        />
                        {touched.contact && errors.contact && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.contact}
                          </p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={getInputClassName("country")}
                          autoComplete="country"
                        >
                          <option value="">Select a country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                          <option value="JP">Japan</option>
                          <option value="IN">India</option>
                          <option value="BR">Brazil</option>
                          <option value="MX">Mexico</option>
                          <option value="LK">Sri Lanka</option>
                          <option value="SG">Singapore</option>
                          <option value="MY">Malaysia</option>
                          <option value="TH">Thailand</option>
                          <option value="PH">Philippines</option>
                          <option value="ID">Indonesia</option>
                          <option value="VN">Vietnam</option>
                          <option value="KR">South Korea</option>
                          <option value="CN">China</option>
                          <option value="HK">Hong Kong</option>
                          <option value="TW">Taiwan</option>
                          <option value="NZ">New Zealand</option>
                        </select>
                        {touched.country && errors.country && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.country}
                          </p>
                        )}
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
                        onClick={resetProfileForm}
                        disabled={isUpdating}
                      />
                      <SecondaryButton
                        type="submit"
                        variant="filled"
                        color="#051923"
                        text={isUpdating ? "Updating..." : "Update Profile"}
                        py="py-2"
                        px="px-6"
                        disabled={isUpdating || !hasDataChanged()}
                      />
                    </div>
                  </form>
                </div>

                {/* Password Update Form */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Update Password
                  </h3>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="grid gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords.oldPassword ? "text" : "password"
                            }
                            name="oldPassword"
                            value={passwordData.oldPassword}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            className={getPasswordInputClassName("oldPassword")}
                            placeholder="••••••••"
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
                        {passwordTouched.oldPassword &&
                          passwordErrors.oldPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.oldPassword}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={
                              showPasswords.newPassword ? "text" : "password"
                            }
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            className={getPasswordInputClassName("newPassword")}
                            placeholder="••••••••"
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
                        {passwordTouched.newPassword &&
                          passwordErrors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.newPassword}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password *
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
                            onBlur={handlePasswordBlur}
                            className={getPasswordInputClassName(
                              "confirmPassword"
                            )}
                            placeholder="••••••••"
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
                        {passwordTouched.confirmPassword &&
                          passwordErrors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">
                              {passwordErrors.confirmPassword}
                            </p>
                          )}
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

                {/* Delete Account Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delete Account
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <SecondaryButton
                    variant="filled"
                    onClick={() => handleDeleteAccount(user.id)}
                    color="#FF4D4D"
                    text="Delete Account"
                    hoverColor="#FF1A1A"
                    py="py-2"
                    px="px-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        title="Delete Account"
        message={`Are you sure you want to delete your account? This action cannot be undone`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteAccount}
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      {/* Alert Component */}
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

export default Settings;
