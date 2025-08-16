import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { recordOnce, sttCall, ttsCall, supportsVoice, VoiceState, createVoiceSession } from '@/lib/voice';
import { smartAgentResponse } from '@/lib/aiAgents';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceChatProps {
  className?: string;
  onStateChange?: (state: VoiceState) => void;
}

export function VoiceChat({ className, onStateChange }: VoiceChatProps) {
  const [voiceSession, setVoiceSession] = useState(createVoiceSession());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { position: location } = useGeolocation();

  const isSupported = supportsVoice();

  useEffect(() => {
    onStateChange?.(voiceSession.state);
  }, [voiceSession.state, onStateChange]);

  const updateVoiceState = (updates: Partial<typeof voiceSession>) => {
    setVoiceSession(prev => ({ ...prev, ...updates }));
  };

  const appendMessage = (message: Omit<Message, 'timestamp'>) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
  };

  const handleVoiceInteraction = async () => {
    if (voiceSession.state !== 'idle') return;

    try {
      setError(null);
      
      // 1. Record audio
      updateVoiceState({ state: 'recording', isRecording: true });
      const audioBlob = await recordOnce(30); // 30 seconds max
      
      // 2. Convert to text
      updateVoiceState({ 
        state: 'processing', 
        isRecording: false, 
        isProcessing: true 
      });
      
      const userText = await sttCall(audioBlob);
      
      if (!userText.trim()) {
        setError('No speech detected. Please try again.');
        updateVoiceState({ state: 'idle', isProcessing: false });
        return;
      }

      // Add user message
      appendMessage({ role: 'user', content: userText });

      // 3. Get AI response
      const aiResponse = await smartAgentResponse(userText, {
        userLocation: location || undefined
      });

      // Add AI message
      appendMessage({ role: 'assistant', content: aiResponse });

      // 4. Convert AI response to speech and play
      if (!isMuted) {
        updateVoiceState({ 
          state: 'speaking', 
          isProcessing: false, 
          isSpeaking: true 
        });

        const audioElement = await ttsCall(aiResponse);
        currentAudioRef.current = audioElement;

        audioElement.onended = () => {
          updateVoiceState({ state: 'idle', isSpeaking: false });
          currentAudioRef.current = null;
        };

        audioElement.onerror = () => {
          setError('Audio playback failed');
          updateVoiceState({ state: 'idle', isSpeaking: false });
          currentAudioRef.current = null;
        };

        await audioElement.play();
      } else {
        updateVoiceState({ state: 'idle', isProcessing: false });
      }

    } catch (err: any) {
      console.error('[VoiceChat] Error:', err);
      setError(err.message || 'Voice interaction failed');
      updateVoiceState({ 
        state: 'error', 
        isRecording: false, 
        isProcessing: false, 
        isSpeaking: false 
      });
      
      // Auto-reset after 3 seconds
      setTimeout(() => {
        updateVoiceState({ state: 'idle' });
        setError(null);
      }, 3000);
    }
  };

  const stopCurrentAction = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    updateVoiceState({ 
      state: 'idle', 
      isRecording: false, 
      isProcessing: false, 
      isSpeaking: false 
    });
  };

  const getButtonState = () => {
    switch (voiceSession.state) {
      case 'recording':
        return { 
          icon: MicOff, 
          text: 'Recording...', 
          variant: 'destructive' as const,
          pulse: true 
        };
      case 'processing':
        return { 
          icon: MessageSquare, 
          text: 'Processing...', 
          variant: 'secondary' as const,
          pulse: true 
        };
      case 'speaking':
        return { 
          icon: Volume2, 
          text: 'Speaking...', 
          variant: 'secondary' as const,
          pulse: true 
        };
      case 'error':
        return { 
          icon: MicOff, 
          text: 'Error - Retry', 
          variant: 'destructive' as const 
        };
      default:
        return { 
          icon: Mic, 
          text: 'Start Voice Chat', 
          variant: 'default' as const 
        };
    }
  };

  if (!isSupported) {
    return (
      <div className={cn("p-4 bg-yellow-50 border border-yellow-200 rounded-lg", className)}>
        <p className="text-sm text-yellow-800 font-medium">
          Voice features not supported in this browser
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Try using Chrome, Firefox, or Safari with HTTPS
        </p>
      </div>
    );
  }

  const buttonState = getButtonState();
  const ButtonIcon = buttonState.icon;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Voice Control Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={voiceSession.state === 'idle' ? handleVoiceInteraction : stopCurrentAction}
          disabled={voiceSession.state === 'processing'}
          variant={buttonState.variant}
          size="lg"
          className={cn(
            "flex-1 h-12 text-base font-medium transition-all duration-200",
            buttonState.pulse && "animate-pulse"
          )}
        >
          <ButtonIcon className="h-5 w-5 mr-2" />
          {buttonState.text}
        </Button>

        <Button
          onClick={() => setIsMuted(!isMuted)}
          variant="outline"
          size="lg"
          className="h-12 px-3"
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5 text-gray-500" />
          ) : (
            <Volume2 className="h-5 w-5 text-primary" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg text-sm",
                message.role === 'user' 
                  ? "bg-primary text-white ml-8" 
                  : "bg-gray-100 text-gray-900 mr-8"
              )}
            >
              <div className="font-medium mb-1">
                {message.role === 'user' ? 'You' : 'VeganAI'}
              </div>
              <div>{message.content}</div>
              <div className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Voice Instructions */}
      {messages.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Voice Assistant Ready</p>
          <p className="text-xs mt-1">
            Tap the button and speak to get restaurant recommendations
          </p>
        </div>
      )}
    </div>
  );
}