import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Bot, User, Loader2, Minimize2, Maximize2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant for BScAI Unity. I can help you with questions about the B.Sc. Applied AI & Data Science program, concerns, and general support. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Using a more reliable free AI API or fallback to local responses
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-demo-key'}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI assistant for BScAI Unity, a platform for B.Sc. Applied AI & Data Science students at IIT Jodhpur. You help students with:
              - Questions about the B.Sc. Applied AI & Data Science program
              - Academic concerns and issues
              - Information about the program structure, curriculum, and requirements
              - General support and guidance for students
              - Information about the student community and platform features

              Keep responses helpful, concise, and relevant to the academic context. If you don't know something specific about the program, suggest they contact the admin or submit a concern through the platform.`
            },
            {
              role: 'user',
              content: currentInput
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      let botResponseText;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      botResponseText = data.choices[0].message.content;

      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);

      // Provide intelligent fallback responses
      const fallbackResponse = getFallbackResponse(currentInput);

      const botMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      // Show toast notification about connection issue
      toast({
        title: "Connection Issue",
        description: "I'm having trouble connecting to the AI service, but I can still help with basic questions!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getFallbackResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes('concern') || input.includes('problem') || input.includes('issue')) {
      return "I understand you have a concern. You can submit your concern through our platform using the 'Add Concern' button. Our admin team will respond via email or through the platform. Would you like me to guide you to the concern submission page?";
    }

    if (input.includes('course') || input.includes('curriculum') || input.includes('syllabus')) {
      return "The B.Sc. Applied AI & Data Science program at IIT Jodhpur covers machine learning, data science, programming, mathematics, and AI applications. You can find detailed information on our 'About Course' page. For specific curriculum questions, please submit a concern for official guidance.";
    }

    if (input.includes('admission') || input.includes('eligibility') || input.includes('fees')) {
      return "For admission-related queries including eligibility criteria and fees (₹1,09,000 annually + ₹10,000 application fee), I recommend submitting a concern through our platform for official guidance from the admin team.";
    }

    if (input.includes('faculty') || input.includes('professor') || input.includes('teacher')) {
      return "For faculty-related information or to connect with professors, you can submit a query through our concern system. Our admin team can help coordinate with the appropriate faculty members.";
    }

    if (input.includes('technical') || input.includes('login') || input.includes('platform')) {
      return "For technical issues with the learning platform or login problems, please submit a technical concern through our platform. Include details about the specific issue you're experiencing for faster resolution.";
    }

    if (input.includes('hi') || input.includes('hello') || input.includes('hey')) {
      return "Hello! I'm here to help with your B.Sc. Applied AI & Data Science program questions. You can ask about the course, submit concerns, or get general guidance. What would you like to know?";
    }

    return "I'm here to help with your B.Sc. Applied AI & Data Science program questions! I can provide information about the course, help you submit concerns, and offer general guidance. You can also submit detailed queries through our concern system where our admin team will provide comprehensive responses. What specific topic would you like help with?";
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: "Hi! I'm your AI assistant for BScAI Unity. I can help you with questions about the B.Sc. Applied AI & Data Science program, concerns, and general support. How can I help you today?",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  const submitConcern = () => {
    window.location.href = '/add-concern';
  };

  useEffect(() => {
    // Generate user session ID
    const sessionId = localStorage.getItem('userSessionId') || 'student_' + Date.now();
    localStorage.setItem('userSessionId', sessionId);

    // Generate HMAC for identity verification (in production, this should be done server-side)
    const generateHMAC = async (userId, secretKey) => {
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secretKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(userId));
      return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    };

    // Add chatbot script with identity verification
    const initChatbot = async () => {
      const secretKey = 'txl0'; // In production, get this from environment variables
      const hmac = await generateHMAC(sessionId, secretKey);

      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.setAttribute('chatbotId', 'a7jpgyqmt1iix6kkckon1c9wmfzmtxl0');
      script.setAttribute('domain', 'www.chatbase.co');
      script.setAttribute('userId', sessionId);
      script.setAttribute('userHmac', hmac);
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    };

    const cleanup = initChatbot();
    return cleanup;
  }, []);


  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-2 border-blue-500"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 ${isMinimized ? 'w-72 sm:w-80' : 'w-80 sm:w-96'} max-w-[calc(100vw-2rem)]`}
    >
      <Card className="shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-300 rounded-full"></div>
                </div>
              </div>
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6 sm:h-8 sm:w-8"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <Minimize2 className="h-3 w-3 sm:h-4 sm:w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-6 w-6 sm:h-8 sm:w-8"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-80 sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/10">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 sm:gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        {message.isBot && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full"></div>
                            </div>
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] p-2 sm:p-3 rounded-lg text-xs sm:text-sm ${
                            message.isBot
                              ? 'bg-blue-50 border border-blue-200 text-gray-800'
                              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!message.isBot && (
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                            <User className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-2 sm:gap-3 justify-start"
                    >
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-300 rounded-full"></div>
                        </div>
                      </div>
                      <div className="bg-background border border-border p-2 sm:p-3 rounded-lg">
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about the program..."
                      disabled={isLoading}
                      className="flex-1 text-xs sm:text-sm"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      AI-powered Assistant
                    </span>
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={submitConcern}
                        className="text-xs text-blue-600 hover:text-blue-800 p-1 h-auto"
                      >
                        Submit Concern
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="text-xs p-1 h-auto"
                      >
                        Clear Chat
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default Chatbot;