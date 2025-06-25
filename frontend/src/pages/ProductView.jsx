import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Headphones } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

export default function ProductViewPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [specifications, setSpecifications] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/public/getProduct/${id}`);
        setProduct(response.data);
        
        // Parse specifications from the response
        if (response.data.specifications) {
          try {
            const parsedSpecs = JSON.parse(response.data.specifications);
            if (Array.isArray(parsedSpecs)) {
              setSpecifications(parsedSpecs);
            }
          } catch (e) {
            console.error('Error parsing specifications:', e);
          }
        }
        
        console.log(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  

  // Function to get icon based on specification name
  const getSpecificationIcon = (specName) => {
    const lowerName = specName.toLowerCase();
    if (lowerName.includes('wireless') || lowerName.includes('bluetooth')) {
      return <Headphones className="w-6 h-6" />;
    } else if (lowerName.includes('grade') || lowerName.includes('quality')) {
      return <Star className="w-6 h-6" />;
    } else if (lowerName.includes('feedback') || lowerName.includes('real-time')) {
      return <RotateCcw className="w-6 h-6" />;
    } else if (lowerName.includes('battery') || lowerName.includes('life')) {
      return <Truck className="w-6 h-6" />;
    } else if (lowerName.includes('design') || lowerName.includes('comfort')) {
      return <Shield className="w-6 h-6" />;
    }
    return <Shield className="w-6 h-6" />; // default icon
  };

  

  // Simple Footer component
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">SL Neurorobotics</h3>
            <p className="text-gray-400">
              Leading provider of advanced EEG technology and neurofeedback solutions.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>EEG Headsets</li>
              <li>Software Solutions</li>
              <li>Research Tools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Documentation</li>
              <li>Contact Us</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>About Us</li>
              <li>Careers</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SL Neurorobotics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Product not found'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get product images with proper URL construction
  const productImages = product.images && product.images.length > 0 
    ? product.images.map(img => `http://localhost:8080/uploads/productImages/${product.id}/${img.imageName}`)
    : [`http://localhost:8080/uploads/productImages/default/default-product.jpg`]; // fallback image

  // Determine which specifications to use
  const displaySpecifications = specifications.length > 0 
    ? specifications.map(spec => ({
        icon: getSpecificationIcon(spec.name),
        title: spec.name,
        description: spec.description
      }))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ${product.price}
              </div>
              <p className="text-gray-600">
                {product.summary || product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Buy Now
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                  Add to Cart
                </button>
              </div>
            </div>

            
          </div>
        </div>

        {/* Product Overview */}
        {product.overview && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Overview</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-600 leading-relaxed">{product.overview}</p>
            </div>
          </div>
        )}

        {/* Specifications Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Specifications</h2>
          {displaySpecifications ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySpecifications.map((spec, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-600 mb-3">
                  {spec.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{spec.title}</h3>
                <p className="text-gray-600 text-sm">{spec.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-500">No specifications have been specified for this product.</p>
          </div>
        )}
        </div>

        {/* Tutorial Link */}
        {product.tutorialLink && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Want to learn more about this product?</h3>
            <p className="text-blue-100 mb-6">
              Check out our comprehensive tutorial and documentation
            </p>
            <a 
              href={product.tutorialLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block"
            >
              View Tutorial
            </a>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}