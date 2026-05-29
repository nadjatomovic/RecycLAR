# RecycLAR

> **Skeniraj. Loči. Uči se.**  
> Point your camera at waste. Find out exactly which bin it belongs in.

RecycLAR is a mobile app for identifying waste items and telling users exactly where to throw them — with
municipality-specific bin rules and guidance from the mascot Lari.

---

## What the app does

The core of RecycLAR is a single interaction:

1. Users points their camera at a piece of waste
2. Taps the scan button
3. The app says: **"Plastenka PET → Rumeni zabojnik"** + a practical tip from Lari

Everything else in the app supports and extends that interaction.

---

## Phases

### Phase 1 — The Scanner (current focus)
The scanner is the product. Everything else is secondary.

- Camera screen with scan button
- AI identifies the waste item (Google Gemini Vision)
- Shows the correct bin, bin color, and Lari's tip
- Municipality-aware — rules differ between Maribor, Ljubljana, etc.

### Phase 2 — Quiz (next)
Built on the same Gemini integration as the scanner.

- AI-generated recycling knowledge questions
- Points (eko točke) for correct answers
- Class leaderboard so students compete

### Phase 3 — Everything else (later)
- Map of nearby EKO otoki
- Badges and achievements
- Streak counter
- Push notifications

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Mobile | React Native + Expo SDK 51 | Team knows React/JS |
| Navigation | Expo Router v3 | File-based, like Next.js |
| Styling | NativeWind v4 | Tailwind CSS on mobile |
| Camera | Expo Camera | Built-in, simple to set up |
| Animations | Reanimated 3 | Smooth result card transitions |
| Backend | Node.js + Express + TypeScript | Team knows JavaScript |
| Database | PostgreSQL via Supabase | Free, reliable |
| AI | Google Gemini 1.5 Flash | Free tier, vision-capable |
| Auth | Firebase Authentication | Free, Google SSO for schools |
| Hosting | Render | Free tier, easy deploys |
 
Phase 2 will add Redis (Upstash) for leaderboards and Socket.IO for real-time updates.
---

## Project Structure

```
recyclar/
├── apps/
│   ├── mobile/                  # React Native + Expo app
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login.tsx    # Firebase Google SSO
│   │   │   └── (tabs)/
│   │   │       ├── index.tsx    # Home — scan prompt
│   │   │       └── skeniraj.tsx # Camera + result card
│   │   ├── components/
│   │   │   ├── scanner/         # Camera overlay, result card
│   │   │   └── lari/            # Mascot avatar + tip bubble
│   │   ├── store/
│   │   │   └── useAuthStore.ts  # User session + municipality
│   │   ├── services/
│   │   │   ├── api.ts           # Axios instance + auth header
│   │   │   └── scanService.ts   # POST /scan
│   │   └── constants/
│   │       └── waste.ts         # Bin colors, category labels
│   │
│   └── backend/                 # Node.js + Express API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── auth.routes.ts    # POST /auth/verify
│       │   │   └── scan.routes.ts    # POST /scan
│       │   ├── controllers/
│       │   │   ├── auth.controller.ts
│       │   │   └── scan.controller.ts
│       │   ├── services/
│       │   │   └── scanService.ts    # Gemini API call + response parsing
│       │   └── middleware/
│       │       ├── auth.middleware.ts     # Firebase token verification
│       │       └── validate.middleware.ts # Zod request validation
│       └── prisma/
│           └── schema.prisma     # Database schema
│
└── packages/
    └── shared/                  # Shared TypeScript types (ScanResult etc.)
```

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Expo Go** app on your phone — for development only
- Free accounts on: Supabase, Firebase, Google AI Studio, Render

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/recyclar.git
cd recyclar
npm install
```

### 2. Set up environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/mobile/.env.example apps/mobile/.env
# Fill in your values — see Environment Variables below
```

### 3. Set up the database

```bash
cd apps/backend
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Start the backend

```bash
cd apps/backend
npm run dev
# Runs on http://localhost:3000
```

### 5. Start the mobile app

```bash
cd apps/mobile
npx expo start
# Scan the QR code with Expo Go on your phone
```

> **Scanner note:** The camera requires an Expo Dev Build, not Expo Go.
> When you reach that step run `npx expo run:android` or `npx expo run:ios`.
> This only needs to be done once.

---

## Environment Variables

### apps/backend/.env

```bash
# Database (Supabase → Settings → Database → Connection string)
DATABASE_URL="postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres"

# Firebase Admin SDK (Firebase Console → Project Settings → Service Accounts)
FIREBASE_PROJECT_ID="recyclar-app"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@recyclar-app.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Google Gemini (aistudio.google.com → Get API Key)
GEMINI_API_KEY="AIza..."

# App
PORT=3000
NODE_ENV="development"
```

### apps/mobile/.env

```bash
# Your backend URL
EXPO_PUBLIC_API_URL="http://localhost:3000"

# Firebase client config (Firebase Console → Project Settings → Your apps)
EXPO_PUBLIC_FIREBASE_API_KEY="AIza..."
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="recyclar-app.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="recyclar-app"
EXPO_PUBLIC_FIREBASE_APP_ID="1:..."
```

---

## API — Phase 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/verify` | Verify Firebase token, create user if new |
| POST | `/scan` | Send image, get back waste type + bin + tip |

All endpoints require `Authorization: Bearer {firebase_token}` header.

### POST /scan

**Request:**
```json
{
  "imageBase64": "...",
  "municipality": "Maribor"
}
```

**Response:**
```json
{
  "item": "Plastenka PET",
  "category": "Embalaža",
  "bin": "Rumeni zabojnik",
  "binColor": "yellow",
  "confidence": 0.97,
  "tip": "Stisni plastenko in odstrani pokrovček, če je možno."
}
```

---

## Slovenian Bin Rules

| Bin | Color | Accepts |
|-----|-------|---------|
| Rumeni zabojnik | Yellow | Plastic bottles, cans, packaging, Tetra Pak |
| Modri zabojnik | Blue | Paper, cardboard, newspapers |
| Zeleni zabojnik | Green | Glass bottles and jars |
| Rjavi zabojnik | Brown | Food waste, organic material |
| Črni zabojnik | Black | Everything else |

Rules are municipality-aware. Municipality is set at registration and
sent with every scan request.

---

## Build and Distribution

### Development
```bash
npx expo start        # Expo Go (UI only, no camera)
npx expo run:android  # Dev Build with camera support
npx expo run:ios      # Dev Build with camera support (requires Mac)
```

### Pilot distribution (free)
```bash
# Android — build APK, share the file directly with students
eas build --platform android --profile preview

# iOS — build for TestFlight (up to 10,000 testers, free)
eas build --platform ios --profile preview
eas submit --platform ios  # uploads to TestFlight
```

### Public store release
```bash
eas build --platform all --profile production
eas submit --platform all
```

Requires: Google Play Developer account ($25 one-time) and/or
Apple Developer account ($99/year).


### Backend — Render

> The free tier server sleeps after 15 minutes of inactivity.
> The first request of the day takes ~30 seconds to wake up.
> This is acceptable for a school-hours usage pattern.
