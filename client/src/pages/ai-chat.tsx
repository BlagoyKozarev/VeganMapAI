import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChat() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history'],
    retry: false,
  });

  useEffect(() => {
    if (chatHistory && typeof chatHistory === 'object' && 'messages' in chatHistory && Array.isArray((chatHistory as any).messages)) {
      setMessages((chatHistory as any).messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [chatHistory]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    },
    onSuccess: async (response: any) => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak if conversation is active
      if (conversationActive) {
        await speakText(response.response);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
  });

  const clearChat = async () => {
    try {
      const response = await fetch('/api/chat/clear', { method: 'POST' });
      if (!response.ok) throw new Error('Failed to clear chat');
      setMessages([]);
      endConversation();
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    await chatMutation.mutateAsync(question);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage.trim();
    setCurrentMessage('');
    
    await chatMutation.mutateAsync(messageToSend);
  };

  // Voice conversation functions
  const startListening = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Гласово разпознаване не се поддържа',
        description: isMobile 
          ? 'Използвайте Chrome на Android или Safari на iOS.'
          : 'Вашият браузър не поддържа гласово разпознаване. Опитайте с Chrome или Safari.',
        variant: 'destructive',
      });
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
    
    // Mobile-specific settings
    if (isMobile) {
      // On mobile, use shorter timeouts
      recognition.grammars = null;
    }

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setCurrentMessage(transcript);
      setIsListening(false);
      
      if (transcript.trim()) {
        // If conversation is active, send immediately
        // If not active, wait 5 seconds for user to complete thought
        const delay = conversationActive ? 0 : 5000;
        
        setTimeout(async () => {
          const userMessage: ChatMessage = {
            role: 'user',
            content: transcript.trim(),
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, userMessage]);
          setCurrentMessage('');
          
          await chatMutation.mutateAsync(transcript.trim());
        }, delay);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Грешка при гласовото разпознаване';
      switch (event.error) {
        case 'not-allowed':
          errorMessage = 'Достъпът до микрофона е отказан. Моля, разрешете достъп в браузъра си.';
          endConversation();
          break;
        case 'no-speech':
          errorMessage = 'Не беше открита реч. Опитайте отново.';
          break;
        case 'audio-capture':
          errorMessage = 'Проблем с микрофона. Проверете дали е свързан правилно.';
          break;
        case 'network':
          errorMessage = 'Мрежова грешка. Проверете интернет връзката си.';
          break;
      }
      
      if (event.error !== 'no-speech') {
        toast({
          title: 'Грешка с гласа',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
      toast({
        title: 'Грешка при стартиране',
        description: 'Не можа да се стартира гласовото разпознаване.',
        variant: 'destructive',
      });
    }
  };

  const resetConversationTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // End conversation after 5 seconds of inactivity if no conversation is active, 7 seconds if active
    const timeoutDelay = conversationActive ? 7000 : 5000;
    timeoutRef.current = setTimeout(() => {
      endConversation();
    }, timeoutDelay);
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
    // Detailed browser support check for mobile
    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    console.log('Detailed browser support check:', {
      hasSpeechRecognition,
      isMobile,
      isIOS,
      isAndroid,
      userAgent: navigator.userAgent,
      isSecureContext: window.isSecureContext,
      location: window.location.href,
      mediaDevicesSupported: navigator.mediaDevices ? true : false
    });

    // Enhanced mobile browser checks
    if (!hasSpeechRecognition) {
      let browserMessage = 'Браузърът не поддържа гласово разпознаване.';
      
      if (isIOS) {
        browserMessage = 'Използвайте Safari на iOS за най-добра поддръжка на гласовото разпознаване.';
      } else if (isAndroid) {
        browserMessage = 'Използвайте Chrome на Android устройство за гласово разпознаване.';
      } else if (isMobile) {
        browserMessage = 'Опитайте с Chrome на Android или Safari на iOS устройство.';
      }
      
      toast({
        title: 'Гласът не се поддържа',
        description: browserMessage,
        variant: 'destructive',
      });
      return;
    }

    // Enhanced HTTPS and permission checks for mobile
    if (isMobile) {
      if (!window.isSecureContext) {
        toast({
          title: 'Изисква се сигурна връзка',
          description: 'Гласовото разпознаване работи само през HTTPS връзка. Отворете в браузър с https://',
          variant: 'destructive',
        });
        return;
      }

      // Additional mobile-specific checks
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast({
          title: 'Медийният достъп не се поддържа',
          description: 'Вашият мобилен браузър не поддържа достъп до микрофон.',
          variant: 'destructive',
        });
        return;
      }
    }

    if (conversationActive) {
      // End conversation if already active
      endConversation();
      toast({
        title: 'Разговорът приключи',
        description: 'Гласовият разговор беше спрян.',
      });
      return;
    }

    // Mobile-specific permission handling
    try {
      console.log('Requesting microphone permission for mobile device...');
      
      // Try to get media stream permission first
      let stream;
      try {
        // Enhanced mobile microphone request with fallbacks
        const audioConstraints = isMobile ? {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 16000, // Lower sample rate for mobile
            channelCount: 1
          }
        } : {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        };
        
        stream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        console.log('Microphone access granted');
        
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
      } catch (mediaError) {
        console.error('Media permission error:', mediaError);
        
        let errorMessage = 'Моля, разрешете достъп до микрофона.';
        console.error('MediaError details:', {
          name: mediaError.name,
          message: mediaError.message,
          stack: mediaError.stack,
          isMobile,
          isIOS,
          isAndroid
        });
        
        if (mediaError instanceof Error) {
          switch (mediaError.name) {
            case 'NotAllowedError':
              errorMessage = isMobile 
                ? 'Достъпът до микрофона е отказан. В настройките на браузъра разрешете достъп до микрофон за този сайт.'
                : 'Достъпът до микрофона е отказан. Кликнете иконата за заключване до URL-а и разрешете микрофон.';
              break;
            case 'NotFoundError':
              errorMessage = isMobile
                ? 'Микрофон не е намерен. Проверете дали устройството има микрофон.'
                : 'Микрофон не е намерен на устройството.';
              break;
            case 'NotSupportedError':
              errorMessage = isIOS
                ? 'Използвайте Safari браузър на iOS за гласово разпознаване.'
                : isAndroid
                  ? 'Използвайте Chrome браузър на Android за гласово разпознаване.'
                  : 'Браузърът не поддържа достъп до микрофон.';
              break;
            case 'AbortError':
              errorMessage = 'Заявката за микрофон беше прекратена от потребителя.';
              break;
            case 'NotReadableError':
              errorMessage = isMobile
                ? 'Микрофонът се използва от друго приложение. Затворете други приложения които използват микрофона.'
                : 'Микрофонът не може да бъде достъпен. Възможно е да се използва от друго приложение.';
              break;
            case 'OverconstrainedError':
              errorMessage = 'Настройките на микрофона не са поддържани. Опитайте с друг браузър.';
              break;
            default:
              errorMessage = isMobile 
                ? `Проблем с микрофона (${mediaError.name}). Опитайте да рефрешнете страницата или използвайте друг браузър.`
                : `Грешка при достъп до микрофона: ${mediaError.name}`;
          }
        }
        
        toast({
          title: 'Няма достъп до микрофон',
          description: errorMessage,
          variant: 'destructive',
        });
        return;
      }
      
      // If we get here, microphone permission was granted
      setConversationActive(true);
      setIsRecording(true);
      
      toast({
        title: 'Гласов разговор започнат',
        description: isMobile 
          ? 'Говорете сега на български език. Натиснете микрофона за да спрете.'
          : 'Говорете на български език. Кликнете микрофона отново за да спрете.',
      });
      
      // Start speech recognition immediately after getting permission
      setTimeout(() => {
        startListening();
      }, 500);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: 'Грешка',
        description: 'Неочаквана грешка при стартиране на гласовия разговор.',
        variant: 'destructive',
      });
      return;
    }
  };

  const speakText = async (text: string) => {
    return new Promise<void>((resolve) => {
      if (!('speechSynthesis' in window)) {
        console.log('Speech synthesis not supported');
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bg-BG';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
        
        // Start listening for next question after AI finishes speaking
        if (conversationActive) {
          setTimeout(() => {
            if (conversationActive) {
              startListening();
            }
          }, 1000); // Wait 1 second after AI finishes speaking
        }
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
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
            <div className="flex items-center space-x-3">
              <button 
                onClick={clearChat}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                title="Clear chat history"
              >
                Clear
              </button>
              <button 
                onClick={() => setLocation('/')}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        {/* Voice Conversation Status */}
        {conversationActive && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700 font-medium">
              🎙️ Гласов разговор активен - {isListening ? 'Слушам...' : isSpeaking ? 'Говоря...' : 'Готов'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Разговорът ще приключи след {conversationActive ? '7' : '5'} секунди бездействие
            </p>
            <p className="text-xs text-blue-500 mt-1">
              💡 Кликнете микрофона отново за да спрете разговора
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
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-full bg-vegan-green flex items-center justify-center mr-3 flex-shrink-0 animate-pulse">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <div className="bg-vegan-light-green rounded-2xl rounded-tl-md p-4 max-w-xs md:max-w-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-vegan-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed bottom section with voice button and text input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Voice Recording Button */}
          <div className="flex items-center justify-center mb-6">
            <button
              onClick={handleVoiceRecording}
              disabled={chatMutation.isPending || isSpeaking}
              className={`
                p-6 rounded-full border-2 transition-all duration-200 text-2xl
                ${conversationActive
                  ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                  : isRecording
                    ? 'bg-red-500 border-red-500 text-white animate-pulse'
                    : isSpeaking
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                touch-manipulation active:scale-95
              `}
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                WebkitUserSelect: 'none',
                userSelect: 'none'
              }}
            >
              🎤
            </button>
          </div>

          {/* Status Messages */}
          <div className="text-center mb-4">
            {isListening && (
              <p className="text-sm text-blue-600 animate-pulse">🎙️ Слушам...</p>
            )}
            {isSpeaking && (
              <p className="text-sm text-orange-600 animate-pulse">🗣️ Говоря...</p>
            )}
            {conversationActive && !isListening && !isSpeaking && (
              <p className="text-sm text-green-600">✅ Готов за разговор</p>
            )}
            {!conversationActive && (
              <p className="text-sm text-gray-500">Кликнете микрофона за гласов разговор</p>
            )}
          </div>

          {/* Text Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Напишете съобщение..."
              className="flex-1 resize-none min-h-[44px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button 
              type="submit" 
              disabled={!currentMessage.trim() || chatMutation.isPending}
              className="bg-vegan-green hover:bg-vegan-green/90 text-white px-6"
            >
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}