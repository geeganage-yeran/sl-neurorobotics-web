import React, { useEffect, useState } from "react";
import { Info, ChevronLeft, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import ar from "../assets/ar.gif";
import DynamicHeader from "../components/DynamicHeader";

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
        const response = await axios.get(
          `http://localhost:8080/api/public/getProduct/${id}`
        );
        setProduct(response.data);

        // Parse specifications from the response
        if (response.data.specifications) {
          try {
            const parsedSpecs = JSON.parse(response.data.specifications);
            if (Array.isArray(parsedSpecs)) {
              setSpecifications(parsedSpecs);
            }
          } catch (e) {
            console.error("Error parsing specifications:", e);
          }
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
        ]; // fallback image

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

                  {/* AR Icon */}
                  <a
                    href=""
                    className="flex items-center gap-2 group/ar flex-shrink-0 bg-[#00355412] hover:bg-[#00355420] px-3 py-2 rounded-xl border border-[#00355420] hover:border-[#00355440] transition-all"
                  >
                    <img src={ar} className="w-7 h-7" alt="AR View" />
                    <span className="text-sm font-medium text-[#003554]">
                      View in AR
                    </span>
                  </a>
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
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 cursor-pointer text-gray-600 hover:text-[#006494] hover:bg-gray-50 transition-colors rounded-r-lg"
                  >
                    <span className="text-xl font-semibold">+</span>
                  </button>
                </div>
              </div>

              {/* Buy Now Button */}
              <button className="w-full bg-[#006494] hover:bg-[#003554] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors">
                BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* Product Overview */}
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

        {/* Product Description */}
        {product.description && (
          <div data-aos="fade-up" className="mt-20">
            <h2 className="text-3xl font-semibold text-[#006494] mb-8">
              Product Description
            </h2>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <p className="text-gray-700 leading-relaxed text-lg max-w-4xl text-justify">
                {product.overview}
              </p>
            </div>
          </div>
        )}

        {/* Specifications - Grid Layout */}
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

        {/* Setup Tutorial Section */}
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

      <Footer />
    </div>
  );
}
