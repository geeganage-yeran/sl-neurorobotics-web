import React, { useState, useEffect } from 'react';
import { Upload, X, Save, RotateCcw, Loader2 } from 'lucide-react';
import api from "../../services/api";
import Alert from "../../components/Alert";

const ManageHomePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deviceImage, setDeviceImage] = useState(null);
  const [deviceImageFile, setDeviceImageFile] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Alert state
  const [alert, setAlert] = useState({ 
    open: false, 
    message: '', 
    type: 'success', 
    position: 'top-right' 
  });

  const showAlert = (message, type = "success", position = "top-right") => {
    setAlert({ open: true, message, type, position });
  };

  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  const handleDeviceImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showAlert('File size must be less than 10MB', 'error');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file', 'error');
        return;
      }

      setDeviceImageFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setDeviceImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setDeviceImage(null);
    setDeviceImageFile(null);
  };

  const handleCancel = () => {
    clearForm();
  };

  const handleSave = async () => {
    // Simple validation - just show alert if title is empty, but don't prevent saving completely
    if (!title.trim()) {
      showAlert('Please enter a device title', 'warning');
      return;
    }

    setSaveLoading(true);
    
    try {
      const formData = new FormData();
      
      // Add device data as JSON
      const deviceData = {
        title: title.trim(),
        description: description.trim()
      };
      formData.append('deviceData', JSON.stringify(deviceData));
      
      // Add image file if selected
      if (deviceImageFile) {
        formData.append('deviceImage', deviceImageFile);
      }

      // Fixed: Use axios response format instead of fetch
      const response = await api.post('/admin/saveHomePageDevice', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      // Fixed: Axios response structure is different from fetch
      if (response.status === 200) {
        showAlert('Device section saved successfully!', 'success');
        
        // Clear form after successful save
        clearForm();
      } else {
        showAlert(`Error saving device section: ${response.data}`, 'error');
      }
    } catch (error) {
      console.error('Error saving device section:', error);
      
      // Better error handling
      let errorMessage = 'An error occurred while saving. Please try again.';
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      showAlert(errorMessage, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#003554]">Manage Home Page</h1>
                  <p className="text-gray-600 mt-1">Update your upcoming device section</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Upcoming Device Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">          
            <div className="p-6">
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Device Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003554] focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                    placeholder="Enter device title"
                    disabled={saveLoading}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Device Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#003554] focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                    placeholder="Enter device description"
                    disabled={saveLoading}
                  />
                </div>

                {/* Upload Image */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Device Image</label>
                  {deviceImage ? (
                    <div className="relative">
                      <img
                        src={deviceImage}
                        alt="Device preview"
                        className="w-full h-64 object-cover rounded-xl shadow-sm border border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setDeviceImage(null);
                          setDeviceImageFile(null);
                        }}
                        disabled={saveLoading}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {deviceImageFile && (
                        <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          New image selected
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className={`cursor-pointer block ${saveLoading ? 'pointer-events-none opacity-50' : ''}`}>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#003554] hover:bg-blue-50 transition-all duration-200">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-gray-600 font-medium">Click to upload device image</p>
                        <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleDeviceImageUpload}
                        disabled={saveLoading}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  disabled={saveLoading}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveLoading}
                  className="px-6 py-3 bg-[#003554] text-white rounded-xl hover:bg-[#003554] transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Component */}
      <Alert
        open={alert.open}
        onClose={closeAlert}
        message={alert.message}
        type={alert.type}
        position={alert.position}
        autoHideDuration={6000}
      />
    </>
  );
};

export default ManageHomePage;