import React, { useState } from 'react';
import { Upload, X, Image, Camera, Save, RotateCcw } from 'lucide-react';

const ManageHomePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deviceImage, setDeviceImage] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [newCarouselImages, setNewCarouselImages] = useState([]);

  // Sample existing carousel images
  useState(() => {
    setCarouselImages([
      { id: 1, url: 'https://via.placeholder.com/150x100/e5e7eb/6b7280?text=Image+1' },
      { id: 2, url: 'https://via.placeholder.com/150x100/e5e7eb/6b7280?text=Image+2' },
      { id: 3, url: 'https://via.placeholder.com/150x100/e5e7eb/6b7280?text=Image+3' }
    ]);
  }, []);

  const handleDeviceImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDeviceImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCarouselImageUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          id: Date.now() + Math.random(),
          url: e.target.result
        };
        setNewCarouselImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCarouselImage = (imageId, isNew = false) => {
    if (isNew) {
      setNewCarouselImages(prev => prev.filter(img => img.id !== imageId));
    } else {
      setCarouselImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDeviceImage(null);
    setNewCarouselImages([]);
  };

  const handleSave = () => {
    console.log('Saving device section:', { title, description, deviceImage });
  };

  const handleGenerate = () => {
    console.log('Generating carousel images:', newCarouselImages);
    // Move new images to main carousel
    setCarouselImages(prev => [...prev, ...newCarouselImages]);
    setNewCarouselImages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-[#003554]">Manage Home Page</h1>
                <p className="text-gray-600 mt-1">Update your upcoming device section and carousel images</p>
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
                <label className="block text-sm font-semibold text-gray-700 mb-2">Device Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm"
                  placeholder="Enter device title"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Device Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 shadow-sm resize-none"
                  placeholder="Enter device description"
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
                      onClick={() => setDeviceImage(null)}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-all hover:scale-110"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 font-medium">Click to upload device image</p>
                      <p className="text-sm text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleDeviceImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageHomePage;