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

// Working TTS implementation with proper voice loading
const speak = (text: string) => {
  console.log('🎯 TTS starting with text:', text.substring(0, 30) + '...');
  
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.error('🚫 speechSynthesis not supported');
    return;
  }
  
  const doSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to get Bulgarian voice
    const voices = window.speechSynthesis.getVoices();
    console.log('📢 Available voices:', voices.length);
    
    const bgVoice = voices.find(v => v.lang.includes('bg') || v.lang.includes('BG'));
    const enVoice = voices.find(v => v.lang.includes('en') && v.name.includes('Google'));
    
    if (bgVoice) {
      utterance.voice = bgVoice;
      console.log('🇧🇬 Using voice:', bgVoice.name);
    } else if (enVoice) {
      utterance.voice = enVoice;
      console.log('🇺🇸 Using English voice:', enVoice.name);
    }
    
    utterance.onstart = () => {
      console.log('✅ TTS STARTED SUCCESSFULLY!');
    };
    
    utterance.onend = () => {
      console.log('🔇 TTS COMPLETED');
    };
    
    utterance.onerror = (e) => {
      console.error('❌ TTS ERROR:', e.error);
    };
    
    // Force start TTS
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    console.log('🚀 speechSynthesis.speak() called');
  };
  
  // Ensure voices are loaded
  if (window.speechSynthesis.getVoices().length === 0) {
    console.log('⏳ Waiting for voices to load...');
    window.speechSynthesis.onvoiceschanged = () => {
      console.log('🔄 Voices loaded, trying TTS');
      doSpeak();
    };
  } else {
    doSpeak();
  }
};

// 2. Зареди гласове с debugging
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // preload voices
    const voices = window.speechSynthesis.getVoices();
    console.log('🔄 Voices loaded event:', voices.length, 'voices available');
  };
  
  // Force initial voice loading
  const initialVoices = window.speechSynthesis.getVoices();
  console.log('🚀 Initial voices:', initialVoices.length);
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
  
  // Mobile detection - based only on user agent, not screen size
  const isMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];
    const isMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
    
    console.log('Mobile detection:', { userAgent, isMobileUserAgent, windowWidth: window.innerWidth });
    return isMobileUserAgent; // Only true mobile devices, not small desktop windows
  };
  
  const mobileDevice = isMobileDevice();

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
      
      // Direct TTS test with manual trigger
      console.log('🎤 AI response ready for TTS');
      console.log('🔊 Response text:', data.reply);
      
      // Show response and provide manual TTS button
      const ttsButton = confirm('🎤 AI отговор:\n\n' + data.reply + '\n\nНатиснете OK за гласов отговор или Cancel за text only');
      
      if (ttsButton) {
        // Ultra-simple TTS test
        console.log('🎤 TTS Test - Creating utterance');
        
        try {
          // Test 1: Simple text
          const testUtterance = new SpeechSynthesisUtterance('Тест');
          testUtterance.volume = 1;
          testUtterance.rate = 1;
          
          console.log('🔊 Test utterance created');
          console.log('🎛️ Available voices:', speechSynthesis.getVoices().length);
          
          // Test 2: Force speak
          speechSynthesis.speak(testUtterance);
          console.log('✅ speechSynthesis.speak(testUtterance) called');
          
          // Test 3: Main response
          setTimeout(() => {
            const mainUtterance = new SpeechSynthesisUtterance(data.reply);
            speechSynthesis.speak(mainUtterance);
            console.log('🚀 Main response TTS started');
          }, 1000);
          
        } catch (error) {
          console.error('❌ TTS Exception:', error);
        }
        
        // Debug info
        console.log('🔍 Browser TTS Support:', {
          speechSynthesis: !!window.speechSynthesis,
          voicesLength: speechSynthesis.getVoices().length,
          speaking: speechSynthesis.speaking
        });
        
        // Manual console test suggestion
        console.log('🧪 Manual test: Open console and run:');
        console.log('speechSynthesis.speak(new SpeechSynthesisUtterance("Здравей"))');
      }
      
      // Set conversation as active after first voice interaction
      if (!conversationActive) {
        setConversationActive(true);
        console.log('✅ Conversation activated');
      }
      
      // Continue listening after TTS finishes (estimate 3 seconds)
      setTimeout(() => {
        if (!mobileDevice) {
          console.log('🎙️ Continuing voice conversation...');
          startWhisperRecording();
        }
      }, 3000);
      
      // Reset speaking state
      setTimeout(() => {
        setIsSpeaking(false);
      }, 1000);
      
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
      
      // Auto-stop after 10 seconds for better Bulgarian recognition
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, 10000);
      
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
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onstart = () => {
        console.log('TTS started successfully');
      };
      
      utterance.onend = () => {
        console.log('TTS finished');
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = (error) => {
        console.error('TTS error:', error);
        setIsSpeaking(false);
        resolve();
      };
      
      console.log('About to start TTS with text:', text.substring(0, 50) + '...');
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    });
  };

  const toggleVoiceConversation = () => {
    // Allow voice conversation on all devices - let user decide
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

        {/* Mobile info */}
        {mobileDevice && (
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500">TTS работи на всички устройства</p>
          </div>
        )}

        {/* Text Input */}
        <form onSubmit={handleTextSubmit} className="flex space-x-2">
          <Textarea
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            placeholder={mobileDevice ? "Напишете съобщение..." : "Напишете съобщение или използвайте гласовия асистент..."}
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

        {/* Mobile Voice Info */}
        {mobileDevice && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Гласовият асистент е достъпен само на десктоп браузъри
          </p>
        )}
      </div>
    </div>
  );
}