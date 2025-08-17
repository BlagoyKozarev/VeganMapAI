var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  chatSessions: () => chatSessions,
  dietaryStyleEnum: () => dietaryStyleEnum,
  insertChatSessionSchema: () => insertChatSessionSchema,
  insertRestaurantSchema: () => insertRestaurantSchema,
  insertScoringWeightsSchema: () => insertScoringWeightsSchema,
  insertUserAnalyticsSchema: () => insertUserAnalyticsSchema,
  insertUserFavoriteSchema: () => insertUserFavoriteSchema,
  insertUserProfileSchema: () => insertUserProfileSchema,
  insertUserVisitSchema: () => insertUserVisitSchema,
  insertVeganScoreBreakdownSchema: () => insertVeganScoreBreakdownSchema,
  insertVoiceSessionSchema: () => insertVoiceSessionSchema,
  insertVoiceUsageSchema: () => insertVoiceUsageSchema,
  priceRangeEnum: () => priceRangeEnum,
  restaurants: () => restaurants,
  scoringWeights: () => scoringWeights,
  sessions: () => sessions,
  userAnalytics: () => userAnalytics,
  userFavorites: () => userFavorites,
  userProfiles: () => userProfiles,
  userVisits: () => userVisits,
  users: () => users,
  veganScoreBreakdown: () => veganScoreBreakdown,
  voiceSessions: () => voiceSessions,
  voiceUsage: () => voiceUsage
});
import { sql } from "drizzle-orm";
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
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions, users, dietaryStyleEnum, priceRangeEnum, userProfiles, restaurants, veganScoreBreakdown, userFavorites, userVisits, chatSessions, userAnalytics, scoringWeights, voiceUsage, voiceSessions, insertUserProfileSchema, insertRestaurantSchema, insertVeganScoreBreakdownSchema, insertUserFavoriteSchema, insertUserVisitSchema, insertChatSessionSchema, insertUserAnalyticsSchema, insertScoringWeightsSchema, insertVoiceUsageSchema, insertVoiceSessionSchema;
var init_schema = __esm({
  "shared/schema.ts"() {
    sessions = pgTable(
      "sessions",
      {
        sid: varchar("sid").primaryKey(),
        sess: jsonb("sess").notNull(),
        expire: timestamp("expire").notNull()
      },
      (table) => [index("IDX_session_expire").on(table.expire)]
    );
    users = pgTable("users", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      email: varchar("email").unique(),
      firstName: varchar("first_name"),
      lastName: varchar("last_name"),
      profileImageUrl: varchar("profile_image_url"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    dietaryStyleEnum = pgEnum("dietary_style", ["vegan", "vegetarian", "flexitarian"]);
    priceRangeEnum = pgEnum("price_range", ["$", "$$", "$$$", "$$$$"]);
    userProfiles = pgTable("user_profiles", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
      dietaryStyle: dietaryStyleEnum("dietary_style").notNull().default("vegan"),
      allergies: text("allergies").array(),
      preferredCuisines: text("preferred_cuisines").array(),
      priceRange: priceRangeEnum("price_range").notNull().default("$$"),
      maxDistance: integer("max_distance").notNull().default(2e3),
      // in meters
      isProfileComplete: boolean("is_profile_complete").notNull().default(false),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    restaurants = pgTable("restaurants", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      placeId: varchar("place_id").unique(),
      // Google Places ID
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
      geoHash: varchar("geo_hash"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    veganScoreBreakdown = pgTable("vegan_score_breakdown", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      restaurantId: varchar("restaurant_id").notNull().unique().references(() => restaurants.id, { onDelete: "cascade" }),
      menuVariety: decimal("menu_variety", { precision: 3, scale: 2 }).notNull(),
      ingredientClarity: decimal("ingredient_clarity", { precision: 3, scale: 2 }).notNull(),
      staffKnowledge: decimal("staff_knowledge", { precision: 3, scale: 2 }).notNull(),
      crossContaminationPrevention: decimal("cross_contamination_prevention", { precision: 3, scale: 2 }).notNull(),
      nutritionalInformation: decimal("nutritional_information", { precision: 3, scale: 2 }).notNull(),
      allergenManagement: decimal("allergen_management", { precision: 3, scale: 2 }).notNull(),
      overallScore: decimal("overall_score", { precision: 3, scale: 2 }).notNull(),
      lastUpdated: timestamp("last_updated").defaultNow()
    });
    userFavorites = pgTable("user_favorites", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
      createdAt: timestamp("created_at").defaultNow()
    });
    userVisits = pgTable("user_visits", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      restaurantId: varchar("restaurant_id").notNull().references(() => restaurants.id, { onDelete: "cascade" }),
      visitDate: timestamp("visit_date").defaultNow(),
      rating: integer("rating"),
      // 1-5 stars
      notes: text("notes")
    });
    chatSessions = pgTable("chat_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      messages: jsonb("messages").notNull().default([]),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    userAnalytics = pgTable("user_analytics", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      actionType: varchar("action_type").notNull(),
      // 'search', 'view_restaurant', 'favorite', etc.
      actionData: jsonb("action_data"),
      location: jsonb("location"),
      // lat, lng
      timestamp: timestamp("timestamp").defaultNow()
    });
    scoringWeights = pgTable("scoring_weights", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      name: varchar("name").notNull(),
      // Configuration name
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
    voiceUsage = pgTable("voice_usage", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      date: varchar("date").notNull(),
      // YYYY-MM-DD format
      totalMinutes: decimal("total_minutes", { precision: 5, scale: 2 }).notNull().default("0.00"),
      sessionCount: integer("session_count").notNull().default(0),
      lastSessionStart: timestamp("last_session_start"),
      lastSessionEnd: timestamp("last_session_end"),
      createdAt: timestamp("created_at").defaultNow(),
      updatedAt: timestamp("updated_at").defaultNow()
    });
    voiceSessions = pgTable("voice_sessions", {
      id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
      userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
      voiceUsageId: varchar("voice_usage_id").notNull().references(() => voiceUsage.id, { onDelete: "cascade" }),
      startTime: timestamp("start_time").notNull(),
      endTime: timestamp("end_time"),
      durationMinutes: decimal("duration_minutes", { precision: 5, scale: 2 }),
      userType: varchar("user_type").notNull().default("FREE"),
      // FREE or PAID
      wasWarningShown: boolean("was_warning_shown").notNull().default(false),
      endReason: varchar("end_reason"),
      // 'user_ended', 'limit_reached', 'error', 'fallback_to_text'
      createdAt: timestamp("created_at").defaultNow()
    });
    insertUserProfileSchema = createInsertSchema(userProfiles).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertRestaurantSchema = createInsertSchema(restaurants).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertVeganScoreBreakdownSchema = createInsertSchema(veganScoreBreakdown).omit({
      id: true,
      lastUpdated: true
    });
    insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
      id: true,
      createdAt: true
    });
    insertUserVisitSchema = createInsertSchema(userVisits).omit({
      id: true
    });
    insertChatSessionSchema = createInsertSchema(chatSessions).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertUserAnalyticsSchema = createInsertSchema(userAnalytics).omit({
      id: true,
      timestamp: true
    });
    insertScoringWeightsSchema = createInsertSchema(scoringWeights).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertVoiceUsageSchema = createInsertSchema(voiceUsage).omit({
      id: true,
      createdAt: true,
      updatedAt: true
    });
    insertVoiceSessionSchema = createInsertSchema(voiceSessions).omit({
      id: true,
      createdAt: true
    });
  }
});

// server/db.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
var pool, db;
var init_db = __esm({
  "server/db.ts"() {
    init_schema();
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?"
      );
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
    });
    db = drizzle({ client: pool, schema: schema_exports });
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  DatabaseStorage: () => DatabaseStorage,
  storage: () => storage
});
import { eq, and, desc, sql as sql2, inArray } from "drizzle-orm";
var DatabaseStorage, storage;
var init_storage = __esm({
  "server/storage.ts"() {
    init_schema();
    init_db();
    DatabaseStorage = class {
      // User operations
      // (IMPORTANT) these user operations are mandatory for Replit Auth.
      async getUser(id) {
        console.log(`Storage: Getting user with ID: ${id}`);
        try {
          const [user] = await db.select().from(users).where(eq(users.id, id));
          console.log(`Storage: Found user: ${user ? user.id : "undefined"}`);
          return user;
        } catch (error) {
          console.error(`Storage: Error getting user ${id}:`, error);
          throw error;
        }
      }
      async upsertUser(userData) {
        console.log("Storage: Upserting user:", userData);
        try {
          const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
            target: users.id,
            set: {
              ...userData,
              updatedAt: /* @__PURE__ */ new Date()
            }
          }).returning();
          console.log(`Storage: Upserted user: ${user.id}`);
          return user;
        } catch (error) {
          console.error("Storage: Error upserting user:", error);
          throw error;
        }
      }
      // User profile operations
      async getUserProfile(userId) {
        console.log(`Storage: Getting profile for user ID: ${userId}`);
        try {
          const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
          console.log(`Storage: Found profile for user ${userId}: ${profile ? profile.id : "undefined"}`);
          return profile;
        } catch (error) {
          console.error(`Storage: Error getting profile for user ${userId}:`, error);
          throw error;
        }
      }
      async createUserProfile(profile) {
        console.log("Storage: Creating user profile:", profile);
        try {
          const [createdProfile] = await db.insert(userProfiles).values(profile).returning();
          console.log(`Storage: Created profile with ID: ${createdProfile.id}`);
          return createdProfile;
        } catch (error) {
          console.error("Storage: Error creating user profile:", error);
          throw error;
        }
      }
      async updateUserProfile(userId, profile) {
        console.log(`Storage: Updating profile for user ID: ${userId} with data:`, profile);
        try {
          const [updatedProfile] = await db.update(userProfiles).set({ ...profile, updatedAt: /* @__PURE__ */ new Date() }).where(eq(userProfiles.userId, userId)).returning();
          console.log(`Storage: Updated profile for user ${userId}: ${updatedProfile ? updatedProfile.id : "undefined"}`);
          return updatedProfile;
        } catch (error) {
          console.error(`Storage: Error updating profile for user ${userId}:`, error);
          throw error;
        }
      }
      async upsertUserProfile(profile) {
        console.log("Storage: Upserting user profile:", profile);
        try {
          const [upsertedProfile] = await db.insert(userProfiles).values(profile).onConflictDoUpdate({
            target: userProfiles.userId,
            set: {
              dietaryStyle: profile.dietaryStyle,
              allergies: profile.allergies,
              preferredCuisines: profile.preferredCuisines,
              priceRange: profile.priceRange,
              maxDistance: profile.maxDistance,
              isProfileComplete: profile.isProfileComplete,
              updatedAt: /* @__PURE__ */ new Date()
            }
          }).returning();
          console.log(`Storage: Upserted profile for user ${upsertedProfile.userId} with ID: ${upsertedProfile.id}`);
          return upsertedProfile;
        } catch (error) {
          console.error("Storage: Error upserting user profile:", error);
          throw error;
        }
      }
      // Restaurant operations
      async getRestaurant(id) {
        console.log(`Storage: Getting restaurant with ID: ${id}`);
        try {
          const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.id, id));
          console.log(`Storage: Found restaurant: ${restaurant ? restaurant.name : "undefined"}`);
          return restaurant;
        } catch (error) {
          console.error(`Storage: Error getting restaurant ${id}:`, error);
          throw error;
        }
      }
      async getRestaurantByPlaceId(placeId) {
        console.log(`Storage: Getting restaurant with Place ID: ${placeId}`);
        try {
          const [restaurant] = await db.select().from(restaurants).where(eq(restaurants.placeId, placeId));
          console.log(`Storage: Found restaurant by Place ID ${placeId}: ${restaurant ? restaurant.name : "undefined"}`);
          return restaurant;
        } catch (error) {
          console.error(`Storage: Error getting restaurant by Place ID ${placeId}:`, error);
          throw error;
        }
      }
      async createRestaurant(restaurant) {
        console.log("Storage: Creating restaurant:", restaurant);
        try {
          const [createdRestaurant] = await db.insert(restaurants).values(restaurant).returning();
          console.log(`Storage: Created restaurant with ID: ${createdRestaurant.id}`);
          return createdRestaurant;
        } catch (error) {
          console.error("Storage: Error creating restaurant:", error);
          throw error;
        }
      }
      async updateRestaurant(id, restaurant) {
        console.log(`Storage: Updating restaurant with ID: ${id} with data:`, restaurant);
        try {
          const [updatedRestaurant] = await db.update(restaurants).set({ ...restaurant, updatedAt: /* @__PURE__ */ new Date() }).where(eq(restaurants.id, id)).returning();
          console.log(`Storage: Updated restaurant ${id}: ${updatedRestaurant ? updatedRestaurant.name : "undefined"}`);
          return updatedRestaurant;
        } catch (error) {
          console.error(`Storage: Error updating restaurant ${id}:`, error);
          throw error;
        }
      }
      async getAllRestaurantsWithScores() {
        console.log("Storage: Getting all restaurants with AI vegan scores");
        try {
          const result = await db.select().from(restaurants).orderBy(restaurants.name);
          console.log(`Storage: Retrieved ${result.length} restaurants from database`);
          if (result.length === 0) {
            console.log("Database is empty - returning empty array");
            return [];
          }
          return result.map((r) => ({
            ...r,
            veganScore: r.veganScore || "0",
            cuisineTypes: r.cuisineTypes || [],
            latitude: r.latitude?.toString() || "0",
            longitude: r.longitude?.toString() || "0"
          }));
        } catch (error) {
          console.error("Error getting all restaurants with scores:", error);
          return [];
        }
      }
      async getRestaurantsInRadius(lat, lng, radiusKm) {
        console.log(`Storage: Getting restaurants in radius: lat=${lat}, lng=${lng}, radius=${radiusKm}km`);
        try {
          const allRestaurants = await db.select().from(restaurants);
          console.log(`Storage: Found ${allRestaurants.length} total restaurants in database`);
          const filteredRestaurants = allRestaurants.filter((restaurant) => {
            const restLat = parseFloat(restaurant.latitude);
            const restLng = parseFloat(restaurant.longitude);
            const latDiff = Math.abs(lat - restLat);
            const lngDiff = Math.abs(lng - restLng);
            const approximateDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111;
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
      async getRestaurantsNearby(params) {
        console.log(`Storage: Getting restaurants nearby with params:`, params);
        try {
          const nearbyRestaurants = await this.getRestaurantsInRadius(params.lat, params.lng, params.radiusKm);
          const filteredRestaurants = nearbyRestaurants.filter((restaurant) => {
            const score = parseFloat(restaurant.veganScore || "0");
            return score >= params.minScore;
          });
          const sortedRestaurants = filteredRestaurants.sort((a, b) => parseFloat(b.veganScore || "0") - parseFloat(a.veganScore || "0")).slice(0, params.limit);
          console.log(`Storage: Returning ${sortedRestaurants.length} nearby restaurants with min score ${params.minScore}`);
          const toNum = (v) => typeof v === "number" ? v : Number(String(v).replace(",", "."));
          return sortedRestaurants.map((r) => ({
            ...r,
            id: r.id,
            name: r.name,
            veganScore: toNum(r.veganScore || "0"),
            latitude: String(toNum(r.latitude || "0")),
            longitude: String(toNum(r.longitude || "0"))
          }));
        } catch (error) {
          console.error(`Storage: Error getting nearby restaurants:`, error);
          throw error;
        }
      }
      async getRestaurantsInBounds(bounds, limit = 1e3) {
        console.log("Storage: Getting restaurants in bounds:", bounds, "with limit:", limit);
        try {
          const query = await db.select().from(restaurants).where(
            sql2`${restaurants.latitude} >= ${bounds.south} AND 
              ${restaurants.latitude} <= ${bounds.north} AND 
              ${restaurants.longitude} >= ${bounds.west} AND 
              ${restaurants.longitude} <= ${bounds.east}`
          ).limit(limit).orderBy(desc(restaurants.veganScore));
          console.log(`Storage: Found ${query.length} restaurants in bounds`);
          return query;
        } catch (error) {
          console.error("Storage: Error getting restaurants in bounds:", error);
          throw error;
        }
      }
      async getAllRestaurants() {
        console.log("Storage: Getting all restaurants");
        try {
          const result = await db.select().from(restaurants).orderBy(desc(restaurants.createdAt));
          console.log(`Storage: Found ${result.length} restaurants`);
          return result;
        } catch (error) {
          console.error("Storage: Error getting all restaurants:", error);
          throw error;
        }
      }
      async searchRestaurants(query, lat, lng, filters) {
        console.log(`Storage: Searching restaurants with query: "${query}", lat: ${lat}, lng: ${lng}, filters:`, filters);
        try {
          let queryBuilder = db.select().from(restaurants);
          if (query) {
            queryBuilder = queryBuilder.where(
              sql2`LOWER(${restaurants.name}) LIKE LOWER(${"%" + query + "%"}) OR 
              LOWER(${restaurants.address}) LIKE LOWER(${"%" + query + "%"})`
            );
          }
          if (filters?.minVeganScore) {
            queryBuilder = queryBuilder.where(sql2`${restaurants.veganScore} >= ${filters.minVeganScore}`);
          }
          if (filters?.priceRange && filters.priceRange.length > 0) {
            queryBuilder = queryBuilder.where(inArray(restaurants.priceLevel, filters.priceRange));
          }
          if (filters?.cuisineTypes && filters.cuisineTypes.length > 0) {
            queryBuilder = queryBuilder.where(
              sql2`${restaurants.cuisineTypes} && ${filters.cuisineTypes}`
            );
          }
          const result = await queryBuilder.orderBy(desc(restaurants.veganScore));
          console.log(`Storage: Found ${result.length} restaurants matching search criteria`);
          return result;
        } catch (error) {
          console.error("Storage: Error searching restaurants:", error);
          throw error;
        }
      }
      // Vegan score operations
      async getVeganScoreBreakdown(restaurantId) {
        console.log(`Storage: Getting vegan score breakdown for restaurant ID: ${restaurantId}`);
        try {
          const [breakdown] = await db.select().from(veganScoreBreakdown).where(eq(veganScoreBreakdown.restaurantId, restaurantId));
          console.log(`Storage: Found breakdown for restaurant ${restaurantId}: ${breakdown ? breakdown.id : "undefined"}`);
          return breakdown;
        } catch (error) {
          console.error(`Storage: Error getting vegan score breakdown for restaurant ${restaurantId}:`, error);
          throw error;
        }
      }
      async upsertVeganScoreBreakdown(breakdown) {
        console.log("Storage: Upserting vegan score breakdown:", breakdown);
        try {
          const [upsertedBreakdown] = await db.insert(veganScoreBreakdown).values(breakdown).onConflictDoUpdate({
            target: veganScoreBreakdown.restaurantId,
            set: {
              ...breakdown,
              lastUpdated: /* @__PURE__ */ new Date()
            }
          }).returning();
          console.log(`Storage: Upserted breakdown for restaurant ${upsertedBreakdown.restaurantId} with ID: ${upsertedBreakdown.id}`);
          return upsertedBreakdown;
        } catch (error) {
          console.error("Storage: Error upserting vegan score breakdown:", error);
          throw error;
        }
      }
      // User favorites operations
      async getUserFavorites(userId) {
        console.log(`Storage: Getting favorites for user ID: ${userId}`);
        try {
          const favorites = await db.select({
            restaurant: restaurants
          }).from(userFavorites).innerJoin(restaurants, eq(userFavorites.restaurantId, restaurants.id)).where(eq(userFavorites.userId, userId)).orderBy(desc(userFavorites.createdAt));
          console.log(`Storage: Found ${favorites.length} favorites for user ${userId}`);
          return favorites.map((f) => f.restaurant);
        } catch (error) {
          console.error(`Storage: Error getting favorites for user ${userId}:`, error);
          throw error;
        }
      }
      async addUserFavorite(favorite) {
        console.log("Storage: Adding user favorite:", favorite);
        try {
          const existing = await db.select().from(userFavorites).where(and(
            eq(userFavorites.userId, favorite.userId),
            eq(userFavorites.restaurantId, favorite.restaurantId)
          ));
          if (existing.length > 0) {
            console.log(`Storage: Favorite already exists for user ${favorite.userId} and restaurant ${favorite.restaurantId}`);
            return existing[0];
          }
          const [newFavorite] = await db.insert(userFavorites).values(favorite).returning();
          console.log(`Storage: Added favorite with ID: ${newFavorite.id}`);
          return newFavorite;
        } catch (error) {
          console.error("Storage: Error adding user favorite:", error);
          throw error;
        }
      }
      async removeUserFavorite(userId, restaurantId) {
        console.log(`Storage: Removing favorite for user ID: ${userId}, restaurant ID: ${restaurantId}`);
        try {
          await db.delete(userFavorites).where(and(
            eq(userFavorites.userId, userId),
            eq(userFavorites.restaurantId, restaurantId)
          ));
          console.log(`Storage: Removed favorite for user ${userId}, restaurant ${restaurantId}`);
        } catch (error) {
          console.error(`Storage: Error removing favorite for user ${userId}, restaurant ${restaurantId}:`, error);
          throw error;
        }
      }
      async isUserFavorite(userId, restaurantId) {
        console.log(`Storage: Checking if restaurant ${restaurantId} is favorite for user ${userId}`);
        try {
          const [favorite] = await db.select().from(userFavorites).where(and(
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
      async getUserVisits(userId) {
        console.log(`Storage: Getting visits for user ID: ${userId}`);
        try {
          const result = await db.select().from(userVisits).where(eq(userVisits.userId, userId)).orderBy(desc(userVisits.visitDate));
          console.log(`Storage: Found ${result.length} visits for user ${userId}`);
          return result;
        } catch (error) {
          console.error(`Storage: Error getting visits for user ${userId}:`, error);
          throw error;
        }
      }
      async addUserVisit(visit) {
        console.log("Storage: Adding user visit:", visit);
        try {
          const [createdVisit] = await db.insert(userVisits).values(visit).returning();
          console.log(`Storage: Added visit with ID: ${createdVisit.id}`);
          return createdVisit;
        } catch (error) {
          console.error("Storage: Error adding user visit:", error);
          throw error;
        }
      }
      // Chat sessions operations
      async getChatSession(userId) {
        console.log(`Storage: Getting chat session for user ID: ${userId}`);
        try {
          const [session2] = await db.select().from(chatSessions).where(eq(chatSessions.userId, userId)).orderBy(desc(chatSessions.updatedAt));
          console.log(`Storage: Found chat session for user ${userId}: ${session2 ? session2.id : "undefined"}`);
          return session2;
        } catch (error) {
          console.error(`Storage: Error getting chat session for user ${userId}:`, error);
          throw error;
        }
      }
      async upsertChatSession(session2) {
        console.log("Storage: Upserting chat session:", session2);
        try {
          const existingSession = await this.getChatSession(session2.userId);
          if (existingSession) {
            console.log(`Storage: Updating existing chat session ID: ${existingSession.id}`);
            const [updatedSession] = await db.update(chatSessions).set({
              messages: session2.messages,
              updatedAt: /* @__PURE__ */ new Date()
            }).where(eq(chatSessions.id, existingSession.id)).returning();
            console.log(`Storage: Updated chat session ID: ${updatedSession.id}`);
            return updatedSession;
          } else {
            console.log("Storage: Creating new chat session");
            const [createdSession] = await db.insert(chatSessions).values(session2).returning();
            console.log(`Storage: Created chat session ID: ${createdSession.id}`);
            return createdSession;
          }
        } catch (error) {
          console.error("Storage: Error upserting chat session:", error);
          throw error;
        }
      }
      // Analytics operations
      async addUserAnalytics(analytics) {
        console.log("Storage: Adding user analytics:", analytics);
        try {
          const [createdAnalytics] = await db.insert(userAnalytics).values(analytics).returning();
          console.log(`Storage: Added analytics with ID: ${createdAnalytics.id}`);
          return createdAnalytics;
        } catch (error) {
          console.error("Storage: Error adding user analytics:", error);
          throw error;
        }
      }
      async getUserAnalytics(userId, limit = 100) {
        console.log(`Storage: Getting user analytics for user ID: ${userId} with limit: ${limit}`);
        try {
          const result = await db.select().from(userAnalytics).where(eq(userAnalytics.userId, userId)).orderBy(desc(userAnalytics.timestamp)).limit(limit);
          console.log(`Storage: Found ${result.length} analytics records for user ${userId}`);
          return result;
        } catch (error) {
          console.error(`Storage: Error getting user analytics for user ${userId}:`, error);
          throw error;
        }
      }
      // Voice usage operations
      async getVoiceUsageForToday(userId) {
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        console.log(`Storage: Getting voice usage for user ID: ${userId} for date: ${today}`);
        try {
          const [usage] = await db.select().from(voiceUsage).where(and(
            eq(voiceUsage.userId, userId),
            eq(voiceUsage.date, today)
          ));
          console.log(`Storage: Found voice usage for user ${userId} today: ${usage ? usage.id : "undefined"}`);
          return usage;
        } catch (error) {
          console.error(`Storage: Error getting voice usage for user ${userId} for date ${today}:`, error);
          throw error;
        }
      }
      async createVoiceUsage(usage) {
        console.log("Storage: Creating voice usage:", usage);
        try {
          const [created] = await db.insert(voiceUsage).values(usage).returning();
          console.log(`Storage: Created voice usage with ID: ${created.id}`);
          return created;
        } catch (error) {
          console.error("Storage: Error creating voice usage:", error);
          throw error;
        }
      }
      async updateVoiceUsage(id, usage) {
        console.log(`Storage: Updating voice usage with ID: ${id} with data:`, usage);
        try {
          const [updated] = await db.update(voiceUsage).set({ ...usage, updatedAt: /* @__PURE__ */ new Date() }).where(eq(voiceUsage.id, id)).returning();
          console.log(`Storage: Updated voice usage with ID: ${updated.id}`);
          return updated;
        } catch (error) {
          console.error(`Storage: Error updating voice usage with ID ${id}:`, error);
          throw error;
        }
      }
      async createVoiceSession(session2) {
        console.log("Storage: Creating voice session:", session2);
        try {
          const [created] = await db.insert(voiceSessions).values(session2).returning();
          console.log(`Storage: Created voice session with ID: ${created.id}`);
          return created;
        } catch (error) {
          console.error("Storage: Error creating voice session:", error);
          throw error;
        }
      }
      async updateVoiceSession(id, session2) {
        console.log(`Storage: Updating voice session with ID: ${id} with data:`, session2);
        try {
          const [updated] = await db.update(voiceSessions).set(session2).where(eq(voiceSessions.id, id)).returning();
          console.log(`Storage: Updated voice session with ID: ${updated.id}`);
          return updated;
        } catch (error) {
          console.error(`Storage: Error updating voice session with ID ${id}:`, error);
          throw error;
        }
      }
      async getActiveVoiceSession(userId) {
        console.log(`Storage: Getting active voice session for user ID: ${userId}`);
        try {
          const [session2] = await db.select().from(voiceSessions).where(and(
            eq(voiceSessions.userId, userId),
            sql2`${voiceSessions.endTime} IS NULL`
          )).orderBy(desc(voiceSessions.startTime));
          console.log(`Storage: Found active voice session for user ${userId}: ${session2 ? session2.id : "undefined"}`);
          return session2;
        } catch (error) {
          console.error(`Storage: Error getting active voice session for user ${userId}:`, error);
          throw error;
        }
      }
      // Required API methods implementation
      async count() {
        const result = await db.select({ count: sql2`count(*)` }).from(restaurants);
        return result[0]?.count || 0;
      }
      async getRestaurantsInBox(query) {
        const allRestaurants = await this.getAllRestaurantsWithScores();
        return allRestaurants.map((r) => ({
          id: r.id,
          name: r.name,
          lat: r.latitude,
          lng: r.longitude,
          score: r.veganScore
        }));
      }
      async saveFeedback(body) {
        console.log("Feedback received:", body);
      }
      async loadSampleData() {
        const existing = await this.getAllRestaurants();
        if (existing.length > 0) {
          return existing.length;
        }
        const sampleRestaurants = [
          {
            id: "loving-hut-sofia-emergency",
            name: "Loving Hut Sofia",
            address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
            latitude: "42.69798360",
            longitude: "23.33007510",
            cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
            openingHours: "Mon-Sun: 11:00-22:00",
            rating: "4.50",
            reviewCount: 247,
            veganScore: "8.00",
            priceLevel: 2,
            website: "https://lovinghut.com/sofia"
          }
        ];
        for (const restaurant of sampleRestaurants) {
          await db.insert(restaurants).values(restaurant).onConflictDoNothing();
        }
        return sampleRestaurants.length;
      }
    };
    storage = new DatabaseStorage();
  }
});

// shared/voice-limits.ts
var VOICE_SESSION_LIMITS, VOICE_CONFIG;
var init_voice_limits = __esm({
  "shared/voice-limits.ts"() {
    VOICE_SESSION_LIMITS = {
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
    VOICE_CONFIG = {
      ENABLE_LIMITS: true,
      FALLBACK_TO_TEXT: true,
      PRESERVE_CONTEXT: true,
      TRACK_USAGE: true
    };
  }
});

// server/services/voiceUsageService.ts
var voiceUsageService_exports = {};
__export(voiceUsageService_exports, {
  VoiceUsageService: () => VoiceUsageService,
  voiceUsageService: () => voiceUsageService
});
var VoiceUsageService, voiceUsageService;
var init_voiceUsageService = __esm({
  "server/services/voiceUsageService.ts"() {
    init_storage();
    init_voice_limits();
    VoiceUsageService = class {
      getUserType(userId) {
        return "FREE";
      }
      async checkVoiceLimits(userId) {
        if (!VOICE_CONFIG.ENABLE_LIMITS) {
          return {
            canUseVoice: true,
            remainingSessionMinutes: Infinity,
            remainingDailyMinutes: Infinity,
            warningThreshold: 0,
            userType: "PAID"
          };
        }
        const userType = this.getUserType(userId);
        const limits = userType === "PAID" ? VOICE_SESSION_LIMITS.PAID_USERS : VOICE_SESSION_LIMITS.FREE_USERS;
        const todayUsage = await storage.getVoiceUsageForToday(userId);
        const totalMinutesToday = todayUsage ? parseFloat(todayUsage.totalMinutes) : 0;
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
        if (userType === "FREE" && todayUsage && todayUsage.lastSessionEnd) {
          const lastSessionEnd = new Date(todayUsage.lastSessionEnd);
          const cooldownEndsAt = new Date(lastSessionEnd.getTime() + limits.cooldownHours * 60 * 60 * 1e3);
          if (cooldownEndsAt > /* @__PURE__ */ new Date()) {
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
        const activeSession = await storage.getActiveVoiceSession(userId);
        let sessionMinutesUsed = 0;
        if (activeSession && activeSession.startTime) {
          const sessionDuration = ((/* @__PURE__ */ new Date()).getTime() - new Date(activeSession.startTime).getTime()) / 1e3 / 60;
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
      async startVoiceSession(userId) {
        const limits = await this.checkVoiceLimits(userId);
        if (!limits.canUseVoice) {
          throw new Error("Voice session limit reached");
        }
        let todayUsage = await storage.getVoiceUsageForToday(userId);
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        if (!todayUsage) {
          todayUsage = await storage.createVoiceUsage({
            userId,
            date: today,
            totalMinutes: "0",
            sessionCount: 0
          });
        }
        const session2 = await storage.createVoiceSession({
          userId,
          voiceUsageId: todayUsage.id,
          startTime: /* @__PURE__ */ new Date(),
          userType: limits.userType
        });
        await storage.updateVoiceUsage(todayUsage.id, {
          sessionCount: todayUsage.sessionCount + 1,
          lastSessionStart: /* @__PURE__ */ new Date()
        });
        return session2.id;
      }
      async endVoiceSession(sessionId, endReason) {
        const session2 = await storage.updateVoiceSession(sessionId, {
          endTime: /* @__PURE__ */ new Date(),
          endReason
        });
        if (session2.startTime && session2.endTime) {
          const durationMinutes = (new Date(session2.endTime).getTime() - new Date(session2.startTime).getTime()) / 1e3 / 60;
          await storage.updateVoiceSession(sessionId, {
            durationMinutes: durationMinutes.toFixed(2)
          });
          const todayUsage = await storage.getVoiceUsageForToday(session2.userId);
          if (todayUsage) {
            const newTotal = parseFloat(todayUsage.totalMinutes) + durationMinutes;
            await storage.updateVoiceUsage(todayUsage.id, {
              totalMinutes: newTotal.toFixed(2),
              lastSessionEnd: /* @__PURE__ */ new Date()
            });
          }
        }
      }
      async getSessionTimeRemaining(userId) {
        const limits = await this.checkVoiceLimits(userId);
        return limits.remainingSessionMinutes;
      }
      async shouldShowWarning(userId) {
        const limits = await this.checkVoiceLimits(userId);
        const activeSession = await storage.getActiveVoiceSession(userId);
        if (!activeSession || !activeSession.startTime) {
          return false;
        }
        const sessionDuration = ((/* @__PURE__ */ new Date()).getTime() - new Date(activeSession.startTime).getTime()) / 1e3 / 60;
        return sessionDuration >= limits.warningThreshold && !activeSession.wasWarningShown;
      }
      async markWarningShown(sessionId) {
        await storage.updateVoiceSession(sessionId, {
          wasWarningShown: true
        });
      }
    };
    voiceUsageService = new VoiceUsageService();
  }
});

// server/services/googleMapsOptimizer.ts
import { Client as Client3 } from "@googlemaps/google-maps-services-js";
import memoizee from "memoizee";
var GoogleMapsOptimizer, getGoogleMapsOptimizer;
var init_googleMapsOptimizer = __esm({
  "server/services/googleMapsOptimizer.ts"() {
    init_storage();
    GoogleMapsOptimizer = class {
      cache;
      geoHashCache;
      // geohash -> restaurant IDs
      apiCallTracker;
      // daily API call tracking
      emergencyMode = false;
      client;
      apiKey;
      constructor(apiKey) {
        this.cache = /* @__PURE__ */ new Map();
        this.geoHashCache = /* @__PURE__ */ new Map();
        this.apiCallTracker = /* @__PURE__ */ new Map();
        this.client = new Client3({});
        this.apiKey = apiKey;
        this.loadCacheFromDatabase();
      }
      /**
       * Load previously cached restaurant data from database
       */
      async loadCacheFromDatabase() {
        try {
          const cachedRestaurants = await storage.getAllRestaurants();
          console.log(`\u{1F4E6} Loading ${cachedRestaurants.length} restaurants from database cache`);
          for (const restaurant of cachedRestaurants) {
            if (restaurant.placeId) {
              const geoHash = this.generateGeoHash(
                parseFloat(restaurant.latitude),
                parseFloat(restaurant.longitude),
                6
              );
              const existingHashes = this.geoHashCache.get(geoHash) || [];
              existingHashes.push(restaurant.id);
              this.geoHashCache.set(geoHash, existingHashes);
            }
          }
          console.log(`\u2705 Loaded ${this.geoHashCache.size} geo-hash regions`);
        } catch (error) {
          console.error("Failed to load cache from database:", error);
        }
      }
      /**
       * PHASE 1: Pre-populate US restaurant data using BULK operations
       */
      async bulkPopulateUSRestaurants() {
        console.log("\u{1F680} Starting BULK US restaurant population - this will take hours but save $40K+");
        const usCities = [
          { name: "New York", lat: 40.7128, lng: -74.006, radius: 5e4 },
          { name: "Los Angeles", lat: 34.0522, lng: -118.2437, radius: 8e4 },
          { name: "Chicago", lat: 41.8781, lng: -87.6298, radius: 5e4 },
          { name: "San Francisco", lat: 37.7749, lng: -122.4194, radius: 4e4 },
          { name: "Seattle", lat: 47.6062, lng: -122.3321, radius: 4e4 },
          { name: "Austin", lat: 30.2672, lng: -97.7431, radius: 35e3 },
          { name: "Portland", lat: 45.5152, lng: -122.6784, radius: 35e3 },
          { name: "Denver", lat: 39.7392, lng: -104.9903, radius: 4e4 },
          { name: "Boston", lat: 42.3601, lng: -71.0589, radius: 35e3 },
          { name: "Philadelphia", lat: 39.9526, lng: -75.1652, radius: 4e4 },
          { name: "Washington DC", lat: 38.9072, lng: -77.0369, radius: 35e3 },
          { name: "Miami", lat: 25.7617, lng: -80.1918, radius: 45e3 },
          { name: "Atlanta", lat: 33.749, lng: -84.388, radius: 4e4 },
          { name: "Phoenix", lat: 33.4484, lng: -112.074, radius: 5e4 },
          { name: "San Diego", lat: 32.7157, lng: -117.1611, radius: 35e3 },
          { name: "Dallas", lat: 32.7767, lng: -96.797, radius: 45e3 },
          { name: "Houston", lat: 29.7604, lng: -95.3698, radius: 5e4 },
          { name: "Las Vegas", lat: 36.1699, lng: -115.1398, radius: 3e4 },
          { name: "Minneapolis", lat: 44.9778, lng: -93.265, radius: 35e3 },
          { name: "Detroit", lat: 42.3314, lng: -83.0458, radius: 4e4 }
        ];
        for (const city of usCities) {
          if (this.emergencyMode) {
            console.warn("\u{1F6A8} Emergency mode active - stopping bulk population");
            break;
          }
          console.log(`\u{1F4CD} Processing ${city.name}...`);
          await this.bulkTextSearch(city, [
            "vegan restaurant",
            "vegetarian restaurant",
            "health food restaurant",
            "organic restaurant",
            "plant based restaurant"
          ]);
          await this.sleep(2e3);
        }
        console.log("\u2705 Bulk population complete");
      }
      /**
       * Bulk Text Search - much cheaper than Places API
       */
      async bulkTextSearch(city, queries) {
        for (const query of queries) {
          try {
            const searchQuery = `${query} in ${city.name}`;
            const response = await this.makeTextSearchRequest(searchQuery, city);
            await this.cacheRestaurantsWithGeoHash(response.data.results, city);
            await this.sleep(1e3);
          } catch (error) {
            console.error(`Error in text search for ${query} in ${city.name}:`, error.message);
            if (error.message?.includes("QUOTA_EXCEEDED")) {
              console.warn("\u{1F6A8} Daily quota exceeded - entering emergency mode");
              this.emergencyMode = true;
              return;
            }
          }
        }
      }
      /**
       * Intelligent Geo-Hash caching system
       */
      async cacheRestaurantsWithGeoHash(restaurants2, city) {
        for (const restaurant of restaurants2) {
          const geoHash = this.generateGeoHash(
            restaurant.geometry.location.lat,
            restaurant.geometry.location.lng,
            6
            // precision for city-level caching
          );
          try {
            const savedRestaurant = await storage.createRestaurant({
              name: restaurant.name,
              placeId: restaurant.place_id,
              address: restaurant.formatted_address || restaurant.vicinity,
              latitude: restaurant.geometry.location.lat.toString(),
              longitude: restaurant.geometry.location.lng.toString(),
              rating: restaurant.rating?.toString() || "0",
              priceLevel: restaurant.price_level || 0,
              cuisineTypes: restaurant.types || [],
              photos: restaurant.photos ? restaurant.photos.slice(0, 3).map((p) => p.photo_reference) : [],
              openingHours: restaurant.opening_hours || {},
              phoneNumber: restaurant.formatted_phone_number || "",
              website: restaurant.website || "",
              geoHash
            });
            const existingHashes = this.geoHashCache.get(geoHash) || [];
            existingHashes.push(savedRestaurant.id);
            this.geoHashCache.set(geoHash, existingHashes);
          } catch (error) {
            console.error("Failed to cache restaurant:", error);
          }
        }
      }
      /**
       * Smart restaurant loading based on viewport
       */
      async getRestaurantsInViewport(bounds, maxResults = 100) {
        const relevantGeoHashes = this.getGeoHashesInBounds(bounds);
        const restaurants2 = [];
        const seenIds = /* @__PURE__ */ new Set();
        for (const geoHash of relevantGeoHashes) {
          const restaurantIds = this.geoHashCache.get(geoHash) || [];
          for (const restaurantId of restaurantIds) {
            if (seenIds.has(restaurantId)) continue;
            const restaurant = await storage.getRestaurant(restaurantId);
            if (restaurant && this.isInViewport(
              { lat: parseFloat(restaurant.latitude), lng: parseFloat(restaurant.longitude) },
              bounds
            )) {
              restaurants2.push(restaurant);
              seenIds.add(restaurantId);
              if (restaurants2.length >= maxResults) {
                return restaurants2;
              }
            }
          }
        }
        if (restaurants2.length < 20 && !this.emergencyMode) {
          console.log("\u{1F4E1} Making targeted API calls to fill viewport...");
          const center = {
            lat: (bounds.north + bounds.south) / 2,
            lng: (bounds.east + bounds.west) / 2
          };
          const additionalRestaurants = await this.makeTargetedNearbySearch(center, 20 - restaurants2.length);
          restaurants2.push(...additionalRestaurants);
        }
        return restaurants2;
      }
      /**
       * Lazy loading of detailed restaurant data ONLY when user clicks
       */
      async getRestaurantDetails(placeId, forceRefresh = false) {
        const restaurants2 = await storage.getAllRestaurants();
        const cached = restaurants2.find((r) => r.placeId === placeId);
        if (cached && !forceRefresh) {
          if (cached.website && cached.phoneNumber && cached.updatedAt && this.isFreshEnough(new Date(cached.updatedAt), 7)) {
            return cached;
          }
        }
        console.log(`\u{1F4E1} Fetching details for ${placeId}`);
        try {
          const details = await this.makePlaceDetailsRequest(placeId);
          if (cached) {
            await storage.updateRestaurant(cached.id, {
              phoneNumber: details.result.formatted_phone_number || "",
              website: details.result.website || "",
              openingHours: details.result.opening_hours || {}
            });
          }
          this.trackAPICall("place_details");
          return details.result;
        } catch (error) {
          console.error("Failed to fetch restaurant details:", error);
          return cached || null;
        }
      }
      /**
       * Photo loading optimization - load photos on demand
       */
      async getRestaurantPhotos(placeId, maxPhotos = 3) {
        const restaurants2 = await storage.getAllRestaurants();
        const cached = restaurants2.find((r) => r.placeId === placeId);
        if (cached?.photos && cached.photos.length > 0) {
          return cached.photos.slice(0, maxPhotos).map(
            (ref) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${this.apiKey}`
          );
        }
        try {
          const details = await this.getRestaurantDetails(placeId);
          const photoRefs = details.photos?.slice(0, maxPhotos).map((p) => p.photo_reference) || [];
          if (cached && photoRefs.length > 0) {
            await storage.updateRestaurant(cached.id, {
              photos: photoRefs
            });
          }
          return photoRefs.map(
            (ref) => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${this.apiKey}`
          );
        } catch (error) {
          console.error("Failed to load photos:", error);
          return [];
        }
      }
      /**
       * Emergency mode - when reaching daily limits
       */
      activateEmergencyMode() {
        this.emergencyMode = true;
        console.warn("\u{1F6A8} Emergency mode activated - serving cached data only");
      }
      /**
       * API call tracking and quota management
       */
      trackAPICall(type) {
        const today = (/* @__PURE__ */ new Date()).toDateString();
        const key = `${today}-${type}`;
        const count = this.apiCallTracker.get(key) || 0;
        this.apiCallTracker.set(key, count + 1);
        const dailyTotal = Array.from(this.apiCallTracker.entries()).filter(([k]) => k.startsWith(today)).reduce((sum, [, count2]) => sum + count2, 0);
        if (dailyTotal > 8e3) {
          console.warn("\u26A0\uFE0F Approaching daily API limit");
        }
        if (dailyTotal > 9500) {
          this.activateEmergencyMode();
        }
      }
      /**
       * Cost estimation and reporting
       */
      getCostReport() {
        const costs = {
          textSearch: this.getAPICallCount("text_search") * 0.032,
          nearbySearch: this.getAPICallCount("nearby_search") * 0.032,
          placeDetails: this.getAPICallCount("place_details") * 0.017,
          photos: this.getAPICallCount("photos") * 7e-3
        };
        return {
          daily: Object.values(costs).reduce((a, b) => a + b, 0),
          monthly: Object.values(costs).reduce((a, b) => a + b, 0) * 30,
          breakdown: costs,
          apiCalls: {
            today: this.getTodayAPICallCount(),
            limit: 1e4,
            remaining: 1e4 - this.getTodayAPICallCount()
          }
        };
      }
      // Utility methods
      generateGeoHash(lat, lng, precision) {
        const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
        let idx = 0;
        let bit = 0;
        let evenBit = true;
        let geohash = "";
        const latRange = [-90, 90];
        const lngRange = [-180, 180];
        while (geohash.length < precision) {
          if (evenBit) {
            const mid = (lngRange[0] + lngRange[1]) / 2;
            if (lng > mid) {
              idx |= 1 << 4 - bit;
              lngRange[0] = mid;
            } else {
              lngRange[1] = mid;
            }
          } else {
            const mid = (latRange[0] + latRange[1]) / 2;
            if (lat > mid) {
              idx |= 1 << 4 - bit;
              latRange[0] = mid;
            } else {
              latRange[1] = mid;
            }
          }
          evenBit = !evenBit;
          if (bit < 4) {
            bit++;
          } else {
            geohash += BASE32[idx];
            bit = 0;
            idx = 0;
          }
        }
        return geohash;
      }
      getGeoHashesInBounds(bounds) {
        const hashes = [];
        const latStep = (bounds.north - bounds.south) / 10;
        const lngStep = (bounds.east - bounds.west) / 10;
        for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
          for (let lng = bounds.west; lng <= bounds.east; lng += lngStep) {
            hashes.push(this.generateGeoHash(lat, lng, 6));
          }
        }
        return Array.from(new Set(hashes));
      }
      isInViewport(location, bounds) {
        return location.lat >= bounds.south && location.lat <= bounds.north && location.lng >= bounds.west && location.lng <= bounds.east;
      }
      isFreshEnough(lastUpdated, maxAgeDays) {
        const ageInDays = (Date.now() - lastUpdated.getTime()) / (1e3 * 60 * 60 * 24);
        return ageInDays <= maxAgeDays;
      }
      sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      getAPICallCount(type) {
        const today = (/* @__PURE__ */ new Date()).toDateString();
        return this.apiCallTracker.get(`${today}-${type}`) || 0;
      }
      getTodayAPICallCount() {
        const today = (/* @__PURE__ */ new Date()).toDateString();
        return Array.from(this.apiCallTracker.entries()).filter(([k]) => k.startsWith(today)).reduce((sum, [, count]) => sum + count, 0);
      }
      // Actual API methods
      async makeTextSearchRequest(query, location) {
        this.trackAPICall("text_search");
        return this.client.textSearch({
          params: {
            query,
            location: `${location.lat},${location.lng}`,
            radius: location.radius,
            type: "restaurant",
            key: this.apiKey
          }
        });
      }
      async makePlaceDetailsRequest(placeId) {
        this.trackAPICall("place_details");
        return this.client.placeDetails({
          params: {
            place_id: placeId,
            fields: [
              "name",
              "formatted_address",
              "formatted_phone_number",
              "website",
              "opening_hours",
              "rating",
              "price_level",
              "photos",
              "types",
              "url"
            ],
            key: this.apiKey
          }
        });
      }
      async makeTargetedNearbySearch(center, maxResults) {
        this.trackAPICall("nearby_search");
        try {
          const response = await this.client.placesNearby({
            params: {
              location: `${center.lat},${center.lng}`,
              radius: 5e3,
              type: "restaurant",
              keyword: "vegan vegetarian",
              key: this.apiKey
            }
          });
          const results = response.data.results.slice(0, maxResults);
          await this.cacheRestaurantsWithGeoHash(results, { name: "Viewport search", ...center });
          return results;
        } catch (error) {
          console.error("Nearby search failed:", error);
          return [];
        }
      }
    };
    getGoogleMapsOptimizer = memoizee(
      (apiKey) => new GoogleMapsOptimizer(apiKey),
      { primitive: true }
    );
  }
});

// server/services/googleMapsService.ts
var googleMapsService_exports = {};
__export(googleMapsService_exports, {
  bulkPopulateUSRestaurants: () => bulkPopulateUSRestaurants,
  default: () => googleMapsService_default,
  getCostReport: () => getCostReport,
  getRestaurantDetails: () => getRestaurantDetails,
  getRestaurantPhotos: () => getRestaurantPhotos,
  getRestaurantsByCity: () => getRestaurantsByCity,
  getRestaurantsInViewport: () => getRestaurantsInViewport,
  isEmergencyMode: () => isEmergencyMode
});
import memoizee2 from "memoizee";
async function getRestaurantsInViewport(bounds, maxResults = 100) {
  try {
    const restaurants2 = await optimizer.getRestaurantsInViewport(bounds, maxResults);
    return restaurants2.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      latitude: r.latitude,
      longitude: r.longitude,
      placeId: r.placeId,
      rating: r.rating,
      priceLevel: r.priceLevel,
      cuisineTypes: r.cuisineTypes,
      photos: r.photos,
      veganScore: r.veganScore
    }));
  } catch (error) {
    console.error("Error getting restaurants in viewport:", error);
    throw error;
  }
}
async function getRestaurantDetails(placeId, forceRefresh = false) {
  try {
    return await optimizer.getRestaurantDetails(placeId, forceRefresh);
  } catch (error) {
    console.error("Error getting restaurant details:", error);
    throw error;
  }
}
async function getRestaurantPhotos(placeId, maxPhotos = 3) {
  try {
    return await optimizer.getRestaurantPhotos(placeId, maxPhotos);
  } catch (error) {
    console.error("Error getting restaurant photos:", error);
    return [];
  }
}
async function bulkPopulateUSRestaurants() {
  try {
    console.log("\u{1F680} Starting bulk US restaurant population...");
    await optimizer.bulkPopulateUSRestaurants();
    console.log("\u2705 Bulk population complete");
  } catch (error) {
    console.error("Error in bulk population:", error);
    throw error;
  }
}
function getCostReport() {
  return optimizer.getCostReport();
}
function isEmergencyMode() {
  const report = optimizer.getCostReport();
  return report.apiCalls.remaining < 500;
}
var GOOGLE_MAPS_API_KEY, optimizer, getRestaurantsByCity, googleMapsService_default;
var init_googleMapsService = __esm({
  "server/services/googleMapsService.ts"() {
    init_googleMapsOptimizer();
    GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";
    optimizer = getGoogleMapsOptimizer(GOOGLE_MAPS_API_KEY);
    getRestaurantsByCity = memoizee2(
      async (cityName, lat, lng, radius = 5e3) => {
        const bounds = {
          north: lat + radius / 111320,
          south: lat - radius / 111320,
          east: lng + radius / (111320 * Math.cos(lat * Math.PI / 180)),
          west: lng - radius / (111320 * Math.cos(lat * Math.PI / 180))
        };
        return getRestaurantsInViewport(bounds, 200);
      },
      {
        maxAge: 24 * 60 * 60 * 1e3,
        // 24 hours
        primitive: true
      }
    );
    googleMapsService_default = {
      getRestaurantsInViewport,
      getRestaurantDetails,
      getRestaurantPhotos,
      bulkPopulateUSRestaurants,
      getCostReport,
      isEmergencyMode,
      getRestaurantsByCity
    };
  }
});

// server/index.ts
import { config } from "dotenv";
import path6 from "path";
import fs6 from "fs";
import express5 from "express";
import cors from "cors";

// server/routes.ts
init_storage();
import { Router } from "express";
import { createServer } from "http";

// server/replitAuth.ts
init_storage();
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET || "vegan-map-ai-fallback-secret-key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config2 = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config: config2,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config2, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config2 = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config2, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// server/services/googlePlaces.ts
import { Client } from "@googlemaps/google-maps-services-js";

// server/utils/geoCache.ts
var GeoCache = class {
  cache = /* @__PURE__ */ new Map();
  config;
  constructor(config2 = { ttl: 24 * 60 * 60 * 1e3, precision: 6 }) {
    this.config = config2;
    setInterval(() => this.cleanup(), 60 * 60 * 1e3);
  }
  /**
   * Generate geo-hash for latitude/longitude with specified precision
   */
  generateGeoHash(lat, lng, precision = this.config.precision) {
    const latRange = [-90, 90];
    const lngRange = [-180, 180];
    let geoHash = "";
    let isLat = true;
    for (let i = 0; i < precision * 5; i++) {
      if (isLat) {
        const mid = (latRange[0] + latRange[1]) / 2;
        if (lat >= mid) {
          geoHash += "1";
          latRange[0] = mid;
        } else {
          geoHash += "0";
          latRange[1] = mid;
        }
      } else {
        const mid = (lngRange[0] + lngRange[1]) / 2;
        if (lng >= mid) {
          geoHash += "1";
          lngRange[0] = mid;
        } else {
          geoHash += "0";
          lngRange[1] = mid;
        }
      }
      isLat = !isLat;
    }
    return geoHash;
  }
  /**
   * Generate cache key for Places API search
   */
  generatePlacesSearchKey(lat, lng, radius, type) {
    const geoHash = this.generateGeoHash(lat, lng);
    const radiusKey = Math.ceil(radius / 500);
    const typeKey = type || "restaurant";
    return `places:${geoHash}:${radiusKey}:${typeKey}`;
  }
  /**
   * Generate cache key for Places Details
   */
  generatePlacesDetailsKey(placeId) {
    return `details:${placeId}`;
  }
  /**
   * Generate cache key for Photos
   */
  generatePhotosKey(photoReference) {
    return `photo:${photoReference}`;
  }
  /**
   * Store data in cache
   */
  set(key, data, customTtl) {
    const ttl = customTtl || this.config.ttl;
    const entry = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    };
    this.cache.set(key, entry);
    console.log(`Cache SET: ${key} (TTL: ${Math.round(ttl / 1e3 / 60)}min)`);
  }
  /**
   * Retrieve data from cache
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      console.log(`Cache MISS: ${key}`);
      return null;
    }
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      console.log(`Cache EXPIRED: ${key}`);
      return null;
    }
    console.log(`Cache HIT: ${key} (age: ${Math.round((Date.now() - entry.timestamp) / 1e3 / 60)}min)`);
    return entry.data;
  }
  /**
   * Check if key exists and is not expired
   */
  has(key) {
    return this.get(key) !== null;
  }
  /**
   * Delete specific key
   */
  delete(key) {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`Cache DELETE: ${key}`);
    }
    return deleted;
  }
  /**
   * Clear all cache
   */
  clear() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`Cache CLEARED: ${size} entries removed`);
  }
  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`Cache CLEANUP: ${cleaned} expired entries removed`);
    }
  }
  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size
    };
  }
  /**
   * Get nearby cache keys for expanding search radius
   */
  getNearbyKeys(lat, lng, radius, type) {
    const baseKey = this.generatePlacesSearchKey(lat, lng, radius, type);
    const keys = [baseKey];
    const offsets = [
      { lat: 1e-3, lng: 0 },
      // North
      { lat: -1e-3, lng: 0 },
      // South  
      { lat: 0, lng: 1e-3 },
      // East
      { lat: 0, lng: -1e-3 }
      // West
    ];
    for (const offset of offsets) {
      const nearbyKey = this.generatePlacesSearchKey(
        lat + offset.lat,
        lng + offset.lng,
        radius,
        type
      );
      if (nearbyKey !== baseKey) {
        keys.push(nearbyKey);
      }
    }
    return keys;
  }
};
var geoCache = new GeoCache({
  ttl: 24 * 60 * 60 * 1e3,
  // 24 hours for places data
  precision: 6
  // ~1.2km precision at equator
});
var photoCache = new GeoCache({
  ttl: 7 * 24 * 60 * 60 * 1e3,
  // 7 days for photos
  precision: 4
});
var detailsCache = new GeoCache({
  ttl: 7 * 24 * 60 * 60 * 1e3,
  // 7 days for place details  
  precision: 8
});

// server/services/googlePlaces.ts
var client2 = new Client({});
var apiCallStats = {
  placesSearch: 0,
  placeDetails: 0,
  photos: 0,
  cacheHits: 0,
  cacheMisses: 0
};
function getApiStats() {
  return {
    ...apiCallStats,
    cacheHitRate: apiCallStats.cacheHits / (apiCallStats.cacheHits + apiCallStats.cacheMisses) * 100
  };
}
async function findNearbyRestaurants(lat, lng, radiusMeters = 4e3) {
  try {
    console.log(`Searching for restaurants in ${radiusMeters / 1e3}km radius from coordinates`);
    const cacheKey = geoCache.generatePlacesSearchKey(lat, lng, radiusMeters, "restaurant");
    const cachedResults = geoCache.get(cacheKey);
    if (cachedResults) {
      apiCallStats.cacheHits++;
      console.log(`Cache HIT: Returning ${cachedResults.length} cached restaurants for area`);
      return cachedResults;
    }
    apiCallStats.cacheMisses++;
    console.log(`Cache MISS: Fetching fresh data from Google Places API`);
    const allPlaces = [];
    const processedPlaceIds = /* @__PURE__ */ new Set();
    const searchTypes = ["restaurant", "food", "meal_takeaway", "cafe", "bar", "night_club"];
    for (const searchType of searchTypes) {
      console.log(`Searching for type: ${searchType}`);
      let nextPageToken;
      do {
        const typeKey = geoCache.generatePlacesSearchKey(lat, lng, radiusMeters, searchType);
        let response;
        const cachedTypeResults = geoCache.get(typeKey);
        if (cachedTypeResults && !nextPageToken) {
          console.log(`Cache HIT for ${searchType}: Using cached results`);
          response = { data: { results: cachedTypeResults, next_page_token: void 0 } };
          apiCallStats.cacheHits++;
        } else {
          console.log(`Fetching ${searchType} from Google Places API`);
          response = await client2.placesNearby({
            params: {
              location: { lat, lng },
              radius: radiusMeters,
              type: searchType,
              key: process.env.GOOGLE_MAPS_API_KEY,
              ...nextPageToken && { pagetoken: nextPageToken }
            }
          });
          apiCallStats.placesSearch++;
          if (!nextPageToken) {
            geoCache.set(typeKey, response.data.results, 12 * 60 * 60 * 1e3);
          }
        }
        console.log(`Found ${response.data.results.length} ${searchType} places in this page`);
        for (const place of response.data.results) {
          if (processedPlaceIds.has(place.place_id)) {
            continue;
          }
          processedPlaceIds.add(place.place_id);
          try {
            const detailsKey = detailsCache.generatePlacesDetailsKey(place.place_id);
            let detailsResponse;
            const cachedDetails = detailsCache.get(detailsKey);
            if (cachedDetails) {
              console.log(`Cache HIT for place details: ${place.name}`);
              detailsResponse = { data: { result: cachedDetails } };
              apiCallStats.cacheHits++;
            } else {
              console.log(`Fetching place details for: ${place.name}`);
              detailsResponse = await client2.placeDetails({
                params: {
                  place_id: place.place_id,
                  fields: [
                    "place_id",
                    "name",
                    "formatted_address",
                    "geometry",
                    "formatted_phone_number",
                    "website",
                    "price_level",
                    "types",
                    "opening_hours",
                    "photos",
                    "rating",
                    "user_ratings_total",
                    "reviews",
                    "editorial_summary"
                  ],
                  key: process.env.GOOGLE_MAPS_API_KEY
                }
              });
              apiCallStats.placeDetails++;
              if (detailsResponse.data.result) {
                detailsCache.set(detailsKey, detailsResponse.data.result, 7 * 24 * 60 * 60 * 1e3);
              }
            }
            if (detailsResponse.data.result) {
              allPlaces.push(detailsResponse.data.result);
            }
          } catch (error) {
            console.warn(`Failed to get details for place ${place.place_id}:`, error);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        nextPageToken = response.data.next_page_token;
        if (nextPageToken) {
          console.log("Waiting for next page to be ready...");
          await new Promise((resolve) => setTimeout(resolve, 3e3));
        }
      } while (nextPageToken && allPlaces.length < 100);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    const keywordSearches = [
      "steakhouse",
      "seafood",
      "\u043C\u0435\u0445\u0430\u043D\u0430",
      "\u0431\u0438\u0441\u0442\u0440\u043E",
      "tavern",
      "diner"
    ];
    for (const keyword of keywordSearches) {
      console.log(`Searching for keyword: ${keyword}`);
      let nextPageToken;
      do {
        const response = await client2.textSearch({
          params: {
            query: `${keyword} restaurant Sofia Bulgaria`,
            location: { lat, lng },
            radius: radiusMeters,
            key: process.env.GOOGLE_MAPS_API_KEY,
            ...nextPageToken && { pagetoken: nextPageToken }
          }
        });
        console.log(`Found ${response.data.results.length} ${keyword} places in this page`);
        const restaurantPlaces = response.data.results.filter(
          (place) => place.types?.some(
            (type) => ["restaurant", "food", "meal_takeaway", "establishment", "bar"].includes(type)
          )
        );
        for (const place of restaurantPlaces) {
          if (processedPlaceIds.has(place.place_id)) {
            continue;
          }
          processedPlaceIds.add(place.place_id);
          try {
            const detailsKey = detailsCache.generatePlacesDetailsKey(place.place_id);
            let detailsResponse;
            const cachedDetails = detailsCache.get(detailsKey);
            if (cachedDetails) {
              console.log(`Cache HIT for ${keyword} place: ${place.name}`);
              detailsResponse = { data: { result: cachedDetails } };
              apiCallStats.cacheHits++;
            } else {
              console.log(`Fetching ${keyword} place details: ${place.name}`);
              detailsResponse = await client2.placeDetails({
                params: {
                  place_id: place.place_id,
                  fields: [
                    "place_id",
                    "name",
                    "formatted_address",
                    "geometry",
                    "formatted_phone_number",
                    "website",
                    "price_level",
                    "rating",
                    "user_ratings_total",
                    "types",
                    "photos",
                    "opening_hours",
                    "reviews"
                  ],
                  key: process.env.GOOGLE_MAPS_API_KEY
                }
              });
              apiCallStats.placeDetails++;
              if (detailsResponse.data.result) {
                detailsCache.set(detailsKey, detailsResponse.data.result, 7 * 24 * 60 * 60 * 1e3);
              }
            }
            const placeDetails = detailsResponse.data.result;
            if (placeDetails.geometry?.location) {
              const distance = calculateDistance(
                lat,
                lng,
                placeDetails.geometry.location.lat,
                placeDetails.geometry.location.lng
              );
              console.log(`${keyword.charAt(0).toUpperCase() + keyword.slice(1)} ${placeDetails.name}: distance ~${distance.toFixed(2)}km`);
              if (distance <= radiusMeters / 1e3) {
                allPlaces.push({
                  place_id: placeDetails.place_id,
                  name: placeDetails.name,
                  formatted_address: placeDetails.formatted_address,
                  geometry: {
                    location: {
                      lat: placeDetails.geometry.location.lat,
                      lng: placeDetails.geometry.location.lng
                    }
                  },
                  formatted_phone_number: placeDetails.formatted_phone_number,
                  website: placeDetails.website,
                  price_level: placeDetails.price_level,
                  rating: placeDetails.rating,
                  user_ratings_total: placeDetails.user_ratings_total,
                  types: placeDetails.types,
                  photos: placeDetails.photos?.map((photo) => photo.photo_reference),
                  opening_hours: placeDetails.opening_hours,
                  reviews: placeDetails.reviews
                });
              }
            }
          } catch (error) {
            console.warn(`Failed to get details for ${keyword} place ${place.place_id}:`, error);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        nextPageToken = response.data.next_page_token;
        if (nextPageToken) {
          console.log("Waiting for next page to be ready...");
          await new Promise((resolve) => setTimeout(resolve, 3e3));
        }
      } while (nextPageToken && allPlaces.length < 500);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    console.log(`Total restaurants found: ${allPlaces.length}`);
    geoCache.set(cacheKey, allPlaces, 24 * 60 * 60 * 1e3);
    console.log(`Cost optimization stats - API calls: ${apiCallStats.placesSearch + apiCallStats.placeDetails}, Cache hit rate: ${apiCallStats.cacheHits > 0 ? (apiCallStats.cacheHits / (apiCallStats.cacheHits + apiCallStats.cacheMisses) * 100).toFixed(1) : 0}%`);
    return allPlaces;
  } catch (error) {
    console.error("Error fetching nearby restaurants from Google Places:", error);
    throw new Error("Failed to fetch restaurants from Google Places");
  }
}

// server/routes/api-stats.ts
function registerApiStatsRoutes(app2) {
  app2.get("/api/stats/usage", (req, res) => {
    const stats = getApiStats();
    const cacheStats = {
      places: geoCache.getStats(),
      details: detailsCache.getStats(),
      photos: photoCache.getStats()
    };
    const totalApiCalls = stats.placesSearch + stats.placeDetails + stats.photos;
    const totalRequests = stats.cacheHits + stats.cacheMisses;
    const costPerCall = 1e-3;
    const estimatedSavings = stats.cacheHits * costPerCall;
    res.json({
      apiCalls: {
        placesSearch: stats.placesSearch,
        placeDetails: stats.placeDetails,
        photos: stats.photos,
        total: totalApiCalls
      },
      cache: {
        hits: stats.cacheHits,
        misses: stats.cacheMisses,
        hitRate: stats.cacheHitRate,
        totalRequests,
        sizes: cacheStats
      },
      costOptimization: {
        estimatedSavings: `$${estimatedSavings.toFixed(4)}`,
        potentialCosts: `$${(totalRequests * costPerCall).toFixed(4)}`,
        actualCosts: `$${(totalApiCalls * costPerCall).toFixed(4)}`,
        savingsPercentage: totalRequests > 0 ? (stats.cacheHits / totalRequests * 100).toFixed(1) + "%" : "0%"
      }
    });
  });
  app2.post("/api/stats/clear-cache", (req, res) => {
    const beforeSizes = {
      places: geoCache.getStats().size,
      details: detailsCache.getStats().size,
      photos: photoCache.getStats().size
    };
    geoCache.clear();
    detailsCache.clear();
    photoCache.clear();
    res.json({
      message: "Cache cleared successfully",
      clearedEntries: beforeSizes,
      newSizes: {
        places: geoCache.getStats().size,
        details: detailsCache.getStats().size,
        photos: photoCache.getStats().size
      }
    });
  });
}

// server/routes.ts
init_db();
init_schema();
import multer from "multer";
import fs from "fs";
import { sql as sql3 } from "drizzle-orm";

// server/agents/mapAgent.ts
init_storage();

// server/services/openai.ts
import OpenAI from "openai";
var openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
async function analyzeVeganFriendliness(restaurantData) {
  try {
    const prompt = `
      Analyze the following restaurant data and provide a comprehensive vegan-friendliness score.
      Rate each dimension from 0-10 and provide an overall score:
      
      Restaurant: ${restaurantData.name}
      Description: ${restaurantData.description || "N/A"}
      Menu: ${restaurantData.menu || "N/A"}
      Cuisine Types: ${restaurantData.cuisine?.join(", ") || "N/A"}
      Reviews: ${restaurantData.reviews?.slice(0, 5).join("\n") || "N/A"}
      
      Evaluate these 6 dimensions:
      1. Menu Variety (0-10): How many vegan options are available?
      2. Ingredient Clarity (0-10): How clearly are ingredients listed and vegan items marked?
      3. Staff Knowledge (0-10): Based on reviews, how knowledgeable is staff about vegan options?
      4. Cross-contamination Prevention (0-10): How well does the restaurant prevent cross-contamination?
      5. Nutritional Information (0-10): How well does the restaurant provide nutritional information?
      6. Allergen Management (0-10): How well does the restaurant handle allergen concerns?
      
      Respond with JSON in this exact format:
      {
        "menuVariety": number,
        "ingredientClarity": number,
        "staffKnowledge": number,
        "crossContaminationPrevention": number,
        "nutritionalInformation": number,
        "allergenManagement": number,
        "overallScore": number,
        "reasoning": "detailed explanation of the scoring"
      }
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a vegan nutrition expert and restaurant analyst. Provide accurate, detailed vegan-friendliness scores based on the provided data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const validatedResult = {
      menuVariety: Math.max(0, Math.min(10, result.menuVariety || 0)),
      ingredientClarity: Math.max(0, Math.min(10, result.ingredientClarity || 0)),
      staffKnowledge: Math.max(0, Math.min(10, result.staffKnowledge || 0)),
      crossContaminationPrevention: Math.max(0, Math.min(10, result.crossContaminationPrevention || 0)),
      nutritionalInformation: Math.max(0, Math.min(10, result.nutritionalInformation || 0)),
      allergenManagement: Math.max(0, Math.min(10, result.allergenManagement || 0)),
      overallScore: Math.max(0, Math.min(10, result.overallScore || 0)),
      reasoning: result.reasoning || "Analysis completed based on available data."
    };
    return validatedResult;
  } catch (error) {
    console.error("Error analyzing vegan friendliness:", error);
    throw new Error("Failed to analyze vegan friendliness: " + error.message);
  }
}
async function generateRestaurantRecommendations(userProfile, userLocation, restaurants2) {
  try {
    const prompt = `
      Based on the user profile and available restaurants, recommend the top 5 restaurants.
      
      User Profile: ${JSON.stringify(userProfile)}
      User Location: ${JSON.stringify(userLocation)}
      Available Restaurants: ${JSON.stringify(restaurants2.slice(0, 20))}
      
      Consider:
      - User's dietary style and allergies
      - Restaurant vegan scores
      - Distance from user
      - User's preferred cuisines and price range
      - Recent user behavior patterns
      
      Respond with JSON array of restaurant IDs in order of recommendation:
      {
        "recommendations": ["restaurant_id_1", "restaurant_id_2", ...]
      }
    `;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a personalized restaurant recommendation engine for vegan-friendly dining."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}

// server/agents/mapAgent.ts
var MapAgent = class {
  async getRestaurantsInRadius(lat, lng, radiusKm = 2) {
    try {
      let restaurants2 = await storage.getRestaurantsInRadius(lat, lng, radiusKm);
      if (restaurants2.length < 5) {
        console.log("Fetching additional restaurants from Google Places...");
        await this.fetchAndStoreRestaurants(lat, lng, radiusKm * 1e3);
        restaurants2 = await storage.getRestaurantsInRadius(lat, lng, radiusKm);
      }
      return restaurants2;
    } catch (error) {
      console.error("MapAgent: Error getting restaurants in radius:", error);
      throw new Error("Failed to fetch nearby restaurants");
    }
  }
  async fetchAndStoreRestaurants(lat, lng, radiusMeters) {
    try {
      const googlePlaces = await findNearbyRestaurants(lat, lng, radiusMeters);
      const qualityRestaurants = googlePlaces.filter((place) => {
        const rating = place.rating || 0;
        return rating > 3;
      });
      console.log(`Found ${googlePlaces.length} total restaurants, filtering to ${qualityRestaurants.length} with rating > 3.0`);
      for (const place of qualityRestaurants) {
        try {
          const existing = await storage.getRestaurantByPlaceId(place.place_id);
          if (!existing) {
            await this.analyzeNewRestaurant(place);
          }
        } catch (error) {
          console.warn(`Failed to process restaurant ${place.name}:`, error);
        }
      }
    } catch (error) {
      console.error("MapAgent: Error fetching restaurants from Google Places:", error);
    }
  }
  async getRestaurantDetails(restaurantId) {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) return null;
      const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      return {
        restaurant,
        scoreBreakdown
      };
    } catch (error) {
      console.error("MapAgent: Error getting restaurant details:", error);
      throw new Error("Failed to fetch restaurant details");
    }
  }
  async updateRestaurantLocation(restaurantId, lat, lng) {
    try {
      return await storage.updateRestaurant(restaurantId, {
        latitude: lat.toString(),
        longitude: lng.toString()
      });
    } catch (error) {
      console.error("MapAgent: Error updating restaurant location:", error);
      throw new Error("Failed to update restaurant location");
    }
  }
  async analyzeNewRestaurant(googlePlacesData) {
    try {
      const existingRestaurant = await storage.getRestaurantByPlaceId(googlePlacesData.place_id);
      if (existingRestaurant) {
        return existingRestaurant;
      }
      const newRestaurant = await storage.createRestaurant({
        placeId: googlePlacesData.place_id,
        name: googlePlacesData.name,
        address: googlePlacesData.formatted_address,
        latitude: googlePlacesData.geometry.location.lat.toString(),
        longitude: googlePlacesData.geometry.location.lng.toString(),
        phoneNumber: googlePlacesData.formatted_phone_number,
        website: googlePlacesData.website,
        priceLevel: this.mapPriceLevel(googlePlacesData.price_level),
        cuisineTypes: googlePlacesData.types || [],
        openingHours: googlePlacesData.opening_hours,
        photos: googlePlacesData.photos?.map((photo) => photo.photo_reference) || [],
        rating: googlePlacesData.rating?.toString(),
        reviewCount: googlePlacesData.user_ratings_total || 0
      });
      const veganAnalysis = await analyzeVeganFriendliness({
        name: newRestaurant.name,
        description: googlePlacesData.editorial_summary?.overview,
        cuisine: newRestaurant.cuisineTypes || [],
        reviews: googlePlacesData.reviews?.map((r) => r.text) || []
      });
      const updatedRestaurant = await storage.updateRestaurant(newRestaurant.id, {
        veganScore: veganAnalysis.overallScore.toString()
      });
      await storage.upsertVeganScoreBreakdown({
        restaurantId: newRestaurant.id,
        menuVariety: veganAnalysis.menuVariety.toString(),
        ingredientClarity: veganAnalysis.ingredientClarity.toString(),
        staffKnowledge: veganAnalysis.staffKnowledge.toString(),
        crossContaminationPrevention: veganAnalysis.crossContaminationPrevention.toString(),
        nutritionalInformation: veganAnalysis.nutritionalInformation.toString(),
        allergenManagement: veganAnalysis.allergenManagement.toString(),
        overallScore: veganAnalysis.overallScore.toString()
      });
      return updatedRestaurant;
    } catch (error) {
      console.error("MapAgent: Error analyzing new restaurant:", error);
      throw new Error("Failed to analyze restaurant data");
    }
  }
  mapPriceLevel(priceLevel) {
    if (priceLevel === void 0 || priceLevel === null) return null;
    const mapping = {
      1: "$",
      2: "$$",
      3: "$$$",
      4: "$$$$"
    };
    return mapping[priceLevel] || "$$";
  }
  async getRestaurantsByBounds(north, south, east, west) {
    try {
      const centerLat = (north + south) / 2;
      const centerLng = (east + west) / 2;
      const radiusKm = Math.max(
        this.calculateDistance(centerLat, centerLng, north, centerLng),
        this.calculateDistance(centerLat, centerLng, centerLat, east)
      );
      return await this.getRestaurantsInRadius(centerLat, centerLng, radiusKm);
    } catch (error) {
      console.error("MapAgent: Error getting restaurants by bounds:", error);
      throw new Error("Failed to fetch restaurants in area");
    }
  }
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
};
var mapAgent = new MapAgent();

// server/agents/searchAgent.ts
init_storage();
var SearchAgent = class {
  async searchRestaurants(query, userLocation, filters, limit = 20) {
    try {
      let restaurants2 = await storage.searchRestaurants(
        query,
        userLocation?.lat,
        userLocation?.lng,
        {
          minVeganScore: filters?.minVeganScore,
          priceRange: filters?.priceRange,
          cuisineTypes: filters?.cuisineTypes
        }
      );
      if (filters?.maxDistance && userLocation) {
        restaurants2 = restaurants2.filter((restaurant) => {
          const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(restaurant.latitude),
            parseFloat(restaurant.longitude)
          );
          return distance <= filters.maxDistance / 1e3;
        });
      }
      if (filters?.allergies && filters.allergies.length > 0) {
        const safeRestaurants = [];
        for (const restaurant of restaurants2) {
          const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurant.id);
          if (scoreBreakdown && parseFloat(scoreBreakdown.allergenManagement) >= 7) {
            safeRestaurants.push(restaurant);
          }
        }
        restaurants2 = safeRestaurants;
      }
      return restaurants2.slice(0, limit);
    } catch (error) {
      console.error("SearchAgent: Error searching restaurants:", error);
      throw new Error("Failed to search restaurants");
    }
  }
  async getRestaurantSuggestions(partialQuery, userLocation) {
    try {
      const restaurants2 = await storage.searchRestaurants(
        partialQuery,
        userLocation?.lat,
        userLocation?.lng
      );
      const suggestions = /* @__PURE__ */ new Set();
      restaurants2.forEach((restaurant) => {
        if (restaurant.name.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(restaurant.name);
        }
        restaurant.cuisineTypes?.forEach((cuisine) => {
          if (cuisine.toLowerCase().includes(partialQuery.toLowerCase())) {
            suggestions.add(cuisine);
          }
        });
      });
      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      console.error("SearchAgent: Error getting suggestions:", error);
      return [];
    }
  }
  async filterByUserPreferences(restaurants2, userProfile) {
    try {
      let filtered = [...restaurants2];
      if (userProfile.dietaryStyle) {
        const minScore = this.getMinScoreForDietaryStyle(userProfile.dietaryStyle);
        filtered = filtered.filter(
          (r) => r.veganScore && parseFloat(r.veganScore) >= minScore
        );
      }
      if (userProfile.priceRange) {
        const userPriceRanges = this.expandPriceRange(userProfile.priceRange);
        filtered = filtered.filter(
          (r) => r.priceLevel && userPriceRanges.includes(r.priceLevel)
        );
      }
      if (userProfile.preferredCuisines && userProfile.preferredCuisines.length > 0) {
        filtered = filtered.filter(
          (r) => r.cuisineTypes?.some(
            (cuisine) => userProfile.preferredCuisines.includes(cuisine.toLowerCase())
          )
        );
      }
      filtered.sort((a, b) => {
        const scoreA = parseFloat(a.veganScore || "0");
        const scoreB = parseFloat(b.veganScore || "0");
        return scoreB - scoreA;
      });
      return filtered;
    } catch (error) {
      console.error("SearchAgent: Error filtering by preferences:", error);
      return restaurants2;
    }
  }
  async searchByLocation(locationName, filters) {
    try {
      const restaurants2 = await storage.searchRestaurants(locationName, void 0, void 0, filters);
      return {
        restaurants: restaurants2.slice(0, 20),
        location: null
        // Would be populated by geocoding service
      };
    } catch (error) {
      console.error("SearchAgent: Error searching by location:", error);
      throw new Error("Failed to search by location");
    }
  }
  getMinScoreForDietaryStyle(dietaryStyle) {
    const minScores = {
      "vegan": 8,
      "vegetarian": 6,
      "flexitarian": 4
    };
    return minScores[dietaryStyle] || 5;
  }
  expandPriceRange(priceRange) {
    const ranges = {
      "$": ["$"],
      "$$": ["$", "$$"],
      "$$$": ["$$", "$$$"],
      "$$$$": ["$$$", "$$$$"]
    };
    return ranges[priceRange] || ["$", "$$"];
  }
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
};
var searchAgent = new SearchAgent();

// server/agents/scoreAgent.ts
import { Client as Client2 } from "@googlemaps/google-maps-services-js";
import OpenAI2 from "openai";

// server/config/aiConfig.ts
var AI_CONFIG = {
  GBGPT_ENABLED: process.env.GBGPT_ENABLED === "true",
  GBGPT_ENDPOINT: process.env.GBGPT_ENDPOINT || "",
  // ще добавиш ngrok URL тук
  GBGPT_API_KEY: process.env.GBGPT_API_KEY || "R@icommerce23",
  OPENAI_ENABLED: !!process.env.OPENAI_API_KEY
};

// server/agents/scoreAgent.ts
var googleMapsClient = new Client2();
var openai2 = new OpenAI2({ apiKey: process.env.OPENAI_API_KEY });
var ScoreAgent = class {
  /**
   * Calculate comprehensive vegan score for a restaurant using AI analysis
   */
  async calculateVeganScore(placeId, restaurantName, cuisineTypes) {
    try {
      if (!this.isFoodEstablishment(cuisineTypes || [])) {
        return this.getNonFoodScore();
      }
      const placeDetails = await this.getPlaceDetails(placeId);
      const reviews = placeDetails.reviews || [];
      const analysis = await this.analyzeVeganFriendliness({
        name: restaurantName,
        cuisineTypes: cuisineTypes || [],
        reviews: reviews.slice(0, 10),
        // Analyze top 10 reviews
        photos: placeDetails.photos?.slice(0, 5) || [],
        website: placeDetails.website,
        priceLevel: placeDetails.price_level
      });
      return analysis;
    } catch (error) {
      console.error("Error calculating vegan score:", error);
      return this.getFallbackScore(cuisineTypes || []);
    }
  }
  /**
   * Check if establishment is food-related
   */
  isFoodEstablishment(cuisineTypes) {
    const foodTypes = [
      "restaurant",
      "food",
      "cafe",
      "bakery",
      "bar",
      "meal_takeaway",
      "meal_delivery",
      "pizza",
      "chinese",
      "italian",
      "indian",
      "thai",
      "mexican",
      "japanese",
      "greek",
      "mediterranean",
      "vietnamese",
      "fast_food",
      "deli",
      "bistro",
      "pub",
      "grill",
      "buffet"
    ];
    const primaryNonFoodTypes = [
      "lodging",
      "night_club",
      "real_estate_agency",
      "hospital",
      "gas_station"
    ];
    const hasPrimaryNonFood = cuisineTypes.some((type) => primaryNonFoodTypes.includes(type.toLowerCase()));
    const hasFood = cuisineTypes.some((type) => foodTypes.includes(type.toLowerCase()));
    if (hasPrimaryNonFood && !hasFood) {
      return false;
    }
    return hasFood;
  }
  /**
   * Return appropriate score for non-food establishments
   */
  getNonFoodScore() {
    const breakdown = {
      menuVariety: 0,
      ingredientClarity: 0,
      staffKnowledge: 0,
      crossContamination: 0,
      nutritionalInfo: 0,
      allergenManagement: 0
    };
    return {
      overallScore: 0,
      breakdown,
      confidence: 1,
      // High confidence - not a food place
      reasoning: "Not a food establishment - vegan scoring not applicable"
    };
  }
  /**
   * Get detailed place information from Google Places API
   */
  async getPlaceDetails(placeId) {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          "name",
          "reviews",
          "photos",
          "website",
          "price_level",
          "types"
        ],
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    return response.data.result;
  }
  /**
   * Use AI to analyze vegan-friendliness
   */
  async analyzeVeganFriendliness(restaurantData) {
    if (AI_CONFIG.GBGPT_ENABLED && AI_CONFIG.GBGPT_ENDPOINT) {
      try {
        console.log("\u{1F504} Using GBGPT for scoring...");
        return await this.scoreWithGBGPT(restaurantData);
      } catch (error) {
        console.warn("\u26A0\uFE0F GBGPT failed, falling back to OpenAI:", error instanceof Error ? error.message : String(error));
      }
    }
    return await this.scoreWithOpenAI(restaurantData);
  }
  /**
   * Score restaurant using GBGPT
   */
  async scoreWithGBGPT(restaurantData) {
    throw new Error("GBGPT endpoint not configured");
  }
  /**
   * Score restaurant using OpenAI
   */
  async scoreWithOpenAI(restaurantData) {
    const reviewText = restaurantData.reviews.length > 0 ? restaurantData.reviews.map(
      (review, index2) => `${index2 + 1}. "${review.text}" (Rating: ${review.rating}/5)`
    ).join("\n") : "No reviews available for analysis";
    const prompt = `Analyze this Sofia, Bulgaria restaurant for vegan-friendliness. Be realistic but fair in scoring.

Restaurant: ${restaurantData.name}
Cuisine Types: ${restaurantData.cuisineTypes.join(", ")}
Website: ${restaurantData.website || "Not available"}
Price Level: ${restaurantData.priceLevel || "Not specified"}

Customer Reviews:
${reviewText}

SCORING GUIDELINES (0-10 scale):
- 8-10: Excellent vegan options, clearly marked, knowledgeable staff
- 6-7: Good vegan choices, some clarity, decent awareness  
- 4-5: Limited but available vegan options, basic awareness
- 2-3: Very few vegan options, minimal awareness
- 0-1: No clear vegan options or hostile to vegan dining

Score each dimension realistically:
1. Menu Variety: How many vegan dishes/options are clearly available?
2. Ingredient Clarity: Are vegan items clearly marked or ingredients listed?
3. Staff Knowledge: Based on reviews, how aware is staff of vegan needs?
4. Cross-contamination Prevention: Evidence of separate cooking/preparation?
5. Nutritional Information: Availability of nutritional/calorie details?
6. Allergen Management: How well do they handle dietary restrictions?

Consider cuisine type context:
- Pizza/Italian: Usually has vegan options (marinara, vegetables)
- Indian/Mediterranean: Traditionally more vegan-friendly
- Chinese/Thai: Often has tofu/vegetable dishes
- Cafes: Usually have plant milk, salads, some vegan pastries
- Fast food: Limited but often has some vegan options

Respond with JSON in this exact format:
{
  "menuVariety": number,
  "ingredientClarity": number,
  "staffKnowledge": number,
  "crossContamination": number,
  "nutritionalInfo": number,
  "allergenManagement": number,
  "overallScore": number,
  "confidence": number,
  "reasoning": "string explanation"
}`;
    const response = await openai2.chat.completions.create({
      model: "gpt-4o",
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a vegan dining expert. Analyze restaurants for vegan-friendliness based on available data. Be thorough but realistic in your scoring."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3
    });
    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    const breakdown = {
      menuVariety: Math.max(0, Math.min(10, analysis.menuVariety || 0)),
      ingredientClarity: Math.max(0, Math.min(10, analysis.ingredientClarity || 0)),
      staffKnowledge: Math.max(0, Math.min(10, analysis.staffKnowledge || 0)),
      crossContamination: Math.max(0, Math.min(10, analysis.crossContamination || 0)),
      nutritionalInfo: Math.max(0, Math.min(10, analysis.nutritionalInfo || 0)),
      allergenManagement: Math.max(0, Math.min(10, analysis.allergenManagement || 0))
    };
    const overallScore = breakdown.menuVariety * 0.25 + // 25% weight
    breakdown.ingredientClarity * 0.2 + // 20% weight  
    breakdown.staffKnowledge * 0.15 + // 15% weight
    breakdown.crossContamination * 0.2 + // 20% weight
    breakdown.nutritionalInfo * 0.1 + // 10% weight
    breakdown.allergenManagement * 0.1;
    return {
      overallScore: Math.round(overallScore * 10) / 10,
      // Round to 1 decimal
      breakdown,
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.7)),
      reasoning: analysis.reasoning || "Analysis based on available restaurant data"
    };
  }
  /**
   * Fallback scoring when AI analysis fails
   */
  getFallbackScore(cuisineTypes) {
    if (!this.isFoodEstablishment(cuisineTypes)) {
      return this.getNonFoodScore();
    }
    const veganFriendlyCuisines = [
      "vegan",
      "vegetarian",
      "mediterranean",
      "indian",
      "thai",
      "vietnamese",
      "middle_eastern",
      "lebanese",
      "ethiopian",
      "mexican",
      "chinese",
      "japanese"
    ];
    const moderatelyFriendly = [
      "pizza",
      "italian",
      "cafe",
      "bakery",
      "greek"
    ];
    const hasVeganCuisine = cuisineTypes.some(
      (cuisine) => veganFriendlyCuisines.includes(cuisine.toLowerCase())
    );
    const hasModerateOptions = cuisineTypes.some(
      (cuisine) => moderatelyFriendly.includes(cuisine.toLowerCase())
    );
    let baseScore;
    if (hasVeganCuisine) {
      baseScore = 5.5;
    } else if (hasModerateOptions) {
      baseScore = 3;
    } else {
      baseScore = 1.5;
    }
    const breakdown = {
      menuVariety: Math.max(0.5, baseScore - 0.5),
      ingredientClarity: Math.max(0.5, baseScore - 1.5),
      staffKnowledge: Math.max(0.5, baseScore - 1),
      crossContamination: Math.max(0.5, baseScore - 2),
      nutritionalInfo: Math.max(0.5, baseScore - 2.5),
      allergenManagement: Math.max(0.5, baseScore - 1.5)
    };
    return {
      overallScore: baseScore,
      breakdown,
      confidence: 0.4,
      // Moderate confidence for fallback
      reasoning: `Fallback scoring: ${hasVeganCuisine ? "Vegan-friendly" : hasModerateOptions ? "Moderate" : "Basic"} cuisine type`
    };
  }
  /**
   * Batch calculate scores for multiple restaurants
   */
  async calculateBatchScores(restaurants2) {
    const results = /* @__PURE__ */ new Map();
    const batchSize = 5;
    for (let i = 0; i < restaurants2.length; i += batchSize) {
      const batch = restaurants2.slice(i, i + batchSize);
      const batchPromises = batch.map(async (restaurant) => {
        try {
          const score = await this.calculateVeganScore(
            restaurant.placeId,
            restaurant.name,
            restaurant.cuisineTypes
          );
          return { placeId: restaurant.placeId, score };
        } catch (error) {
          console.error(`Error scoring ${restaurant.name}:`, error);
          return {
            placeId: restaurant.placeId,
            score: this.getFallbackScore(restaurant.cuisineTypes || [])
          };
        }
      });
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ placeId, score }) => {
        results.set(placeId, score);
      });
      if (i + batchSize < restaurants2.length) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
    }
    return results;
  }
};
var scoreAgent = new ScoreAgent();

// server/agents/reviewAgent.ts
init_storage();
import OpenAI3 from "openai";
var openai3 = new OpenAI3({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});
var ReviewAgent = class {
  async analyzeReviews(restaurantId, reviews) {
    try {
      if (!reviews || reviews.length === 0) {
        return {
          sentiment: "neutral",
          veganMentions: [],
          allergenWarnings: [],
          highlights: [],
          concerns: [],
          veganFriendlinessScore: 5
        };
      }
      const prompt = `
        Analyze the following restaurant reviews for vegan-friendliness and allergen information.
        
        Reviews:
        ${reviews.slice(0, 20).join("\n---\n")}
        
        Please analyze and extract:
        1. Overall sentiment towards vegan options
        2. Specific mentions of vegan dishes or options
        3. Any allergen warnings or concerns mentioned
        4. Positive highlights about vegan experience
        5. Concerns or negative aspects about vegan options
        6. Overall vegan-friendliness score (0-10)
        
        Respond with JSON in this exact format:
        {
          "sentiment": "positive|negative|neutral",
          "veganMentions": ["array of specific vegan dishes/options mentioned"],
          "allergenWarnings": ["array of allergen concerns mentioned"],
          "highlights": ["array of positive vegan dining highlights"],
          "concerns": ["array of concerns about vegan options"],
          "veganFriendlinessScore": number
        }
      `;
      const response = await openai3.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing restaurant reviews for vegan dining experiences and allergen information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        sentiment: result.sentiment || "neutral",
        veganMentions: result.veganMentions || [],
        allergenWarnings: result.allergenWarnings || [],
        highlights: result.highlights || [],
        concerns: result.concerns || [],
        veganFriendlinessScore: Math.max(0, Math.min(10, result.veganFriendlinessScore || 5))
      };
    } catch (error) {
      console.error("ReviewAgent: Error analyzing reviews:", error);
      throw new Error("Failed to analyze reviews");
    }
  }
  async extractVeganKeywords(text2) {
    try {
      const veganKeywords = [
        "vegan",
        "plant-based",
        "dairy-free",
        "egg-free",
        "no meat",
        "vegetarian",
        "tofu",
        "tempeh",
        "seitan",
        "quinoa",
        "chickpea",
        "lentil",
        "almond milk",
        "soy milk",
        "oat milk",
        "coconut milk",
        "beyond meat",
        "impossible",
        "veggie burger",
        "plant protein",
        "nutritional yeast",
        "cashew cheese",
        "vegan cheese",
        "animal-free",
        "cruelty-free",
        "plant milk"
      ];
      const foundKeywords = veganKeywords.filter(
        (keyword) => text2.toLowerCase().includes(keyword.toLowerCase())
      );
      return [...new Set(foundKeywords)];
    } catch (error) {
      console.error("ReviewAgent: Error extracting vegan keywords:", error);
      return [];
    }
  }
  async detectAllergens(text2) {
    try {
      const allergenPatterns = {
        "nuts": /\b(nut|almond|walnut|pecan|cashew|pistachio|hazelnut|peanut)\b/gi,
        "dairy": /\b(milk|cheese|butter|cream|yogurt|lactose|dairy)\b/gi,
        "gluten": /\b(gluten|wheat|bread|pasta|flour|barley|rye)\b/gi,
        "soy": /\b(soy|soya|tofu|tempeh|miso|soy sauce)\b/gi,
        "shellfish": /\b(shrimp|lobster|crab|shellfish|seafood)\b/gi,
        "eggs": /\b(egg|eggs|mayonnaise|mayo)\b/gi,
        "sesame": /\b(sesame|tahini)\b/gi,
        "fish": /\b(fish|salmon|tuna|cod|anchovy)\b/gi
      };
      const detectedAllergens = [];
      for (const [allergen, pattern] of Object.entries(allergenPatterns)) {
        if (pattern.test(text2)) {
          detectedAllergens.push(allergen);
        }
      }
      return detectedAllergens;
    } catch (error) {
      console.error("ReviewAgent: Error detecting allergens:", error);
      return [];
    }
  }
  async generateReviewSummary(restaurantId) {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }
      const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      if (!scoreBreakdown) {
        return `${restaurant.name} is still being analyzed for vegan-friendliness. Check back soon for detailed reviews!`;
      }
      const overallScore = parseFloat(scoreBreakdown.overallScore);
      let summary = `Based on customer reviews, ${restaurant.name} `;
      if (overallScore >= 8) {
        summary += "is highly praised for its vegan options. ";
      } else if (overallScore >= 6) {
        summary += "offers decent vegan choices with room for improvement. ";
      } else {
        summary += "has limited vegan options but may accommodate special requests. ";
      }
      const menuScore = parseFloat(scoreBreakdown.menuVariety);
      const staffScore = parseFloat(scoreBreakdown.staffKnowledge);
      if (menuScore >= 8) {
        summary += "Customers appreciate the variety of plant-based dishes available. ";
      }
      if (staffScore >= 8) {
        summary += "The staff is knowledgeable about vegan options and dietary restrictions. ";
      } else if (staffScore < 6) {
        summary += "Some reviewers noted that staff could be more informed about vegan ingredients. ";
      }
      return summary;
    } catch (error) {
      console.error("ReviewAgent: Error generating review summary:", error);
      return "Unable to generate review summary at this time.";
    }
  }
  async flagPotentialIssues(reviews) {
    try {
      const prompt = `
        Analyze the following restaurant reviews for potential issues that vegan diners should be aware of:
        
        Reviews:
        ${reviews.slice(0, 15).join("\n---\n")}
        
        Look for:
        1. Cross-contamination warnings (shared grills, fryers, prep areas)
        2. Misleading vegan claims (items marked vegan that aren't)
        3. Allergen concerns mentioned by reviewers
        
        Respond with JSON:
        {
          "crossContaminationWarnings": ["specific warnings about cross-contamination"],
          "misleadingVeganClaims": ["instances where vegan labels were incorrect"],
          "allergenConcerns": ["allergen-related issues mentioned"]
        }
      `;
      const response = await openai3.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a food safety expert focused on vegan dining and allergen management."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });
      const result = JSON.parse(response.choices[0].message.content || "{}");
      return {
        crossContaminationWarnings: result.crossContaminationWarnings || [],
        misleadingVeganClaims: result.misleadingVeganClaims || [],
        allergenConcerns: result.allergenConcerns || []
      };
    } catch (error) {
      console.error("ReviewAgent: Error flagging potential issues:", error);
      return {
        crossContaminationWarnings: [],
        misleadingVeganClaims: [],
        allergenConcerns: []
      };
    }
  }
  async scoreReviewHelpfulness(reviewText, userProfile) {
    try {
      let helpfulnessScore = 0;
      const veganKeywords = await this.extractVeganKeywords(reviewText);
      helpfulnessScore += veganKeywords.length * 0.1;
      const dishMentionCount = (reviewText.match(/\b(dish|meal|food|ordered|tried)\b/gi) || []).length;
      helpfulnessScore += Math.min(dishMentionCount * 0.05, 0.3);
      if (userProfile.allergies) {
        const allergenMentions = await this.detectAllergens(reviewText);
        const relevantAllergens = allergenMentions.filter(
          (allergen) => userProfile.allergies.includes(allergen)
        );
        helpfulnessScore += relevantAllergens.length * 0.2;
      }
      if (reviewText.length > 200) {
        helpfulnessScore += 0.1;
      }
      return Math.min(helpfulnessScore, 1);
    } catch (error) {
      console.error("ReviewAgent: Error scoring review helpfulness:", error);
      return 0.5;
    }
  }
};
var reviewAgent = new ReviewAgent();

// server/agents/profileAgent.ts
init_storage();
var ProfileAgent = class {
  async createUserProfile(userId, profileData) {
    try {
      const profile = await storage.createUserProfile({
        ...profileData,
        userId,
        isProfileComplete: this.isProfileComplete(profileData)
      });
      await storage.addUserAnalytics({
        userId,
        actionType: "profile_created",
        actionData: {
          dietaryStyle: profileData.dietaryStyle,
          allergiesCount: profileData.allergies?.length || 0,
          cuisinesCount: profileData.preferredCuisines?.length || 0
        }
      });
      return profile;
    } catch (error) {
      console.error("ProfileAgent: Error creating user profile:", error);
      throw new Error("Failed to create user profile");
    }
  }
  async updateUserProfile(userId, updates) {
    try {
      const existingProfile = await storage.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error("Profile not found");
      }
      const updatedData = { ...updates };
      const mergedData = { ...existingProfile, ...updates };
      updatedData.isProfileComplete = this.isProfileComplete(mergedData);
      const profile = await storage.updateUserProfile(userId, updatedData);
      await storage.addUserAnalytics({
        userId,
        actionType: "profile_updated",
        actionData: {
          updatedFields: Object.keys(updates),
          isComplete: updatedData.isProfileComplete
        }
      });
      return profile;
    } catch (error) {
      console.error("ProfileAgent: Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }
  async getUserProfile(userId) {
    try {
      const profile = await storage.getUserProfile(userId);
      return profile || null;
    } catch (error) {
      console.error("ProfileAgent: Error getting user profile:", error);
      throw new Error("Failed to get user profile");
    }
  }
  async generatePersonalizedRecommendations(userId, userLocation, limit = 10) {
    try {
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        throw new Error("User profile not found");
      }
      const nearbyRestaurants = await storage.getRestaurantsInRadius(
        userLocation.lat,
        userLocation.lng,
        (profile.maxDistance || 2e3) / 1e3
        // Convert to km
      );
      let filteredRestaurants = nearbyRestaurants;
      const minScore = this.getMinScoreForDietaryStyle(profile.dietaryStyle);
      filteredRestaurants = filteredRestaurants.filter(
        (r) => r.veganScore && parseFloat(r.veganScore) >= minScore
      );
      if (profile.priceRange) {
        const acceptablePrices = this.getAcceptablePriceRanges(profile.priceRange);
        filteredRestaurants = filteredRestaurants.filter(
          (r) => r.priceLevel && acceptablePrices.includes(r.priceLevel)
        );
      }
      if (profile.preferredCuisines && profile.preferredCuisines.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(
          (r) => r.cuisineTypes?.some(
            (cuisine) => profile.preferredCuisines.includes(cuisine.toLowerCase())
          )
        );
      }
      if (profile.allergies && profile.allergies.length > 0) {
        const safeRestaurants = [];
        for (const restaurant of filteredRestaurants) {
          const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurant.id);
          if (scoreBreakdown && parseFloat(scoreBreakdown.allergenManagement) >= 7) {
            safeRestaurants.push(restaurant);
          }
        }
        filteredRestaurants = safeRestaurants;
      }
      const recommendations = await generateRestaurantRecommendations(
        profile,
        userLocation,
        filteredRestaurants
      );
      return recommendations.slice(0, limit);
    } catch (error) {
      console.error("ProfileAgent: Error generating recommendations:", error);
      return [];
    }
  }
  async trackUserBehavior(userId, actionType, actionData, location) {
    try {
      await storage.addUserAnalytics({
        userId,
        actionType,
        actionData,
        location
      });
    } catch (error) {
      console.error("ProfileAgent: Error tracking user behavior:", error);
    }
  }
  async getUserStats(userId) {
    try {
      const [visits, favorites, analytics] = await Promise.all([
        storage.getUserVisits(userId),
        storage.getUserFavorites(userId),
        storage.getUserAnalytics(userId, 1e3)
      ]);
      const reviewsCount = analytics.filter((a) => a.actionType === "review_submitted").length;
      let avgVeganScore = 0;
      if (visits.length > 0) {
        const visitedRestaurants = await Promise.all(
          visits.map((visit) => storage.getRestaurant(visit.restaurantId))
        );
        const scores = visitedRestaurants.filter((r) => r && r.veganScore).map((r) => parseFloat(r.veganScore));
        if (scores.length > 0) {
          avgVeganScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }
      }
      return {
        placesVisited: visits.length,
        favorites: favorites.length,
        reviews: reviewsCount,
        avgVeganScore: Math.round(avgVeganScore * 10) / 10
      };
    } catch (error) {
      console.error("ProfileAgent: Error getting user stats:", error);
      return {
        placesVisited: 0,
        favorites: 0,
        reviews: 0,
        avgVeganScore: 0
      };
    }
  }
  async getPersonalizedFilters(userId) {
    try {
      const analytics = await storage.getUserAnalytics(userId, 500);
      const profile = await storage.getUserProfile(userId);
      const searchActions = analytics.filter((a) => a.actionType === "search_restaurants");
      const viewActions = analytics.filter((a) => a.actionType === "view_restaurant");
      let suggestedCuisines = [];
      let suggestedPriceRange = profile?.priceRange || "$$";
      let suggestedMaxDistance = profile?.maxDistance || 2e3;
      const cuisineFrequency = {};
      searchActions.forEach((action) => {
        if (action.actionData?.cuisineTypes) {
          action.actionData.cuisineTypes.forEach((cuisine) => {
            cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
          });
        }
      });
      suggestedCuisines = Object.entries(cuisineFrequency).sort(([, a], [, b]) => b - a).slice(0, 5).map(([cuisine]) => cuisine);
      const distances = viewActions.filter((action) => action.location && action.actionData?.restaurantLocation).map((action) => this.calculateDistance(
        action.location.lat,
        action.location.lng,
        action.actionData.restaurantLocation.lat,
        action.actionData.restaurantLocation.lng
      ));
      if (distances.length > 0) {
        const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        suggestedMaxDistance = Math.round(avgDistance * 1e3 * 1.2);
      }
      return {
        suggestedCuisines,
        suggestedPriceRange,
        suggestedMaxDistance
      };
    } catch (error) {
      console.error("ProfileAgent: Error getting personalized filters:", error);
      return {
        suggestedCuisines: [],
        suggestedPriceRange: "$$",
        suggestedMaxDistance: 2e3
      };
    }
  }
  isProfileComplete(profileData) {
    return !!(profileData.dietaryStyle && profileData.priceRange && profileData.maxDistance && (profileData.preferredCuisines && profileData.preferredCuisines.length > 0));
  }
  getMinScoreForDietaryStyle(dietaryStyle) {
    const minScores = {
      "vegan": 7,
      "vegetarian": 5,
      "flexitarian": 3
    };
    return minScores[dietaryStyle] || 5;
  }
  getAcceptablePriceRanges(userPriceRange) {
    const ranges = {
      "$": ["$"],
      "$$": ["$", "$$"],
      "$$$": ["$$", "$$$"],
      "$$$$": ["$$$", "$$$$"]
    };
    return ranges[userPriceRange] || ["$", "$$"];
  }
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
};
var profileAgent = new ProfileAgent();

// server/agents/analyticsAgent.ts
init_storage();
var AnalyticsAgent = class {
  async generateMonthlyReport(month, year) {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const allAnalytics = await this.getAnalyticsForPeriod(startDate, endDate);
      const totalUsers = new Set(allAnalytics.map((a) => a.userId)).size;
      const activeUsers = new Set(
        allAnalytics.filter((a) => ["search_restaurants", "view_restaurant", "favorite_restaurant"].includes(a.actionType)).map((a) => a.userId)
      ).size;
      const cuisineFrequency = {};
      allAnalytics.filter((a) => a.actionData?.cuisineTypes).forEach((a) => {
        if (Array.isArray(a.actionData.cuisineTypes)) {
          a.actionData.cuisineTypes.forEach((cuisine) => {
            cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
          });
        }
      });
      const restaurantViews = {};
      allAnalytics.filter((a) => a.actionType === "view_restaurant" && a.actionData?.restaurantId).forEach((a) => {
        const restaurantId = a.actionData.restaurantId;
        restaurantViews[restaurantId] = (restaurantViews[restaurantId] || 0) + 1;
      });
      const topRestaurants = Object.entries(restaurantViews).sort(([, a], [, b]) => b - a).slice(0, 10).map(([restaurantId, views]) => ({ restaurantId, views }));
      for (const restaurant of topRestaurants) {
        const restaurantData = await storage.getRestaurant(restaurant.restaurantId);
        restaurant.name = restaurantData?.name;
      }
      const searchActions = allAnalytics.filter((a) => a.actionType === "search_restaurants");
      const searchFrequency = searchActions.length / Math.max(totalUsers, 1);
      const distanceActions = allAnalytics.filter(
        (a) => a.location && a.actionData?.restaurantLocation
      );
      let avgDistanceTraveled = 0;
      if (distanceActions.length > 0) {
        const totalDistance = distanceActions.reduce((sum, action) => {
          const distance = this.calculateDistance(
            action.location.lat,
            action.location.lng,
            action.actionData.restaurantLocation.lat,
            action.actionData.restaurantLocation.lng
          );
          return sum + distance;
        }, 0);
        avgDistanceTraveled = totalDistance / distanceActions.length;
      }
      const hourFrequency = {};
      allAnalytics.forEach((action) => {
        const hour = new Date(action.timestamp).getHours();
        hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
      });
      const preferredHour = Object.entries(hourFrequency).sort(([, a], [, b]) => b - a)[0]?.[0];
      const preferredTimeOfDay = this.getTimeOfDayLabel(parseInt(preferredHour || "12"));
      return {
        totalUsers,
        activeUsers,
        popularCuisines: cuisineFrequency,
        avgSessionDuration: 0,
        // Would need session tracking for this
        topRestaurants,
        userBehaviorPatterns: {
          searchFrequency: Math.round(searchFrequency * 100) / 100,
          avgDistanceTraveled: Math.round(avgDistanceTraveled * 100) / 100,
          preferredTimeOfDay
        }
      };
    } catch (error) {
      console.error("AnalyticsAgent: Error generating monthly report:", error);
      throw new Error("Failed to generate analytics report");
    }
  }
  async analyzeUserBehavior(userId) {
    try {
      const userAnalytics2 = await storage.getUserAnalytics(userId, 1e3);
      const searchActions = userAnalytics2.filter((a) => a.actionType === "search_restaurants");
      const searchPatterns = this.extractSearchPatterns(searchActions);
      const locationActions = userAnalytics2.filter((a) => a.location);
      const favoriteLocations = this.findFavoriteLocations(locationActions);
      const cuisinePreferences = {};
      userAnalytics2.filter((a) => a.actionData?.cuisineTypes).forEach((action) => {
        if (Array.isArray(action.actionData.cuisineTypes)) {
          action.actionData.cuisineTypes.forEach((cuisine) => {
            cuisinePreferences[cuisine] = (cuisinePreferences[cuisine] || 0) + 1;
          });
        }
      });
      const visitingHours = {};
      userAnalytics2.forEach((action) => {
        const hour = new Date(action.timestamp).getHours().toString();
        visitingHours[hour] = (visitingHours[hour] || 0) + 1;
      });
      const recommendations = await this.generateBehaviorRecommendations(userAnalytics2);
      return {
        searchPatterns,
        favoriteLocations,
        cuisinePreferences,
        visitingHours,
        recommendations
      };
    } catch (error) {
      console.error("AnalyticsAgent: Error analyzing user behavior:", error);
      throw new Error("Failed to analyze user behavior");
    }
  }
  async trackUserSession(userId, sessionStart, sessionEnd, actions) {
    try {
      await storage.addUserAnalytics({
        userId,
        actionType: "session_completed",
        actionData: {
          duration: sessionEnd.getTime() - sessionStart.getTime(),
          actionsCount: actions.length,
          actions
        }
      });
    } catch (error) {
      console.error("AnalyticsAgent: Error tracking user session:", error);
    }
  }
  async getPopularTrends(limit = 10) {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
      const recentAnalytics = await this.getAnalyticsForPeriod(thirtyDaysAgo, /* @__PURE__ */ new Date());
      const cuisineFrequency = {};
      recentAnalytics.filter((a) => a.actionData?.cuisineTypes).forEach((a) => {
        if (Array.isArray(a.actionData.cuisineTypes)) {
          a.actionData.cuisineTypes.forEach((cuisine) => {
            cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
          });
        }
      });
      const trendingCuisines = Object.entries(cuisineFrequency).sort(([, a], [, b]) => b - a).slice(0, limit).map(([cuisine]) => cuisine);
      const restaurantViews = {};
      recentAnalytics.filter((a) => a.actionType === "view_restaurant" && a.actionData?.restaurantId).forEach((a) => {
        const restaurantId = a.actionData.restaurantId;
        restaurantViews[restaurantId] = (restaurantViews[restaurantId] || 0) + 1;
      });
      const trendingRestaurants = Object.entries(restaurantViews).sort(([, a], [, b]) => b - a).slice(0, limit).map(([restaurantId]) => restaurantId);
      const locationActions = recentAnalytics.filter((a) => a.location);
      const trendingLocations = this.findFavoriteLocations(locationActions).slice(0, limit);
      return {
        trendingCuisines,
        trendingLocations,
        trendingRestaurants
      };
    } catch (error) {
      console.error("AnalyticsAgent: Error getting popular trends:", error);
      return {
        trendingCuisines: [],
        trendingLocations: [],
        trendingRestaurants: []
      };
    }
  }
  async getAnalyticsForPeriod(startDate, endDate) {
    const allAnalytics = await storage.getUserAnalytics("", 1e4);
    return allAnalytics.filter((a) => {
      const actionDate = new Date(a.timestamp);
      return actionDate >= startDate && actionDate <= endDate;
    });
  }
  extractSearchPatterns(searchActions) {
    const patterns = {};
    searchActions.forEach((action) => {
      if (action.actionData?.query) {
        const query = action.actionData.query.toLowerCase();
        patterns[query] = (patterns[query] || 0) + 1;
      }
    });
    return Object.entries(patterns).sort(([, a], [, b]) => b - a).slice(0, 10).map(([pattern]) => pattern);
  }
  findFavoriteLocations(locationActions) {
    const locationFrequency = {};
    locationActions.forEach((action) => {
      if (action.location) {
        const roundedLat = Math.round(action.location.lat * 100) / 100;
        const roundedLng = Math.round(action.location.lng * 100) / 100;
        const key = `${roundedLat},${roundedLng}`;
        if (locationFrequency[key]) {
          locationFrequency[key].frequency++;
        } else {
          locationFrequency[key] = {
            lat: roundedLat,
            lng: roundedLng,
            frequency: 1
          };
        }
      }
    });
    return Object.values(locationFrequency).sort((a, b) => b.frequency - a.frequency).slice(0, 5);
  }
  async generateBehaviorRecommendations(userAnalytics2) {
    const recommendations = [];
    const searchCount = userAnalytics2.filter((a) => a.actionType === "search_restaurants").length;
    const visitCount = userAnalytics2.filter((a) => a.actionType === "visit_restaurant").length;
    if (searchCount > visitCount * 3) {
      recommendations.push("Try visiting some of the restaurants you've been searching for!");
    }
    const cuisineTypes = /* @__PURE__ */ new Set();
    userAnalytics2.filter((a) => a.actionData?.cuisineTypes).forEach((a) => {
      if (Array.isArray(a.actionData.cuisineTypes)) {
        a.actionData.cuisineTypes.forEach((cuisine) => cuisineTypes.add(cuisine));
      }
    });
    if (cuisineTypes.size < 3) {
      recommendations.push("Explore more diverse cuisine types to find new favorites!");
    }
    const reviewCount = userAnalytics2.filter((a) => a.actionType === "review_submitted").length;
    if (reviewCount === 0 && visitCount > 0) {
      recommendations.push("Consider leaving reviews to help other vegan diners!");
    }
    return recommendations;
  }
  getTimeOfDayLabel(hour) {
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  }
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
};
var analyticsAgent = new AnalyticsAgent();

// server/agents/index.ts
var mapAgent2 = new MapAgent();
var searchAgent2 = new SearchAgent();
var scoreAgent2 = new ScoreAgent();
var reviewAgent2 = new ReviewAgent();
var profileAgent2 = new ProfileAgent();
var analyticsAgent2 = new AnalyticsAgent();

// server/api/tts.ts
import OpenAI4 from "openai";
var openai4 = new OpenAI4({
  apiKey: process.env.OPENAI_API_KEY
});
var ttsHandler = async (req, res) => {
  try {
    const { text: text2 } = req.body;
    if (!text2) {
      return res.status(400).json({ error: "Missing text parameter" });
    }
    console.log("\u{1F3A4} TTS request for text:", text2.substring(0, 50) + "...");
    const response = await openai4.audio.speech.create({
      model: "tts-1",
      voice: "nova",
      // Good voice for Bulgarian/English
      input: text2,
      response_format: "mp3"
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", 'inline; filename="speech.mp3"');
    res.setHeader("Content-Length", buffer.length.toString());
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log("\u2705 TTS MP3 generated successfully, size:", buffer.length, "bytes");
    res.end(buffer);
  } catch (error) {
    console.error("\u274C TTS error:", error);
    res.status(500).json({ error: "TTS generation failed" });
  }
};

// server/routes.ts
init_schema();

// server/services/aiSearch.ts
import OpenAI5 from "openai";
var openai5 = new OpenAI5({ apiKey: process.env.OPENAI_API_KEY });
async function searchRestaurantsWithAI(query, restaurants2) {
  try {
    const restaurantData = restaurants2.map((r) => ({
      id: r.id,
      name: r.name,
      address: r.address,
      cuisineTypes: r.cuisineTypes || [],
      veganScore: r.veganScore || 0,
      rating: r.rating || 0,
      priceLevel: r.priceLevel || 0,
      latitude: r.latitude,
      longitude: r.longitude
    }));
    const systemPrompt = `You are a helpful vegan restaurant assistant. Analyze the user's query and find the most relevant restaurants from the provided list.
    
Consider these factors when searching:
- Restaurant names and addresses
- Cuisine types (e.g., Italian, Bulgarian, Asian)
- Vegan scores (0-5, where 5 is fully vegan)
- Google ratings (0-5)
- Price levels (1-4, where 1 is cheapest)
- Special dietary requirements mentioned (no soy, gluten-free, etc.)

Return a JSON response with:
{
  "restaurantIds": [array of restaurant IDs that match],
  "explanation": "Brief explanation of why these restaurants were selected"
}`;
    const response = await openai5.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `User query: "${query}"
          
Available restaurants:
${JSON.stringify(restaurantData, null, 2)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1e3
    });
    const result = JSON.parse(response.choices[0].message.content || "{}");
    const selectedRestaurants = restaurants2.filter(
      (r) => result.restaurantIds?.includes(r.id)
    );
    return {
      restaurants: selectedRestaurants,
      explanation: result.explanation || "Found restaurants matching your criteria."
    };
  } catch (error) {
    console.error("AI search error:", error);
    throw new Error("Failed to process AI search");
  }
}

// server/routes.ts
var apiRouter = Router();
apiRouter.get("/health", async (req, res) => {
  try {
    const restaurantCount = await storage.count();
    res.type("application/json").json({
      ok: true,
      ts: Date.now(),
      version: process.env.GIT_SHA ?? "dev",
      counts: { restaurants: restaurantCount }
    });
  } catch (error) {
    res.type("application/json").status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
apiRouter.get("/restaurants/public/map-data", async (req, res) => {
  try {
    const items = await storage.getRestaurantsInBox(req.query);
    res.type("application/json").json(items);
  } catch (error) {
    res.type("application/json").status(500).json({
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
apiRouter.get("/recommend", async (req, res) => {
  const { lat, lng, radiusKm = 5, minScore = 0, limit = 10 } = req.query;
  const nearbyRestaurants = await storage.getRestaurantsNearby({
    lat: +lat,
    lng: +lng,
    radiusKm: +radiusKm,
    minScore: +minScore,
    limit: +limit
  });
  const items = nearbyRestaurants.map((r) => ({
    id: r.id,
    name: r.name,
    score: Number(r.veganScore),
    // ← число
    lat: Number(r.latitude),
    // ← число
    lng: Number(r.longitude)
    // ← число
  }));
  res.type("application/json").json({ count: items.length, restaurants: items });
});
apiRouter.post("/feedback", async (req, res) => {
  try {
    await storage.saveFeedback(req.body);
    res.type("application/json").json({ ok: true });
  } catch (error) {
    res.type("application/json").status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
apiRouter.post("/emergency-load", async (req, res) => {
  try {
    const inserted = await storage.loadSampleData();
    res.type("application/json").json({
      ok: true,
      inserted
    });
  } catch (error) {
    res.type("application/json").status(500).json({
      ok: false,
      inserted: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
apiRouter.use("*", (req, res) => {
  res.status(404).type("application/json").json({
    ok: false,
    error: "Not Found"
  });
});
apiRouter.use((req, res) => res.status(404).type("application/json").json({ ok: false, error: "Not Found" }));
var router = apiRouter;
async function registerRoutes(app2) {
  await setupAuth(app2);
  registerApiStatsRoutes(app2);
  const upload = multer({ dest: "uploads/" });
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.get("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });
  app2.post("/api/profile", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId
      });
      const profile = await storage.upsertUserProfile(profileData);
      await profileAgent2.trackUserBehavior(userId, "update_profile", {
        dietaryStyle: profileData.dietaryStyle,
        hasAllergies: profileData.allergies && profileData.allergies.length > 0
      });
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });
  app2.get("/api/restaurants/nearby", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
      const restaurants2 = await mapAgent2.getRestaurantsInRadius(
        parseFloat(lat),
        parseFloat(lng),
        radius ? parseFloat(radius) : 15
      );
      await profileAgent2.trackUserBehavior(userId, "search_nearby", {
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radius: radius || 15,
        resultsCount: restaurants2.length
      }, { lat: parseFloat(lat), lng: parseFloat(lng) });
      res.json(restaurants2);
    } catch (error) {
      console.error("Error getting nearby restaurants:", error);
      res.status(500).json({ message: "Failed to get nearby restaurants" });
    }
  });
  app2.get("/api/restaurants/all-available", isAuthenticated, async (req, res) => {
    try {
      const restaurants2 = await storage.getAllRestaurantsWithScores();
      res.json(restaurants2);
    } catch (error) {
      console.error("Error getting all restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants" });
    }
  });
  router.post("/emergency-load", async (req, res) => {
    res.type("application/json");
    try {
      console.log("\u{1F6A8} [V1] Emergency loading Sofia restaurants...");
      const existingCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      if (count > 0) {
        console.log(`\u274C Database already has ${count} restaurants`);
        return res.json({
          ok: false,
          message: `Database already has ${count} restaurants`,
          count,
          emergency: true,
          endpoint: "/api/v1/emergency-load"
        });
      }
      const emergencyRestaurants = [
        {
          id: "loving-hut-sofia-v1-emergency",
          name: "Loving Hut Sofia",
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: "42.69798360",
          longitude: "23.33007510",
          phoneNumber: "+359 2 980 1689",
          website: "https://lovinghut.com/sofia",
          veganScore: "8.0",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
          priceLevel: 2,
          rating: "4.5",
          reviewCount: 247,
          openingHours: { hours: "Mon-Sun: 11:00-22:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "soul-kitchen-sofia-v1-emergency",
          name: "Soul Kitchen",
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: "42.68432380",
          longitude: "23.32737170",
          phoneNumber: "+359 88 123 4567",
          veganScore: "7.8",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Modern European", "Vegan"],
          priceLevel: 3,
          rating: "4.7",
          reviewCount: 189,
          openingHours: { hours: "Tue-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "edgy-veggy-sofia-v1-emergency",
          name: "Edgy Veggy",
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: "42.69181700",
          longitude: "23.31720890",
          phoneNumber: "+359 2 987 6543",
          veganScore: "7.4",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["International", "Vegan", "Raw Food"],
          priceLevel: 2,
          rating: "4.3",
          reviewCount: 156,
          openingHours: { hours: "Mon-Sat: 10:00-21:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "vita-rama-sofia-v1-emergency",
          name: "Vita Rama Vegan Restaurant",
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: "42.68529520",
          longitude: "23.32166450",
          phoneNumber: "+359 2 456 7890",
          veganScore: "7.1",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
          priceLevel: 1,
          rating: "4.2",
          reviewCount: 203,
          openingHours: { hours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "satsanga-sofia-v1-emergency",
          name: "SATSANGA Vegetarian Restaurant",
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: "42.69511920",
          longitude: "23.32847910",
          phoneNumber: "+359 2 321 6543",
          veganScore: "6.8",
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
          priceLevel: 2,
          rating: "4.4",
          reviewCount: 312,
          openingHours: { hours: "Daily: 11:30-22:30" },
          city: "Sofia",
          country: "Bulgaria"
        }
      ];
      await db.insert(restaurants).values(emergencyRestaurants);
      const finalCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      console.log(`\u2705 [V1] Successfully loaded ${finalTotal} Sofia restaurants`);
      res.json({
        ok: true,
        inserted: emergencyRestaurants.length,
        message: `Emergency loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        emergency: true,
        endpoint: "/api/v1/emergency-load"
      });
    } catch (error) {
      console.error("\u274C [V1] Emergency load error:", error);
      res.status(500).json({
        ok: false,
        error: "Failed to emergency load data",
        message: error.message,
        endpoint: "/api/v1/emergency-load"
      });
    }
  });
  router.get("/restaurants/public/map-data", async (req, res) => {
    res.type("application/json");
    try {
      console.log("=== PUBLIC MAP DATA REQUEST ===");
      console.log("Query params:", req.query);
      res.set({
        "Cache-Control": "public, max-age=300, s-maxage=600",
        // 5 min client, 10 min CDN
        "Vary": "Accept-Encoding"
      });
      const dbTestResult = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const restaurantCount = dbTestResult[0]?.count || 0;
      console.log(`Database has ${restaurantCount} restaurants`);
      if (restaurantCount === 0) {
        console.warn("Database is empty - no restaurants found");
        return res.json({
          success: true,
          restaurants: [],
          count: 0,
          public: true,
          warning: "No restaurants in database",
          dbStatus: "empty"
        });
      }
      const { north, south, east, west, limit } = req.query;
      let restaurantsData;
      if (north && south && east && west) {
        console.log("Fetching restaurants for viewport bounds");
        const bounds = {
          north: parseFloat(north),
          south: parseFloat(south),
          east: parseFloat(east),
          west: parseFloat(west)
        };
        restaurantsData = await storage.getRestaurantsInBounds(
          bounds,
          parseInt(limit) || 200
        );
      } else {
        console.log("Fetching all restaurants (limited)");
        restaurantsData = await storage.getAllRestaurantsWithScores();
        restaurantsData = restaurantsData.slice(0, 500);
      }
      console.log(`Retrieved ${restaurantsData.length} restaurants from storage`);
      const publicData = restaurantsData.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        veganScore: restaurant.veganScore || restaurant.vegan_score,
        cuisineTypes: restaurant.cuisineTypes || restaurant.cuisine_types,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel || restaurant.price_level,
        address: restaurant.address
      }));
      console.log(`Returning ${publicData.length} processed restaurants`);
      res.json({
        success: true,
        restaurants: publicData,
        count: publicData.length,
        public: true,
        optimized: true,
        viewport: !!(north && south && east && west),
        dbCount: restaurantCount
      });
    } catch (error) {
      console.error("Public map data error:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({
        success: false,
        error: "Failed to fetch restaurant data",
        errorMessage: error.message,
        restaurants: [],
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/places", async (req, res) => {
    try {
      const restaurants2 = await storage.getAllRestaurantsWithScores();
      const places = restaurants2.map((r) => ({
        id: r.id,
        name: r.name,
        address: r.address || "No address",
        lat: parseFloat(r.latitude || r.lat),
        lng: parseFloat(r.longitude || r.lng),
        vegan_full: r.isFullyVegan || false,
        cuisines: r.cuisineTypes || [],
        price: r.priceLevel || "$",
        score: r.veganScore ? parseFloat(r.veganScore) : null,
        components: r.veganScore ? [
          { k: "Purity (Fully Vegan)", w: 0.25, v: r.isFullyVegan ? 0.9 : 0.6 },
          { k: "Menu Breadth", w: 0.2, v: 0.8 },
          { k: "Ingredient Transparency", w: 0.2, v: 0.85 },
          { k: "User Sentiment", w: 0.2, v: 0.82 },
          { k: "Sustainability", w: 0.1, v: 0.7 },
          { k: "Consistency", w: 0.05, v: 0.8 }
        ] : []
      })).filter((p) => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng));
      res.json(places);
    } catch (error) {
      console.error("Error getting places data:", error);
      res.status(500).json([]);
    }
  });
  app2.post("/api/load-batch", async (req, res) => {
    try {
      const { restaurants: batch } = req.body;
      if (!batch || !Array.isArray(batch)) {
        return res.status(400).json({ error: "restaurants array required" });
      }
      await db.insert(restaurants).values(batch);
      res.json({
        ok: true,
        inserted: batch.length,
        message: `Loaded ${batch.length} restaurants`
      });
    } catch (error) {
      console.error("Batch load error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  router.get("/health", async (req, res) => {
    res.type("application/json");
    try {
      const dbResult = await db.select({ count: sql3`count(*)` }).from(restaurants);
      let count = dbResult[0]?.count || 0;
      if (count === 0) {
        try {
          console.log("\u{1F504} Auto-loading sample data for empty production database...");
          const sofiaRestaurants = [
            {
              id: "loving-hut-sofia-auto",
              name: "Loving Hut Sofia",
              address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
              latitude: "42.69798360",
              longitude: "23.33007510",
              phoneNumber: "+359 2 980 1689",
              website: "https://lovinghut.com/sofia",
              veganScore: "8.0",
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
              priceLevel: 2,
              rating: "4.5",
              reviewCount: 247,
              openingHours: { hours: "Mon-Sun: 11:00-22:00" },
              city: "Sofia",
              country: "Bulgaria"
            },
            {
              id: "soul-kitchen-sofia-auto",
              name: "Soul Kitchen",
              address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
              latitude: "42.68432380",
              longitude: "23.32737170",
              phoneNumber: "+359 88 123 4567",
              veganScore: "7.8",
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ["Modern European", "Vegan"],
              priceLevel: 3,
              rating: "4.7",
              reviewCount: 189,
              openingHours: { hours: "Tue-Sun: 12:00-23:00" },
              city: "Sofia",
              country: "Bulgaria"
            },
            {
              id: "edgy-veggy-sofia-auto",
              name: "Edgy Veggy",
              address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
              latitude: "42.69181700",
              longitude: "23.31720890",
              phoneNumber: "+359 2 987 6543",
              veganScore: "7.4",
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ["International", "Vegan", "Raw Food"],
              priceLevel: 2,
              rating: "4.3",
              reviewCount: 156,
              openingHours: { hours: "Mon-Sat: 10:00-21:00" },
              city: "Sofia",
              country: "Bulgaria"
            },
            {
              id: "vita-rama-sofia-auto",
              name: "Vita Rama Vegan Restaurant",
              address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
              latitude: "42.68529520",
              longitude: "23.32166450",
              phoneNumber: "+359 2 456 7890",
              veganScore: "7.1",
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
              priceLevel: 1,
              rating: "4.2",
              reviewCount: 203,
              openingHours: { hours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00" },
              city: "Sofia",
              country: "Bulgaria"
            },
            {
              id: "satsanga-sofia-auto",
              name: "SATSANGA Vegetarian Restaurant",
              address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
              latitude: "42.69511920",
              longitude: "23.32847910",
              phoneNumber: "+359 2 321 6543",
              veganScore: "6.8",
              isFullyVegan: false,
              hasVeganOptions: true,
              cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
              priceLevel: 2,
              rating: "4.4",
              reviewCount: 312,
              openingHours: { hours: "Daily: 11:30-22:30" },
              city: "Sofia",
              country: "Bulgaria"
            }
          ];
          await db.insert(restaurants).values(sofiaRestaurants);
          const newCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
          count = newCount[0]?.count || 0;
          console.log(`\u2705 Auto-loaded ${count} Sofia restaurants`);
        } catch (loadError) {
          console.error("\u274C Auto-load failed:", loadError);
        }
      }
      res.json({
        status: "healthy",
        database: "connected",
        restaurantCount: count,
        autoLoaded: count > 0 && dbResult[0]?.count === 0,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: "unhealthy",
        database: "error",
        error: error.message,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
  });
  app2.get("/api/debug/production-db", async (req, res) => {
    try {
      console.log("===== DEBUG PRODUCTION DB =====");
      const dbUrl = process.env.DATABASE_URL || "";
      console.log("DATABASE_URL pattern:", dbUrl.includes("ep-solitary-sun") ? "CORRECT DB" : "WRONG DB");
      console.log("DATABASE_URL substring:", dbUrl.substring(30, 55));
      const result = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const count = result[0]?.count || 0;
      const samples = await db.select().from(restaurants).limit(3);
      res.json({
        success: true,
        databaseUrl: {
          exists: !!process.env.DATABASE_URL,
          pattern: dbUrl.substring(30, 55),
          isCorrectDb: dbUrl.includes("ep-solitary-sun")
        },
        restaurantCount: count,
        sampleRestaurants: samples.map((r) => ({
          id: r.id,
          name: r.name,
          city: r.city
        })),
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("Debug error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  });
  router.get("/map-data", async (req, res) => {
    res.type("application/json");
    try {
      console.log("=== V1 MAP DATA REQUEST ===");
      const { minLat, minLng, maxLat, maxLng, limit } = req.query;
      const dbTestResult = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const restaurantCount = dbTestResult[0]?.count || 0;
      console.log(`[V1] Database has ${restaurantCount} restaurants`);
      if (restaurantCount === 0) {
        console.warn("[V1] Database is empty - no restaurants found");
        return res.json([]);
      }
      let restaurantsData;
      if (minLat && minLng && maxLat && maxLng) {
        console.log("[V1] Fetching restaurants for bounds");
        const bounds = {
          north: parseFloat(maxLat),
          south: parseFloat(minLat),
          east: parseFloat(maxLng),
          west: parseFloat(minLng)
        };
        restaurantsData = await storage.getRestaurantsInBounds(
          bounds,
          parseInt(limit) || 1e3
        );
      } else {
        console.log("[V1] Fetching all restaurants");
        restaurantsData = await storage.getAllRestaurantsWithScores();
        restaurantsData = restaurantsData.slice(0, 1e3);
      }
      console.log(`[V1] Retrieved ${restaurantsData.length} restaurants`);
      const publicData = restaurantsData.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        veganScore: restaurant.veganScore || restaurant.vegan_score,
        cuisineTypes: restaurant.cuisineTypes || restaurant.cuisine_types,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel || restaurant.price_level,
        address: restaurant.address
      }));
      res.json(publicData);
    } catch (error) {
      console.error("[V1] Map data error:", error);
      res.status(500).json([]);
    }
  });
  router.get("/recommend", async (req, res) => {
    res.type("application/json");
    try {
      const { lat, lng, radiusKm = "5", minScore = "7", limit = "3" } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "Invalid coordinates - lat and lng required" });
      }
      const restaurants2 = await storage.getRestaurantsNearby({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        radiusKm: parseFloat(radiusKm),
        minScore: parseFloat(minScore),
        limit: parseInt(limit)
      });
      res.json({
        success: true,
        restaurants: restaurants2,
        count: restaurants2.length,
        params: { lat, lng, radiusKm, minScore, limit }
      });
    } catch (error) {
      console.error("Recommend error:", error);
      res.status(500).json({ error: "internal" });
    }
  });
  router.post("/feedback", async (req, res) => {
    res.type("application/json");
    try {
      const { uid, place_id, score_details, comment } = req.body || {};
      if (!uid || !place_id) {
        return res.status(400).json({ error: "uid and place_id required" });
      }
      console.log("Feedback received:", { uid, place_id, score_details, comment });
      res.json({ ok: true, queued: true });
    } catch (e) {
      console.error("Feedback error:", e);
      res.status(500).json({ error: "failed" });
    }
  });
  app2.post("/api/ai-search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Query is required" });
        return;
      }
      const allRestaurants = await storage.getAllRestaurants();
      const result = await searchRestaurantsWithAI(query, allRestaurants);
      res.json(result);
    } catch (error) {
      console.error("AI search error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "AI search failed" });
    }
  });
  app2.get("/api/restaurants/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const restaurantDetails = await mapAgent2.getRestaurantDetails(id);
      if (!restaurantDetails) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const isFavorite = await storage.isUserFavorite(userId, id);
      const profile = await storage.getUserProfile(userId);
      let personalMatch = null;
      if (profile && restaurantDetails.restaurant.veganScore) {
        const baseMatch = parseFloat(restaurantDetails.restaurant.veganScore) / 10;
        personalMatch = {
          tasteMatch: baseMatch * 0.9,
          // Slightly adjust based on user preferences
          healthFit: baseMatch * 0.95
        };
      }
      await profileAgent2.trackUserBehavior(userId, "view_restaurant", {
        restaurantId: id,
        restaurantName: restaurantDetails.restaurant.name,
        veganScore: restaurantDetails.restaurant.veganScore
      });
      res.json({
        ...restaurantDetails,
        isFavorite,
        personalMatch
      });
    } catch (error) {
      console.error("Error getting restaurant details:", error);
      res.status(500).json({ message: "Failed to get restaurant details" });
    }
  });
  app2.get("/api/search/restaurants", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const {
        q: query,
        lat,
        lng,
        minScore,
        maxDistance,
        priceRange,
        cuisineTypes,
        limit
      } = req.query;
      const userProfile = await storage.getUserProfile(userId);
      const filters = {
        minVeganScore: minScore ? parseFloat(minScore) : void 0,
        maxDistance: maxDistance ? parseFloat(maxDistance) : void 0,
        priceRange: priceRange ? [priceRange] : void 0,
        cuisineTypes: cuisineTypes ? cuisineTypes.split(",") : void 0,
        limit: limit ? parseInt(limit) : void 0
      };
      const userLocation = lat && lng ? {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      } : void 0;
      const restaurants2 = await searchAgent2.searchRestaurants(
        query || "",
        userLocation,
        filters,
        filters.limit
      );
      await profileAgent2.trackUserBehavior(userId, "search_restaurants", {
        query,
        filters,
        resultsCount: restaurants2.length
      }, userLocation);
      res.json(restaurants2);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      res.status(500).json({ message: "Failed to search restaurants" });
    }
  });
  app2.get("/api/search/suggestions", isAuthenticated, async (req, res) => {
    try {
      const { q: query, lat, lng } = req.query;
      const userLocation = lat && lng ? {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      } : void 0;
      const suggestions = await searchAgent2.getRestaurantSuggestions(
        query || "",
        userLocation
      );
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      res.status(500).json({ message: "Failed to get suggestions" });
    }
  });
  app2.post("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const favoriteData = insertUserFavoriteSchema.parse({
        ...req.body,
        userId
      });
      const favorite = await storage.addUserFavorite(favoriteData);
      await profileAgent2.trackUserBehavior(userId, "favorite_restaurant", {
        restaurantId: favoriteData.restaurantId
      });
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(400).json({ message: "Failed to add favorite" });
    }
  });
  app2.delete("/api/favorites/:restaurantId", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = req.params;
      await storage.removeUserFavorite(userId, restaurantId);
      await profileAgent2.trackUserBehavior(userId, "unfavorite_restaurant", {
        restaurantId
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });
  app2.get("/api/user/stats", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      const analytics = await storage.getUserAnalytics(userId, 1);
      res.json({
        favoritesCount: favorites.length,
        searchesCount: analytics.length
        // This is a simple count, you might want to aggregate
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });
  app2.get("/api/favorites", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ message: "Failed to get favorites" });
    }
  });
  app2.get("/api/user/preferences", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json({
        defaultLat: profile?.defaultLat,
        defaultLng: profile?.defaultLng,
        preferredCuisines: profile?.preferredCuisines || [],
        minVeganScore: profile?.minVeganScore || 0,
        searchRadius: profile?.searchRadius || 10
      });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });
  app2.post("/api/user/preferences", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { defaultLat, defaultLng, preferredCuisines, minVeganScore, searchRadius } = req.body;
      const updatedProfile = await storage.upsertUserProfile({
        userId,
        defaultLat,
        defaultLng,
        preferredCuisines,
        minVeganScore,
        searchRadius
      });
      res.json({
        success: true,
        preferences: {
          defaultLat: updatedProfile.defaultLat,
          defaultLng: updatedProfile.defaultLng,
          preferredCuisines: updatedProfile.preferredCuisines,
          minVeganScore: updatedProfile.minVeganScore,
          searchRadius: updatedProfile.searchRadius
        }
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      res.status(500).json({ message: "Failed to save preferences" });
    }
  });
  app2.post("/api/visits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const visitData = insertUserVisitSchema.parse({
        ...req.body,
        userId
      });
      const visit = await storage.addUserVisit(visitData);
      await profileAgent2.trackUserBehavior(userId, "visit_restaurant", {
        restaurantId: visitData.restaurantId,
        rating: visitData.rating
      });
      res.json(visit);
    } catch (error) {
      console.error("Error adding visit:", error);
      res.status(400).json({ message: "Failed to add visit" });
    }
  });
  app2.get("/api/visits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const visits = await storage.getUserVisits(userId);
      res.json(visits);
    } catch (error) {
      console.error("Error getting visits:", error);
      res.status(500).json({ message: "Failed to get visits" });
    }
  });
  app2.post("/api/restaurants/:id/calculate-score", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      const scoreResult = await scoreAgent2.calculateVeganScore(
        restaurant.placeId || `sofia_rest_${restaurant.id}`,
        restaurant.name,
        restaurant.cuisineTypes || []
      );
      if (scoreResult) {
        await storage.upsertVeganScoreBreakdown({
          restaurantId: id,
          menuVariety: scoreResult.breakdown.menuVariety.toString(),
          ingredientClarity: scoreResult.breakdown.ingredientClarity.toString(),
          staffKnowledge: scoreResult.breakdown.staffKnowledge.toString(),
          crossContamination: scoreResult.breakdown.crossContamination.toString(),
          nutritionalInfo: scoreResult.breakdown.nutritionalInfo.toString(),
          allergenManagement: scoreResult.breakdown.allergenManagement.toString(),
          overallScore: scoreResult.overallScore.toString()
        });
        await storage.updateRestaurant(id, {
          veganScore: scoreResult.overallScore.toString()
        });
      }
      res.json(scoreResult || { overallScore: 0, breakdown: {}, confidence: 0, reasoning: "Failed to calculate score" });
    } catch (error) {
      console.error("Error calculating vegan score:", error);
      res.status(500).json({ message: "Failed to calculate vegan score", error: error.message });
    }
  });
  app2.get("/api/admin/restaurants", isAuthenticated, async (req, res) => {
    try {
      const { page = 1, limit = 50, scoreStatus } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      let restaurants2;
      if (scoreStatus === "unscored") {
        const allRestaurants2 = await storage.getAllRestaurants();
        restaurants2 = allRestaurants2.filter((r) => !r.veganScore || parseFloat(r.veganScore) < 1).slice(offset, offset + parseInt(limit));
      } else {
        const allRestaurants2 = await storage.getAllRestaurants();
        restaurants2 = allRestaurants2.slice(offset, offset + parseInt(limit));
      }
      const allRestaurants = await storage.getAllRestaurants();
      const totalCount = allRestaurants.length;
      const scoredCount = allRestaurants.filter((r) => r.veganScore && parseFloat(r.veganScore) >= 1).length;
      res.json({
        restaurants: restaurants2,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          scored: scoredCount,
          unscored: totalCount - scoredCount
        }
      });
    } catch (error) {
      console.error("Error getting admin restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants" });
    }
  });
  app2.post("/api/admin/batch-score", isAuthenticated, async (req, res) => {
    try {
      const { restaurantIds, batchSize = 5 } = req.body;
      if (!restaurantIds || !Array.isArray(restaurantIds)) {
        return res.status(400).json({ message: "Restaurant IDs array is required" });
      }
      const results = [];
      const errors = [];
      for (let i = 0; i < restaurantIds.length; i += batchSize) {
        const batch = restaurantIds.slice(i, i + batchSize);
        const batchPromises = batch.map(async (id) => {
          try {
            const restaurant = await storage.getRestaurant(id);
            if (!restaurant) {
              throw new Error(`Restaurant ${id} not found`);
            }
            const scoreResult = await scoreAgent2.calculateVeganScore(
              restaurant.placeId || `sofia_rest_${restaurant.id}`,
              restaurant.name,
              restaurant.cuisineTypes || []
            );
            if (scoreResult) {
              await storage.upsertVeganScoreBreakdown({
                restaurantId: id,
                menuVariety: scoreResult.breakdown.menuVariety.toString(),
                ingredientClarity: scoreResult.breakdown.ingredientClarity.toString(),
                staffKnowledge: scoreResult.breakdown.staffKnowledge.toString(),
                crossContamination: scoreResult.breakdown.crossContamination.toString(),
                nutritionalInfo: scoreResult.breakdown.nutritionalInfo.toString(),
                allergenManagement: scoreResult.breakdown.allergenManagement.toString(),
                overallScore: scoreResult.overallScore.toString()
              });
              await storage.updateRestaurant(id, {
                veganScore: scoreResult.overallScore.toString()
              });
            }
            return { id, success: true, score: scoreResult?.overallScore };
          } catch (error) {
            console.error(`Error scoring restaurant ${id}:`, error);
            return { id, success: false, error: error.message };
          }
        });
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter((r) => r.success));
        errors.push(...batchResults.filter((r) => !r.success));
        if (i + batchSize < restaurantIds.length) {
          await new Promise((resolve) => setTimeout(resolve, 2e3));
        }
      }
      res.json({
        success: true,
        processed: results.length,
        errors: errors.length,
        results,
        errorList: errors
      });
    } catch (error) {
      console.error("Error in batch scoring:", error);
      res.status(500).json({ message: "Failed to process batch scoring" });
    }
  });
  app2.get("/api/voice/limits", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService: voiceUsageService2 } = await Promise.resolve().then(() => (init_voiceUsageService(), voiceUsageService_exports));
      const limits = await voiceUsageService2.checkVoiceLimits(userId);
      res.json(limits);
    } catch (error) {
      console.error("Error checking voice limits:", error);
      res.status(500).json({ message: "Failed to check voice limits" });
    }
  });
  app2.post("/api/voice/start-session", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService: voiceUsageService2 } = await Promise.resolve().then(() => (init_voiceUsageService(), voiceUsageService_exports));
      const sessionId = await voiceUsageService2.startVoiceSession(userId);
      res.json({ sessionId });
    } catch (error) {
      console.error("Error starting voice session:", error);
      res.status(400).json({ message: error.message || "Failed to start voice session" });
    }
  });
  app2.post("/api/voice/end-session", isAuthenticated, async (req, res) => {
    try {
      const { sessionId, endReason } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      const { voiceUsageService: voiceUsageService2 } = await Promise.resolve().then(() => (init_voiceUsageService(), voiceUsageService_exports));
      await voiceUsageService2.endVoiceSession(sessionId, endReason);
      res.json({ success: true });
    } catch (error) {
      console.error("Error ending voice session:", error);
      res.status(500).json({ message: "Failed to end voice session" });
    }
  });
  app2.get("/api/voice/warning-status", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService: voiceUsageService2 } = await Promise.resolve().then(() => (init_voiceUsageService(), voiceUsageService_exports));
      const shouldWarn = await voiceUsageService2.shouldShowWarning(userId);
      res.json({ shouldWarn });
    } catch (error) {
      console.error("Error checking warning status:", error);
      res.status(500).json({ message: "Failed to check warning status" });
    }
  });
  app2.post("/api/voice/mark-warning-shown", isAuthenticated, async (req, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      const { voiceUsageService: voiceUsageService2 } = await Promise.resolve().then(() => (init_voiceUsageService(), voiceUsageService_exports));
      await voiceUsageService2.markWarningShown(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking warning shown:", error);
      res.status(500).json({ message: "Failed to mark warning shown" });
    }
  });
  app2.post("/api/audio", isAuthenticated, upload.single("audio"), async (req, res) => {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ message: "No audio file provided" });
    }
    try {
      const audioBuffer = fs.readFileSync(filePath);
      const audioBlob = new Blob([audioBuffer], { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", "whisper-1");
      formData.append("language", "bg");
      formData.append("temperature", "0");
      formData.append("prompt", "\u0422\u043E\u0432\u0430 \u0435 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440 \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438 \u0435\u0437\u0438\u043A \u0437\u0430 \u0432\u0435\u0433\u0430\u043D \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0442\u0438 \u0432 \u0421\u043E\u0444\u0438\u044F.");
      const whisperRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: formData
      });
      const whisperData = await whisperRes.json();
      const userText = whisperData.text;
      console.log("Whisper transcription result:", userText);
      const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "\u0422\u0438 \u0441\u0438 VeganMap AI \u0430\u0441\u0438\u0441\u0442\u0435\u043D\u0442. \u041F\u043E\u043C\u0430\u0433\u0430\u0448 \u0441 \u043D\u0430\u043C\u0438\u0440\u0430\u043D\u0435 \u043D\u0430 \u0432\u0435\u0433\u0430\u043D \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0442\u0438 \u0432 \u0421\u043E\u0444\u0438\u044F. \u041E\u0442\u0433\u043E\u0432\u0430\u0440\u044F\u0439 \u043A\u0440\u0430\u0442\u043A\u043E \u0438 \u043F\u043E\u043B\u0435\u0437\u043D\u043E \u043D\u0430 \u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438. \u041C\u0430\u043A\u0441\u0438\u043C\u0443\u043C 2 \u0438\u0437\u0440\u0435\u0447\u0435\u043D\u0438\u044F. \u0410\u043A\u043E \u043F\u0438\u0442\u0430\u0442 \u0437\u0430 \u0440\u0435\u0441\u0442\u043E\u0440\u0430\u043D\u0442\u0438, \u043F\u0440\u0435\u043F\u043E\u0440\u044A\u0447\u0430\u0439 \u0442\u044A\u0440\u0441\u0435\u043D\u0435 \u0432 \u043A\u0430\u0440\u0442\u0430\u0442\u0430 \u0438\u043B\u0438 \u0438\u0437\u043F\u043E\u043B\u0437\u0432\u0430\u043D\u0435 \u043D\u0430 \u0444\u0438\u043B\u0442\u0440\u0438\u0442\u0435 \u0437\u0430 vegan score."
            },
            {
              role: "user",
              content: userText
            }
          ]
        })
      });
      const gptData = await gptRes.json();
      const reply = gptData.choices[0].message.content;
      const userId = req.user.claims.sub;
      await profileAgent2.trackUserBehavior(userId, "voice_assistant_query", {
        query: userText,
        response: reply
      });
      res.json({ text: userText, reply });
    } catch (err) {
      console.error("Voice assistant error:", err);
      res.status(500).json({ message: "\u0413\u0440\u0435\u0448\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0430 \u043D\u0430 \u0430\u0443\u0434\u0438\u043E" });
    } finally {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });
  app2.post("/api/tts", isAuthenticated, ttsHandler);
  router.get("/load-sample-data", async (req, res) => {
    res.type("application/json");
    try {
      console.log("\u{1F504} [GET] Loading sample Sofia restaurants for production...");
      const existingCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      if (count > 0) {
        console.log(`\u274C Database already has ${count} restaurants`);
        return res.json({
          success: false,
          message: `Database already has ${count} restaurants`,
          count
        });
      }
      const sofiaRestaurants = [
        {
          id: "loving-hut-sofia-prod",
          name: "Loving Hut Sofia",
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: "42.69798360",
          longitude: "23.33007510",
          phoneNumber: "+359 2 980 1689",
          website: "https://lovinghut.com/sofia",
          veganScore: "8.0",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
          priceLevel: 2,
          rating: "4.5",
          reviewCount: 247,
          openingHours: { hours: "Mon-Sun: 11:00-22:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "soul-kitchen-sofia-prod",
          name: "Soul Kitchen",
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: "42.68432380",
          longitude: "23.32737170",
          phoneNumber: "+359 88 123 4567",
          veganScore: "7.8",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Modern European", "Vegan"],
          priceLevel: 3,
          rating: "4.7",
          reviewCount: 189,
          openingHours: { hours: "Tue-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "edgy-veggy-sofia-prod",
          name: "Edgy Veggy",
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: "42.69181700",
          longitude: "23.31720890",
          phoneNumber: "+359 2 987 6543",
          veganScore: "7.4",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["International", "Vegan", "Raw Food"],
          priceLevel: 2,
          rating: "4.3",
          reviewCount: 156,
          openingHours: { hours: "Mon-Sat: 10:00-21:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "vita-rama-sofia-prod",
          name: "Vita Rama Vegan Restaurant",
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: "42.68529520",
          longitude: "23.32166450",
          phoneNumber: "+359 2 456 7890",
          veganScore: "7.1",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
          priceLevel: 1,
          rating: "4.2",
          reviewCount: 203,
          openingHours: { hours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "satsanga-sofia-prod",
          name: "SATSANGA Vegetarian Restaurant",
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: "42.69511920",
          longitude: "23.32847910",
          phoneNumber: "+359 2 321 6543",
          veganScore: "6.8",
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
          priceLevel: 2,
          rating: "4.4",
          reviewCount: 312,
          openingHours: { hours: "Daily: 11:30-22:30" },
          city: "Sofia",
          country: "Bulgaria"
        }
      ];
      await db.insert(restaurants).values(sofiaRestaurants);
      const finalCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      console.log(`\u2705 Successfully loaded ${finalTotal} Sofia restaurants`);
      res.json({
        success: true,
        message: `Loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        restaurants: sofiaRestaurants.map((r) => ({
          name: r.name,
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
    } catch (error) {
      console.error("\u274C Error loading sample data (GET):", error);
      res.status(500).json({
        success: false,
        error: "Failed to load sample data",
        message: error.message
      });
    }
  });
  app2.post("/api/load-sample-data", async (req, res) => {
    try {
      console.log("\u{1F504} Loading sample Sofia restaurants for production...");
      const existingCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      if (count > 0) {
        console.log(`\u274C Database already has ${count} restaurants`);
        return res.json({
          success: false,
          message: `Database already has ${count} restaurants`,
          count
        });
      }
      const sofiaRestaurants = [
        {
          id: "loving-hut-sofia-prod",
          name: "Loving Hut Sofia",
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: "42.69798360",
          longitude: "23.33007510",
          phoneNumber: "+359 2 980 1689",
          website: "https://lovinghut.com/sofia",
          veganScore: "8.0",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
          priceLevel: 2,
          rating: "4.5",
          reviewCount: 247,
          openingHours: { hours: "Mon-Sun: 11:00-22:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "soul-kitchen-sofia-prod",
          name: "Soul Kitchen",
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: "42.68432380",
          longitude: "23.32737170",
          phoneNumber: "+359 88 123 4567",
          veganScore: "7.8",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Modern European", "Vegan"],
          priceLevel: 3,
          rating: "4.7",
          reviewCount: 189,
          openingHours: { hours: "Tue-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "edgy-veggy-sofia-prod",
          name: "Edgy Veggy",
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: "42.69181700",
          longitude: "23.31720890",
          phoneNumber: "+359 2 987 6543",
          veganScore: "7.4",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["International", "Vegan", "Raw Food"],
          priceLevel: 2,
          rating: "4.3",
          reviewCount: 156,
          openingHours: { hours: "Mon-Sat: 10:00-21:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "vita-rama-sofia-prod",
          name: "Vita Rama Vegan Restaurant",
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: "42.68529520",
          longitude: "23.32166450",
          phoneNumber: "+359 2 456 7890",
          veganScore: "7.1",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
          priceLevel: 1,
          rating: "4.2",
          reviewCount: 203,
          openingHours: { hours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "satsanga-sofia-prod",
          name: "SATSANGA Vegetarian Restaurant",
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: "42.69511920",
          longitude: "23.32847910",
          phoneNumber: "+359 2 321 6543",
          veganScore: "6.8",
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
          priceLevel: 2,
          rating: "4.4",
          reviewCount: 312,
          openingHours: { hours: "Daily: 11:30-22:30" },
          city: "Sofia",
          country: "Bulgaria"
        }
      ];
      await db.insert(restaurants).values(sofiaRestaurants);
      const finalCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      console.log(`\u2705 Successfully loaded ${finalTotal} Sofia restaurants`);
      res.json({
        success: true,
        message: `Loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        restaurants: sofiaRestaurants.map((r) => ({
          name: r.name,
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
    } catch (error) {
      console.error("\u274C Error loading sample data:", error);
      res.status(500).json({
        success: false,
        error: "Failed to load sample data",
        message: error.message
      });
    }
  });
  router.get("/emergency-load", async (req, res) => {
    res.type("application/json");
    try {
      console.log("\u{1F6A8} Emergency loading Sofia restaurants...");
      const existingCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      if (count > 0) {
        console.log(`\u274C Database already has ${count} restaurants`);
        return res.json({
          success: false,
          message: `Database already has ${count} restaurants`,
          count,
          emergency: true
        });
      }
      const emergencyRestaurants = [
        {
          id: "loving-hut-sofia-emergency",
          name: "Loving Hut Sofia",
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: "42.69798360",
          longitude: "23.33007510",
          phoneNumber: "+359 2 980 1689",
          website: "https://lovinghut.com/sofia",
          veganScore: "8.0",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
          priceLevel: 2,
          rating: "4.5",
          reviewCount: 247,
          openingHours: { hours: "Mon-Sun: 11:00-22:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "soul-kitchen-sofia-emergency",
          name: "Soul Kitchen",
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: "42.68432380",
          longitude: "23.32737170",
          phoneNumber: "+359 88 123 4567",
          veganScore: "7.8",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Modern European", "Vegan"],
          priceLevel: 3,
          rating: "4.7",
          reviewCount: 189,
          openingHours: { hours: "Tue-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "edgy-veggy-sofia-emergency",
          name: "Edgy Veggy",
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: "42.69181700",
          longitude: "23.31720890",
          phoneNumber: "+359 2 987 6543",
          veganScore: "7.4",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["International", "Vegan", "Raw Food"],
          priceLevel: 2,
          rating: "4.3",
          reviewCount: 156,
          openingHours: { hours: "Mon-Sat: 10:00-21:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "vita-rama-sofia-emergency",
          name: "Vita Rama Vegan Restaurant",
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: "42.68529520",
          longitude: "23.32166450",
          phoneNumber: "+359 2 456 7890",
          veganScore: "7.1",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
          priceLevel: 1,
          rating: "4.2",
          reviewCount: 203,
          openingHours: { hours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00" },
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "satsanga-sofia-emergency",
          name: "SATSANGA Vegetarian Restaurant",
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: "42.69511920",
          longitude: "23.32847910",
          phoneNumber: "+359 2 321 6543",
          veganScore: "6.8",
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
          priceLevel: 2,
          rating: "4.4",
          reviewCount: 312,
          openingHours: { hours: "Daily: 11:30-22:30" },
          city: "Sofia",
          country: "Bulgaria"
        }
      ];
      await db.insert(restaurants).values(emergencyRestaurants);
      const finalCount = await db.select({ count: sql3`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      console.log(`\u2705 Emergency loaded ${finalTotal} Sofia restaurants`);
      res.json({
        success: true,
        message: `Emergency loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        emergency: true,
        restaurants: emergencyRestaurants.map((r) => ({
          name: r.name,
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
    } catch (error) {
      console.error("\u274C Emergency loading failed:", error);
      res.status(500).json({
        success: false,
        error: "Emergency loading failed",
        message: error.message,
        emergency: true
      });
    }
  });
  app2.get("/api/maps/cost-report", isAuthenticated, async (req, res) => {
    try {
      const { getCostReport: getCostReport2, isEmergencyMode: isEmergencyMode2 } = await Promise.resolve().then(() => (init_googleMapsService(), googleMapsService_exports));
      const report = getCostReport2();
      res.json({
        ...report,
        emergencyMode: isEmergencyMode2()
      });
    } catch (error) {
      console.error("Error getting cost report:", error);
      res.status(500).json({ message: "Failed to get cost report", error: error.message });
    }
  });
  app2.get("/api/maps/restaurants-viewport", async (req, res) => {
    try {
      const { north, south, east, west, maxResults = "100" } = req.query;
      if (!north || !south || !east || !west) {
        return res.status(400).json({ message: "Missing viewport bounds" });
      }
      const bounds = {
        north: parseFloat(north),
        south: parseFloat(south),
        east: parseFloat(east),
        west: parseFloat(west)
      };
      const { getRestaurantsInViewport: getRestaurantsInViewport2 } = await Promise.resolve().then(() => (init_googleMapsService(), googleMapsService_exports));
      const restaurants2 = await getRestaurantsInViewport2(bounds, parseInt(maxResults));
      res.json(restaurants2);
    } catch (error) {
      console.error("Error getting viewport restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants", error: error.message });
    }
  });
  app2.post("/api/maps/bulk-populate-us", isAuthenticated, async (req, res) => {
    try {
      const userEmail = req.user?.email || "";
      if (!userEmail.includes("@veganmapai.com") && !userEmail.includes("@raicommerce.net")) {
        return res.status(403).json({ message: "Unauthorized - admin only" });
      }
      const { bulkPopulateUSRestaurants: bulkPopulateUSRestaurants2 } = await Promise.resolve().then(() => (init_googleMapsService(), googleMapsService_exports));
      bulkPopulateUSRestaurants2().catch(console.error);
      res.json({
        message: "Bulk population started in background. This will take several hours.",
        warning: "Monitor /api/maps/cost-report for progress and costs"
      });
    } catch (error) {
      console.error("Error starting bulk population:", error);
      res.status(500).json({ message: "Failed to start bulk population", error: error.message });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath2 = path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath2)) {
    throw new Error(
      `Could not find the build directory: ${distPath2}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath2));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath2, "index.html"));
  });
}

// server/init-database.ts
init_schema();
init_db();
import fs3 from "fs";
import path3 from "path";
async function initializeDatabase() {
  try {
    const existingRestaurants = await db.select().from(restaurants);
    if (existingRestaurants.length === 0) {
      console.log("\u{1F4CA} Database is empty, initializing with restaurant data...");
      const exportPath = path3.join(process.cwd(), "restaurants-export.json");
      if (fs3.existsSync(exportPath)) {
        const fileContent = JSON.parse(fs3.readFileSync(exportPath, "utf-8"));
        const data = fileContent.restaurants || fileContent;
        console.log(`\u{1F4E5} Loading ${data.length} restaurants...`);
        const batchSize = 50;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          await db.insert(restaurants).values(batch);
          console.log(`\u2705 Inserted ${i + batch.length}/${data.length} restaurants`);
        }
        console.log("\u2705 Database initialized successfully!");
      } else {
        console.log("\u26A0\uFE0F No restaurants-export.json found, database will remain empty");
      }
    } else {
      console.log(`\u2705 Database already has ${existingRestaurants.length} restaurants`);
    }
  } catch (error) {
    console.error("\u274C Database initialization failed:", error);
  }
}

// server/share-route.ts
import express3 from "express";
import path4 from "path";
import fs4 from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var router2 = express3.Router();
var ZIP_PATH = path4.resolve(__dirname, "../share/veganmapai-share.zip");
var MANIFEST_PATH = path4.resolve(__dirname, "../share/manifest.json");
router2.get("/share/zip", (_req, res) => {
  if (!fs4.existsSync(ZIP_PATH)) return res.status(404).send("zip missing");
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"'
  });
  res.sendFile(ZIP_PATH);
});
router2.head("/share/zip", (_req, res) => {
  if (!fs4.existsSync(ZIP_PATH)) return res.status(404).end();
  const { size, mtime } = fs4.statSync(ZIP_PATH);
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
    "Content-Length": String(size),
    "Last-Modified": mtime.toUTCString()
  });
  res.status(200).end();
});
router2.get("/share/manifest.json", (_req, res) => {
  if (!fs4.existsSync(MANIFEST_PATH)) return res.status(404).json({ error: "manifest missing" });
  res.set("Cache-Control", "no-store");
  res.sendFile(MANIFEST_PATH);
});
var share_route_default = router2;

// server/share-refresh.ts
import express4 from "express";
import { spawn } from "child_process";
import path5 from "path";
import fs5 from "fs";
var router3 = express4.Router();
var isRefreshing = false;
router3.post("/share/refresh", async (req, res) => {
  if (isRefreshing) {
    return res.status(429).json({
      error: "Refresh already in progress",
      code: 429,
      stdout: "",
      stderr: "Another refresh operation is currently running"
    });
  }
  isRefreshing = true;
  try {
    const scriptPath = path5.join(process.cwd(), "scripts", "safezip.sh");
    if (!fs5.existsSync(scriptPath)) {
      isRefreshing = false;
      return res.status(404).json({
        error: "Script not found",
        code: 404,
        stdout: "",
        stderr: `Script not found at ${scriptPath}`
      });
    }
    try {
      fs5.chmodSync(scriptPath, 493);
    } catch (chmodError) {
    }
    const child = spawn("bash", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"]
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    child.on("close", (code) => {
      isRefreshing = false;
      res.json({
        code: code || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
    child.on("error", (error) => {
      isRefreshing = false;
      res.status(500).json({
        error: "Script execution failed",
        code: 500,
        stdout: stdout.trim(),
        stderr: `Execution error: ${error.message}`
      });
    });
    setTimeout(() => {
      if (isRefreshing) {
        child.kill("SIGTERM");
        isRefreshing = false;
        res.status(408).json({
          error: "Script execution timeout",
          code: 408,
          stdout: stdout.trim(),
          stderr: "Script execution timed out after 120 seconds"
        });
      }
    }, 12e4);
  } catch (error) {
    isRefreshing = false;
    res.status(500).json({
      error: "Internal server error",
      code: 500,
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown error"
    });
  }
});
var share_refresh_default = router3;

// server/index.ts
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { Client as Client4 } from "@googlemaps/google-maps-services-js";
import client3 from "prom-client";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2, join } from "path";
import { readFileSync } from "fs";
var envPath = path6.join(process.cwd(), ".env");
var envExists = fs6.existsSync(envPath);
if (envExists) {
  console.log("\u{1F4C1} Loading environment from .env file:", envPath);
  config({ path: envPath });
} else {
  console.log("\u{1F510} Using environment variables from system/secrets");
}
function validateEnvironment() {
  const required = ["DATABASE_URL", "OPENAI_API_KEY", "GOOGLE_MAPS_API_KEY"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error("\u274C Missing environment variables:", missing);
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
  console.log("\u2705 All required environment variables loaded successfully");
}
validateEnvironment();
var reg = new client3.Registry();
reg.setDefaultLabels({ app: "veganmapai" });
client3.collectDefaultMetrics({
  register: reg,
  prefix: "veganmapai_",
  gcDurationBuckets: [0.05, 0.1, 0.2, 0.5, 1, 2]
});
var httpRequestDuration = new client3.Histogram({
  name: "veganmapai_http_request_duration_seconds",
  help: "HTTP request duration",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [reg]
});
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var app = express5();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express5.json({ limit: "1mb" }));
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on("finish", () => end({ status_code: String(res.statusCode) }));
  next();
});
var allowlist = [
  "https://www.veganmapai.ai",
  "https://veganmapai.ai",
  "https://vegan-map-ai-bkozarev.replit.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5000"
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    cb(null, allowlist.includes(origin));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
  res.setHeader("X-App-Commit", process.env.GIT_SHA ?? "dev");
  next();
});
app.get("/__ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use(share_route_default);
app.use(share_refresh_default);
var publicLimiter = rateLimit({ windowMs: 6e4, max: 60 });
var geoLimiter = rateLimit({ windowMs: 6e4, max: 10 });
app.get("/api/v1/healthz", publicLimiter, (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get(
  "/api/v1/version",
  publicLimiter,
  (req, res) => res.json({
    git_sha: process.env.GIT_SHA ?? "dev",
    node_env: process.env.NODE_ENV ?? "dev"
  })
);
app.get("/api/v1/openapi.json", publicLimiter, (req, res) => {
  const p = join(process.cwd(), "server", "api", "openapi.v1.json");
  res.type("application/json").send(readFileSync(p, "utf-8"));
});
var openapiPath = join(process.cwd(), "server", "api", "openapi.v1.json");
var openapiDoc = JSON.parse(readFileSync(openapiPath, "utf-8"));
var swaggerAuth = (req, res, next) => {
  if (process.env.NODE_ENV !== "production") return next();
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Docs"');
    return res.status(401).json({ error: "Authentication required" });
  }
  const credentials = Buffer.from(auth.slice(6), "base64").toString().split(":");
  const username = credentials[0];
  const password = credentials[1];
  if (username === process.env.SWAGGER_USER && password === process.env.SWAGGER_PASS) {
    return next();
  }
  res.setHeader("WWW-Authenticate", 'Basic realm="Swagger Docs"');
  return res.status(401).json({ error: "Invalid credentials" });
};
app.use("/api/v1/docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(openapiDoc));
var gmaps = new Client4({});
var geoCache2 = /* @__PURE__ */ new Map();
app.get("/api/v1/geocode", geoLimiter, async (req, res) => {
  try {
    const q = String(req.query.query ?? "").trim();
    if (!q) return res.status(400).json({ error: "query required" });
    if (geoCache2.has(q)) return res.json({ cached: true, result: geoCache2.get(q) });
    const r = await gmaps.geocode({
      params: { address: q, key: process.env.GOOGLE_MAPS_API_KEY }
    });
    geoCache2.set(q, r.data);
    res.json({ cached: false, result: r.data });
  } catch (e) {
    res.status(500).json({ error: e?.message ?? "geocode error" });
  }
});
app.get("/api/v1/restaurants/:id/reviews", publicLimiter, async (req, res) => {
  const id = String(req.params.id);
  res.json({ count: 0, items: [] });
});
app.get("/api/v1/admin/metrics", (req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    return req.headers["x-metrics-token"] === process.env.METRICS_TOKEN ? next() : res.status(401).end();
  }
  next();
}, async (req, res) => {
  res.set("Content-Type", reg.contentType);
  res.set("Cache-Control", "no-store");
  res.end(await reg.metrics());
});
app.get("/api/v1/map-data", publicLimiter, async (req, res) => {
  const qs = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
  req.url = "/restaurants/public/map-data" + qs;
  return apiRouter(req, res, () => {
  });
});
app.get("/api/v1/recommend", publicLimiter, (req, res, next) => {
  const qs = req.url.includes("?") ? req.url.substring(req.url.indexOf("?")) : "";
  req.url = "/recommend" + qs;
  req.originalUrl = req.originalUrl.replace("/api/v1/recommend", "/api/recommend");
  return apiRouter(req, res, next);
});
app.post("/api/v1/emergency-load", publicLimiter, (req, res, next) => {
  req.url = "/emergency-load";
  req.originalUrl = req.originalUrl.replace("/api/v1/emergency-load", "/api/emergency-load");
  return apiRouter(req, res, next);
});
app.post("/api/v1/seed-full", publicLimiter, async (req, res) => {
  try {
    console.log("V1 seed-full: Loading Sofia GeoJSON dataset");
    const geoPath = path6.join(process.cwd(), "backend", "geojson", "sofia.geojson");
    if (!fs6.existsSync(geoPath)) {
      console.error("V1 seed-full: Sofia GeoJSON file not found:", geoPath);
      return res.status(404).json({ ok: false, error: "Sofia GeoJSON file not found" });
    }
    const raw = fs6.readFileSync(geoPath, "utf-8");
    const geo = JSON.parse(raw);
    const features = geo.features || [];
    console.log(`V1 seed-full: Found ${features.length} features in GeoJSON`);
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    let inserted = 0;
    for (const f of features) {
      const props = f.properties || {};
      const coords = f.geometry?.coordinates || [0, 0];
      try {
        await storage2.createRestaurant({
          id: props.id ?? `sofia_${coords[1]}_${coords[0]}`,
          name: props.name ?? "Unknown Restaurant",
          latitude: coords[1].toString(),
          longitude: coords[0].toString(),
          veganScore: props.vegan_score?.toString() ?? "0",
          cuisineTypes: props.cuisine ? [props.cuisine] : [],
          city: "Sofia",
          country: "Bulgaria",
          address: props.address ?? "",
          phoneNumber: props.phone ?? null,
          websiteUrl: props.urls?.website ?? null,
          placeId: props.place_id ?? null
        });
        inserted++;
      } catch (error) {
        console.warn(`V1 seed-full: Skip restaurant ${props.name}:`, error.message);
      }
    }
    console.log(`V1 seed-full: Successfully inserted ${inserted} restaurants`);
    res.json({ ok: true, inserted, total_features: features.length });
  } catch (e) {
    console.error("V1 seed-full error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});
app.post("/api/v1/admin/ingest", async (req, res) => {
  try {
    if (req.headers["x-seed-token"] !== process.env.SEED_TOKEN) {
      console.warn("V1 admin/ingest: Invalid or missing seed token");
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }
    const items = Array.isArray(req.body?.restaurants) ? req.body.restaurants : [];
    console.log(`V1 admin/ingest: Processing ${items.length} restaurants`);
    const { storage: storage2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
    let inserted = 0;
    for (const r of items) {
      try {
        await storage2.createRestaurant({
          id: String(r.id ?? crypto.randomUUID()),
          name: r.name || "Unknown Restaurant",
          latitude: String(Number(r.latitude ?? r.lat ?? 0)),
          longitude: String(Number(r.longitude ?? r.lng ?? 0)),
          veganScore: r.veganScore ?? r.score ?? null,
          cuisineTypes: Array.isArray(r.cuisineTypes) ? r.cuisineTypes : [],
          city: r.city ?? "Sofia",
          country: r.country ?? "Bulgaria",
          address: r.address ?? "",
          phoneNumber: r.phoneNumber ?? r.phone ?? null,
          websiteUrl: r.websiteUrl ?? r.website ?? null,
          placeId: r.placeId ?? null
        });
        inserted++;
      } catch (error) {
        console.warn(`V1 admin/ingest: Skip restaurant ${r.name || r.id}:`, error.message);
      }
    }
    console.log(`V1 admin/ingest: Successfully inserted ${inserted} restaurants`);
    res.json({ ok: true, inserted, total_processed: items.length });
  } catch (e) {
    console.error("V1 admin/ingest error:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});
app.use("/api", apiRouter);
var clientDist = path6.join(process.cwd(), "client", "dist");
var distPath = path6.join(process.cwd(), "dist", "public");
if (fs6.existsSync(clientDist)) {
  app.use("/assets", express5.static(path6.join(clientDist, "assets"), { maxAge: "0", etag: false }));
  app.get(["/", "/index.html"], (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.sendFile(path6.join(clientDist, "index.html"));
  });
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/share/")) {
      if (req.path.startsWith("/api/")) {
        return res.status(404).json({ ok: false, error: "Not Found" });
      }
      return next();
    }
    res.set("Cache-Control", "no-store");
    res.sendFile(path6.join(clientDist, "index.html"));
  });
}
if (!fs6.existsSync(clientDist) && fs6.existsSync(distPath)) {
  app.use(express5.static(distPath, { maxAge: "0", etag: false }));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return res.status(404).json({ ok: false, error: "Not Found" });
    }
    res.set("Cache-Control", "no-store");
    res.sendFile(path6.join(distPath, "index.html"));
  });
}
app.use((err, _req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});
(async () => {
  const server = await registerRoutes(app);
  await initializeDatabase();
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const PORT = Number(process.env.PORT ?? 5e3);
  app.set("trust proxy", 1);
  server.listen({
    port: PORT,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    console.log(`\u{1F310} Server listening on port ${PORT}`);
    console.log(`\u{1F4CD} Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`\u{1F517} Local URL: http://localhost:${PORT}`);
    if (process.env.REPL_SLUG) {
      console.log(`\u{1F680} Replit URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.replit.app`);
    }
  });
})();
