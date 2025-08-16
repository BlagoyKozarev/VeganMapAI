import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Send, Trash2, ArrowLeft, Volume2 } from 'lucide-react';
import { VoiceChat } from '@/components/voice/VoiceChat';
import { VoiceState } from '@/lib/voice';
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
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Mobile detection with proper logic
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
  // Check if device supports speech recognition
  const supportsSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  // Debug conversation state
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
        // Don't update activity time for nonsensical transcriptions
        // Don't continue recording - let the inactivity timer handle it
        return;
      }
      // Valid transcription - update last activity time
      setLastActivityTime(Date.now());
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
      // Speak the AI response
      speakText(data.reply)
        .then(() => {
          // TTS completed successfully
        })
        .catch(error => {
        });
      // Reset activity time on successful conversation
      setLastActivityTime(Date.now());
      // Note: Conversation continuation is now handled in TTS onend callback
      queryClient.invalidateQueries({ queryKey: ['/api/chat/history'] });
    },
    onError: (error: any) => {
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
          // Audio too small, likely silent
          // Don't continue recording - let the inactivity timer handle it
          return;
        }
        setIsProcessing(true);
        try {
          await voiceChatMutation.mutateAsync(audioBlob);
        } catch (error) {
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
    // Create a silent utterance to initialize the speech synthesis
    const testUtterance = new SpeechSynthesisUtterance('');
    testUtterance.volume = 0;
    speechSynthesis.speak(testUtterance);
  };
  const speakText = async (text: string): Promise<void> => {
    if (!window.speechSynthesis) {
      return Promise.resolve();
    }
    // Initialize TTS first
    initializeTTS();
    return new Promise<void>((resolve) => {
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
      // Try to find a good voice
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(voice => 
          voice.lang.startsWith(isBulgarian ? 'bg' : 'en')
        ) || voices[0];
        utterance.voice = preferredVoice;
      }
      utterance.onstart = () => {
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        // Continue conversation after TTS finishes
        if (conversationActive) {
          setTimeout(() => {
            if (conversationActive && !isRecording) {
              startWhisperRecording();
            }
          }, 500); // Short delay after TTS
        }
        resolve();
      };
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        resolve();
      };
      // Force speech start with multiple fallbacks for mobile
      const startSpeech = () => {
        speechSynthesis.speak(utterance);
        // Mobile-specific fixes
        setTimeout(() => {
          if (!speechSynthesis.speaking && speechSynthesis.paused) {
            speechSynthesis.resume();
          }
        }, 100);
        setTimeout(() => {
        }, 500);
      };
      // Start immediately
      startSpeech();
      // Backup timeout
      setTimeout(() => {
        if (isSpeaking) {
          setIsSpeaking(false);
          resolve();
        }
      }, 8000);
    });
  };
  const toggleVoiceConversation = () => {
    // Initialize TTS on user interaction
    if (window.speechSynthesis) {
      initializeTTS();
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Микрофон не е достъпен",
        description: "Вашето устройство не поддържа запис на звук.",
        variant: "destructive",
      });
      return;
    }
    if (conversationActive) {
      endConversation();
    } else {
      startVoiceConversation();
    }
  };
  const startVoiceConversation = async () => {
    if (!permissionGranted) {
      const granted = await requestMicrophonePermission();
      if (!granted) {
        return;
      }
    }
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
      {/* Input Area with Tabs */}
      <div className="border-t border-gray-200 bg-white">
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Текст
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Глас
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="p-4 m-0">
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
          </TabsContent>
          
          <TabsContent value="voice" className="p-4 m-0">
            <VoiceChat 
              onStateChange={setVoiceState}
              className="w-full"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}