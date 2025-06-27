import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Mail } from "lucide-react";
import api from "../../services/api";

function HelpCenter() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [faqItems, setFaqItems] = useState([]); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    fetchAllFAQs();
  }, []);

  const fetchAllFAQs = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/user/getFaq`, {
        withCredentials: true,
      });

      if (Array.isArray(response.data)) {
        console.log(response.data);
        
        const transformedData = [
          {
            id: 1,
            category: "Frequently Asked Questions",
            questions: response.data.map(faq => ({
              question: faq.question,
              answer: faq.answer
            }))
          }
        ];
        
        setFaqItems(transformedData);
      } else {
        console.warn("API returned empty or invalid FAQ data");
        setFaqItems([]);
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setFaqItems([]); 
    } finally {
      setLoading(false);
    }
  };

  const toggleFAQ = (questionIndex) => {
    setExpandedFAQ(expandedFAQ === questionIndex ? null : questionIndex);
  };

  return (
    <div className="min-h-screen lg:ml-18 bg-[#F5F5F5]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3 ">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="mb-2">
              <h1 className="text-2xl font-semibold text-[#003554] mb-1">
                Help Center
              </h1>
              <h3 className="text-gray-600">
                Find answers to common questions about our neurorobotics and
                products.
              </h3>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-600">Loading FAQs...</p>
              </div>
            )}

            {/* FAQ Sections */}
            {!loading && (
              <div className="space-y-8">
                {faqItems.length > 0 ? (
                  faqItems.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200"
                    >
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-[#003554]">
                          {category.category}
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          {category.questions.map((item, index) => {
                            const questionIndex = `${category.id}-${index}`;
                            return (
                              <div
                                key={index}
                                className="border border-gray-200 rounded-lg"
                              >
                                <button
                                  onClick={() => toggleFAQ(questionIndex)}
                                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                  <span className="font-medium text-[#003554]">
                                    {item.question}
                                  </span>
                                  {expandedFAQ === questionIndex ? (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                  )}
                                </button>
                                {expandedFAQ === questionIndex && (
                                  <div className="px-4 pb-3">
                                    <div className="pt-2 border-t border-gray-100">
                                      <p className="text-gray-600">{item.answer}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No FAQs available at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Contact Support Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#003554] mb-2">
                Contact Support
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                If you can't find answers you're looking for, our support team
                is here to help.You can reach us via email or use our chat bot
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-[#006494] px-4 py-2 rounded-md border">
                <Mail size={16} />
                <span className="text-sm font-medium">
                  slneurorobotics@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HelpCenter;