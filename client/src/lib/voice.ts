/**
 * Voice interaction utilities for VeganMapAI
 * Provides STT, TTS, and voice recording capabilities
 */

export async function recordOnce(maxSec: number = 30): Promise<Blob> {
  console.log(`[Voice] Starting recording for max ${maxSec} seconds`);
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream, { 
    mimeType: "audio/webm;codecs=opus" 
  });
  
  const chunks: BlobPart[] = [];
  
  const done = new Promise<Blob>((resolve) => {
    rec.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    
    rec.onstop = () => {
      console.log(`[Voice] Recording stopped, ${chunks.length} chunks collected`);
      const blob = new Blob(chunks, { type: "audio/webm" });
      console.log(`[Voice] Final blob size: ${blob.size} bytes`);
      
      // Stop all tracks to release microphone
      stream.getTracks().forEach(track => track.stop());
      
      resolve(blob);
    };
  });

  rec.start();
  
  // Auto-stop after maxSec
  setTimeout(() => {
    if (rec.state !== "inactive") {
      console.log('[Voice] Auto-stopping recording after timeout');
      rec.stop();
    }
  }, maxSec * 1000);

  return await done;
}

export async function sttCall(blob: Blob): Promise<string> {
  console.log(`[STT] Sending audio blob: ${blob.size} bytes`);
  
  const fd = new FormData();
  fd.append("audio", blob, "input.webm");
  
  const response = await fetch("/voice/stt", { 
    method: "POST", 
    body: fd 
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`STT failed: ${error}`);
  }
  
  const result = await response.json();
  console.log(`[STT] Transcription: "${result.text}"`);
  
  return result.text || "";
}

export async function ttsCall(text: string): Promise<HTMLAudioElement> {
  console.log(`[TTS] Converting to speech: "${text.substring(0, 50)}..."`);
  
  const response = await fetch("/voice/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TTS failed: ${error}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  console.log(`[TTS] Received audio: ${arrayBuffer.byteLength} bytes`);
  
  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);
  
  const audio = new Audio(url);
  audio.preload = "auto";
  
  // Clean up URL when audio ends
  audio.addEventListener('ended', () => {
    URL.revokeObjectURL(url);
  });
  
  return audio;
}

// Voice recording state management
export type VoiceState = 'idle' | 'recording' | 'processing' | 'speaking' | 'error';

export interface VoiceSession {
  state: VoiceState;
  isRecording: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  error?: string;
}

export const createVoiceSession = (): VoiceSession => ({
  state: 'idle',
  isRecording: false,
  isProcessing: false,
  isSpeaking: false
});

// Check if browser supports voice features
export const supportsVoice = (): boolean => {
  return !!(
    typeof navigator !== 'undefined' &&
    navigator.mediaDevices && 
    navigator.mediaDevices.getUserMedia &&
    typeof window !== 'undefined' &&
    window.MediaRecorder &&
    window.Audio
  );
};

// Get supported audio formats
export const getSupportedAudioFormats = (): string[] => {
  const formats = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg'
  ];
  
  return formats.filter(format => MediaRecorder.isTypeSupported(format));
};