import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Voiceflow types
interface VoiceflowTrace {
  type: string;
  payload: {
    message?: string;
  };
}

interface VoiceflowClient {
  start(): Promise<void>;
  sendText(text: string): Promise<void>;
  onSpeak(callback: (trace: VoiceflowTrace) => void): void;
  onEnd(callback: () => void): void;
  onError(callback: (error: any) => void): void;
}

interface VoiceflowFactory {
  createClient(): VoiceflowClient;
}

interface VoiceflowChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceflowChat({ isOpen, onClose }: VoiceflowChatProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [voiceflowClient, setVoiceflowClient] = useState<VoiceflowClient | null>(null);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  // Initialize Voiceflow client
  useEffect(() => {
    if (!isOpen) return;

    const initializeVoiceflow = async () => {
      try {
        // Import Voiceflow runtime client
        const RuntimeClientFactory = (await import('@voiceflow/runtime-client-js')).default;
        
        // Create Voiceflow client
        const factory = new RuntimeClientFactory({
          versionID: import.meta.env.VITE_VOICEFLOW_VERSION_ID || '',
          apiKey: import.meta.env.VITE_VOICEFLOW_API_KEY || ''
        });

        const client = factory.createClient();
        
        // Set up event listeners
        client.onSpeak((trace: VoiceflowTrace) => {
          if (trace.payload.message) {
            const aiMessage = trace.payload.message;
            setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
            
            // Auto-speak response
            speakText(aiMessage);
          }
        });

        client.onError((error: any) => {
          console.error('Voiceflow error:', error);
          toast({
            title: 'Грешка в гласовия асистент',
            description: 'Възникна проблем с връзката. Опитайте отново.',
            variant: 'destructive'
          });
        });

        // Start conversation
        await client.start();
        setVoiceflowClient(client);
        setIsConnected(true);
        
        console.log('Voiceflow client initialized successfully');

      } catch (error) {
        console.error('Failed to initialize Voiceflow:', error);
        toast({
          title: 'Не успяхме да стартираме гласовия асистент',
          description: 'Проверете настройките и опитайте отново.',
          variant: 'destructive'
        });
      }
    };

    initializeVoiceflow();
  }, [isOpen, toast]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'bg-BG'; // Bulgarian language
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim() && voiceflowClient) {
        console.log('Speech recognized:', transcript);
        setMessages(prev => [...prev, { role: 'user', content: transcript }]);
        voiceflowClient.sendText(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: 'Достъпът до микрофона е отказан',
          description: 'Моля, разрешете достъп до микрофона в браузъра си.',
          variant: 'destructive'
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [voiceflowClient, toast]);

  const startListening = () => {
    if (!recognitionRef.current || !isConnected) return;
    
    try {
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speakText = (text: string) => {
    if (!text) return;

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bg-BG';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Гласов асистент
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Натиснете микрофона и започнете да говорите
            </div>
          ) : (
            messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}>
                  {message.content}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center gap-4">
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={!isConnected}
            className={`rounded-full w-12 h-12 p-0 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            disabled={!isSpeaking}
            variant="outline"
            className="rounded-full w-12 h-12 p-0"
          >
            {isSpeaking ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
        </div>

        {/* Status */}
        <div className="px-4 pb-2 text-center text-xs text-gray-500 dark:text-gray-400">
          {!isConnected && 'Свързване...'}
          {isConnected && isListening && 'Слушам...'}
          {isConnected && isSpeaking && 'Говоря...'}
          {isConnected && !isListening && !isSpeaking && 'Готов за разговор'}
        </div>
      </div>
    </div>
  );
}