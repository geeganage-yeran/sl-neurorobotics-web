import React, { useEffect, useState } from "react";
import { Info, ChevronLeft, ChevronRight, X, AlertCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import ar from "../assets/ar.gif";
import DynamicHeader from "../components/DynamicHeader";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import Alert from "../components/Alert";

export default function ProductViewPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [arViewingModel, setArViewingModel] = useState(null);
  const [loadingArModel, setLoadingArModel] = useState(false);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [specifications, setSpecifications] = useState([]);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Alert state
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

  // Load model-viewer script if not already loaded
  useEffect(() => {
    if (!document.querySelector('script[src*="model-viewer"]')) {
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js";
      document.head.appendChild(script);
    }
  }, []);

  // Handle AR View click
  const handleArView = async () => {
    try {
      setLoadingArModel(true);

      // Fetch 3D models for this product
      const response = await api.get(`/3d-models/product/${id}`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.models.length > 0) {
        // Get the first (or most recent) model
        const model = response.data.models[0];
        setArViewingModel({
          ...model,
          productName: product.name,
        });
      } else {
        showAlert("No 3D model available for AR view yet", "warning");
      }
    } catch (error) {
      console.error("Error fetching 3D model:", error);
      showAlert("Failed to load 3D model for AR view", "error");
    } finally {
      setLoadingArModel(false);
    }
  };

  const closeArViewer = () => {
    setArViewingModel(null);
  };

  // Add to Cart function
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      return navigate("/login");
    }

    setCartLoading(true);
    const userId = user.id;
    const dataToSend = {
      userId: userId,
      productId: productId,
      quantity: quantity,
    };

    try {
      const response = await api.post(`/cart/add`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        if (window.refreshCartCount) {
          window.refreshCartCount();
        }
        showAlert("Item added to cart successfully");
      }
    } catch (error) {
      showAlert("Product already in cart", "error");
    } finally {
      setCartLoading(false);
    }
  };

  // Buy Now function
  const buyNow = (product, quantity = 1) => {
    if (!isAuthenticated) {
      return navigate("/login");
    }

    // Create a cart item structure for single product
    const buyNowItem = {
      cartItemId: `buynow-${product.id}`,
      productId: product.id,
      productName: product.name,
      productImage:
        product.images?.length > 0
          ? `http://localhost:8080/uploads/productImages/${product.id}/${product.images[0].imageName}`
          : null,
      unitPrice: product.price,
      quantity: quantity,
    };

    const subtotal = product.price * quantity;

    // Navigate directly to checkout with single item
    navigate(`/checkout/${user.id}`, {
      state: {
        source: "buynow",
        cartItems: [buyNowItem],
        subtotal: subtotal,
        discount: 0,
        appliedPromo: "",
        discountAmount: 0,
      },
    });
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8080/api/public/getProduct/${id}`
        );
        setProduct(response.data);
        console.log("Fetched product:", response.data);

        // Handle specifications - now comes as Map/object from backend
        if (response.data.specifications) {
          const specsArray = Object.entries(response.data.specifications).map(
            ([name, description]) => ({
              name: name,
              description: description,
            })
          );
          setSpecifications(specsArray);
        } else {
          setSpecifications([]);
        }

        console.log(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Auto-slide images every 4 seconds
  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [product]);

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
          <p className="text-red-600 text-lg">{error || "Product not found"}</p>
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
  const productImages =
    product.images && product.images.length > 0
      ? product.images.map(
          (img) =>
            `http://localhost:8080/uploads/productImages/${product.id}/${img.imageName}`
        )
      : [
          `http://localhost:8080/uploads/productImages/default/default-product.jpg`,
        ];

  // Navigation functions for images
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <DynamicHeader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image - 16:10 aspect ratio with navigation arrows */}
            <div className="relative aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/800x500?text=No+Image";
                }}
              />

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700 cursor-pointer" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700 cursor-pointer" />
                  </button>
                </>
              )}

              {/* Image indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === index
                          ? "bg-white"
                          : "bg-white bg-opacity-50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pl-2 pt-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-12 rounded-lg overflow-hidden transition-all ${
                      selectedImage === index
                        ? "ring-2 ring-[#006494] ring-offset-2"
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/80x50?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl lg:text-4xl font-bold text-[#006494] leading-tight">
                    {product.name}
                  </h1>

                  {/* AR Icon - Updated with proper functionality */}
                  <button
                    onClick={handleArView}
                    disabled={loadingArModel}
                    className="flex items-center gap-2 group/ar flex-shrink-0 bg-[#00355412] hover:bg-[#00355420] px-3 py-2 rounded-xl border border-[#00355420] hover:border-[#00355440] transition-all disabled:opacity-50"
                  >
                    {loadingArModel ? (
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-[#003554]"></div>
                    ) : (
                      <img src={ar} className="w-7 h-7" alt="AR View" />
                    )}
                    <span className="text-sm font-medium text-[#003554]">
                      {loadingArModel ? "Loading..." : "View in AR"}
                    </span>
                  </button>
                </div>

                <div className="text-3xl font-bold text-gray-500 mb-6">
                  ${product.price}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Shipping calculated at checkout.
                </div>

                <p className="text-gray-700 leading-relaxed text-lg">
                  {product.summary}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {product.quantity > 0 ? (
                <>
                  {/* Quantity Selector */}
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700 font-medium">Quantity:</span>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 cursor-pointer hover:text-[#006494] hover:bg-gray-50 transition-colors rounded-l-lg"
                        disabled={quantity <= 1}
                      >
                        <span className="text-xl font-semibold">−</span>
                      </button>
                      <span className="px-4 py-2 min-w-[3rem] text-center font-medium border-l border-r border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.quantity, quantity + 1))
                        }
                        disabled={quantity >= product.quantity}
                        className="px-3 py-2 cursor-pointer text-gray-600 hover:text-[#006494] hover:bg-gray-50 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-xl font-semibold">+</span>
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Buy Now Button */}
                    <button
                      onClick={() => buyNow(product, quantity)}
                      className="w-full bg-[#006494] hover:bg-[#003554] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors"
                    >
                      BUY NOW
                    </button>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product.id, quantity)}
                      disabled={cartLoading}
                      className="w-full bg-white hover:bg-gray-50 text-[#006494] font-semibold py-4 px-6 rounded-xl border-2 border-[#006494] hover:border-[#003554] transition-all duration-300 disabled:opacity-50"
                    >
                      {cartLoading ? "Adding..." : "ADD TO CART"}
                    </button>
                  </div>
                </>
              ) : (
                /* Out of Stock Message */
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <p className="text-red-700 font-semibold text-lg">
                    Out of Stock
                  </p>
                  <p className="text-red-600 text-sm mt-1">
                    This item is currently unavailable
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest of your existing content - Product Overview, Description, Specifications, Tutorial */}
        {product.overview && (
          <div data-aos="fade-up" className="mt-20">
            <h2 className="text-3xl font-semibold text-[#006494] mb-8">
              Product Overview
            </h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-gray-700 leading-relaxed text-lg max-w-4xl text-justify">
                {product.overview}
              </p>
            </div>
          </div>
        )}

        {product.description && (
          <div data-aos="fade-up" className="mt-20">
            <h2 className="text-3xl font-semibold text-[#006494] mb-8">
              Product Description
            </h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-gray-700 leading-relaxed text-lg max-w-4xl text-justify">
                {product.description}
              </p>
            </div>
          </div>
        )}

        <div data-aos="fade-up" className="mt-20">
          <h2 className="text-3xl font-semibold text-[#006494] mb-8">
            Specifications
          </h2>
          {specifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {spec.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {spec.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
              <p className="text-gray-500">
                No specifications have been specified for this product.
              </p>
            </div>
          )}
        </div>

        {product.tutorialLink && (
          <section data-aos="fade-up" className="py-16 bg-white lg:py-24">
            <div className="px-6 mx-auto lg:px-6 xl:px-0 md:px-6 max-w-7xl">
              <h2 className="mb-12 text-2xl font-semibold text-[#006494] md:text-3xl lg:text-4xl">
                {product.name} Setup Tutorial
              </h2>
              <div className="relative w-full max-w-7xl">
                <div className="overflow-hidden shadow-2xl aspect-video rounded-xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={product.tutorialLink}
                    title={`${product.name} Setup Tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* AR Model Viewer Modal */}
      {arViewingModel && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[85vh] mx-4 shadow-2xl flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-[#003554]">
                  {arViewingModel.productName}
                </h3>
              </div>
              <button
                onClick={closeArViewer}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {arViewingModel.modelFilePath ? (
                <div
                  className="w-full h-full rounded-lg overflow-hidden shadow-inner"
                  style={{ minHeight: "400px" }}
                >
                  <model-viewer
                    src={`http://localhost:8080/api/3d-models/files/${arViewingModel.modelFilePath
                      .split("\\")
                      .pop()}`}
                    alt={`AR 3D model of ${arViewingModel.productName}`}
                    ar
                    ar-modes="webxr scene-viewer quick-look"
                    camera-controls
                    auto-rotate
                    loading="eager"
                    style={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#ffffff",
                    }}
                    onError={(e) => {
                      console.error("AR Model viewer error:", e);
                    }}
                    onLoad={() => {
                      console.log("AR Model loaded successfully");
                    }}
                  >
                    <div slot="ar-button" className="absolute bottom-4 right-4">
                      <button className="bg-[#003554] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-[#002a43] transition-all">
                        View in AR
                      </button>
                    </div>
                  </model-viewer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    AR Model Not Available
                  </h3>
                  <p className="text-sm text-center">
                    The 3D model file could not be loaded for AR viewing. Please
                    check if the model exists.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alert Component */}
      <Alert
        open={alert.open}
        onClose={closeAlert}
        message={alert.message}
        type={alert.type}
        position={alert.position}
        autoHideDuration={3000}
      />

      <Footer />
    </div>
  );
}
