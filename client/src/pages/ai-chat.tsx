import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChat() {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationActive, setConversationActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const quickQuestions = [
    "Какви са най-добрите веган ресторанти в София?",
    "Кажи ми за ресторанти с високи веган оценки",
    "Къде мога да намеря веган пица в центъра?",
    "Препоръчай ми място за веган закуска"
  ];

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ['/api/chat/history'],
    retry: false,
  });

  useEffect(() => {
    if (chatHistory && Array.isArray(chatHistory)) {
      setMessages(chatHistory.map((msg: any) => ({
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
        console.log('🔊 Voice conversation active, speaking response:', aiMessage.substring(0, 50) + '...');
        console.log('🔍 conversationActive:', conversationActive, 'isSpeaking:', isSpeaking);
        
        try {
          console.log('📞 Calling speakText() function...');
          await speakText(aiMessage);
          console.log('✅ Speech synthesis completed successfully');
          
          // Continue listening after AI responds - 2 second delay per user preference
          setTimeout(() => {
            if (conversationActive && !isSpeaking) {
              console.log('🎤 Restarting voice recording after 2 seconds');
              startWhisperRecording();
            }
          }, 2000);
        } catch (error) {
          console.error('❌ Speech synthesis failed:', error);
          
          // Still continue conversation even if TTS fails
          setTimeout(() => {
            if (conversationActive && !isSpeaking) {
              console.log('🎤 Restarting voice recording after TTS error');
              startWhisperRecording();
            }
          }, 2000);
        }
      } else {
        console.log('🔇 Voice conversation NOT active - skipping speech synthesis');
        console.log('🔍 conversationActive:', conversationActive);
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
        console.error('Clear chat error:', response.status, errorText);
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
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
    onError: (error) => {
      console.error('Failed to clear chat:', error);
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

  // OpenAI TTS API for reliable speech synthesis
  const speakText = async (text: string): Promise<void> => {
    console.log('🎯 Starting OpenAI TTS for:', text.substring(0, 50) + '...');
    
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
      console.log('📢 Received TTS audio blob, size:', audioBlob.size, 'bytes');
      
      // Create audio URL and play
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      return new Promise<void>((resolve) => {
        audio.onloadeddata = () => {
          console.log('✅ TTS audio loaded, duration:', audio.duration, 'seconds');
        };
        
        audio.onplay = () => {
          console.log('▶️ TTS audio playback started');
        };
        
        audio.onended = () => {
          console.log('🏁 TTS audio playback ended');
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
          
          // Continue conversation after speech ends
          if (conversationActive) {
            setTimeout(() => {
              if (conversationActive && !isSpeaking) {
                console.log('🎤 Continuing conversation after TTS ended');
                startWhisperRecording();
              }
            }, 2000);
          }
        };
        
        audio.onerror = (error) => {
          console.error('❌ TTS audio playback error:', error);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
          
          // Continue conversation even if TTS fails
          if (conversationActive) {
            setTimeout(() => {
              if (conversationActive && !isSpeaking) {
                console.log('🎤 Continuing conversation after TTS error');
                startWhisperRecording();
              }
            }, 2000);
          }
        };
        
        // Start playback
        audio.play().catch(error => {
          console.error('❌ Failed to start TTS audio playback:', error);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        });
      });
      
    } catch (error) {
      console.error('❌ OpenAI TTS error:', error);
      setIsSpeaking(false);
      
      // Continue conversation even if TTS completely fails
      if (conversationActive) {
        setTimeout(() => {
          if (conversationActive && !isSpeaking) {
            console.log('🎤 Continuing conversation after TTS API error');
            startWhisperRecording();
          }
        }, 2000);
      }
    }
  };

  const endConversation = () => {
    setConversationActive(false);
    setIsListening(false);
    setIsRecording(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
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
      console.log('🎤 Starting voice conversation - setting conversationActive to true');
      setConversationActive(true);
      setIsRecording(true);
      
      toast({
        title: 'Гласов разговор започнат',
        description: isMobile 
          ? 'Говорете на български език. Използваме Whisper AI за точно разпознаване.'
          : 'Говорете на български език. Кликнете микрофона отново за да спрете.',
      });
      
      setTimeout(() => {
        console.log('🚀 Starting Whisper recording in 300ms');
        startWhisperRecording();
      }, 300);
      
    } catch (error) {
      console.error('Voice recording error:', error);
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
    console.log('🎙️ Starting Whisper recording - conversationActive:', conversationActive);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000, // High quality for better accuracy
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
          
          console.log('Sending audio to Whisper API, blob size:', audioBlob.size, 'bytes');
          
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
            console.log('🎯 Whisper transcription:', result.text);
            console.log('🔍 About to send to chat - conversationActive:', conversationActive);
            
            const userMessage: ChatMessage = {
              role: 'user',
              content: result.text.trim(),
              timestamp: new Date(),
            };
            setMessages(prev => [...prev, userMessage]);
            
            // Ensure conversation is active for speech synthesis
            if (!conversationActive) {
              console.log('⚠️ Setting conversationActive to true for speech synthesis');
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
          console.error('Whisper API error:', error);
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
      console.log('Starting Whisper recording for 8 seconds - optimized for speed and accuracy');
      
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          console.log('Stopping Whisper recording after 8 seconds');
        }
      }, 8000); // Optimized 8 seconds for faster response
      
      // Store reference for manual stop
      (window as any).currentMediaRecorder = mediaRecorder;
      
    } catch (error) {
      console.error('Microphone access error:', error);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      await chatMutation.mutateAsync(inputMessage);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно изпращане на съобщението.',
        variant: 'destructive',
      });
    }
  };

  const handleQuickQuestion = async (question: string) => {
    const userMessage: ChatMessage = {
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      await chatMutation.mutateAsync(question);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно изпращане на въпроса.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white shadow border-b">
        <div className="p-3">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Напишете съобщение..."
                disabled={chatMutation.isPending}
                className="pr-12"
              />
              <button
                type="button"
                onClick={handleVoiceRecording}
                disabled={chatMutation.isPending}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 ${
                  conversationActive
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : isListening
                    ? 'bg-blue-500 text-white animate-pulse'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={conversationActive ? 'Спри разговора' : 'Започни гласов разговор'}
              >
                <i className={`fas ${conversationActive ? 'fa-stop' : 'fa-microphone'} text-xs`}></i>
              </button>
            </div>
            <Button 
              type="submit" 
              disabled={chatMutation.isPending || !inputMessage.trim()}
              className="bg-vegan-green hover:bg-vegan-green/90"
            >
              {chatMutation.isPending ? 'Изпращане...' : 'Изпрати'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}