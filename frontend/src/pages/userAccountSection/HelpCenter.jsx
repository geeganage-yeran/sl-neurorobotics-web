import React, { useState } from "react";
import { ChevronDown, ChevronRight, Mail } from "lucide-react";

function HelpCenter() {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqItems = [
    {
      id: 1,
      category: "Account & Billing",
      questions: [
        {
          question: "How do I update my billing information?",
          answer:
            "You can update your billing information by going to your account settings and selecting the billing section. From there, you can edit your payment methods and billing address.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.",
        },
      ],
    },
    {
      id: 2,
      category: "Technical Support",
      questions: [
        {
          question: "How do I contact technical support?",
          answer:
            "You can contact our technical support team through live chat, email at support@slneurorobotics.com, or by calling our support hotline during business hours.",
        },
        {
          question: "What are the support hours?",
          answer:
            "Our support team is available Monday through Friday, 9 AM to 6 PM (EST). For urgent technical issues, we also provide 24/7 emergency support.",
        },
        {
          question: "Do you offer 24/7 support?",
          answer:
            "We offer 24/7 emergency technical support for critical issues. For general inquiries, our standard support hours are Monday-Friday, 9 AM to 6 PM EST.",
        },
      ],
    },
  ];

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

            {/* FAQ Sections */}
            <div className="space-y-8">
              {faqItems.map((category) => (
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
              ))}
            </div>

            {/* Contact Support Section */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-[#003554] mb-2">
                Contact Support
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                If you can’t find answers you’re looking for, our support team
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
