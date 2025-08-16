import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

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
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      // Stop the stream immediately after getting permission
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

  const startRecording = async () => {
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
        await processAudio(audioBlob);
        
        // Stop all tracks
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
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      
      const response = await fetch('/api/audio', {
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
      console.error('Error processing audio:', error);
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
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
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
      </div>
    </div>
  );
}