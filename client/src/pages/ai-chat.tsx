import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { apiRequest } from '@/lib/queryClient';
import TabNavigation from '@/components/layout/TabNavigation';
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  suggestions?: string[];
  restaurantRecommendations?: {
    id: string;
    name: string;
    reason: string;
  }[];
}
import { useToast } from '@/hooks/use-toast';

export default function AiChat() {
  const [, setLocation] = useLocation();
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your vegan dining assistant. I can help you find great vegan-friendly restaurants, explain our scoring system, and provide personalized recommendations. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history'],
    staleTime: 1000 * 60, // 1 minute
  });

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/chat', { message });
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (response) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      speakText(response.message);
      
      // Start listening for next question after AI responds
      if (conversationActive) {
        setTimeout(() => {
          if (conversationActive && !isSpeaking) {
            startListening();
          }
        }, 5000); // Wait 5 seconds after AI starts speaking
      }
    },
    onError: (error) => {
      toast({
        title: 'Chat Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Initialize chat history
  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory.messages)) {
      setMessages(chatHistory.messages);
    } else {
      // Add welcome message if no history
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I'm your VeganAI assistant. I can help you find amazing vegan places, explain our scoring system, and answer any questions about plant-based dining. How can I help you today?",
          timestamp: new Date(),
        }
      ]);
    }
  }, [chatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    await chatMutation.mutateAsync(currentMessage.trim());
  };

  const handleQuickQuestion = (question: string) => {
    setCurrentMessage(question);
    handleSendMessage();
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(true);
    resetConversationTimeout();
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'bg-BG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);
      setIsListening(false);
      
      if (transcript.trim()) {
        const userMessage: ChatMessage = {
          role: 'user',
          content: transcript.trim(),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        
        await chatMutation.mutateAsync(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        // Wait 5 seconds before restarting after no speech detected
        if (conversationActive) {
          setTimeout(() => {
            if (conversationActive) {
              startListening();
            }
          }, 5000);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (conversationActive && !chatMutation.isPending) {
        // Wait 5 seconds before restarting to let user complete their thought
        setTimeout(() => {
          if (conversationActive) {
            startListening();
          }
        }, 5000);
      }
    };

    recognition.start();
  };

  const resetConversationTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // End conversation after 7 seconds of inactivity
    timeoutRef.current = setTimeout(() => {
      endConversation();
    }, 7000);
  };

  const endConversation = () => {
    setConversationActive(false);
    setIsListening(false);
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleVoiceRecording = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice not supported',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive',
      });
      return;
    }

    if (conversationActive) {
      // End conversation if already active
      endConversation();
      return;
    }

    // Start continuous conversation
    setConversationActive(true);
    setIsRecording(true);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.lang = 'bg-BG';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);
      setIsRecording(false);
      
      if (transcript.trim()) {
        const userMessage: ChatMessage = {
          role: 'user',
          content: transcript.trim(),
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setCurrentMessage('');
        
        await chatMutation.mutateAsync(transcript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bg-BG'; // Bulgarian
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      
      // Start listening for next question after AI finishes speaking
      if (conversationActive) {
        setTimeout(() => {
          if (conversationActive) {
            startListening();
          }
        }, 5000); // Wait 5 seconds after AI finishes speaking
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const quickQuestions = [
    "How is scoring calculated?",
    "Find nearby vegan places",
    "Allergy-friendly options",
    "Best vegan restaurants",
    "Explain vegan score breakdown"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col pb-20">
      {/* Header with Back Link */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-vegan-green rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-robot text-white"></i>
              </div>
              <div>
                <h1 className="text-lg font-poppins font-semibold">VeganAI Assistant</h1>
                <p className="text-sm text-vegan-green">Online</p>
              </div>
            </div>
            <button 
              onClick={() => setLocation('/')}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Back
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        {/* Voice Conversation Status */}
        {conversationActive && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700 font-medium">
              🎙️ Voice conversation active - {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Ready'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Conversation will end after 7 seconds of inactivity
            </p>
          </div>
        )}

        {/* Quick Action Questions */}
        {!conversationActive && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-3 text-sm"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message flex items-start ${
                message.role === 'user' ? 'justify-end' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors ${
                  isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-vegan-green'
                }`}>
                  <i className="fas fa-robot text-white text-sm"></i>
                </div>
              )}
              <div
                className={`rounded-2xl p-4 max-w-xs md:max-w-sm ${
                  message.role === 'user'
                    ? 'bg-vegan-green text-white rounded-tr-md'
                    : 'bg-vegan-light-green rounded-tl-md'
                }`}
              >
                <div className="flex flex-col">
                  <p className={`font-opensans ${
                    message.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {message.content}
                  </p>
                  {message.role === 'assistant' && (
                    <div className="flex items-center mt-2 space-x-2">
                      <button
                        onClick={() => speakText(message.content)}
                        disabled={isSpeaking}
                        className="text-xs text-gray-500 hover:text-vegan-green transition-colors flex items-center"
                        title="Speak message"
                      >
                        <i className="fas fa-volume-up mr-1"></i>
                        Play
                      </button>
                      {isSpeaking && (
                        <button
                          onClick={stopSpeaking}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors flex items-center"
                          title="Stop speaking"
                        >
                          <i className="fas fa-stop mr-1"></i>
                          Stop
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {chatMutation.isPending && (
            <div className="chat-message flex items-start">
              <div className="w-8 h-8 bg-vegan-green rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-vegan-light-green rounded-2xl rounded-tl-md p-4 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Action Buttons */}
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2 justify-center py-4 mt-6">
            {quickQuestions.map((question) => (
              <Button
                key={question}
                variant="outline"
                onClick={() => handleQuickQuestion(question)}
                className="bg-white border border-vegan-green text-vegan-green px-4 py-2 rounded-full text-sm font-opensans font-medium hover:bg-vegan-light-green transition-colors"
              >
                {question}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything about vegan dining..."
                className="w-full p-4 pr-12 border border-gray-200 rounded-2xl outline-none focus:border-vegan-green transition-colors font-opensans"
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                disabled={chatMutation.isPending}
              />
              {/* Send Button in Input */}
              <Button
                variant="ghost"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 text-gray-500 hover:text-vegan-green transition-colors font-medium text-sm"
                onClick={handleSendMessage}
                disabled={!currentMessage.trim() || chatMutation.isPending}
                title="Send Message"
              >
                Send
              </Button>
            </div>
            {/* Microphone Button Outside */}
            <Button
              variant="ghost"
              className="w-10 h-10 p-0"
              title={conversationActive ? "End Voice Conversation" : "Start Voice Conversation"}
              onClick={handleVoiceRecording}
              disabled={chatMutation.isPending}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                conversationActive 
                  ? (isRecording || isListening) 
                    ? 'bg-red-500 animate-pulse' 
                    : 'bg-orange-500'
                  : 'bg-green-500'
              }`}>
                <span className="text-white text-lg font-bold">
                  {conversationActive ? (isListening ? '👂' : '🎤') : '🎤'}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
      
      <TabNavigation currentTab="agent" />
    </div>
  );
}
