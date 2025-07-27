import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { readFileSync } from "fs";
import path from "path";

// Sample restaurant data for Sofia
const sampleRestaurants = [
  {
    placeId: "sofia_rest_1",
    name: "Green Kitchen Sofia",
    address: "1421 София, ул. Раковски 127",
    latitude: "42.69990000",
    longitude: "23.16000000",
    phoneNumber: "+359 2 987 6543",
    website: "https://greenkitchen.bg",
    priceLevel: "$$",
    cuisineTypes: ["vegan", "mediterranean"],
    rating: "4.50",
    reviewCount: 127,
    veganScore: "8.50",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_2",
    name: "Veganarium",
    address: "1000 София, ул. Витоша 15",
    latitude: "42.70010000",
    longitude: "23.16050000",
    phoneNumber: "+359 2 846 1234",
    website: "https://veganarium.bg",
    priceLevel: "$$$",
    cuisineTypes: ["vegan", "international"],
    rating: "4.70",
    reviewCount: 89,
    veganScore: "9.20",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_3",
    name: "Buddha Bar Sofia",
    address: "1000 София, пл. Народно събрание 4",
    latitude: "42.69680000",
    longitude: "23.16120000",
    phoneNumber: "+359 2 980 8870",
    website: "https://buddhabar.bg",
    priceLevel: "$$$$",
    cuisineTypes: ["asian", "fusion"],
    rating: "4.20",
    reviewCount: 342,
    veganScore: "6.80",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_4",
    name: "Rainbow Pizza",
    address: "1463 София, ул. Г. М. Димитров 76",
    latitude: "42.69750000",
    longitude: "23.15850000",
    phoneNumber: "+359 2 963 2847",
    website: "https://rainbowpizza.bg",
    priceLevel: "$",
    cuisineTypes: ["pizza", "italian"],
    rating: "4.10",
    reviewCount: 156,
    veganScore: "7.20",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_5",
    name: "Healthy Corner",
    address: "1309 София, ул. Фритьоф Нансен 37",
    latitude: "42.70150000",
    longitude: "23.15720000",
    phoneNumber: "+359 2 846 5678",
    website: "https://healthycorner.bg",
    priceLevel: "$$",
    cuisineTypes: ["healthy", "salads"],
    rating: "4.60",
    reviewCount: 203,
    veganScore: "8.90",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_6",
    name: "BioFresh Sofia",
    address: "1164 София, ул. Боян Магесник 1",
    latitude: "42.69880000",
    longitude: "23.15950000",
    phoneNumber: "+359 2 865 1020",
    website: "https://biofresh.bg",
    priceLevel: "$",
    cuisineTypes: ["organic", "juice"],
    rating: "4.30",
    reviewCount: 95,
    veganScore: "7.80",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_7",
    name: "Pizza Palace",
    address: "1612 София, бул. Васил Левски 75",
    latitude: "42.69580000",
    longitude: "23.15680000",
    phoneNumber: "+359 2 943 2156",
    website: "https://pizzapalace.bg",
    priceLevel: "$",
    cuisineTypes: ["pizza", "fast food"],
    rating: "3.80",
    reviewCount: 278,
    veganScore: "3.50",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_8",
    name: "Sushi Zone",
    address: "1164 София, ул. Шишман 12",
    latitude: "42.69420000",
    longitude: "23.15580000",
    phoneNumber: "+359 2 987 3421",
    website: "https://sushizone.bg",
    priceLevel: "$$$",
    cuisineTypes: ["sushi", "japanese"],
    rating: "4.40",
    reviewCount: 167,
    veganScore: "5.80",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_9",
    name: "Burger King Sofia",
    address: "1000 София, бул. Витоша 2",
    latitude: "42.69450000",
    longitude: "23.15420000",
    phoneNumber: "+359 2 811 0505",
    website: "https://burgerking.bg",
    priceLevel: "$",
    cuisineTypes: ["fast food", "burgers"],
    rating: "3.90",
    reviewCount: 892,
    veganScore: "2.10",
    isVerified: false,
  },
  {
    placeId: "sofia_rest_10",
    name: "Green Paradise",
    address: "1000 София, ул. Граф Игнатиев 2",
    latitude: "42.69320000",
    longitude: "23.15380000",
    phoneNumber: "+359 2 980 1234",
    website: "https://greenparadise.bg",
    priceLevel: "$$",
    cuisineTypes: ["vegan", "raw"],
    rating: "4.80",
    reviewCount: 76,
    veganScore: "9.70",
    isVerified: false,
  }
];

async function seedDatabase() {
  try {
    // Check if restaurants already exist
    const existingRestaurants = await storage.getRestaurantsNearby(42.7, 23.16, 10);
    
    if (existingRestaurants.length === 0) {
      console.log('Seeding database with sample restaurants...');
      
      for (const restaurant of sampleRestaurants) {
        await storage.createRestaurant(restaurant);
      }
      
      console.log(`Seeded ${sampleRestaurants.length} restaurants into database`);
    } else {
      console.log(`Database already contains ${existingRestaurants.length} restaurants`);
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Seed database with sample data
  await seedDatabase();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Restaurant routes
  app.get('/api/restaurants/nearby', async (req, res) => {
    try {
      const { lat, lng, radius = 2 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lng as string);
      const radiusKm = parseFloat(radius as string);

      console.log(`Getting restaurants in radius: lat=${latitude}, lng=${longitude}, radius=${radiusKm}km`);

      const restaurants = await storage.getRestaurantsNearby(latitude, longitude, radiusKm);
      
      console.log(`Returning ${restaurants.length} restaurants within ${radiusKm}km`);
      
      res.json(restaurants);
    } catch (error) {
      console.error("Error fetching nearby restaurants:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.get('/api/restaurants/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const restaurant = await storage.getRestaurant(id);
      
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      res.json(restaurant);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      res.status(500).json({ message: "Failed to fetch restaurant" });
    }
  });

  // Vegan score routes
  app.get('/api/restaurants/:id/vegan-score', async (req, res) => {
    try {
      const { id } = req.params;
      const breakdown = await storage.getVeganScoreBreakdown(id);
      
      if (!breakdown) {
        return res.status(404).json({ message: "Vegan score breakdown not found" });
      }

      res.json(breakdown);
    } catch (error) {
      console.error("Error fetching vegan score breakdown:", error);
      res.status(500).json({ message: "Failed to fetch vegan score breakdown" });
    }
  });

  // User favorites routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = req.body;
      
      const favorite = await storage.addUserFavorite({
        userId,
        restaurantId
      });
      
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:restaurantId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = req.params;
      
      await storage.removeUserFavorite(userId, restaurantId);
      res.json({ message: "Favorite removed" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // Setup Vite dev server for development
  if (process.env.NODE_ENV === 'development') {
    const vite = await (await import("vite")).createServer({
      server: { middlewareMode: true },
      appType: "custom",
      base: "/",
    });

    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      if (req.originalUrl.startsWith("/api/")) {
        return next();
      }

      try {
        const url = req.originalUrl;
        let template = readFileSync(path.join(process.cwd(), "client/index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production mode - serve static files
    app.use(express.static(path.join(process.cwd(), "dist/public")));
    
    app.get("*", (req, res) => {
      if (req.originalUrl.startsWith("/api/")) {
        return res.status(404).json({ message: "API route not found" });
      }
      res.sendFile(path.join(process.cwd(), "dist/public", "index.html"));
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
}