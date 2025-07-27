import {
  users,
  restaurants,
  veganScoreBreakdowns,
  userFavorites,
  userVisits,
  chatSessions,
  type User,
  type UpsertUser,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Restaurant operations
  getRestaurant(id: string): Promise<Restaurant | undefined>;
  getRestaurantByPlaceId(placeId: string): Promise<Restaurant | undefined>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant>;
  getRestaurantsNearby(lat: number, lng: number, radiusKm: number): Promise<Restaurant[]>;
  
  // Vegan score operations
  getVeganScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | undefined>;
  createVeganScoreBreakdown(breakdown: InsertVeganScoreBreakdown): Promise<VeganScoreBreakdown>;
  updateVeganScoreBreakdown(restaurantId: string, breakdown: Partial<InsertVeganScoreBreakdown>): Promise<VeganScoreBreakdown>;
  
  // User favorites
  getUserFavorites(userId: string): Promise<UserFavorite[]>;
  addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeUserFavorite(userId: string, restaurantId: string): Promise<void>;
  
  // User visits
  getUserVisits(userId: string): Promise<UserVisit[]>;
  addUserVisit(visit: InsertUserVisit): Promise<UserVisit>;
  
  // Chat sessions
  getChatSession(userId: string): Promise<ChatSession | undefined>;
  saveChatSession(session: InsertChatSession): Promise<ChatSession>;
}

export class DatabaseStorage implements IStorage {
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

  async getRestaurant(id: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
    return restaurant;
  }

  async getRestaurantByPlaceId(placeId: string): Promise<Restaurant | undefined> {
    const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.placeId, placeId));
    return restaurant;
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const [newRestaurant] = await db
      .insert(restaurants)
      .values(restaurant)
      .returning();
    return newRestaurant;
  }

  async updateRestaurant(id: string, restaurant: Partial<InsertRestaurant>): Promise<Restaurant> {
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set({ ...restaurant, updatedAt: new Date() })
      .where(eq(restaurants.id, id))
      .returning();
    return updatedRestaurant;
  }

  async getRestaurantsNearby(lat: number, lng: number, radiusKm: number): Promise<Restaurant[]> {
    // Using Haversine formula for distance calculation
    const result = await db
      .select()
      .from(restaurants)
      .where(
        sql`(
          6371 * acos(
            cos(radians(${lat})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(latitude))
          )
        ) <= ${radiusKm}`
      )
      .orderBy(
        sql`(
          6371 * acos(
            cos(radians(${lat})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(latitude))
          )
        ) ASC`
      );
    return result;
  }

  async getVeganScoreBreakdown(restaurantId: string): Promise<VeganScoreBreakdown | undefined> {
    const [breakdown] = await db
      .select()
      .from(veganScoreBreakdowns)
      .where(eq(veganScoreBreakdowns.restaurantId, restaurantId));
    return breakdown;
  }

  async createVeganScoreBreakdown(breakdown: InsertVeganScoreBreakdown): Promise<VeganScoreBreakdown> {
    const [newBreakdown] = await db
      .insert(veganScoreBreakdowns)
      .values(breakdown)
      .returning();
    return newBreakdown;
  }

  async updateVeganScoreBreakdown(restaurantId: string, breakdown: Partial<InsertVeganScoreBreakdown>): Promise<VeganScoreBreakdown> {
    const [updatedBreakdown] = await db
      .update(veganScoreBreakdowns)
      .set({ ...breakdown, updatedAt: new Date() })
      .where(eq(veganScoreBreakdowns.restaurantId, restaurantId))
      .returning();
    return updatedBreakdown;
  }

  async getUserFavorites(userId: string): Promise<UserFavorite[]> {
    return await db
      .select()
      .from(userFavorites)
      .where(eq(userFavorites.userId, userId));
  }

  async addUserFavorite(favorite: InsertUserFavorite): Promise<UserFavorite> {
    const [newFavorite] = await db
      .insert(userFavorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeUserFavorite(userId: string, restaurantId: string): Promise<void> {
    await db
      .delete(userFavorites)
      .where(
        and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.restaurantId, restaurantId)
        )
      );
  }

  async getUserVisits(userId: string): Promise<UserVisit[]> {
    return await db
      .select()
      .from(userVisits)
      .where(eq(userVisits.userId, userId))
      .orderBy(sql`${userVisits.visitDate} DESC`);
  }

  async addUserVisit(visit: InsertUserVisit): Promise<UserVisit> {
    const [newVisit] = await db
      .insert(userVisits)
      .values(visit)
      .returning();
    return newVisit;
  }

  async getChatSession(userId: string): Promise<ChatSession | undefined> {
    const [session] = await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(sql`${chatSessions.updatedAt} DESC`)
      .limit(1);
    return session;
  }

  async saveChatSession(session: InsertChatSession): Promise<ChatSession> {
    const existingSession = await this.getChatSession(session.userId!);
    
    if (existingSession) {
      const [updatedSession] = await db
        .update(chatSessions)
        .set({ 
          messages: session.messages,
          updatedAt: new Date()
        })
        .where(eq(chatSessions.id, existingSession.id))
        .returning();
      return updatedSession;
    } else {
      const [newSession] = await db
        .insert(chatSessions)
        .values(session)
        .returning();
      return newSession;
    }
  }
}

export const storage = new DatabaseStorage();