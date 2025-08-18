import {
  users,
  userProfiles,
  restaurants,
  veganScoreBreakdown,
  userFavorites,
  userVisits,
  chatSessions,
  userAnalytics,
  voiceUsage,
  voiceSessions,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Restaurant,
  type InsertRestaurant,
  type VeganScoreBreakdown,
  type InsertVeganScoreBreakdown,
  type UserFavorite,
  type InsertUserFavorite,
  type UserVisit,
  type InsertUserVisit,
  type ChatSession,
  type InsertChatSession,
  type UserAnalytics,
  type InsertUserAnalytics,
  type VoiceUsage,
  type InsertVoiceUsage,
  type VoiceSession,
  type InsertVoiceSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, sql, inArray } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile>;

  // Restaurant operations
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByPlaceId(placeId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  getAllRestaurantsWithScores(): Promise<Restaurant[]>;
  getRestaurantsInRadius(lat: number, lng: number, radiusKm: number): Promise<Restaurant[]>;
  getRestaurantsNearby(params: { lat: number, lng: number, radiusKm: number, minScore: number, limit: number }): Promise<Restaurant[]>;
  getRestaurantsInBounds(bounds: { north: number, south: number, east: number, west: number }, limit?: number): Promise<Restaurant[]>;
  searchRestaurants(query: string, lat?: number, lng?: number, filters?: any): Promise<Restaurant[]>;
  getAllRestaurants(): Promise<Restaurant[]>;

  // Vegan score operations
  getVeganScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | undefined>;
  upsertVeganScoreBreakdown(breakdown: InsertVeganScoreBreakdown): Promise<VeganScoreBreakdown>;

  // User favorites operations
  getUserFavorites(userId: string): Promise<Restaurant[]>;
  addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeUserFavorite(userId: string, restaurantId: string): Promise<void>;
  isUserFavorite(userId: string, restaurantId: string): Promise<boolean>;

  // User visits operations
  getUserVisits(userId: string): Promise<UserVisit[]>;
  addUserVisit(visit: InsertUserVisit): Promise<UserVisit>;

  // Chat sessions operations
  getChatSession(userId: string): Promise<ChatSession | undefined>;
  upsertChatSession(session: InsertChatSession): Promise<ChatSession>;

  // Analytics operations
  addUserAnalytics(analytics: InsertUserAnalytics): Promise<UserAnalytics>;
  getUserAnalytics(userId: string, limit?: number): Promise<UserAnalytics[]>;

  // Voice usage operations
  getVoiceUsageForToday(userId: string): Promise<VoiceUsage | undefined>;
  createVoiceUsage(usage: InsertVoiceUsage): Promise<VoiceUsage>;
  updateVoiceUsage(id: string, usage: Partial<InsertVoiceUsage>): Promise<VoiceUsage>;
  createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession>;
  updateVoiceSession(id: string, session: Partial<InsertVoiceSession>): Promise<VoiceSession>;
  getActiveVoiceSession(userId: string): Promise<VoiceSession | undefined>;

  // Required API methods
  count(): Promise<number>;
  getRestaurantsInBox(query: any): Promise<Array<{id: string, name: string, lat: string, lng: string, score?: string}>>;
  saveFeedback(body: any): Promise<void>;
  loadSampleData(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    console.log(`Storage: Getting user with ID: ${id}`);
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      console.log(`Storage: Found user: ${user ? user.id : 'undefined'}`);
      return user;
    } catch (error) {
      console.error(`Storage: Error getting user ${id}:`, error);
      throw error;
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    console.log('Storage: Upserting user:', userData);
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            ...userData,
            updatedAt: new Date(),
          },
        })
        .returning();
      console.log(`Storage: Upserted user: ${user.id}`);
      return user;
    } catch (error) {
      console.error('Storage: Error upserting user:', error);
      throw error;
    }
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    console.log(`Storage: Getting profile for user ID: ${userId}`);
    try {
      const [profile] = await db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId));
      console.log(`Storage: Found profile for user ${userId}: ${profile ? profile.id : 'undefined'}`);
      return profile;
    } catch (error) {
      console.error(`Storage: Error getting profile for user ${userId}:`, error);
      throw error;
    }
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    console.log('Storage: Creating user profile:', profile);
    try {
      const [createdProfile] = await db
        .insert(userProfiles)
        .values(profile)
        .returning();
      console.log(`Storage: Created profile with ID: ${createdProfile.id}`);
      return createdProfile;
    } catch (error) {
      console.error('Storage: Error creating user profile:', error);
      throw error;
    }
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    console.log(`Storage: Updating profile for user ID: ${userId} with data:`, profile);
    try {
      const [updatedProfile] = await db
        .update(userProfiles)
        .set({ ...profile, updatedAt: new Date() })
        .where(eq(userProfiles.userId, userId))
        .returning();
      console.log(`Storage: Updated profile for user ${userId}: ${updatedProfile ? updatedProfile.id : 'undefined'}`);
      return updatedProfile;
    } catch (error) {
      console.error(`Storage: Error updating profile for user ${userId}:`, error);
      throw error;
    }
  }

  async upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    console.log('Storage: Upserting user profile:', profile);
    try {
      const [upsertedProfile] = await db
        .insert(userProfiles)
        .values(profile)
        .onConflictDoUpdate({
          target: userProfiles.userId,
          set: {
            dietaryStyle: profile.dietaryStyle,
            allergies: profile.allergies,
            preferredCuisines: profile.preferredCuisines,
            priceRange: profile.priceRange,
            maxDistance: profile.maxDistance,
            isProfileComplete: profile.isProfileComplete,
            updatedAt: new Date(),
          },
        })
        .returning();
      console.log(`Storage: Upserted profile for user ${upsertedProfile.userId} with ID: ${upsertedProfile.id}`);
      return upsertedProfile;
    } catch (error) {
      console.error('Storage: Error upserting user profile:', error);
      throw error;
    }
  }

  // Restaurant operations
  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    console.log(`Storage: Getting restaurant with ID: ${id}`);
    try {
      const [restaurant] = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.id, id));
      console.log(`Storage: Found restaurant: ${restaurant ? restaurant.name : 'undefined'}`);
      return restaurant;
    } catch (error) {
      console.error(`Storage: Error getting restaurant ${id}:`, error);
      throw error;
    }
  }

  async getRestaurantByPlaceId(placeId: string): Promise<Restaurant | undefined> {
    console.log(`Storage: Getting restaurant with Place ID: ${placeId}`);
    try {
      const [restaurant] = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.placeId, placeId));
      console.log(`Storage: Found restaurant by Place ID ${placeId}: ${restaurant ? restaurant.name : 'undefined'}`);
      return restaurant;
    } catch (error) {
      console.error(`Storage: Error getting restaurant by Place ID ${placeId}:`, error);
      throw error;
    }
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    console.log('Storage: Creating restaurant:', restaurant);
    try {
      const [createdRestaurant] = await db
        .insert(restaurants)
        .values(restaurant)
        .returning();
      console.log(`Storage: Created restaurant with ID: ${createdRestaurant.id}`);
      return createdRestaurant;
    } catch (error) {
      console.error('Storage: Error creating restaurant:', error);
      throw error;
    }
  }

  async updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    console.log(`Storage: Updating restaurant with ID: ${id} with data:`, restaurant);
    try {
      const [updatedRestaurant] = await db
        .update(restaurants)
        .set({ ...restaurant, updatedAt: new Date() })
        .where(eq(restaurants.id, id))
        .returning();
      console.log(`Storage: Updated restaurant ${id}: ${updatedRestaurant ? updatedRestaurant.name : 'undefined'}`);
      return updatedRestaurant;
    } catch (error) {
      console.error(`Storage: Error updating restaurant ${id}:`, error);
      throw error;
    }
  }

  async getAllRestaurantsWithScores(): Promise<Restaurant[]> {
    console.log('Storage: Getting all restaurants with AI vegan scores');
    try {
      const result = await db.select().from(restaurants).orderBy(restaurants.name);

      console.log(`Storage: Retrieved ${result.length} restaurants from database`);

      if (result.length === 0) {
        console.log('Database is empty - returning empty array');
        return [];
      }

      return result.map(r => ({
        ...r,
        veganScore: r.veganScore ? r.veganScore.toString() : '0',
        cuisineTypes: r.cuisineTypes || [],
        latitude: r.latitude ? r.latitude.toString() : '0',
        longitude: r.longitude ? r.longitude.toString() : '0'
      }));
    } catch (error) {
      console.error('Error getting all restaurants with scores:', error);
      return [];
    }
  }

  async getRestaurantsInRadius(lat: number, lng: number, radiusKm: number): Promise<Restaurant[]> {
    console.log(`Storage: Getting restaurants in radius: lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
    try {
      // For now, return all restaurants and filter client-side for simplicity
      // In production, use proper geospatial queries
      const allRestaurants = await db.select().from(restaurants);

      console.log(`Storage: Found ${allRestaurants.length} total restaurants in database`);

      // Simple distance calculation (approximately)
      const filteredRestaurants = allRestaurants.filter(restaurant => {
        const restLat = parseFloat(restaurant.latitude);
        const restLng = parseFloat(restaurant.longitude);

        // Simple distance approximation in km
        const latDiff = Math.abs(lat - restLat);
        const lngDiff = Math.abs(lng - restLng);
        const approximateDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // ~111km per degree

        console.log(`Storage: Restaurant ${restaurant.name}: distance ~${approximateDistance.toFixed(2)}km`);

        return approximateDistance <= radiusKm;
      });

      console.log(`Storage: Returning ${filteredRestaurants.length} restaurants within ${radiusKm}km`);
      return filteredRestaurants;
    } catch (error) {
      console.error(`Storage: Error getting restaurants in radius:`, error);
      throw error;
    }
  }

  async getRestaurantsNearby(params: { lat: number, lng: number, radiusKm: number, minScore: number, limit: number }): Promise<Restaurant[]> {
    console.log(`Storage: Getting restaurants nearby with params:`, params);
    try {
      // Get restaurants in radius first
      const nearbyRestaurants = await this.getRestaurantsInRadius(params.lat, params.lng, params.radiusKm);
      
      // Filter by minimum vegan score
      const filteredRestaurants = nearbyRestaurants.filter(restaurant => {
        const score = parseFloat(restaurant.veganScore || '0');
        return score >= params.minScore;
      });
      
      // Sort by vegan score (highest first) and limit results
      const sortedRestaurants = filteredRestaurants
        .sort((a, b) => parseFloat(b.veganScore || '0') - parseFloat(a.veganScore || '0'))
        .slice(0, params.limit);
      
      console.log(`Storage: Returning ${sortedRestaurants.length} nearby restaurants with min score ${params.minScore}`);
      
      // Hard cast with fallback protection (duplicate safety)
      const toNum = (v: any) => typeof v === 'number' ? v : Number(String(v).replace(',', '.'));
      return sortedRestaurants.map(r => ({
        ...r,
        id: r.id,
        name: r.name,
        veganScore: toNum(r.veganScore || '0'),
        latitude: String(toNum(r.latitude || '0')),
        longitude: String(toNum(r.longitude || '0'))
      }));
    } catch (error) {
      console.error(`Storage: Error getting nearby restaurants:`, error);
      throw error;
    }
  }

  async getRestaurantsInBounds(bounds: { north: number, south: number, east: number, west: number }, limit: number = 1000): Promise<Restaurant[]> {
    console.log('Storage: Getting restaurants in bounds:', bounds, 'with limit:', limit);
    try {
      // Optimized viewport-based loading
      const query = await db.select()
        .from(restaurants)
        .where(
          sql`${restaurants.latitude} >= ${bounds.south} AND 
              ${restaurants.latitude} <= ${bounds.north} AND 
              ${restaurants.longitude} >= ${bounds.west} AND 
              ${restaurants.longitude} <= ${bounds.east}`
        )
        .limit(limit)
        .orderBy(desc(restaurants.veganScore));

      console.log(`Storage: Found ${query.length} restaurants in bounds`);
      return query;
    } catch (error) {
      console.error('Storage: Error getting restaurants in bounds:', error);
      throw error;
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    console.log('Storage: Getting all restaurants');
    try {
      const result = await db.select()
        .from(restaurants)
        .orderBy(desc(restaurants.createdAt));
      console.log(`Storage: Found ${result.length} restaurants`);
      return result;
    } catch (error) {
      console.error('Storage: Error getting all restaurants:', error);
      throw error;
    }
  }

  async searchRestaurants(query: string, lat?: number, lng?: number, filters?: any): Promise<Restaurant[]> {
    console.log(`Storage: Searching restaurants with query: "${query}", lat: ${lat}, lng: ${lng}, filters:`, filters);
    try {
      let queryBuilder = db.select().from(restaurants);

      if (query) {
        queryBuilder = queryBuilder.where(
          sql`LOWER(${restaurants.name}) LIKE LOWER(${'%' + query + '%'}) OR 
              LOWER(${restaurants.address}) LIKE LOWER(${'%' + query + '%'})`
        ) as any;
      }

      if (filters?.minVeganScore) {
        queryBuilder = queryBuilder.where(sql`${restaurants.veganScore} >= ${filters.minVeganScore}`) as any;
      }

      if (filters?.priceRange && filters.priceRange.length > 0) {
        queryBuilder = queryBuilder.where(inArray(restaurants.priceLevel, filters.priceRange)) as any;
      }

      if (filters?.cuisineTypes && filters.cuisineTypes.length > 0) {
        queryBuilder = queryBuilder.where(
          sql`${restaurants.cuisineTypes} && ${filters.cuisineTypes}`
        ) as any;
      }

      const result = await queryBuilder.orderBy(desc(restaurants.veganScore));
      console.log(`Storage: Found ${result.length} restaurants matching search criteria`);
      return result;
    } catch (error) {
      console.error('Storage: Error searching restaurants:', error);
      throw error;
    }
  }

  // Vegan score operations
  async getVeganScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | undefined> {
    console.log(`Storage: Getting vegan score breakdown for restaurant ID: ${restaurantId}`);
    try {
      const [breakdown] = await db
        .select()
        .from(veganScoreBreakdown)
        .where(eq(veganScoreBreakdown.restaurantId, restaurantId));
      console.log(`Storage: Found breakdown for restaurant ${restaurantId}: ${breakdown ? breakdown.id : 'undefined'}`);
      return breakdown;
    } catch (error) {
      console.error(`Storage: Error getting vegan score breakdown for restaurant ${restaurantId}:`, error);
      throw error;
    }
  }

  async upsertVeganScoreBreakdown(breakdown: InsertVeganScoreBreakdown): Promise<VeganScoreBreakdown> {
    console.log('Storage: Upserting vegan score breakdown:', breakdown);
    try {
      const [upsertedBreakdown] = await db
        .insert(veganScoreBreakdown)
        .values(breakdown)
        .onConflictDoUpdate({
          target: veganScoreBreakdown.restaurantId,
          set: {
            ...breakdown,
            lastUpdated: new Date(),
          },
        })
        .returning();
      console.log(`Storage: Upserted breakdown for restaurant ${upsertedBreakdown.restaurantId} with ID: ${upsertedBreakdown.id}`);
      return upsertedBreakdown;
    } catch (error) {
      console.error('Storage: Error upserting vegan score breakdown:', error);
      throw error;
    }
  }

  // User favorites operations
  async getUserFavorites(userId: string): Promise<Restaurant[]> {
    console.log(`Storage: Getting favorites for user ID: ${userId}`);
    try {
      const favorites = await db
        .select({
          restaurant: restaurants,
        })
        .from(userFavorites)
        .innerJoin(restaurants, eq(userFavorites.restaurantId, restaurants.id))
        .where(eq(userFavorites.userId, userId))
        .orderBy(desc(userFavorites.createdAt));

      console.log(`Storage: Found ${favorites.length} favorites for user ${userId}`);
      return favorites.map(f => f.restaurant);
    } catch (error) {
      console.error(`Storage: Error getting favorites for user ${userId}:`, error);
      throw error;
    }
  }

  async addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    console.log('Storage: Adding user favorite:', favorite);
    try {
      // Check if already exists
      const existing = await db
        .select()
        .from(userFavorites)
        .where(and(
          eq(userFavorites.userId, favorite.userId),
          eq(userFavorites.restaurantId, favorite.restaurantId)
        ));

      if (existing.length > 0) {
        console.log(`Storage: Favorite already exists for user ${favorite.userId} and restaurant ${favorite.restaurantId}`);
        return existing[0];
      }

      const [newFavorite] = await db
        .insert(userFavorites)
        .values(favorite)
        .returning();
      console.log(`Storage: Added favorite with ID: ${newFavorite.id}`);
      return newFavorite;
    } catch (error) {
      console.error('Storage: Error adding user favorite:', error);
      throw error;
    }
  }

  async removeUserFavorite(userId: string, restaurantId: string): Promise<void> {
    console.log(`Storage: Removing favorite for user ID: ${userId}, restaurant ID: ${restaurantId}`);
    try {
      await db
        .delete(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.restaurantId, restaurantId)
        ));
      console.log(`Storage: Removed favorite for user ${userId}, restaurant ${restaurantId}`);
    } catch (error) {
      console.error(`Storage: Error removing favorite for user ${userId}, restaurant ${restaurantId}:`, error);
      throw error;
    }
  }

  async isUserFavorite(userId: string, restaurantId: string): Promise<boolean> {
    console.log(`Storage: Checking if restaurant ${restaurantId} is favorite for user ${userId}`);
    try {
      const [favorite] = await db
        .select()
        .from(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.restaurantId, restaurantId)
        ));
      console.log(`Storage: Is favorite: ${!!favorite}`);
      return !!favorite;
    } catch (error) {
      console.error(`Storage: Error checking if user is favorite for user ${userId}, restaurant ${restaurantId}:`, error);
      throw error;
    }
  }

  // User visits operations
  async getUserVisits(userId: string): Promise<UserVisit[]> {
    console.log(`Storage: Getting visits for user ID: ${userId}`);
    try {
      const result = await db
        .select()
        .from(userVisits)
        .where(eq(userVisits.userId, userId))
        .orderBy(desc(userVisits.visitDate));
      console.log(`Storage: Found ${result.length} visits for user ${userId}`);
      return result;
    } catch (error) {
      console.error(`Storage: Error getting visits for user ${userId}:`, error);
      throw error;
    }
  }

  async addUserVisit(visit: InsertUserVisit): Promise<UserVisit> {
    console.log('Storage: Adding user visit:', visit);
    try {
      const [createdVisit] = await db
        .insert(userVisits)
        .values(visit)
        .returning();
      console.log(`Storage: Added visit with ID: ${createdVisit.id}`);
      return createdVisit;
    } catch (error) {
      console.error('Storage: Error adding user visit:', error);
      throw error;
    }
  }

  // Chat sessions operations
  async getChatSession(userId: string): Promise<ChatSession | undefined> {
    console.log(`Storage: Getting chat session for user ID: ${userId}`);
    try {
      const [session] = await db
        .select()
        .from(chatSessions)
        .where(eq(chatSessions.userId, userId))
        .orderBy(desc(chatSessions.updatedAt));
      console.log(`Storage: Found chat session for user ${userId}: ${session ? session.id : 'undefined'}`);
      return session;
    } catch (error) {
      console.error(`Storage: Error getting chat session for user ${userId}:`, error);
      throw error;
    }
  }

  async upsertChatSession(session: InsertChatSession): Promise<ChatSession> {
    console.log('Storage: Upserting chat session:', session);
    try {
      const existingSession = await this.getChatSession(session.userId);

      if (existingSession) {
        console.log(`Storage: Updating existing chat session ID: ${existingSession.id}`);
        const [updatedSession] = await db
          .update(chatSessions)
          .set({
            messages: session.messages,
            updatedAt: new Date(),
          })
          .where(eq(chatSessions.id, existingSession.id))
          .returning();
        console.log(`Storage: Updated chat session ID: ${updatedSession.id}`);
        return updatedSession;
      } else {
        console.log('Storage: Creating new chat session');
        const [createdSession] = await db
          .insert(chatSessions)
          .values(session)
          .returning();
        console.log(`Storage: Created chat session ID: ${createdSession.id}`);
        return createdSession;
      }
    } catch (error) {
      console.error('Storage: Error upserting chat session:', error);
      throw error;
    }
  }

  // Analytics operations
  async addUserAnalytics(analytics: InsertUserAnalytics): Promise<UserAnalytics> {
    console.log('Storage: Adding user analytics:', analytics);
    try {
      const [createdAnalytics] = await db
        .insert(userAnalytics)
        .values(analytics)
        .returning();
      console.log(`Storage: Added analytics with ID: ${createdAnalytics.id}`);
      return createdAnalytics;
    } catch (error) {
      console.error('Storage: Error adding user analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(userId: string, limit: number = 100): Promise<UserAnalytics[]> {
    console.log(`Storage: Getting user analytics for user ID: ${userId} with limit: ${limit}`);
    try {
      const result = await db
        .select()
        .from(userAnalytics)
        .where(eq(userAnalytics.userId, userId))
        .orderBy(desc(userAnalytics.timestamp))
        .limit(limit);
      console.log(`Storage: Found ${result.length} analytics records for user ${userId}`);
      return result;
    } catch (error) {
      console.error(`Storage: Error getting user analytics for user ${userId}:`, error);
      throw error;
    }
  }

  // Voice usage operations
  async getVoiceUsageForToday(userId: string): Promise<VoiceUsage | undefined> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    console.log(`Storage: Getting voice usage for user ID: ${userId} for date: ${today}`);
    try {
      const [usage] = await db
        .select()
        .from(voiceUsage)
        .where(and(
          eq(voiceUsage.userId, userId),
          eq(voiceUsage.date, today)
        ));
      console.log(`Storage: Found voice usage for user ${userId} today: ${usage ? usage.id : 'undefined'}`);
      return usage;
    } catch (error) {
      console.error(`Storage: Error getting voice usage for user ${userId} for date ${today}:`, error);
      throw error;
    }
  }

  async createVoiceUsage(usage: InsertVoiceUsage): Promise<VoiceUsage> {
    console.log('Storage: Creating voice usage:', usage);
    try {
      const [created] = await db
        .insert(voiceUsage)
        .values(usage)
        .returning();
      console.log(`Storage: Created voice usage with ID: ${created.id}`);
      return created;
    } catch (error) {
      console.error('Storage: Error creating voice usage:', error);
      throw error;
    }
  }

  async updateVoiceUsage(id: string, usage: Partial<InsertVoiceUsage>): Promise<VoiceUsage> {
    console.log(`Storage: Updating voice usage with ID: ${id} with data:`, usage);
    try {
      const [updated] = await db
        .update(voiceUsage)
        .set({ ...usage, updatedAt: new Date() })
        .where(eq(voiceUsage.id, id))
        .returning();
      console.log(`Storage: Updated voice usage with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      console.error(`Storage: Error updating voice usage with ID ${id}:`, error);
      throw error;
    }
  }

  async createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession> {
    console.log('Storage: Creating voice session:', session);
    try {
      const [created] = await db
        .insert(voiceSessions)
        .values(session)
        .returning();
      console.log(`Storage: Created voice session with ID: ${created.id}`);
      return created;
    } catch (error) {
      console.error('Storage: Error creating voice session:', error);
      throw error;
    }
  }

  async updateVoiceSession(id: string, session: Partial<InsertVoiceSession>): Promise<VoiceSession> {
    console.log(`Storage: Updating voice session with ID: ${id} with data:`, session);
    try {
      const [updated] = await db
        .update(voiceSessions)
        .set(session)
        .where(eq(voiceSessions.id, id))
        .returning();
      console.log(`Storage: Updated voice session with ID: ${updated.id}`);
      return updated;
    } catch (error) {
      console.error(`Storage: Error updating voice session with ID ${id}:`, error);
      throw error;
    }
  }

  async getActiveVoiceSession(userId: string): Promise<VoiceSession | undefined> {
    console.log(`Storage: Getting active voice session for user ID: ${userId}`);
    try {
      const [session] = await db
        .select()
        .from(voiceSessions)
        .where(and(
          eq(voiceSessions.userId, userId),
          sql`${voiceSessions.endTime} IS NULL`
        ))
        .orderBy(desc(voiceSessions.startTime));
      console.log(`Storage: Found active voice session for user ${userId}: ${session ? session.id : 'undefined'}`);
      return session;
    } catch (error) {
      console.error(`Storage: Error getting active voice session for user ${userId}:`, error);
      throw error;
    }
  }

  // Required API methods implementation
  async count(): Promise<number> {
    const result = await db.select({count: sql<number>`count(*)`}).from(restaurants);
    return result[0]?.count || 0;
  }

  async getRestaurantsInBox(query: any): Promise<Array<{id: string, name: string, lat: string, lng: string, score?: string}>> {
    const allRestaurants = await this.getAllRestaurantsWithScores();
    return allRestaurants.map(r => ({
      id: r.id,
      name: r.name,
      lat: r.latitude,
      lng: r.longitude,
      score: r.veganScore
    }));
  }

  async saveFeedback(body: any): Promise<void> {
    console.log('Feedback received:', body);
    // Simple logging for now - feedback table can be added later
  }

  async loadSampleData(): Promise<number> {
    // Check if data already exists
    const existing = await this.getAllRestaurants();
    if (existing.length > 0) {
      return existing.length;
    }

    // Sample Sofia restaurants data
    const sampleRestaurants = [
      {
        id: 'loving-hut-sofia-emergency',
        name: 'Loving Hut Sofia',
        address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
        latitude: '42.69798360',
        longitude: '23.33007510',
        cuisineTypes: ['Asian', 'Vegan', 'Vegetarian'],
        openingHours: 'Mon-Sun: 11:00-22:00',
        rating: '4.50',
        reviewCount: 247,
        veganScore: '8.00',
        priceLevel: 2,
        website: 'https://lovinghut.com/sofia'
      }
    ];

    for (const restaurant of sampleRestaurants) {
      await db.insert(restaurants).values(restaurant).onConflictDoNothing();
    }

    return sampleRestaurants.length;
  }
}

export const storage = new DatabaseStorage();