import React, { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Bot, AlertCircle } from "lucide-react";
import BotIcon from "../assets/bot.json";
import Lottie from "lottie-react";
import axios from "axios";

const NeuroLinkChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const messagesEndRef = useRef(null);


  const BACKEND_URL = "http://localhost:8080";
  const CHATBOT_ENDPOINT = "/api/chatbot/ask";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: Date.now(),
        text: "Hello! I'm NeuroLink, your advanced AI assistant. I'm here to help you with anything you need regarding SLNeurorobotics. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Function to call the Spring Boot backend using axios
  const callChatbotAPI = async (question) => {
    try {
      setConnectionError(false);
      
      const response = await axios.post(`${BACKEND_URL}${CHATBOT_ENDPOINT}`, {
        question: question
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Backend response:', response.data);
      
      return response.data.response || "I apologize, but I couldn't process your request at the moment.";
      
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      setConnectionError(true);
      
      // Handle different types of axios errors
      if (error.code === 'ECONNABORTED') {
        return "The request timed out. Please try again with a shorter question.";
      } else if (error.response) {
        // Server responded with error status
        return `Server error (${error.response.status}): ${error.response.statusText}. Please try again later.`;
      } else if (error.request) {
        // Request was made but no response received
        return "Unable to connect to the server. Please check your internet connection and try again.";
      } else {
        // Something else happened
        return "An unexpected error occurred. Please try again.";
      }
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      const currentQuestion = inputValue;
      setInputValue("");
      setIsTyping(true);

      try {
        // Call the actual API instead of simulated response
        const botResponseText = await callChatbotAPI(currentQuestion);
        
        setIsTyping(false);
        const botResponse = {
          id: Date.now() + 1,
          text: botResponseText,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        
      } catch (error) {
        setIsTyping(false);
        const errorResponse = {
          id: Date.now() + 1,
          text: "I apologize, but I encountered an error while processing your request. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorResponse]);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
    // Clear messages when closing chat
    setMessages([]);
    setConnectionError(false);
  };

  return (
    <>
      {!isOpen && (
        <div
          className="fixed bottom-6 right-2 z-50 cursor-pointer"
          onClick={toggleChat}
        >
          <div className="relative w-20 lg:w-30 h-16 flex items-center justify-center">
            <div className="relative w-25 h-20 rounded-full  flex items-center justify-center  transition-all duration-300 hover:scale-110 ">
              <Lottie animationData={BotIcon} loop={true} />
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
            isMinimized ? "w-80 h-25" : "w-80 h-[500px] md:w-96 md:h-[600px]"
          }`}
        >
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 h-full flex flex-col overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div 
              className="bg-gradient-to-r from-[#051923] via-[#0a2a3a] to-[#051923] p-5 text-white relative overflow-hidden cursor-pointer"
              onClick={isMinimized ? maximizeChat : undefined}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
                <div
                  className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-twinkle"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full animate-twinkle"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Lottie animationData={BotIcon} loop={true} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">NeuroLink</h3>
                    <p className="text-xs lg:text-sm opacity-90 flex items-center">
                      <span className={`w-2 h-2 ${connectionError ? 'bg-red-400' : 'bg-green-400'} rounded-full mr-2 animate-pulse`}></span>
                      {connectionError ? 'Connection Error' : 'AI Assistant Online'}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={minimizeChat}
                    className="p-2 cursor-pointer hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 cursor-pointer hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-800 to-gray-900 p-4">
                  {/* Connection Error Banner */}
                  {connectionError && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-xl flex items-center space-x-2">
                      <AlertCircle size={16} className="text-red-400" />
                      <p className="text-red-300 text-sm">
                        Connection to server failed. Responses may be limited.
                      </p>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="w-30 h-8 bg-gradient-to-br from-[#051923] to-[#0a2a3a] rounded-full flex items-center justify-center mr-3 mt-1">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-[#051923] to-[#0a2a3a] text-white rounded-br-md"
                            : "bg-gray-800 border border-gray-600 text-gray-100 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === "user"
                              ? "text-gray-300"
                              : "text-gray-400"
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#051923] to-[#0a2a3a] rounded-full flex items-center justify-center mr-3">
                        <Bot size={16} className="text-white" />
                      </div>
                      <div className="bg-gray-800 border border-gray-600 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 border-t border-gray-700 bg-gray-900 rounded-b-3xl">
                  <div className="flex space-x-3 items-center">
                    <div className="flex-1 relative">
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message to NeuroLink..."
                        rows={2}
                        className="w-full px-4 py-4 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#051923] focus:border-transparent text-sm resize-none bg-gray-800 text-gray-100 placeholder-gray-400 hover:bg-gray-750 transition-colors"
                        style={{ minHeight: "60px", maxHeight: "150px" }}
                        disabled={isTyping}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#051923] to-[#0a2a3a] text-white rounded-2xl hover:from-[#0a2a3a] hover:to-[#051923] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Powered by SL Neurorobotics • Press Enter to send
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default NeuroLinkChatbot;