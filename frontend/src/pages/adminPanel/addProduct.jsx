import React, { useState } from "react";
import axios from "axios";
import { Plus, X, Upload, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
import {
  validateForm,
  validateField,
  validateSpecification,
  validateImageFile,
  getFieldError,
  hasFieldError,
  formatValidationErrors,
} from "../../utils/ProductValidationAdmin";

const addProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    description: "",
    overview: "",
    tutorialLink: "",
    price: "",
    enabled: true,
  });

  const [specifications, setSpecifications] = useState([]);
  const [specInput, setSpecInput] = useState({ name: "", description: "" });
  const [uploadedImages, setUploadedImages] = useState([]);

  const [errors, setErrors] = useState({});
  const [specErrors, setSpecErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Fixed toggle handler specifically for the enabled field
  const handleToggleEnabled = () => {
    setFormData((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  const handleBlur = (fieldName) => {
    const validation = validateField(fieldName, formData[fieldName]);
    if (validation.errors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validation.errors,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSpecInputChange = (e) => {
    const { name, value } = e.target;
    setSpecInput((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (specErrors[name]) {
      setSpecErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addSpecification = () => {
    const validation = validateSpecification(specInput);

    if (Object.keys(validation.errors).length > 0) {
      setSpecErrors(validation.errors);
      return;
    }

    if (specInput.name.trim() && specInput.description.trim()) {
      setSpecifications((prev) => [
        ...prev,
        { ...validation.sanitized, id: Date.now() },
      ]);
      setSpecInput({ name: "", description: "" });
      setSpecErrors({});
    }
  };

  const removeSpecification = (id) => {
    setSpecifications((prev) => prev.filter((spec) => spec.id !== id));
  };

  // Update display orders after any image list change
  const updateDisplayOrders = (images) => {
    return images.map((image, index) => ({
      ...image,
      displayOrder: index + 1,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    const imageErrors = [];

    if (uploadedImages.length + files.length > 10) {
      alert("Cannot upload more than 10 images total");
      return;
    }

    files.forEach((file) => {
      const fileErrors = validateImageFile(file);
      if (fileErrors.length > 0) {
        imageErrors.push(`${file.name}: ${fileErrors.join(", ")}`);
      } else {
        validFiles.push(file);
      }
    });

    if (imageErrors.length > 0) {
      alert(`Image validation errors:\n${imageErrors.join("\n")}`);
    }

    const newImages = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: event.target.result,
          name: file.name,
          file: file,
          displayOrder: uploadedImages.length + newImages.length + 1,
        };
        newImages.push(newImage);

        // Update state when all files are processed
        if (newImages.length === validFiles.length) {
          setUploadedImages((prev) =>
            updateDisplayOrders([...prev, ...newImages])
          );
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setUploadedImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      return updateDisplayOrders(filtered);
    });
  };

  const moveImageUp = (index) => {
    if (index === 0) return;

    setUploadedImages((prev) => {
      const newImages = [...prev];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      return updateDisplayOrders(newImages);
    });
  };

  const moveImageDown = (index) => {
    if (index === uploadedImages.length - 1) return;

    setUploadedImages((prev) => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      return updateDisplayOrders(newImages);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateForm(formData, specifications, uploadedImages);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);

      const errorList = formatValidationErrors(validation.errors);
      if (errorList.length > 0) {
        alert(`Please fix the following errors:\n${errorList.join("\n")}`);
      }

      const firstErrorField = Object.keys(validation.errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus();
      }

      return;
    }

    try {
      const productData = {
        ...validation.sanitizedData,
        specifications,
        enabled: formData.enabled, // Explicitly include the enabled state
      };

      const formDataToSend = new FormData();

      formDataToSend.append("product", JSON.stringify(productData));

      uploadedImages.forEach((img) => {
        formDataToSend.append("images", img.file);
        formDataToSend.append("imageNames", img.name);
        formDataToSend.append("displayOrders", img.displayOrder.toString());
      });

      // Send POST request to the backend
      const response = await axios.post(
        "http://localhost:8080/api/products/addProduct",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      //console.log(response.data.message);

      if (response.data === "Product created successfully") {
        showAlert(
          "Item added to the system successfully",
          "success",
          "top-right"
        );
        // Reset form after successful submission
        setFormData({
          name: "",
          summary: "",
          description: "",
          overview: "",
          tutorialLink: "",
          price: "",
          enabled: true,
        });
        setSpecifications([]);
        setUploadedImages([]);
        setErrors({});
      } else {
        showAlert(
          "Unexpected error occur please try again",
          "error",
          "top-right"
        );
      }
    } catch (error) {
      showAlert(
        "Unexpected error occur please try again",
        "error",
        "top-right"
      );

      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);

        if (error.response.data && typeof error.response.data === "string") {
          alert(`Error: ${error.response.data}`);
        } else {
          alert(
            `Error adding product: ${error.response.status} - ${error.response.statusText}`
          );
        }
      } else if (error.request) {
        console.error("Request made but no response:", error.request);
        alert(
          "No response from server. Please check if the backend is running."
        );
      } else {
        console.error("Error setting up request:", error.message);
        alert("Error setting up request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] px-3 sm:px-4 lg:px-6">
      <div className="max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-5">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl font-bold text-[#003554] mb-1">
              Add New Product
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Fill in the details to add a new product to your catalog
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("name")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                    hasFieldError(errors, "name")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                  required
                />
                {hasFieldError(errors, "name") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(errors, "name")}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur("price")}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                    hasFieldError(errors, "price")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
                {hasFieldError(errors, "price") && (
                  <p className="mt-1 text-sm text-red-600">
                    {getFieldError(errors, "price")}
                  </p>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Summary Description *
              </label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                onBlur={() => handleBlur("summary")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                  hasFieldError(errors, "summary")
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Brief summary of the product"
                maxLength="500"
                required
              />
              <div className="flex justify-between items-center mt-1">
                {hasFieldError(errors, "summary") && (
                  <p className="text-sm text-red-600">
                    {getFieldError(errors, "summary")}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.summary.length}/500
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                onBlur={() => handleBlur("description")}
                rows="4"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all resize-y ${
                  hasFieldError(errors, "description")
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Detailed description of the product"
                maxLength="2000"
                required
              />
              <div className="flex justify-between items-center mt-1">
                {hasFieldError(errors, "description") && (
                  <p className="text-sm text-red-600">
                    {getFieldError(errors, "description")}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.description.length}/2000
                </p>
              </div>
            </div>

            {/* Overview */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Overview *
              </label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                onBlur={() => handleBlur("overview")}
                rows="3"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all resize-y ${
                  hasFieldError(errors, "overview")
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="Product overview"
                maxLength="1000"
                required
              />
              <div className="flex justify-between items-center mt-1">
                {hasFieldError(errors, "overview") && (
                  <p className="text-sm text-red-600">
                    {getFieldError(errors, "overview")}
                  </p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {formData.overview.length}/1000
                </p>
              </div>
            </div>

            {/* Tutorial Link */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                Tutorial Link
              </label>
              <input
                type="url"
                name="tutorialLink"
                value={formData.tutorialLink}
                onChange={handleInputChange}
                onBlur={() => handleBlur("tutorialLink")}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                  hasFieldError(errors, "tutorialLink")
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                placeholder="https://example.com/tutorial"
                maxLength="2048"
              />
              {hasFieldError(errors, "tutorialLink") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError(errors, "tutorialLink")}
                </p>
              )}
            </div>

            {/* Specifications Section */}
            <div className="rounded-lg sm:rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-[#003554] mb-4">
                Specifications
              </h3>

              {/* Add Specification */}
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 lg:grid-cols-2 sm:gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={specInput.name}
                    onChange={handleSpecInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                      specErrors.name
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Specification name"
                    maxLength="100"
                  />
                  {specErrors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {specErrors.name}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      name="description"
                      value={specInput.description}
                      onChange={handleSpecInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all ${
                        specErrors.description
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Specification details"
                      maxLength="500"
                    />
                    {specErrors.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {specErrors.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    disabled={specifications.length >= 20}
                    className={`px-3 sm:px-4 py-2 sm:py-3 cursor-pointer text-white rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base whitespace-nowrap ${
                      specifications.length >= 20
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#006494] hover:bg-[#003554]"
                    }`}
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Add</span>
                  </button>
                </div>
              </div>

              {specifications.length >= 20 && (
                <p className="text-sm text-orange-600 mb-4">
                  Maximum of 20 specifications reached
                </p>
              )}

              {/* Specifications List */}
              {specifications.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                    Added Specifications ({specifications.length}/20):
                  </h4>
                  {specifications.map((spec) => (
                    <div
                      key={spec.id}
                      className="bg-white rounded-lg p-3 sm:p-4 flex justify-between items-start shadow-sm"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <h5 className="font-medium text-gray-900 text-sm sm:text-base break-words">
                          {spec.name}
                        </h5>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1 break-words">
                          {spec.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSpecification(spec.id)}
                        className="flex-shrink-0 text-red-500 cursor-pointer hover:text-red-700 transition-colors p-1"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload Section */}
            <div className="rounded-lg sm:rounded-xl">
              <h3 className="text-base sm:text-lg font-semibold text-[#003554] mb-4">
                Product Images
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4">
                Upload images and reorder them to set display priority. The
                first image will be the main product image.
              </p>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 lg:p-8 text-center mb-4 sm:mb-6">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadedImages.length >= 10}
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer flex flex-col items-center gap-2 sm:gap-3 ${
                    uploadedImages.length >= 10
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <Upload className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-gray-400" />
                  <div>
                    <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-600">
                      {uploadedImages.length >= 10
                        ? "Maximum images reached"
                        : "Click to upload images"}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      PNG, JPG, GIF, WEBP up to 8MB each (
                      {uploadedImages.length}/10)
                    </p>
                  </div>
                </label>
              </div>

              {/* Uploaded Images with Ordering */}
              {uploadedImages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">
                      Uploaded Images ({uploadedImages.length}/10)
                    </h4>
                    <p className="text-xs text-gray-500">
                      Use arrows to reorder images
                    </p>
                  </div>

                  <div className="space-y-2">
                    {uploadedImages.map((image, index) => (
                      <div
                        key={image.id}
                        className="bg-white rounded-lg p-3 shadow-sm border"
                      >
                        <div className="flex items-center gap-3">
                          {/* Display Order Badge */}
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-[#0582CA] text-white text-sm font-medium rounded-full">
                              {image.displayOrder}
                            </span>
                          </div>

                          {/* Image Preview */}
                          <div className="flex-shrink-0">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded"
                            />
                          </div>

                          {/* Image Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {image.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Display Order: {image.displayOrder}
                              {index === 0 && " (Main Image)"}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {/* Move Up Button */}
                            <button
                              type="button"
                              onClick={() => moveImageUp(index)}
                              disabled={index === 0}
                              className={`p-1 rounded transition-colors ${
                                index === 0
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              }`}
                              title="Move up"
                            >
                              <ChevronUp size={16} />
                            </button>

                            {/* Move Down Button */}
                            <button
                              type="button"
                              onClick={() => moveImageDown(index)}
                              disabled={index === uploadedImages.length - 1}
                              className={`p-1 rounded transition-colors ${
                                index === uploadedImages.length - 1
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                              }`}
                              title="Move down"
                            >
                              <ChevronDown size={16} />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => removeImage(image.id)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors ml-1"
                              title="Remove image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Enable/Disable Toggle - FIXED VERSION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 rounded-lg sm:rounded-xl p-4 gap-3 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-[#003554]">
                  Product Status
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  Enable or disable this product
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium ${
                    formData.enabled ? "text-green-600" : "text-gray-500"
                  }`}
                >
                  {formData.enabled ? "Enabled" : "Disabled"}
                </span>
                <button
                  type="button"
                  onClick={handleToggleEnabled}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:ring-offset-2 ${
                    formData.enabled ? "bg-green-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.enabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center sm:justify-end pt-4 sm:pt-6">
              <Button disabled={isSubmitting}>
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </form>
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
  );
};

export default addProduct;
