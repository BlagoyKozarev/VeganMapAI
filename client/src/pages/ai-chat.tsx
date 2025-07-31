import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Send, Trash2, ArrowLeft } from 'lucide-react';

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mobile detection - temporarily disabled for testing
  const isMobile = false; // /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  console.log('🔍 Device detection:', { 
    userAgent: navigator.userAgent, 
    isMobile, 
    windowWidth: window.innerWidth 
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
      
      // Speak the response if conversation is active
      if (conversationActive) {
        await speakText(data.reply);
        
        // Continue conversation after speaking
        setTimeout(() => {
          if (conversationActive && !isSpeaking) {
            startWhisperRecording();
          }
        }, 2000);
      }
      
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
        setIsProcessing(true);
        await voiceChatMutation.mutateAsync(audioBlob);
        setIsProcessing(false);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 8 seconds for optimal Whisper processing
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 8000);
      
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

  const speakText = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Enhanced language detection - check for Bulgarian characters
      const isBulgarian = /[а-яА-Я]/.test(text);
      utterance.lang = isBulgarian ? "bg-BG" : "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      // Try to find appropriate voice based on detected language
      const voices = speechSynthesis.getVoices();
      let preferredVoice;
      
      if (isBulgarian) {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('bg') || voice.lang.includes('BG')
        );
      } else {
        preferredVoice = voices.find(voice => 
          voice.lang.startsWith('en') && voice.lang.includes('US')
        ) || voices.find(voice => voice.lang.startsWith('en'));
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.onend = () => {
        console.log('🎤 TTS ended, checking conversation continuation');
        setIsSpeaking(false);
        
        // Continue conversation after speaking
        if (conversationActive && !isRecording && !isProcessing) {
          setTimeout(() => {
            console.log('🎙️ Auto-continuing conversation after TTS');
            startWhisperRecording();
          }, 2000);
        }
        
        resolve();
      };
      
      // Backup timeout in case onend doesn't fire
      setTimeout(() => {
        if (isSpeaking) {
          console.log('⏰ TTS backup timeout triggered');
          setIsSpeaking(false);
          if (conversationActive && !isRecording && !isProcessing) {
            startWhisperRecording();
          }
          resolve();
        }
      }, 8000);
      
      utterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
        resolve();
      };
      
      // Cancel any existing speech before starting new one
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  };

  const toggleVoiceConversation = () => {
    if (isMobile) {
      toast({
        title: "Гласов разговор не е достъпен",
        description: "На мобилни устройства използвайте текстовия чат.",
        variant: "destructive",
      });
      return;
    }

    if (conversationActive) {
      endConversation();
    } else {
      startConversation();
    }
  };

  const startConversation = () => {
    setConversationActive(true);
    startWhisperRecording();
  };

  const endConversation = () => {
    setConversationActive(false);
    setIsRecording(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    
    speechSynthesis.cancel();
  };

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

  const getVoiceButtonState = () => {
    if (isProcessing) return { text: "Обработка...", variant: "secondary" as const, disabled: true };
    if (isRecording) return { text: "Записвам...", variant: "destructive" as const, disabled: false };
    if (conversationActive) return { text: "Спри разговора", variant: "outline" as const, disabled: false };
    return { text: "Започни гласов разговор", variant: "default" as const, disabled: false };
  };

  const voiceButtonState = getVoiceButtonState();

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
        {/* Voice Controls */}
        {!isMobile && (
          <div className="mb-4 flex justify-center">
            <Button
              onClick={toggleVoiceConversation}
              variant={voiceButtonState.variant}
              disabled={voiceButtonState.disabled}
              className="flex items-center space-x-2"
            >
              {conversationActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{voiceButtonState.text}</span>
            </Button>
          </div>
        )}

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