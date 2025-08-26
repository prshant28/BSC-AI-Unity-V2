
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
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-proj-test-key'
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
              content: input
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        text: data.choices[0].message.content,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide a helpful fallback response instead of just an error
      const fallbackResponse = getFallbackResponse(input);
      
      const botMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
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
      return "I understand you have a concern. I'd be happy to help! You can submit your concern through our platform, and if you need immediate assistance, our admin team will respond via email or through the platform. Would you like me to guide you to the concern submission page?";
    }
    
    if (input.includes('course') || input.includes('curriculum') || input.includes('syllabus')) {
      return "The B.Sc. Applied AI & Data Science program at IIT Jodhpur covers machine learning, data science, programming, mathematics, and AI applications. For specific curriculum details, you can check the course information page or submit a query to our admin team.";
    }
    
    if (input.includes('admission') || input.includes('eligibility') || input.includes('fees')) {
      return "For admission-related queries including eligibility criteria and fees, I recommend contacting the admissions office directly or submitting a concern through our platform for official guidance from the admin team.";
    }
    
    if (input.includes('faculty') || input.includes('professor') || input.includes('teacher')) {
      return "For faculty-related information or to connect with professors, you can submit a query through our concern system. Our admin team can help coordinate with the appropriate faculty members.";
    }
    
    return "I'm here to help with your B.Sc. Applied AI & Data Science program questions! While I'm experiencing some connectivity issues, I can guide you to submit concerns through our platform where our admin team will provide detailed responses via email or the platform. What specific topic would you like help with?";
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

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-16 h-16 shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500"
        >
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'}`}
    >
      <Card className="shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-2 bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <Bot className="h-5 w-5 text-blue-600" />
              </div>
              AI Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
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
                <div className="h-96 overflow-y-auto p-4 space-y-4 bg-muted/10">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
                      >
                        {message.isBot && (
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.isBot
                              ? 'bg-blue-50 border border-blue-200 text-gray-800'
                              : 'bg-blue-600 text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {!message.isBot && (
                          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-background border border-border p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about the program..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      AI-powered Assistant
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={submitConcern}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Submit Concern
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearChat}
                        className="text-xs"
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
