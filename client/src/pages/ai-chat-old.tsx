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
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationActive, setConversationActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
      const aiMessage = response.message || response.response;
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      // Auto-speak if conversation is active
      if (conversationActive) {
         + '...');
        try {
           function...');
          await speakText(aiMessage);
          // Continue listening after AI responds - 2 second delay per user preference
          setTimeout(() => {
            if (conversationActive && !isSpeaking) {
              startWhisperRecording();
            }
          }, 2000);
        } catch (error) {
          // Still continue conversation even if TTS fails
          setTimeout(() => {
            if (conversationActive && !isSpeaking) {
              startWhisperRecording();
            }
          }, 2000);
        }
      } else {
      }
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
  });
  const clearChatMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/chat/clear', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to clear chat: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      // Clear local state immediately
      setMessages([]);
      endConversation();
      toast({
        title: 'Диалозите са изтрити',
        description: 'Всички съобщения са премахнати от базата данни.',
      });
      // Force refetch of chat history to ensure clean state
      queryClient.removeQueries({ queryKey: ['/api/chat/history'] });
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
    onError: (error) => {
      toast({
        title: 'Грешка',
        description: 'Неуспешно изтриване на диалозите.',
        variant: 'destructive',
      });
    },
  });
  const clearChat = () => {
    clearChatMutation.mutate();
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
      setIsListening(false);
      let errorMessage = 'Грешка при гласовото разпознаване';
      let shouldShowToast = true;
      switch (event.error) {
        case 'not-allowed':
          errorMessage = isMobile 
            ? 'Достъпът до микрофона е отказан. Разрешете достъп в настройките на браузъра и опитайте отново.'
            : 'Достъпът до микрофона е отказан. Кликнете на иконата за заключване в адресната лента и разрешете микрофон.';
          endConversation();
          break;
        case 'no-speech':
          errorMessage = 'Не беше открита реч. Говорете по-ясно и по-силно.';
          shouldShowToast = false; // Don't show toast for no-speech, just retry
          if (conversationActive) {
            // Auto-retry after short delay
            setTimeout(() => {
              if (conversationActive) startListening();
            }, 1000);
          }
          break;
        case 'audio-capture':
          errorMessage = isMobile
            ? 'Проблем с микрофона. Проверете дали друго приложение не използва микрофона.'
            : 'Проблем с микрофона. Проверете дали е свързан правилно.';
          endConversation();
          break;
        case 'network':
          errorMessage = 'Мрежова грешка. Проверете интернет връзката си.';
          endConversation();
          break;
        case 'service-not-allowed':
          errorMessage = isMobile 
            ? 'Гласовото разпознаване не се поддържа на мобилни устройства в момента. Използвайте текстовото поле за съобщения.'
            : 'Гласовото разпознаване не е разрешено за този сайт.';
          endConversation();
          break;
        case 'bad-grammar':
          errorMessage = 'Проблем с езиковите настройки. Опитайте отново.';
          break;
        default:
          errorMessage = `Грешка в гласовото разпознаване: ${event.error}. Опитайте отново.`;
          endConversation();
      }
      if (shouldShowToast) {
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
    if (conversationActive) {
      // End conversation if already active
      endConversation();
      toast({
        title: 'Разговорът приключи',
        description: 'Гласовият разговор беше спрян.',
      });
      return;
    }
    // Start Whisper-based voice recognition (works on mobile!)
    try {
      setConversationActive(true);
      setIsRecording(true);
      toast({
        title: 'Гласов разговор започнат',
        description: isMobile 
          ? 'Говорете на български език. Използваме Whisper AI за точно разпознаване.'
          : 'Говорете на български език. Кликнете микрофона отново за да спрете.',
      });
      setTimeout(() => {
        startWhisperRecording();
      }, 300);
    } catch (error) {
      endConversation();
      toast({
        title: 'Грешка',
        description: 'Проблем при стартиране на гласовия разговор.',
        variant: 'destructive',
      });
    }
  };
  // Whisper API voice recognition (works on mobile!)
  const startWhisperRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000, // Higher quality for better Bulgarian recognition
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true // Better volume normalization
        } 
      });
      setIsListening(true);
      setIsRecording(true);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus' 
          : 'audio/webm'
      });
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      mediaRecorder.onstop = async () => {
        setIsRecording(false);
        setIsListening(false);
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Send to Whisper API
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', 'bg');
          formData.append('model', 'whisper-1');
          formData.append('response_format', 'json');
          formData.append('temperature', '0.2'); // Lower for more accurate transcription
          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            credentials: 'include',
            body: formData
          });
          if (!response.ok) {
            throw new Error(`Whisper API error: ${response.status}`);
          }
          const result = await response.json();
          if (result.text && result.text.trim()) {
            const userMessage: ChatMessage = {
              role: 'user',
              content: result.text.trim(),
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
            // Ensure conversation is active for speech synthesis
            if (!conversationActive) {
              setConversationActive(true);
            }
            await chatMutation.mutateAsync(result.text.trim());
          } else {
            toast({
              title: 'Не беше засечена реч',
              description: 'Опитайте отново да говорите по-ясно.',
              variant: 'default',
            });
          }
          // Continue listening if conversation is active - reduced to 2 seconds
          if (conversationActive && !isSpeaking) {
            setTimeout(() => {
              if (conversationActive && !isSpeaking) {
                startWhisperRecording();
              }
            }, 2000); // Reduced from 1500ms to 2000ms for user preference
          }
        } catch (error) {
          toast({
            title: 'Грешка при разпознаване',
            description: 'Проблем със speech-to-text услугата. Опитайте отново.',
            variant: 'destructive',
          });
          if (conversationActive) {
            endConversation();
          }
        }
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };
      // Record for 8 seconds max - balance between accuracy and response speed
      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 8000); // Optimized 8 seconds for faster response
      // Store reference for manual stop
      (window as any).currentMediaRecorder = mediaRecorder;
    } catch (error) {
      setIsRecording(false);
      setIsListening(false);
      toast({
        title: 'Грешка с микрофона',
        description: 'Не можах да получа достъп до микрофона. Проверете разрешенията.',
        variant: 'destructive',
      });
      if (conversationActive) {
        endConversation();
      }
    }
  };
  // OpenAI TTS API for reliable speech synthesis
  const speakText = async (text: string): Promise<void> => {
     + '...');
    try {
      setIsSpeaking(true);
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          text: text,
          voice: 'nova', // OpenAI TTS voice - good for Bulgarian
          model: 'tts-1'
        })
      });
      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }
      // Get audio blob from response
      const audioBlob = await response.blob();
      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      return new Promise<void>((resolve) => {
        audio.onloadeddata = () => {
        };
        audio.onplay = () => {
        };
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
          // Continue conversation after speech ends
          if (conversationActive) {
            setTimeout(() => {
              if (conversationActive && !isSpeaking) {
                startWhisperRecording();
              }
            }, 2000);
          }
        };
        audio.onerror = (error) => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
          // Continue conversation even if TTS fails
          if (conversationActive) {
            setTimeout(() => {
              if (conversationActive && !isSpeaking) {
                startWhisperRecording();
              }
            }, 2000);
          }
        };
        // Start playback
        audio.play().catch(error => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        });
      });
    } catch (error) {
      setIsSpeaking(false);
      // Continue conversation even if TTS completely fails
      if (conversationActive) {
        setTimeout(() => {
          if (conversationActive && !isSpeaking) {
            startWhisperRecording();
          }
        }, 2000);
      }
    }
  };
        // Start listening for next question after AI finishes speaking
        if (conversationActive) {
          setTimeout(() => {
            if (conversationActive) {
              startWhisperRecording();
            }
          }, 2000); // Wait 2 seconds after AI finishes speaking - user preference
        }
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        resolve();
        // Continue listening even if speech synthesis fails
        if (conversationActive) {
          setTimeout(() => {
            if (conversationActive) {
              startWhisperRecording();
            }
          }, 2000); // Consistent 2-second delay for all scenarios
        }
      };
       with utterance:', utterance);
      // Important: Start speaking immediately after user interaction
      try {
         with text:', text.substring(0, 50) + '...');
        window.speechSynthesis.speak(utterance);
         called successfully');
        // Check if speech started after delay
        setTimeout(() => {
          const speaking = window.speechSynthesis.speaking;
          const pending = window.speechSynthesis.pending;
          if (!speaking && !pending) {
            window.speechSynthesis.resume();
            // Check again after resume
            setTimeout(() => {
              if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                setIsSpeaking(false);
                resolve();
              }
            }, 100);
          }
        }, 300);
      } catch (error) {
        :', error);
        resolve();
        return;
      }
      // Debug: check if speaking started
      setTimeout(() => {
        // If not speaking after 500ms, try to resume
        if (!window.speechSynthesis.speaking && window.speechSynthesis.pending) {
          window.speechSynthesis.resume();
        }
      }, 500);
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
      {/* Google Maps style bottom input panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-4xl mx-auto p-4">
          {/* Status and clear button row */}
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-600">
              {isListening && <span className="text-red-500">🔴 Слушам...</span>}
              {isSpeaking && <span className="text-orange-500">🟠 Говоря...</span>}
              {!isListening && !isSpeaking && !conversationActive && (
                <span className="text-green-500">🟢 Готов за въпроси</span>
              )}
            </div>
            {messages.length > 0 && (
              <Button 
                onClick={clearChat} 
                disabled={clearChatMutation.isPending}
                variant="outline" 
                size="sm"
                className="text-gray-600 hover:text-red-600 disabled:opacity-50"
              >
                {clearChatMutation.isPending ? '...' : 'Изчисти'}
              </Button>
            )}
          </div>
          {/* Google Maps style search input with integrated controls */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Задайте въпрос за вегански ресторанти..."
                className={`
                  w-full px-4 py-3 pr-12 rounded-full border-2 border-gray-300 focus:border-vegan-green focus:outline-none
                  ${isMobile ? 'text-base' : 'text-sm'}
                `}
                style={{
                  fontSize: isMobile ? '16px' : '14px',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              {/* Microphone button at the end of input - Google Maps style */}
              <button
                type="button"
                onClick={handleVoiceRecording}
                disabled={chatMutation.isPending || isSpeaking}
                className={`
                  absolute right-2 top-1/2 transform -translate-y-1/2
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 text-sm
                  ${conversationActive
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : isSpeaking
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                  }
                  touch-manipulation active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                🎤
              </button>
            </div>
            {/* Send button - Google Maps style */}
            <Button 
              type="submit" 
              disabled={!currentMessage.trim() || chatMutation.isPending}
              className={`
                bg-vegan-green hover:bg-vegan-green/90 text-white rounded-full shadow-md
                ${isMobile ? 'w-12 h-12 p-0 flex items-center justify-center' : 'px-6 py-3'}
              `}
            >
              {chatMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : isMobile ? (
                '➤'
              ) : (
                'Изпрати'
              )}
            </Button>
          </form>
          {/* Help text - minimal and clean */}
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isMobile 
              ? 'Задайте въпрос с текст или използвайте микрофона (Whisper AI)'
              : 'Задайте въпрос или използвайте микрофона за гласов разговор'
            }
          </p>
        </div>
      </div>
    </div>
  );
}