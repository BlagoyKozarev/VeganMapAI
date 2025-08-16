# VeganMapAI API Documentation

## 🔐 Authentication

All protected endpoints require user to be logged in via Replit Auth.

### Login Flow
```bash
# Start login
GET /api/login
→ Redirects to Replit OAuth

# After successful login
GET /api/callback
→ Returns to app with session

# Check current user
GET /api/auth/user
→ Returns user data or 401 if not logged in

# Logout
GET /api/logout
→ Clears session and redirects
```

---

## 🏪 Restaurant Endpoints

### Get All Restaurants with AI Scores
```bash
GET /api/restaurants/all-available
```
**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Restaurant Name",
    "address": "Full address",
    "latitude": "42.123456",
    "longitude": "23.123456",
    "phoneNumber": "+359...",
    "website": "https://...",
    "cuisineTypes": ["restaurant", "food"],
    "rating": 4.2,
    "reviewCount": 150,
    "veganScore": "7.50",
    "isVerified": true
  }
]
```

### Search Restaurants
```bash
POST /api/restaurants/search
Content-Type: application/json

{
  "query": "vegan pasta",
  "location": {
    "lat": 42.7,
    "lng": 23.16
  },
  "radius": 5000,
  "minVeganScore": 6.0,
  "cuisineTypes": ["italian"]
}
```

### Add to Favorites
```bash
POST /api/restaurants/favorite
Content-Type: application/json
Authorization: Required (logged in user)

{
  "restaurantId": "uuid"
}
```

### Remove from Favorites
```bash
DELETE /api/restaurants/favorite/:restaurantId
Authorization: Required (logged in user)
```

### Get User's Favorites
```bash
GET /api/restaurants/favorites
Authorization: Required (logged in user)
```

---

## 🤖 AI Chat Endpoints

### Voice Chat (Whisper + GPT-4o)
```bash
POST /api/audio
Content-Type: multipart/form-data
Authorization: Required (logged in user)

FormData:
- audio: <audio file (mp3, wav, m4a)>
```

**Response:**
```json
{
  "text": "Transcribed user speech",
  "reply": "AI assistant response in Bulgarian"
}
```

### Chat History
```bash
GET /api/chat/history
Authorization: Required (logged in user)
```

**Response:**
```json
[
  {
    "id": 1,
    "message": "User question",
    "response": "AI response", 
    "createdAt": "2025-02-02T10:00:00.000Z"
  }
]
```

---

## 👤 User Profile Endpoints

### Create/Update Profile
```bash
POST /api/user/profile
Content-Type: application/json
Authorization: Required (logged in user)

{
  "dietaryPreferences": ["vegan", "vegetarian"],
  "allergies": ["nuts", "gluten"],
  "cuisinePreferences": ["italian", "asian"],
  "priceRange": "moderate"
}
```

### Get Profile
```bash
GET /api/user/profile
Authorization: Required (logged in user)
```

**Response:**
```json
{
  "id": 1,
  "userId": "user-uuid",
  "dietaryPreferences": ["vegan"],
  "allergies": ["nuts"],
  "cuisinePreferences": ["italian"],
  "priceRange": "moderate"
}
```

---

## 🗺️ Geolocation Endpoints

### Nearby Restaurants
```bash
GET /api/restaurants/nearby?lat=42.7&lng=23.16&radius=2000
```

### Geocode Address
```bash
POST /api/geocode
Content-Type: application/json

{
  "address": "Sofia, Bulgaria"
}
```

**Response:**
```json
{
  "lat": 42.6977082,
  "lng": 23.3218675,
  "formatted_address": "Sofia, Bulgaria"
}
```

---

## 📊 Vegan Score System

### Score Calculation
Restaurants scored on 6 dimensions (1-10 scale):

1. **Menu Variety** - Vegan options available
2. **Ingredient Clarity** - Clear vegan labeling  
3. **Staff Knowledge** - Understanding of vegan needs
4. **Cross-contamination Prevention** - Separate preparation
5. **Nutritional Information** - Calorie/macro data
6. **Allergen Management** - Allergen handling protocols

**Final Score**: Average of all dimensions

### Score Ranges:
- **8.5-10**: Excellent (Green)
- **7.5-8.4**: Very Good (Light Green)
- **6.5-7.4**: Good (Yellow)
- **5.5-6.4**: Fair (Orange)
- **0-5.4**: Poor (Red)

---

## ⚠️ Error Handling

### Standard Error Response:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional details if available"
}
```

### Common Status Codes:
- **200**: Success
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (not logged in)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## 🔧 Rate Limiting

- **Google Places API**: Cached with geo-hash
- **OpenAI API**: 50 requests/minute per user
- **General API**: 100 requests/minute per IP

---

## 🌍 Supported Languages

- **Primary**: Bulgarian
- **Secondary**: English
- **AI Chat**: Responds in user's language

---

## 📱 Mobile Considerations

- All endpoints support mobile browsers
- Touch-optimized voice recording
- PWA offline functionality
- Responsive data formats

---

For implementation examples, see `/backend` source code.