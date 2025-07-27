import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  decimal,
  boolean,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Restaurants table with comprehensive vegan scoring
export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  placeId: varchar("place_id").unique().notNull(),
  name: varchar("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  phoneNumber: varchar("phone_number"),
  website: varchar("website"),
  priceLevel: varchar("price_level"), // $, $$, $$$, $$$$
  cuisineTypes: varchar("cuisine_types").array(),
  openingHours: jsonb("opening_hours"),
  photos: varchar("photos").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count"),
  veganScore: decimal("vegan_score", { precision: 3, scale: 2 }).notNull(),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Detailed vegan score breakdown
export const veganScoreBreakdowns = pgTable("vegan_score_breakdowns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id).notNull(),
  menuVariety: decimal("menu_variety", { precision: 3, scale: 1 }).notNull(), // 0-10
  ingredientClarity: decimal("ingredient_clarity", { precision: 3, scale: 1 }).notNull(), // 0-10
  staffKnowledge: decimal("staff_knowledge", { precision: 3, scale: 1 }).notNull(), // 0-10
  crossContamination: decimal("cross_contamination", { precision: 3, scale: 1 }).notNull(), // 0-10
  nutritionalInfo: decimal("nutritional_info", { precision: 3, scale: 1 }).notNull(), // 0-10
  allergenManagement: decimal("allergen_management", { precision: 3, scale: 1 }).notNull(), // 0-10
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User visits tracking
export const userVisits = pgTable("user_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  restaurantId: varchar("restaurant_id").references(() => restaurants.id).notNull(),
  visitDate: timestamp("visit_date").defaultNow(),
  rating: integer("rating"), // 1-5 stars
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat sessions for AI conversations
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertRestaurantSchema = createInsertSchema(restaurants);
export const insertVeganScoreBreakdownSchema = createInsertSchema(veganScoreBreakdowns);
export const insertUserFavoriteSchema = createInsertSchema(userFavorites);
export const insertUserVisitSchema = createInsertSchema(userVisits);
export const insertChatSessionSchema = createInsertSchema(chatSessions);

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type Restaurant = typeof restaurants.$inferSelect;
export type InsertRestaurant = typeof restaurants.$inferInsert;
export type VeganScoreBreakdown = typeof veganScoreBreakdowns.$inferSelect;
export type InsertVeganScoreBreakdown = typeof veganScoreBreakdowns.$inferInsert;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;
export type UserVisit = typeof userVisits.$inferSelect;
export type InsertUserVisit = typeof userVisits.$inferInsert;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = typeof chatSessions.$inferInsert;

// Chat message type
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}