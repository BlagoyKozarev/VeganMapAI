import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dietary style enum
export const dietaryStyleEnum = pgEnum('dietary_style', ['vegan', 'vegetarian', 'flexitarian']);

// Price range enum
export const priceRangeEnum = pgEnum('price_range', ['$', '$$', '$$$', '$$$$']);

// User profiles for dietary preferences and settings
export const userProfiles = pgTable("user_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  dietaryStyle: dietaryStyleEnum("dietary_style").notNull().default('vegan'),
  allergies: text("allergies").array(),
  preferredCuisines: text("preferred_cuisines").array(),
  priceRange: priceRangeEnum("price_range").notNull().default('$$'),
  maxDistance: integer("max_distance").notNull().default(2000), // in meters
  isProfileComplete: boolean("is_profile_complete").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Restaurants table
export const restaurants = pgTable("restaurants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  placeId: varchar("place_id").unique(), // Google Places ID
  name: varchar("name").notNull(),
  address: text("address").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  phoneNumber: varchar("phone_number"),
  website: varchar("website"),
  priceLevel: integer("price_level"),
  cuisineTypes: text("cuisine_types").array(),
  openingHours: jsonb("opening_hours"),
  photos: text("photos").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  veganScore: decimal("vegan_score", { precision: 3, scale: 2 }),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Vegan score breakdown table
export const veganScoreBreakdown = pgTable("vegan_score_breakdown", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  restaurantId: varchar("restaurant_id").notNull().unique().references(() => restaurants.id, { onDelete: 'cascade' }),
  menuVariety: decimal("menu_variety", { precision: 3, scale: 2 }).notNull(),
  ingredientClarity: decimal("ingredient_clarity", { precision: 3, scale: 2 }).notNull(),
  staffKnowledge: decimal("staff_knowledge", { precision: 3, scale: 2 }).notNull(),
  crossContaminationPrevention: decimal("cross_contamination_prevention", { precision: 3, scale: 2 }).notNull(),
  nutritionalInformation: decimal("nutritional_information", { precision: 3, scale: 2 }).notNull(),
  allergenManagement: decimal("allergen_management", { precision: 3, scale: 2 }).notNull(),
  overallScore: decimal("overall_score", { precision: 3, scale: 2 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// User favorites
export const userFavorites = pgTable("user_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

// User visit history
export const userVisits = pgTable("user_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  visitDate: timestamp("visit_date").defaultNow(),
  rating: integer("rating"), // 1-5 stars
  notes: text("notes"),
});

// AI chat sessions
export const chatSessions = pgTable("chat_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  messages: jsonb("messages").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Analytics data
export const userAnalytics = pgTable("user_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  actionType: varchar("action_type").notNull(), // 'search', 'view_restaurant', 'favorite', etc.
  actionData: jsonb("action_data"),
  location: jsonb("location"), // lat, lng
  timestamp: timestamp("timestamp").defaultNow(),
});

// AI Scoring weights configuration table
export const scoringWeights = pgTable("scoring_weights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(), // Configuration name
  menuVarietyWeight: decimal("menu_variety_weight", { precision: 4, scale: 3 }).notNull().default("0.250"),
  ingredientClarityWeight: decimal("ingredient_clarity_weight", { precision: 4, scale: 3 }).notNull().default("0.200"),
  staffKnowledgeWeight: decimal("staff_knowledge_weight", { precision: 4, scale: 3 }).notNull().default("0.150"),
  crossContaminationWeight: decimal("cross_contamination_weight", { precision: 4, scale: 3 }).notNull().default("0.200"),
  nutritionalInformationWeight: decimal("nutritional_information_weight", { precision: 4, scale: 3 }).notNull().default("0.100"),
  allergenManagementWeight: decimal("allergen_management_weight", { precision: 4, scale: 3 }).notNull().default("0.100"),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  userId: true, // Excluded because it's set server-side
  createdAt: true,
  updatedAt: true,
});

export const insertRestaurantSchema = createInsertSchema(restaurants).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVeganScoreBreakdownSchema = createInsertSchema(veganScoreBreakdown).omit({
  id: true,
  lastUpdated: true,
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertUserVisitSchema = createInsertSchema(userVisits).omit({
  id: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit({
  id: true,
  timestamp: true,
});

export const insertScoringWeightsSchema = createInsertSchema(scoringWeights).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfileType = typeof userProfiles.$inferInsert;
export type Restaurant = typeof restaurants.$inferSelect;
export type VeganScoreBreakdown = typeof veganScoreBreakdown.$inferSelect;
export type UserFavorite = typeof userFavorites.$inferSelect;
export type UserVisit = typeof userVisits.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type UserAnalytics = typeof userAnalytics.$inferSelect;
export type ScoringWeights = typeof scoringWeights.$inferSelect;

// Insert types
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertVeganScoreBreakdown = z.infer<typeof insertVeganScoreBreakdownSchema>;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;
export type InsertUserVisit = z.infer<typeof insertUserVisitSchema>;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type InsertUserAnalytics = z.infer<typeof insertUserAnalyticsSchema>;
export type InsertScoringWeights = z.infer<typeof insertScoringWeightsSchema>;

// Additional types for frontend
export interface SearchFilters {
  minVeganScore?: number;
  maxDistance?: number;
  priceRange?: string[];
  cuisineTypes?: string[];
  allergies?: string[];
}

export interface PersonalMatch {
  tasteMatch: number;
  healthFit: number;
}
