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
  
  // Временно деактивиране на mobile detection за testing
  const mobileDevice = false; // Принудително активиране на voice функционалност
  
  console.log('Voice functionality enabled (mobile detection disabled for testing)');

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
      
      // OpenAI TTS implementation - автоматично без dialog
      console.log('🎤 AI response ready for OpenAI TTS');
      console.log('🔊 Response text:', data.reply);
      
      // Автоматично стартиране на TTS без потребителски dialog
        console.log('✅ Starting OpenAI TTS generation');
        
        try {
          // Call our OpenAI TTS endpoint with proper headers
          const ttsResponse = await fetch('/api/tts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg',
            },
            credentials: 'include',
            body: JSON.stringify({ text: data.reply })
          });
          
          if (ttsResponse.ok) {
            // Get the MP3 blob and verify MIME type
            const audioBlob = await ttsResponse.blob();
            
            console.log('🎵 Audio blob size:', audioBlob.size, 'bytes');
            console.log('🎧 Audio blob type:', audioBlob.type);
            console.log('📋 Response headers:', Object.fromEntries(ttsResponse.headers.entries()));
            
            // Force correct MIME type if needed
            const correctedBlob = audioBlob.type.includes('audio') ? audioBlob : 
              new Blob([audioBlob], { type: 'audio/mpeg' });
            
            const audioUrl = URL.createObjectURL(correctedBlob);
            console.log('🔗 Audio URL created:', audioUrl);
            
            // Create invisible HTML audio element for better browser support
            const audio = document.createElement('audio');
            audio.src = audioUrl;
            audio.preload = 'auto';
            audio.volume = 1.0;
            
            console.log('🎛️ Audio element created with src:', audioUrl);
            
            // Add to DOM temporarily for better compatibility
            audio.style.display = 'none';
            document.body.appendChild(audio);
            
            // Event listeners
            audio.onloadstart = () => console.log('📥 Audio loading started');
            audio.oncanplay = () => console.log('▶️ Audio can play');
            audio.onplay = () => console.log('🎵 Audio play started');
            audio.onended = () => {
              console.log('🔇 Audio playback completed');
              document.body.removeChild(audio);
              URL.revokeObjectURL(audioUrl);
            };
            audio.onerror = (e) => {
              console.error('❌ Audio error:', e);
              console.error('Error details:', {
                code: audio.error?.code,
                message: audio.error?.message
              });
            };
            
            // Load and play
            audio.load();
            
            // Direct audio playback - files work when downloaded
            console.log('🚀 Starting audio playback...');
            
            // Set audio properties for better compatibility
            audio.controls = false;
            audio.autoplay = false;
            audio.muted = false;
            
            // Try Web Audio API for better control and bypass autoplay restrictions
            const playAudioWithWebAPI = async () => {
              try {
                // Create AudioContext with proper typing
                let audioCtx: AudioContext;
                if (!(window as any).audioContext) {
                  audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                  (window as any).audioContext = audioCtx;
                } else {
                  audioCtx = (window as any).audioContext;
                }
                
                if (audioCtx.state === 'suspended') {
                  await audioCtx.resume();
                }
                
                // Convert blob to array buffer
                const arrayBuffer = await audioBlob.arrayBuffer();
                const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                
                // Create and play audio source
                const source = audioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioCtx.destination);
                
                console.log('🎵 Starting Web Audio API playback');
                source.start(0);
                
                // Auto-continue conversation after audio ends
                const handleAudioEnd = () => {
                  console.log('🔇 Audio playback completed, continuing conversation');
                  setTimeout(() => {
                    console.log('📊 Current states:', { isRecording, isProcessing, conversationActive });
                    if (!isRecording && !isProcessing && !mobileDevice) {
                      console.log('🎙️ Auto-starting next recording...');
                      startWhisperRecording(); // Continue conversation
                    } else {
                      console.log('🚫 Cannot continue - already recording/processing or mobile device');
                    }
                  }, 1500);
                };
                
                source.addEventListener('ended', handleAudioEnd);
                
                // Also try the older onended property as backup
                source.onended = handleAudioEnd;
                
                return true;
              } catch (webAudioError) {
                console.log('❌ Web Audio API failed:', webAudioError);
                return false;
              }
            };
            
            // Try Web Audio API first, fallback to regular audio
            const success = await playAudioWithWebAPI();
            
            if (!success) {
              // Fallback to regular HTML5 audio with user interaction requirement
              audio.play()
                .then(() => {
                  console.log('✅ HTML5 audio playback successful');
                  
                  // Add event listener for when HTML5 audio ends
                  audio.addEventListener('ended', () => {
                    console.log('🔇 HTML5 audio ended, continuing conversation');
                    setTimeout(() => {
                      if (!isRecording && !isProcessing && !mobileDevice) {
                        console.log('🎙️ Auto-starting next recording (HTML5 fallback)...');
                        startWhisperRecording();
                      }
                    }, 1500);
                  });
                })
                .catch(() => {
                  console.log('📋 All audio methods failed - requiring user click');
                  
                  // Minimal play button that auto-continues conversation
                  const playButton = document.createElement('button');
                  playButton.textContent = '▶️';
                  playButton.style.cssText = `
                    position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                    width: 60px; height: 60px; border-radius: 50%;
                    background: #22c55e; color: white; border: none;
                    font-size: 24px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                  `;
                  
                  playButton.onclick = async () => {
                    const webSuccess = await playAudioWithWebAPI();
                    if (!webSuccess) {
                      await audio.play();
                    }
                    document.body.removeChild(playButton);
                    // Continue conversation after manual play
                    setTimeout(() => {
                      if (!isRecording && !isProcessing) {
                        startWhisperRecording();
                      }
                    }, 2000);
                  };
                  
                  document.body.appendChild(playButton);
                });
            }
            
          } else {
            console.error('❌ TTS API error:', ttsResponse.status);
            const errorText = await ttsResponse.text();
            console.error('Error details:', errorText);
          }
          
        } catch (error) {
          console.error('❌ TTS Error:', error);
        }
      
      // Set conversation as active after first voice interaction
      if (!conversationActive) {
        setConversationActive(true);
        console.log('✅ Conversation activated');
      }
      
      // Remove old timeout - audio playback handlers now manage conversation continuation
      
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
    console.log('🎙️ startWhisperRecording called - States:', { isRecording, isProcessing, mobileDevice });
    
    // Проверка дали вече записваме или обработваме
    if (isRecording || isProcessing) {
      console.log('🚫 Already recording or processing, skipping...');
      return;
    }
    
    if (mobileDevice) {
      console.log('📱 Mobile device detected, voice recording disabled');
      return;
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
        console.log('🎤 Recording stopped, processing audio...');
        setIsProcessing(true);
        
        try {
          await voiceChatMutation.mutateAsync(audioBlob);
        } catch (error) {
          console.error('❌ Voice processing error:', error);
        } finally {
          setIsProcessing(false);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Auto-stop after 8 seconds for better conversation flow
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log('⏰ Auto-stopping recording after 8 seconds');
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