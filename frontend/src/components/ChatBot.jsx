import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Bot } from 'lucide-react';

const NeuroLinkChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [hasStartedMessaging, setHasStartedMessaging] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setInputValue('');
      setHasStartedMessaging(true);
      setIsTyping(true);

      // Simulate bot response with typing indicator
      setTimeout(() => {
        setIsTyping(false);
        const botResponse = {
          id: Date.now() + 1,
          text: "Hello! I'm NeuroLink, your advanced AI assistant. I'm here to help you with anything you need. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botResponse]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Interactive Chatbot Icon with Waves - Only show when chat is closed */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={toggleChat}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Main Bot Icon */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-full shadow-2xl flex items-center justify-center hover:shadow-gray-700/25 transition-all duration-300 hover:scale-110 animate-pulse">
              {/* Neural Network Pattern */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 opacity-50 animate-pulse"></div>
              
              {/* Bot Icon */}
              <Bot className="w-8 h-8 text-gray-100 z-10 drop-shadow-lg" />
              
              {/* Glowing Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-80 h-[500px] md:w-96 md:h-[600px]'
        }`}>
          <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 h-full flex flex-col overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#051923] via-[#0a2a3a] to-[#051923] p-5 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
                <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">NeuroLink</h3>
                    <p className="text-sm opacity-90 flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                      AI Assistant Online
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={minimizeChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <Minimize2 size={18} />
                  </button>
                  <button
                    onClick={closeChat}
                    className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-gray-800 to-gray-900">
                  {/* Animated Purple Sphere - Only shown when no messages */}
                  {!hasStartedMessaging && (
                    <div className="flex items-center justify-center h-full">
                      <div className="relative">
                        {/* Main Sphere with Neural Network Effect */}
                        <div className="w-32 h-32 bg-gradient-to-br from-[#051923] via-[#0a2a3a] to-[#051923] rounded-full shadow-2xl relative overflow-hidden">
                          {/* Animated Neural Connections */}
                          <div className="absolute inset-0 rounded-full">
                            <div className="absolute top-4 left-6 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                            <div className="absolute top-8 right-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                            <div className="absolute bottom-6 left-8 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                            <div className="absolute bottom-8 right-6 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.9s'}}></div>
                            {/* Connection Lines */}
                            <div className="absolute top-4 left-6 w-8 h-0.5 bg-white/30 rotate-45 animate-pulse"></div>
                            <div className="absolute top-8 right-8 w-6 h-0.5 bg-white/30 -rotate-45 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          </div>
                          
                          {/* Inner glow */}
                          <div className="absolute inset-3 bg-gradient-to-br from-[#0a2a3a]/60 to-[#051923]/80 rounded-full animate-pulse"></div>
                          
                          {/* Text */}
                          <div className="absolute inset-0 flex items-center justify-center text-center text-white z-10">
                            <div>
                              <p className="text-lg font-bold mb-1">Hi, I'm NeuroLink</p>
                              <p className="text-sm opacity-90">Advanced AI Assistant</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Orbiting Particles */}
                        <div className="absolute inset-0 animate-spin" style={{animationDuration: '8s'}}>
                          <div className="absolute -top-2 left-1/2 w-2 h-2 bg-[#0a2a3a] rounded-full"></div>
                          <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 bg-[#051923] rounded-full"></div>
                          <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-[#0a2a3a] rounded-full"></div>
                          <div className="absolute top-1/2 -left-2 w-1.5 h-1.5 bg-[#051923] rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Messages */}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'bot' && (
                        <div className="w-8 h-8 bg-gradient-to-br from-[#051923] to-[#0a2a3a] rounded-full flex items-center justify-center mr-3 mt-1">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-[#051923] to-[#0a2a3a] text-white rounded-br-md'
                            : 'bg-gray-800 border border-gray-600 text-gray-100 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
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
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message to NeuroLink..."
                        rows={2}
                        className="w-full px-4 py-4 border border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#051923] focus:border-transparent text-sm resize-none bg-gray-800 text-gray-100 placeholder-gray-400 hover:bg-gray-750 transition-colors"
                        style={{minHeight: '60px', maxHeight: '150px'}}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-[#051923] to-[#0a2a3a] text-white rounded-2xl hover:from-[#0a2a3a] hover:to-[#051923] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Powered by NeuroLink AI • Press Enter to send
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default NeuroLinkChatbot;