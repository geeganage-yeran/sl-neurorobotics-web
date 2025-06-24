import React, { useState } from "react";
import LeftImage from "../assets/image1.jpg";
import axios from "axios";
import Alert from "../components/Alert";
import {
  validateForm,
  sanitizeFormData,
  validateEmail,
  validatePassword,
  hasErrors,
} from "../utils/SigninValidation";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  {
    /* Handling alerts section */
  }

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

  {
    /* Handling validations */
  }

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (touched[name]) {
      let error = "";

      switch (name) {
        case "email":
          error = validateEmail(value);
          break;
        case "password":
          error = validatePassword(value);
          break;
      }

      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    let error = "";

    switch (name) {
      case "email":
        error = validateEmail(formData[name]);
        break;
      case "password":
        error = validatePassword(formData[name]);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const formErrors = validateForm(formData);
    setErrors(formErrors);

    if (!hasErrors(formErrors)) {
      const sanitizedData = sanitizeFormData(formData);

      console.log("Form submitted successfully:", sanitizedData);

      // Set loading state
      setLoading(true);

      try {
        const response = await api.post("/auth/login", sanitizedData, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 10000,
        });

        if (response.data.success) {
          showAlert(response.data.message, "success");
          setFormData({ email: "", password: "" });
          setTouched({ email: false, password: false });
          setErrors({});

          navigate("/dashboard", { replace: true });
        } else {
          showAlert(response.data.message || "Login failed", "error");
        }
      } catch (error) {
        if (error.response && error.response.data) {
          const errorData = error.response.data;

          if (errorData.errors) {
            if (typeof errorData.errors === "object") {
              const errorMessages = Object.values(errorData.errors).join(", ");
              showAlert(errorMessages, "error");
            } else {
              showAlert(errorData.errors, "error");
            }
          } else {
            showAlert(errorData.message || "Login failed", "error");
          }
        } else if (error.request) {
          showAlert(
            "Network error occurred. Please check your connection.",
            "error"
          );
        } else {
          showAlert("An unexpected error occurred. Please try again.", "error");
        }

        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form validation errors:", formErrors);
      showAlert("Please fix the form errors before submitting", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex overflow-hidden">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F5F5]">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#003554] mb-2">
              Welcome back!
            </h2>
            <p className="text-gray-600">
              Enter your Credentials to access your account
            </p>
          </div>

          {/* Form */}
          <div
            data-aos="fade-up"
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onBlur={handleBlur}
                  onChange={handleInputChange}
                  placeholder="slneuro@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  required
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-sm text-[#0582CA] hover:text-[#003554] transition-colors duration-200"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#006494] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#003554] focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:ring-offset-2 transform transition-all cursor-pointer duration-200 hover:scale-105 shadow-lg"
              >
                Sign In
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 cursor-pointer w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/user-reg"
                className="font-semibold text-[#0582CA] hover:text-[#003554] transition-colors duration-200"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div
        data-aos="fade-left"
        className="hidden lg:block lg:w-1/2 fixed right-0 top-0 h-screen"
      >
        <img
          src={LeftImage}
          alt="LoginImage"
          className="object-cover w-full h-full"
        />
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
  );
}
