// Voice session limits and configuration
export const VOICE_SESSION_LIMITS = {
  FREE_USERS: {
    sessionMinutes: 10,
    dailyMinutes: 30,
    cooldownHours: 2,
    warningAtMinutes: 8
  },
  PAID_USERS: {
    sessionMinutes: 20,
    dailyMinutes: 120, 
    cooldownHours: 0,
    warningAtMinutes: 15
  }
};

export const VOICE_CONFIG = {
  ENABLE_LIMITS: true,
  FALLBACK_TO_TEXT: true,
  PRESERVE_CONTEXT: true,
  TRACK_USAGE: true
};

export interface VoiceUsage {
  userId: string;
  date: string;
  totalMinutes: number;
  sessions: VoiceSession[];
}

export interface VoiceSession {
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
}

export interface VoiceLimitStatus {
  canUseVoice: boolean;
  remainingSessionMinutes: number;
  remainingDailyMinutes: number;
  cooldownEndsAt?: Date;
  warningThreshold: number;
  userType: 'FREE' | 'PAID';
}