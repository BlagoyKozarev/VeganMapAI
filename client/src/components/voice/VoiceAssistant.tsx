import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square, AlertTriangle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { VOICE_SESSION_LIMITS } from '@shared/voice-limits';
import type { VoiceLimitStatus } from '@shared/voice-limits';
interface VoiceAssistantProps {
  onTranscription?: (text: string) => void;
  onResponse?: (response: string) => void;
}
export default function VoiceAssistant({ onTranscription, onResponse }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastTranscription, setLastTranscription] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [voiceLimits, setVoiceLimits] = useState<VoiceLimitStatus | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  // Check voice limits on mount
  useEffect(() => {
    checkVoiceLimits();
  }, []);
  // Check for warnings during active session
  useEffect(() => {
    if (currentSessionId && isRecording) {
      const warningInterval = setInterval(async () => {
        try {
          const response = await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/voice/warning-status`, {
            credentials: 'include'
          });
          const data = await response.json();
          if (data.shouldWarn && !showLimitWarning) {
            setShowLimitWarning(true);
            await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/voice/mark-warning-shown`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sessionId: currentSessionId }),
              credentials: 'include'
            });
          }
        } catch (error) {
        }
      }, 5000); // Check every 5 seconds
      return () => clearInterval(warningInterval);
    }
  }, [currentSessionId, isRecording, showLimitWarning]);
  const checkVoiceLimits = async () => {
    try {
      const response = await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/voice/limits`, {
        credentials: 'include'
      });
      const limits = await response.json();
      setVoiceLimits(limits);
    } catch (error) {
    }
  };
  const startVoiceSession = async () => {
    try {
      const response = await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/voice/start-session`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      setCurrentSessionId(data.sessionId);
      return data.sessionId;
    } catch (error: any) {
      toast({
        title: "Лимит достигнат",
        description: error.message || "Не можете да използвате гласовия асистент в момента.",
        variant: "destructive",
      });
      return null;
    }
  };
  const endVoiceSession = async (sessionId: string, endReason?: string) => {
    try {
      await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/voice/end-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, endReason }),
        credentials: 'include'
      });
      setCurrentSessionId(null);
      setShowLimitWarning(false);
      // Refresh limits after session ends
      await checkVoiceLimits();
    } catch (error) {
    }
  };
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      // Stop the stream immediately after getting permission
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
  const startRecording = async () => {
    // Check voice limits first
    if (voiceLimits && !voiceLimits.canUseVoice) {
      if (voiceLimits.cooldownEndsAt) {
        const cooldownTime = new Date(voiceLimits.cooldownEndsAt);
        const minutesLeft = Math.ceil((cooldownTime.getTime() - Date.now()) / 1000 / 60);
        toast({
          title: "Изчакайте малко",
          description: `Можете да използвате гласовия асистент отново след ${minutesLeft} минути.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Дневен лимит достигнат",
          description: "Вашият дневен лимит за гласов асистент е изчерпан. Опитайте отново утре.",
          variant: "destructive",
        });
      }
      return;
    }
    if (!permissionGranted) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    // Start voice session
    const sessionId = await startVoiceSession();
    if (!sessionId) return;
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
        await processAudio(audioBlob);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        // End voice session
        if (currentSessionId) {
          await endVoiceSession(currentSessionId, 'user_ended');
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
      // Set up auto-stop based on remaining session time
      const maxRecordingTime = Math.min(
        8000, // 8 seconds for optimal Whisper processing
        (voiceLimits?.remainingSessionMinutes || 8) * 60 * 1000
      );
      sessionTimerRef.current = setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          stopRecording();
        }
      }, maxRecordingTime);
    } catch (error) {
      // Clean up session on error
      if (sessionId) {
        await endVoiceSession(sessionId, 'error');
      }
      toast({
        title: "Грешка при записването",
        description: "Не може да се достъпи микрофонът. Проверете настройките.",
        variant: "destructive",
      });
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      const response = await fetch(`${import.meta.env.PROD ? '/api/v1' : 'http://localhost:5000/api/v1'}/audio`, {
        method: 'POST',
        body: formData,
        credentials: 'include' // Important for authentication
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Неоторизиран достъп",
            description: "Моля, влезте в профила си.",
            variant: "destructive",
          });
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setLastTranscription(data.text);
      setLastResponse(data.reply);
      // Call callbacks if provided
      onTranscription?.(data.text);
      onResponse?.(data.reply);
      // Use Speech Synthesis for Bulgarian response
      if ('speechSynthesis' in window && data.reply) {
        const utterance = new SpeechSynthesisUtterance(data.reply);
        utterance.lang = 'bg-BG';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        // Try to find Bulgarian voice, fallback to default
        const voices = speechSynthesis.getVoices();
        const bulgarianVoice = voices.find(voice => 
          voice.lang.startsWith('bg') || voice.lang.includes('BG')
        );
        if (bulgarianVoice) {
          utterance.voice = bulgarianVoice;
        }
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      toast({
        title: "Грешка при обработката",
        description: "Възникна проблем при обработката на аудиото. Опитайте отново.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const getButtonState = () => {
    if (isProcessing) return { icon: Square, text: "Обработка...", variant: "secondary" as const };
    if (isRecording) return { icon: MicOff, text: "Записвам...", variant: "destructive" as const };
    return { icon: Mic, text: "Говори", variant: "default" as const };
  };
  const buttonState = getButtonState();
  const ButtonIcon = buttonState.icon;
  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {/* Voice limits information */}
      {voiceLimits && (
        <div className="w-full max-w-md space-y-2">
          <div className="text-center text-sm text-muted-foreground">
            <span className="font-medium">
              {voiceLimits.userType === 'PAID' ? 'Платен план' : 'Безплатен план'}
            </span>
            {voiceLimits.canUseVoice && (
              <span className="ml-2">
                • Оставащо време: {Math.floor(voiceLimits.remainingDailyMinutes)} мин днес
              </span>
            )}
          </div>
          {showLimitWarning && (
            <Alert className="bg-orange-50 dark:bg-orange-900/20 border-orange-200">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                Приближавате лимита си! Оставащо време за сесия: {Math.ceil(voiceLimits.remainingSessionMinutes)} минути
              </AlertDescription>
            </Alert>
          )}
          {voiceLimits.cooldownEndsAt && (
            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Можете да използвате гласовия асистент отново след {' '}
                {new Date(voiceLimits.cooldownEndsAt).toLocaleTimeString('bg-BG', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing || (voiceLimits ? !voiceLimits.canUseVoice : false)}
        variant={buttonState.variant}
        size="lg"
        className="flex items-center space-x-2 px-6 py-3"
      >
        <ButtonIcon className="w-5 h-5" />
        <span>{buttonState.text}</span>
      </Button>
      {lastTranscription && (
        <div className="w-full max-w-md space-y-2">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Вие казахте:
            </p>
            <p className="text-blue-900 dark:text-blue-100">{lastTranscription}</p>
          </div>
          {lastResponse && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                VeganMap отговаря:
              </p>
              <p className="text-green-900 dark:text-green-100">{lastResponse}</p>
            </div>
          )}
        </div>
      )}
      <div className="text-xs text-muted-foreground text-center max-w-xs">
        Натиснете бутона и говорете до 8 секунди. 
        Асистентът ще отговори на български език.
        {voiceLimits && voiceLimits.userType === 'FREE' && (
          <div className="mt-1">
            Безплатен план: {voiceLimits.remainingDailyMinutes}/{VOICE_SESSION_LIMITS.FREE_USERS.dailyMinutes} мин на ден
          </div>
        )}
      </div>
    </div>
  );
}