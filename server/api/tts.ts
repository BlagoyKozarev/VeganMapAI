import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const ttsHandler = async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Missing text parameter' });
    }

    console.log('🎤 TTS request for text:', text.substring(0, 50) + '...');

    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'nova', // Good voice for Bulgarian/English
      input: text,
      response_format: 'mp3'
    });

    // Get the audio buffer
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Set proper headers for MP3 audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Accept-Ranges', 'bytes');
    
    console.log('✅ TTS MP3 generated successfully, size:', buffer.length, 'bytes');
    res.send(buffer);
    
  } catch (error) {
    console.error('❌ TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
};