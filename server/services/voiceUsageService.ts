import { storage } from '../storage';
import { VOICE_SESSION_LIMITS, VOICE_CONFIG } from '@shared/voice-limits';
import type { VoiceLimitStatus } from '@shared/voice-limits';

export class VoiceUsageService {
  private getUserType(userId: string): 'FREE' | 'PAID' {
    // TODO: Implement actual logic to determine if user is free or paid
    // For now, all users are considered FREE
    return 'FREE';
  }

  async checkVoiceLimits(userId: string): Promise<VoiceLimitStatus> {
    if (!VOICE_CONFIG.ENABLE_LIMITS) {
      return {
        canUseVoice: true,
        remainingSessionMinutes: Infinity,
        remainingDailyMinutes: Infinity,
        warningThreshold: 0,
        userType: 'PAID'
      };
    }

    const userType = this.getUserType(userId);
    const limits = userType === 'PAID' ? VOICE_SESSION_LIMITS.PAID_USERS : VOICE_SESSION_LIMITS.FREE_USERS;
    
    // Get today's usage
    const todayUsage = await storage.getVoiceUsageForToday(userId);
    const totalMinutesToday = todayUsage ? parseFloat(todayUsage.totalMinutes) : 0;
    
    // Check daily limit
    const remainingDailyMinutes = Math.max(0, limits.dailyMinutes - totalMinutesToday);
    if (remainingDailyMinutes <= 0) {
      return {
        canUseVoice: false,
        remainingSessionMinutes: 0,
        remainingDailyMinutes: 0,
        warningThreshold: limits.warningAtMinutes,
        userType
      };
    }
    
    // Check cooldown for free users
    if (userType === 'FREE' && todayUsage && todayUsage.lastSessionEnd) {
      const lastSessionEnd = new Date(todayUsage.lastSessionEnd);
      const cooldownEndsAt = new Date(lastSessionEnd.getTime() + limits.cooldownHours * 60 * 60 * 1000);
      
      if (cooldownEndsAt > new Date()) {
        return {
          canUseVoice: false,
          remainingSessionMinutes: 0,
          remainingDailyMinutes,
          cooldownEndsAt,
          warningThreshold: limits.warningAtMinutes,
          userType
        };
      }
    }
    
    // Check active session
    const activeSession = await storage.getActiveVoiceSession(userId);
    let sessionMinutesUsed = 0;
    
    if (activeSession && activeSession.startTime) {
      const sessionDuration = (new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000 / 60;
      sessionMinutesUsed = sessionDuration;
    }
    
    const remainingSessionMinutes = Math.min(
      limits.sessionMinutes - sessionMinutesUsed,
      remainingDailyMinutes
    );
    
    return {
      canUseVoice: true,
      remainingSessionMinutes,
      remainingDailyMinutes,
      warningThreshold: limits.warningAtMinutes,
      userType
    };
  }

  async startVoiceSession(userId: string): Promise<string> {
    const limits = await this.checkVoiceLimits(userId);
    
    if (!limits.canUseVoice) {
      throw new Error('Voice session limit reached');
    }
    
    // Get or create today's usage record
    let todayUsage = await storage.getVoiceUsageForToday(userId);
    const today = new Date().toISOString().split('T')[0];
    
    if (!todayUsage) {
      todayUsage = await storage.createVoiceUsage({
        userId,
        date: today,
        totalMinutes: '0',
        sessionCount: 0
      });
    }
    
    // Create new session
    const session = await storage.createVoiceSession({
      userId,
      voiceUsageId: todayUsage.id,
      startTime: new Date(),
      userType: limits.userType
    });
    
    // Update session count
    await storage.updateVoiceUsage(todayUsage.id, {
      sessionCount: todayUsage.sessionCount + 1,
      lastSessionStart: new Date()
    });
    
    return session.id;
  }

  async endVoiceSession(sessionId: string, endReason?: string): Promise<void> {
    // Get session details
    const session = await storage.updateVoiceSession(sessionId, {
      endTime: new Date(),
      endReason
    });
    
    if (session.startTime && session.endTime) {
      const durationMinutes = (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000 / 60;
      
      // Update session duration
      await storage.updateVoiceSession(sessionId, {
        durationMinutes: durationMinutes.toFixed(2)
      });
      
      // Update daily usage
      const todayUsage = await storage.getVoiceUsageForToday(session.userId);
      if (todayUsage) {
        const newTotal = parseFloat(todayUsage.totalMinutes) + durationMinutes;
        await storage.updateVoiceUsage(todayUsage.id, {
          totalMinutes: newTotal.toFixed(2),
          lastSessionEnd: new Date()
        });
      }
    }
  }

  async getSessionTimeRemaining(userId: string): Promise<number> {
    const limits = await this.checkVoiceLimits(userId);
    return limits.remainingSessionMinutes;
  }

  async shouldShowWarning(userId: string): Promise<boolean> {
    const limits = await this.checkVoiceLimits(userId);
    const activeSession = await storage.getActiveVoiceSession(userId);
    
    if (!activeSession || !activeSession.startTime) {
      return false;
    }
    
    const sessionDuration = (new Date().getTime() - new Date(activeSession.startTime).getTime()) / 1000 / 60;
    
    return sessionDuration >= limits.warningThreshold && !activeSession.wasWarningShown;
  }

  async markWarningShown(sessionId: string): Promise<void> {
    await storage.updateVoiceSession(sessionId, {
      wasWarningShown: true
    });
  }
}

export const voiceUsageService = new VoiceUsageService();