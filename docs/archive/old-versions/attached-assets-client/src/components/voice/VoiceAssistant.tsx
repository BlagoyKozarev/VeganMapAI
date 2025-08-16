import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToServer(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Грешка при достъп до микрофона:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToServer = async (audioBlob: Blob) => {
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Audio = (reader.result as string).split(',')[1];

      try {
        const response = await fetch('/api/whisper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audio: base64Audio }),
        });

        const data = await response.json();
        const resultText = data.text || 'Грешка при разпознаване.';
        setLastResponse(resultText);
        await playWithTTS(resultText);
      } catch (err) {
        console.error("Грешка при изпращане на аудио:", err);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.readAsDataURL(audioBlob);
  };

  const playWithTTS = async (text: string) => {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const contentType = response.headers.get("Content-Type");
      if (!contentType?.includes("audio")) {
        const errorText = await response.text();
        console.error("Expected audio, got:", errorText);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const audio = new Audio();
      audio.src = url;
      audio.load();

      audio.oncanplaythrough = () => {
        console.log("🔁 Playing response audio");
        audio.play().catch(err => console.error("❌ Audio play failed:", err));
      };

      audio.onended = () => {
        URL.revokeObjectURL(url);
      };

      audio.onerror = (e) => {
        console.error("🎧 Audio error:", e);
      };

    } catch (err) {
      console.error("TTS playback failed:", err);
    }
  };

  return (
    <div className="p-4 border rounded-xl space-y-4">
      <h2 className="text-xl font-semibold">Гласов Асистент</h2>

      <div className="flex gap-4 items-center">
        {isRecording ? (
          <Button onClick={handleStopRecording} variant="destructive">
            <MicOff className="mr-2" /> Спри
          </Button>
        ) : (
          <Button onClick={handleStartRecording} disabled={isProcessing}>
            <Mic className="mr-2" /> Говори
          </Button>
        )}

        {isProcessing && <Loader2 className="animate-spin" />}
      </div>

      {lastResponse && (
        <div className="bg-muted p-3 rounded text-sm">
          <strong>Ти каза:</strong> {lastResponse}
        </div>
      )}
    </div>
  );
}