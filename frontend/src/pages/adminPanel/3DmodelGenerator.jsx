import React, { useState } from "react";
import {
  Upload,
  ChevronDown,
  X,
  Save,
  RotateCcw,
  Edit,
  Trash2,
} from "lucide-react";
import api from "../../services/api";

const ModelGeneratorInterface = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedModels, setGeneratedModels] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingModel, setEditingModel] = useState(null);
  const [editProduct, setEditProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // SIMPLIFIED LOADING STATES - Only one loading state and message
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Single message for all states

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/products", {
        withCredentials: true,
      });

      if (response.data) {
        setProducts(response.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (20MB limit as per API)
      if (file.size > 20 * 1024 * 1024) {
        setStatusMessage("Error: Image file too large. Maximum size is 20MB");
        setTimeout(() => setStatusMessage(""), 5000);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setStatusMessage("Error: Please select a valid image file");
        setTimeout(() => setStatusMessage(""), 5000);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setStatusMessage(""); // Clear any previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedProduct) {
      setStatusMessage("Error: Please select both an image and a product");
      setTimeout(() => setStatusMessage(""), 5000);
      return;
    }

    // SINGLE LOADING STATE
    setIsGenerating(true);
    setStatusMessage("Uploading image...");

    try {
      // Create FormData for API call
      const formData = new FormData();

      // Find the product ID by name
      const selectedProductObj = products.find(
        (p) => p.name === selectedProduct
      );
      if (!selectedProductObj) {
        throw new Error("Selected product not found");
      }

      formData.append("productId", selectedProductObj.id);

      // Convert base64 to file
      const response = await fetch(uploadedImage);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: "image/jpeg" });
      formData.append("image", file);

      setStatusMessage("Generating 3D model... This may take a few minutes.");

      // API call
      const apiResponse = await api.post("/3d-models/generate", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 600000, // 10 minute timeout
      });

      // Handle the response
      const result = apiResponse.data;

      if (result.success) {
        // Add to generated models
        const newModel = {
          id: result.modelId,
          image: uploadedImage,
          product: selectedProduct,
          modelFilePath: result.modelPath,
          createdAt: result.createdAt,
        };

        setGeneratedModels([...generatedModels, newModel]);
        setUploadedImage(null);
        setSelectedProduct("");
        setStatusMessage("✓ Model generated successfully!");

        // Clear success message after 3 seconds
        setTimeout(() => setStatusMessage(""), 3000);
      } else {
        throw new Error(result.message || "Model generation failed");
      }

    } catch (error) {
      console.error("Error generating 3D model:", error);
      let errorMessage = "Failed to generate 3D model";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setStatusMessage("Error: " + errorMessage);
      
      // Clear error message after 8 seconds for longer errors
      setTimeout(() => setStatusMessage(""), 8000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    setUploadedImage(null);
    setSelectedProduct("");
    setStatusMessage("");
  };

  const handleDelete = (modelId) => {
    setDeleteConfirmId(modelId);
  };

  const confirmDelete = () => {
    setGeneratedModels(
      generatedModels.filter((model) => model.id !== deleteConfirmId)
    );
    setDeleteConfirmId(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleEdit = (model) => {
    setEditingModel(model);
    setEditProduct(model.product);
  };

  const saveEdit = () => {
    setGeneratedModels(
      generatedModels.map((model) =>
        model.id === editingModel.id
          ? { ...model, product: editProduct }
          : model
      )
    );
    setEditingModel(null);
    setEditProduct("");
  };

  const cancelEdit = () => {
    setEditingModel(null);
    setEditProduct("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div
        className={`container mx-auto px-4 py-8 max-w-7xl ${
          deleteConfirmId || editingModel ? "blur-sm" : ""
        } transition-all duration-200`}
      >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#003554]">
                  3D Model Generator
                </h1>
                <p className="text-gray-600 mt-1">
                  Upload images and generate 3D models for your products
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Model Generation Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6">
            <div className="space-y-6">
              {/* Product Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product List
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full max-w-md px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003554] focus:border-transparent outline-none transition-all duration-200 text-left shadow-sm flex items-center justify-between"
                    disabled={loading || isGenerating}
                  >
                    <span
                      className={
                        !selectedProduct || selectedProduct === ""
                          ? "text-gray-500"
                          : "text-gray-900"
                      }
                    >
                      {loading
                        ? "Loading products..."
                        : selectedProduct || "Select a product"}
                    </span>
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </button>

                  {isDropdownOpen && !loading && !isGenerating && (
                    <div className="absolute z-10 mt-2 w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setSelectedProduct(product.name);
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none first:rounded-t-xl last:rounded-b-xl transition-all duration-200"
                        >
                          {product.name}
                        </button>
                      ))}
                      {products.length === 0 && (
                        <div className="px-4 py-3 text-gray-500 text-sm">
                          No products available
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Image for 3D Model Generation
                </label>
                {uploadedImage ? (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded preview"
                      className="w-full h-64 object-cover rounded-xl shadow-sm border border-gray-200"
                    />
                    {!isGenerating && (
                      <button
                        onClick={() => setUploadedImage(null)}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  <label className={`cursor-pointer block ${isGenerating ? 'pointer-events-none opacity-50' : ''}`}>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#003554] hover:bg-blue-50 transition-all duration-200">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">
                        Click to upload an image
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        PNG, JPG, WebP up to 20MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isGenerating}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* SINGLE STATUS MESSAGE SECTION */}
            {statusMessage && (
              <div className="mb-6 p-4 rounded-xl border">
                <div className="flex items-center gap-3">
                  {isGenerating && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  )}
                  <span
                    className={`font-medium ${
                      statusMessage.includes("Error")
                        ? "text-red-600"
                        : statusMessage.includes("✓")
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {statusMessage}
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                disabled={isGenerating}
                className="px-6 py-3 cursor-pointer bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleGenerate}
                disabled={
                  !uploadedImage ||
                  !selectedProduct ||
                  selectedProduct === "" ||
                  isGenerating
                }
                className="px-6 py-3 bg-[#003554] text-white rounded-xl hover:bg-[#022b42] disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Generate Model
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Generated 3D Models Section */}
        {generatedModels.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#003554] mb-6">
                Generated 3D Models
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedModels.map((model) => (
                  <div
                    key={model.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="aspect-square bg-white">
                      <img
                        src={model.image}
                        alt={`3D Model of ${model.product}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {model.product}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(model)}
                          disabled={isGenerating}
                          className="flex-1 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
                          disabled={isGenerating}
                          className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-all font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {generatedModels.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No 3D models generated yet
              </h3>
              <p className="text-gray-600">
                Upload an image and select a product category to get started
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
              Delete 3D Model
            </h3>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Are you sure you want to delete this 3D model? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Edit 3D Model
            </h3>

            <div className="mb-4">
              <img
                src={editingModel.image}
                alt="Model preview"
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Category
              </label>
              <select
                value={editProduct}
                onChange={(e) => setEditProduct(e.target.value)}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900"
              >
                {products.map((product) => (
                  <option key={product.id} value={product.name}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={cancelEdit}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelGeneratorInterface;