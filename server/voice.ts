import type { Request, Response } from "express";
import { z } from "zod";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { randomUUID } from "crypto";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
const el = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY! });

const TTSSchema = z.object({
  text: z.string().min(1).max(500),
  lang: z.string().default(process.env.VOICE_LANG || "en")
});

export async function stt(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "audio required" });

    console.log(`[STT] Processing audio file: ${file.originalname}, size: ${file.size} bytes`);

    const transcript = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      response_format: "json"
    });

    const text = (transcript as any).text || "";
    console.log(`[STT] Transcription result: "${text}"`);

    res.json({ text });
  } catch (e: any) {
    console.error('[STT] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
}

export async function tts(req: Request, res: Response) {
  try {
    const qp = TTSSchema.parse(req.body);
    console.log(`[TTS] Converting text to speech: "${qp.text.substring(0, 50)}..."`);

    const audio = await el.textToSpeech.convert({
      voice_id: process.env.ELEVENLABS_VOICE_ID!,
      text: qp.text,
      model_id: "eleven_monolingual_v1",
      voice_settings: { 
        stability: 0.5, 
        similarity_boost: 0.75 
      }
    });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=speech.mp3");
    
    const buffer = Buffer.from(await audio.arrayBuffer());
    console.log(`[TTS] Generated audio: ${buffer.length} bytes`);
    
    res.send(buffer);
  } catch (e: any) {
    console.error('[TTS] Error:', e.message);
    res.status(500).json({ error: e.message });
  }
}