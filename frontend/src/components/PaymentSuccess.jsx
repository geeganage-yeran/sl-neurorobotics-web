import { CheckCircle, Home, Download } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function PaymentSuccess() {
  const [sessionId, setSessionId] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get("session_id");
    console.log("Session ID from URL:", session);

    if (!session) {
      window.location.href = "/";
      return;
    }

    setSessionId(session);

    api
      .get(`/checkout/verify-payment/${session}`)
      .then((response) => {
        if (response.data && response.data.valid) {
          setIsVerifying(false);
        } else {
          window.location.href = "/";
        }
      })
      .catch(() => {
        window.location.href = "/";
      });
  }, []);

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003554] mx-auto mb-4"></div>
          <p>Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your payment has been processed
            successfully.
          </p>
        </div>

        {/* Success Details */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-center text-green-600 mb-4">
            <CheckCircle className="w-5 h-5 mr-2" />
            <span className="text-sm">Payment confirmed</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReturnHome}
            className="w-full bg-[#003554] hover:bg-[#002a43] cursor-pointer text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Return to Home
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
