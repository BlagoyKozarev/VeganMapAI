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
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
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
    return user;
  }
  
  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }
  
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [createdProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return createdProfile;
  }
  
  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  async upsertUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
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
    return upsertedProfile;
  }
  
  // Restaurant operations
  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, id));
    return restaurant;
  }
  
  async getRestaurantByPlaceId(placeId: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.placeId, placeId));
    return restaurant;
  }
  
  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [createdRestaurant] = await db
      .insert(restaurants)
      .values(restaurant)
      .returning();
    return createdRestaurant;
  }
  
  async updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set({ ...restaurant, updatedAt: new Date() })
      .where(eq(restaurants.id, id))
      .returning();
    return updatedRestaurant;
  }
  
  async getAllRestaurantsWithScores(): Promise<Restaurant[]> {
    console.log('Getting all restaurants with AI vegan scores');
    
    // PRODUCTION FIX: Use raw SQL query with snake_case column names
    if (process.env.NODE_ENV === 'production') {
      const result = await db.execute(sql`
        SELECT 
          id,
          place_id as "placeId",
          name,
          address,
          latitude,
          longitude,
          phone_number as "phoneNumber",
          website,
          price_level as "priceLevel",
          cuisine_types as "cuisineTypes",
          opening_hours as "openingHours",
          photos,
          rating,
          review_count as "reviewCount",
          vegan_score as "veganScore",
          is_verified as "isVerified",
          created_at as "createdAt",
          updated_at as "updatedAt",
          geo_hash as "geoHash"
        FROM restaurants
      `);
      
      console.log(`Found ${result.rows.length} total restaurants in production database`);
      return result.rows as Restaurant[];
    }
    
    // Development: use normal Drizzle query
    const allRestaurants = await db.select().from(restaurants);
    console.log(`Found ${allRestaurants.length} total restaurants in database`);
    return allRestaurants;
  }

  async getRestaurantsInRadius(lat: number, lng: number, radiusKm: number): Promise<Restaurant[]> {
    console.log(`Getting restaurants in radius: lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
    
    // For now, return all restaurants and filter client-side for simplicity
    // In production, use proper geospatial queries
    const allRestaurants = await db.select().from(restaurants);
    
    console.log(`Found ${allRestaurants.length} total restaurants in database`);
    
    // Simple distance calculation (approximately)
    const filteredRestaurants = allRestaurants.filter(restaurant => {
      const restLat = parseFloat(restaurant.latitude);
      const restLng = parseFloat(restaurant.longitude);
      
      // Simple distance approximation in km
      const latDiff = Math.abs(lat - restLat);
      const lngDiff = Math.abs(lng - restLng);
      const approximateDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // ~111km per degree
      
      console.log(`Restaurant ${restaurant.name}: distance ~${approximateDistance.toFixed(2)}km`);
      
      return approximateDistance <= radiusKm;
    });
    
    console.log(`Returning ${filteredRestaurants.length} restaurants within ${radiusKm}km`);
    return filteredRestaurants;
  }
  
  async getAllRestaurants(): Promise<Restaurant[]> {
    const result = await db.select()
      .from(restaurants)
      .orderBy(desc(restaurants.createdAt));
    
    return result;
  }

  async searchRestaurants(query: string, lat?: number, lng?: number, filters?: any): Promise<Restaurant[]> {
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
    
    return await queryBuilder.orderBy(desc(restaurants.veganScore));
  }
  
  // Vegan score operations
  async getVeganScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | undefined> {
    const [breakdown] = await db
      .select()
      .from(veganScoreBreakdown)
      .where(eq(veganScoreBreakdown.restaurantId, restaurantId));
    return breakdown;
  }
  
  async upsertVeganScoreBreakdown(breakdown: InsertVeganScoreBreakdown): Promise<VeganScoreBreakdown> {
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
    return upsertedBreakdown;
  }
  
  // User favorites operations
  async getUserFavorites(userId: string): Promise<Restaurant[]> {
    const favorites = await db
      .select({
        restaurant: restaurants,
      })
      .from(userFavorites)
      .innerJoin(restaurants, eq(userFavorites.restaurantId, restaurants.id))
      .where(eq(userFavorites.userId, userId))
      .orderBy(desc(userFavorites.createdAt));
      
    return favorites.map(f => f.restaurant);
  }
  
  async addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    // Check if already exists
    const existing = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, favorite.userId),
        eq(userFavorites.restaurantId, favorite.restaurantId)
      ));
      
    if (existing.length > 0) {
      return existing[0];
    }
    
    const [newFavorite] = await db
      .insert(userFavorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }
  
  async removeUserFavorite(userId: string, restaurantId: string): Promise<void> {
    await db
      .delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.restaurantId, restaurantId)
      ));
  }
  
  async isUserFavorite(userId: string, restaurantId: string): Promise<boolean> {
    const [favorite] = await db
      .select()
      .from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.restaurantId, restaurantId)
      ));
    return !!favorite;
  }
  
  // User visits operations
  async getUserVisits(userId: string): Promise<UserVisit[]> {
    return await db
      .select()
      .from(userVisits)
      .where(eq(userVisits.userId, userId))
      .orderBy(desc(userVisits.visitDate));
  }
  
  async addUserVisit(visit: InsertUserVisit): Promise<UserVisit> {
    const [createdVisit] = await db
      .insert(userVisits)
      .values(visit)
      .returning();
    return createdVisit;
  }
  
  // Chat sessions operations
  async getChatSession(userId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt));
    return session;
  }
  
  async upsertChatSession(session: InsertChatSession): Promise<ChatSession> {
    const existingSession = await this.getChatSession(session.userId);
    
    if (existingSession) {
      const [updatedSession] = await db
        .update(chatSessions)
        .set({
          messages: session.messages,
          updatedAt: new Date(),
        })
        .where(eq(chatSessions.id, existingSession.id))
        .returning();
      return updatedSession;
    } else {
      const [createdSession] = await db
        .insert(chatSessions)
        .values(session)
        .returning();
      return createdSession;
    }
  }
  
  // Analytics operations
  async addUserAnalytics(analytics: InsertUserAnalytics): Promise<UserAnalytics> {
    const [createdAnalytics] = await db
      .insert(userAnalytics)
      .values(analytics)
      .returning();
    return createdAnalytics;
  }
  
  async getUserAnalytics(userId: string, limit: number = 100): Promise<UserAnalytics[]> {
    return await db
      .select()
      .from(userAnalytics)
      .where(eq(userAnalytics.userId, userId))
      .orderBy(desc(userAnalytics.timestamp))
      .limit(limit);
  }
  
  // Voice usage operations
  async getVoiceUsageForToday(userId: string): Promise<VoiceUsage | undefined> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const [usage] = await db
      .select()
      .from(voiceUsage)
      .where(and(
        eq(voiceUsage.userId, userId),
        eq(voiceUsage.date, today)
      ));
    return usage;
  }
  
  async createVoiceUsage(usage: InsertVoiceUsage): Promise<VoiceUsage> {
    const [created] = await db
      .insert(voiceUsage)
      .values(usage)
      .returning();
    return created;
  }
  
  async updateVoiceUsage(id: string, usage: Partial<InsertVoiceUsage>): Promise<VoiceUsage> {
    const [updated] = await db
      .update(voiceUsage)
      .set({ ...usage, updatedAt: new Date() })
      .where(eq(voiceUsage.id, id))
      .returning();
    return updated;
  }
  
  async createVoiceSession(session: InsertVoiceSession): Promise<VoiceSession> {
    const [created] = await db
      .insert(voiceSessions)
      .values(session)
      .returning();
    return created;
  }
  
  async updateVoiceSession(id: string, session: Partial<InsertVoiceSession>): Promise<VoiceSession> {
    const [updated] = await db
      .update(voiceSessions)
      .set(session)
      .where(eq(voiceSessions.id, id))
      .returning();
    return updated;
  }
  
  async getActiveVoiceSession(userId: string): Promise<VoiceSession | undefined> {
    const [session] = await db
      .select()
      .from(voiceSessions)
      .where(and(
        eq(voiceSessions.userId, userId),
        sql`${voiceSessions.endTime} IS NULL`
      ))
      .orderBy(desc(voiceSessions.startTime));
    return session;
  }
}

export const storage = new DatabaseStorage();
