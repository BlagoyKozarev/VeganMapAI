import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Send, Trash2, ArrowLeft } from 'lucide-react';
// import { requestGPTHelp } from '../../../agent-gpt-helper';

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
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [lastActivityTime, setLastActivityTime] = useState<number>(Date.now());
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Mobile detection with proper logic
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  
  // Check if device supports speech recognition
  const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  console.log('🔍 Device detection:', { 
    userAgent: navigator.userAgent, 
    isMobile, 
    windowWidth: window.innerWidth,
    supportsSpeechRecognition,
    hasMediaDevices: 'mediaDevices' in navigator,
    hasGetUserMedia: navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices
  });
  
  // Debug conversation state
  console.log('🎯 Conversation state:', { 
    conversationActive, 
    isRecording, 
    isProcessing, 
    isSpeaking 
  });

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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const textChatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to send message');
      return await response.json();
    },
    onSuccess: (response: any) => {
      const aiMessage = response.message || response.response;
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: aiMessage,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
  });

  const voiceChatMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/audio', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized access');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: async (data: any) => {
      console.log('🎉 Voice chat success data:', data);
      console.log('🔍 Current conversation state:', { conversationActive, isSpeaking, isRecording, isProcessing });
      
      // Filter out nonsensical or repetitive transcriptions from background noise
      const transcribedText = data.text.toLowerCase().trim();
      const repetitivePatterns = [
        'благодаря ви, че гледахте',
        'абонирайте се',
        'видеоклип',
        'канал',
        'нови видео'
      ];
      
      const isNonsensical = repetitivePatterns.some(pattern => 
        transcribedText.includes(pattern)
      );
      
      if (isNonsensical) {
        console.log('🚫 Detected nonsensical/repetitive transcription, ignoring');
        // Don't update activity time for nonsensical transcriptions
        // Don't continue recording - let the inactivity timer handle it
        return;
      }
      
      // Valid transcription - update last activity time
      setLastActivityTime(Date.now());
      console.log('✅ Valid user input detected, activity time updated');
      
      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: data.text,
        timestamp: new Date(),
      };
      
      // Add AI response
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
      // Always speak the response during voice conversation
      console.log('🔊 Starting TTS for response:', data.reply);
      console.log('🎯 Before TTS - conversationActive:', conversationActive);
      console.log('🔍 SpeechSynthesis support check:', {
        hasSpeechSynthesis: 'speechSynthesis' in window,
        hasUtterance: 'SpeechSynthesisUtterance' in window,
        voices: speechSynthesis ? speechSynthesis.getVoices().length : 0
      });
      
      // FORCE TTS TEST - Direct call
      console.log('🎯 FORCE TTS TEST - About to call speakText with reply:', data.reply);
      console.log('🔍 speakText function exists:', typeof speakText);
      console.log('🔍 conversationActive state:', conversationActive);
      
      // Direct call without conditions
      console.log('🔊 CALLING speakText DIRECTLY...');
      speakText(data.reply)
        .then(() => console.log('✅ TTS Promise resolved'))
        .catch(error => console.error('❌ TTS Promise rejected:', error));
      
      console.log('🔄 TTS call initiated, continuing...');
      
      // TODO: Интегрирай GPT helper когато е необходимо
      
      // Reset activity time on successful conversation
      setLastActivityTime(Date.now());
      
      // Continue conversation after speaking with timeout check
      setTimeout(() => {
        console.log('⏰ Timeout check - conversationActive:', conversationActive, 'isSpeaking:', isSpeaking);
        
        // Force conversation to remain active after successful response
        if (!conversationActive) {
          console.log('🔄 Reactivating conversation after successful response');
          setConversationActive(true);
        }
        
        if (!isSpeaking) {
          console.log('🎙️ Starting next recording after TTS timeout');
          
          // Clear any existing timeout - conversation continues indefinitely
          if (inactivityTimeoutRef.current) {
            clearTimeout(inactivityTimeoutRef.current);
          }
          
          startWhisperRecording();
        }
      }, 2000); // 2 seconds pause between responses as requested
      
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
    onError: (error: any) => {
      console.error('Voice chat error:', error);
      if (error.message === 'Unauthorized access') {
        toast({
          title: "Неоторизиран достъп",
          description: "Моля, влезте в профила си.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Грешка при обработката",
          description: "Възникна проблем при обработката на аудиото.",
          variant: "destructive",
        });
      }
    }
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
        throw new Error(`Failed to clear chat: ${response.status}`);
      }
      return response.json();
    },
    onSuccess: () => {
      setMessages([]);
      endConversation();
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
      toast({
        title: "Чат изчистен",
        description: "Историята на разговора е изтрита.",
      });
    },
    onError: () => {
      toast({
        title: "Грешка",
        description: "Неуспешно изчистване на чата.",
        variant: "destructive",
      });
    }
  });

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      toast({
        title: "Достъп до микрофона отказан",
        description: "Моля, разрешете достъп до микрофона в настройките на браузъра.",
        variant: "destructive",
      });
      return false;
    }
  };

  const startWhisperRecording = async () => {
    if (!permissionGranted) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Check if audio has content (not silent)
        if (audioBlob.size < 1500) { 
          console.log('🔇 Silent recording detected (small file), not updating activity');
          
          // Don't continue recording - let the inactivity timer handle it
          return;
        }
        
        setIsProcessing(true);
        try {
          await voiceChatMutation.mutateAsync(audioBlob);
        } catch (error) {
          console.log('🔇 Error processing audio, continuing...');
        } finally {
          setIsProcessing(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 5 seconds to allow proper speaking time
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 5000); // Increased to allow 2 seconds silence detection
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      toast({
        title: "Грешка при записването",
        description: "Не може да се достъпи микрофонът.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Initialize TTS on first user interaction
  const initializeTTS = () => {
    if (!window.speechSynthesis) return;
    
    console.log('🎵 Initializing TTS with user gesture...');
    
    // Create a silent utterance to initialize the speech synthesis
    const testUtterance = new SpeechSynthesisUtterance('');
    testUtterance.volume = 0;
    speechSynthesis.speak(testUtterance);
    
    console.log('✅ TTS initialized with user interaction');
  };

  const speakText = async (text: string): Promise<void> => {
    console.log('🔊 ===== SPEAKTEXT FUNCTION CALLED =====');
    console.log('🔊 Input text:', text.substring(0, 50) + '...');
    
    if (!window.speechSynthesis) {
      console.log('❌ SpeechSynthesis not supported');
      return Promise.resolve();
    }

    // Initialize TTS first
    initializeTTS();

    return new Promise<void>((resolve) => {
      console.log('🎵 Creating speech utterance...');
      setIsSpeaking(true);
      
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = 1.0;
      utterance.rate = 0.8; // Slower for better mobile compatibility
      utterance.pitch = 1.0;
      
      // Language detection
      const isBulgarian = /[а-яА-Я]/.test(text);
      utterance.lang = isBulgarian ? 'bg-BG' : 'en-US';
      
      console.log('🌍 Language:', utterance.lang);
      
      // Try to find a good voice
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(isBulgarian ? 'bg' : 'en')
        ) || voices[0];
        
        utterance.voice = preferredVoice;
        console.log('🎤 Using voice:', preferredVoice.name);
      }
      
      utterance.onstart = () => {
        console.log('🎤 TTS STARTED');
      };
      
      utterance.onend = () => {
        console.log('✅ TTS COMPLETED');
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ TTS ERROR:', event.error);
        setIsSpeaking(false);
        resolve();
      };
      
      // Force speech start with multiple fallbacks for mobile
      console.log('🎯 Starting speech...');
      
      const startSpeech = () => {
        speechSynthesis.speak(utterance);
        
        // Mobile-specific fixes
        setTimeout(() => {
          if (!speechSynthesis.speaking && speechSynthesis.paused) {
            console.log('🔄 Resuming paused speech...');
            speechSynthesis.resume();
          }
        }, 100);
        
        setTimeout(() => {
          console.log('🔍 Speech status:', {
            speaking: speechSynthesis.speaking,
            pending: speechSynthesis.pending,
            paused: speechSynthesis.paused
          });
        }, 500);
      };
      
      // Start immediately
      startSpeech();
      
      // Backup timeout
      setTimeout(() => {
        if (isSpeaking) {
          console.log('⏰ TTS timeout');
          setIsSpeaking(false);
          resolve();
        }
      }, 8000);
    });
  };

  const toggleVoiceConversation = () => {
    console.log('🎤 Voice button clicked!');
    
    // Initialize TTS on user interaction
    if (window.speechSynthesis) {
      initializeTTS();
    }
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('❌ MediaDevices API not supported');
      toast({
        title: "Микрофон не е достъпен",
        description: "Вашето устройство не поддържа запис на звук.",
        variant: "destructive",
      });
      return;
    }

    if (conversationActive) {
      console.log('🛑 Ending conversation...');
      endConversation();
    } else {
      console.log('🎙️ Starting voice conversation...');
      startVoiceConversation();
    }
  };

  const startVoiceConversation = async () => {
    console.log('🚀 Starting voice conversation...');
    
    if (!permissionGranted) {
      console.log('🔐 Permission not granted, requesting...');
      const granted = await requestMicrophonePermission();
      if (!granted) {
        console.log('❌ Permission denied');
        return;
      }
    }

    console.log('✅ Setting conversation active');
    setConversationActive(true);
    setLastActivityTime(Date.now()); // Set initial activity time
    
    // Start inactivity timeout - end conversation after 3 seconds of no valid activity
    const startInactivityCheck = () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      
      inactivityTimeoutRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivityTime;
        if (timeSinceLastActivity >= 3000 && conversationActive) { // 3 seconds
          console.log('⏹️ 3 seconds of inactivity detected, ending conversation silently');
          endConversation();
        } else if (conversationActive) {
          // Continue recording if still active and not enough inactivity time
          startWhisperRecording();
          // Check again in 1 second
          startInactivityCheck();
        }
      }, 1000);
    };
    
    startInactivityCheck();
    console.log('🎙️ Starting whisper recording...');
    startWhisperRecording();
  };

  const endConversation = () => {
    setConversationActive(false);
    setIsRecording(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    // Clear inactivity timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }
    
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    speechSynthesis.cancel();
  };

  // Voice button state logic
  const voiceButtonState = useMemo(() => {
    console.log('🔄 Voice button state recalculated:', {
      isProcessing,
      isRecording,
      conversationActive,
      isSpeaking
    });
    
    if (isProcessing || isSpeaking) {
      return {
        variant: 'secondary' as const,
        disabled: true,
        text: isProcessing ? 'Обработвам...' : 'Говоря...'
      };
    }
    
    if (conversationActive) {
      return {
        variant: 'destructive' as const,
        disabled: false,
        text: isRecording ? 'Записвам...' : 'Спри разговор'
      };
    }
    
    return {
      variant: 'default' as const,
      disabled: false,
      text: 'Започни разговор'
    };
  }, [conversationActive, isRecording, isProcessing, isSpeaking]);

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    textChatMutation.mutate(currentMessage);
    setCurrentMessage('');
  };

  const quickQuestions = [
    "Как се изчислява vegan score?",
    "Намери веган ресторанти наблизо",
    "Опции за алергии",
    "Най-добри веган места",
    "Обясни оценката подробно"
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/')}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">VeganMap AI Асистент</h1>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => clearChatMutation.mutate()}
          disabled={clearChatMutation.isPending || messages.length === 0}
          className="flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Изчисти</span>
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Voice Conversation Status */}
        {conversationActive && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
            <p className="text-sm text-blue-700 font-medium">
              🎙️ Гласов разговор активен - {isRecording ? 'Записвам...' : isProcessing ? 'Обработвам...' : isSpeaking ? 'Говоря...' : 'Готов'}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Разговорът ще продължи автоматично след всеки отговор
            </p>
          </div>
        )}

        {/* Quick Questions */}
        {messages.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left justify-start h-auto p-3 text-sm"
                onClick={() => {
                  setCurrentMessage(question);
                  const userMessage: ChatMessage = {
                    role: 'user',
                    content: question,
                    timestamp: new Date(),
                  };
                  setMessages(prev => [...prev, userMessage]);
                  textChatMutation.mutate(question);
                }}
              >
                {question}
              </Button>
            ))}
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString('bg-BG', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading states */}
        {(textChatMutation.isPending || voiceChatMutation.isPending) && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        {/* Voice Controls - Available on all devices, restricted for iOS Safari only */}
        <div className="mb-4 flex justify-center space-x-3">
          <button
            onTouchStart={(e) => {
              console.log('🎤 Voice button TOUCH START triggered!');
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎤 Voice button TOUCH END triggered!');
              console.log('Button state:', voiceButtonState);
              toggleVoiceConversation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🎤 Voice button CLICK triggered!');
              console.log('Button state:', voiceButtonState);
              toggleVoiceConversation();
            }}
            onPointerDown={(e) => {
              console.log('🎤 Voice button POINTER DOWN triggered!');
            }}
            disabled={voiceButtonState.disabled}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors
              ${voiceButtonState.variant === 'destructive' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : voiceButtonState.variant === 'secondary'
                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                : voiceButtonState.variant === 'outline'
                ? 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
              ${voiceButtonState.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
            `}
            type="button"
          >
            {conversationActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{voiceButtonState.text}</span>
          </button>
        </div>

        {/* Text Input */}
        <form onSubmit={handleTextSubmit} className="flex space-x-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={isMobile ? "Напишете съобщение..." : "Напишете съобщение или използвайте гласовия асистент..."}
            className="flex-1 min-h-[2.5rem] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleTextSubmit(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={!currentMessage.trim() || textChatMutation.isPending}
            className="px-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}