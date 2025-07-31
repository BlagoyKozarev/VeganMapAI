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
    
    // Set comprehensive headers for proper MP3 playback
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'inline; filename="speech.mp3"');
    res.setHeader('Content-Length', buffer.length.toString());
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    console.log('✅ TTS MP3 generated successfully, size:', buffer.length, 'bytes');
    res.end(buffer);
    
  } catch (error) {
    console.error('❌ TTS error:', error);
    res.status(500).json({ error: 'TTS generation failed' });
  }
};