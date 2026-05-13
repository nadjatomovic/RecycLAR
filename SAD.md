# Software Architecture Document (SAD)
## RecycLAR — Gamified Recycling Education App

---

## Table of Contents

1. Introduction
2. Product Vision and Phases
3. Architecture Goals and Constraints
4. System Context
5. Architecture Overview
6. Phase 1 — Scanner Architecture
7. Phase 2 — Quiz and Gamification (planned)
8. Data Architecture
9. Integration Architecture
10. Security Architecture
11. Deployment and Distribution
12. Architecture Decision Records (ADRs)
13. Quality Attributes
14. Risks and Technical Debt

---

## 1. Introduction

### 1.1 Purpose

This document describes the software architecture of RecycLAR — a mobile
application that helps people sort waste correctly
by pointing their camera at an item and receiving instant guidance.


### 1.2 The Core Idea

RecycLAR does one thing first, and does it well:

> A user points their camera at a piece of waste.  
> The app identifies it and says: **"Plastenka PET → Rumeni zabojnik."**  
> That's it.

The quiz, leaderboard, map, and gamification layer are valuable additions
but they are Phase 2 and Phase 3. 

### 1.3 Definitions

| Term | Definition |
|------|-----------|
| Eko točke | "Eco points" — in-app reward currency (Phase 2) |
| EKO otok | Physical recycling collection island (Phase 3) |
| Lestvica | Slovenian for "leaderboard" (Phase 2) |
| Kviz | Slovenian for "quiz" (Phase 2) |
| Skeniraj | Slovenian for "scan" — the core Phase 1 feature |
| Lari | The app mascot character |
| Municipality | A Slovenian administrative unit (e.g. Maribor, Ljubljana) |
| SAD | Software Architecture Document |
| ADR | Architecture Decision Record |

---

## 2. Product Vision and Phases

### Phase 1 — Scanner (current)

**Goal:** A working, accurate waste scanner that tells users which bin
to use, with municipality-specific rules.

**In scope:**
- Login with Firebase (to capture municipality)
- Camera screen with scan button
- Gemini Vision call on backend
- Result card: item name, bin name, bin color, Lari's tip
- Scan history saved to database

**Out of scope for Phase 1:**
- Points, leaderboard, badges
- Quiz
- Map
- Push notifications

**Definition of done for Phase 1:**
A user can open the app, log in, point the camera at a plastic bottle,
and receive the correct bin name and a practical tip within 3 seconds.

---

### Phase 2 — Quiz and Gamification (next)

Shares the Gemini integration already built in Phase 1.

**Additions:**
- Gemini generates recycling quiz questions by topic
- Points (eko točke) awarded for scans and correct quiz answers
- Class leaderboard (Redis sorted sets, real-time via Socket.IO)
- Streak counter on user profile
- Badges for milestones

**New infrastructure needed:**
- Redis via Upstash (leaderboards)
- Socket.IO on backend (real-time updates)

---

### Phase 3 — Map and Polish (later)

**Additions:**
- Map of nearby EKO otoki (OpenStreetMap, no API key needed)
- Push notifications (Firebase Cloud Messaging)
- Onboarding flow
- Offline graceful degradation

---

## 3. Architecture Goals and Constraints

### 3.1 Goals

| Goal | Description |
|------|-------------|
| **Scanner first** | Phase 1 architecture must not be complicated by Phase 2 features |
| **Zero cost** | All infrastructure runs on free tiers |
| **Cross-platform** | Single codebase for iOS and Android |
| **Municipality-aware** | Waste rules differ by municipality; always pass municipality context |
| **Security** | API keys never exposed to the mobile app |
| **Simplicity** | A small team must understand and extend the codebase |

### 3.2 Constraints

| Constraint | Impact |
|------------|--------|
| Free hosting (Render) | Server sleeps after 15 min inactivity, ~30s cold start |
| Gemini free tier | 1,500 AI requests/day — sufficient for school pilot |
| Expo Dev Build | Camera scanner cannot run in Expo Go; requires one-time build step |
| App store costs | Google Play $25 (one-time), App Store $99/year — unavoidable for public launch |
| No paid services | Every third-party integration must have a usable free tier |

### 3.3 Distribution Strategy

Users never see or install Expo Go. The app is a fully compiled,
standard native application.

| Stage | Platform | Method | Cost |
|-------|----------|--------|------|
| Pilot | Android | Direct APK file | Free |
| Pilot | iOS | TestFlight (up to 10,000 testers) | Free |
| Public | Android | Google Play Store | $25 one-time |
| Public | iOS | Apple App Store | $99/year |

---

## 4. System Context

```
┌──────────────────────────────────────────────┐
│                External Actors               │
│                                              │
│  [Student]  ──→  [RecycLAR App]              │
│                                              │
└──────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────┐
│           RecycLAR System Boundary           │
│                                              │
│   [Mobile App]  ←──→  [Backend API]          │
│                            │                 │
│                      [PostgreSQL]            │
│                                              │
└──────────────────────────────────────────────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
   [Firebase Auth]  [Gemini API]  [Supabase]
```

### 4.1 External Systems — Phase 1

| System | Provider | Purpose |
|--------|----------|---------|
| Firebase Auth | Google | Login and token management |
| Gemini 1.5 Flash | Google | AI waste identification from image |
| Supabase | Supabase Inc. | Managed PostgreSQL database |

### 4.2 External Systems — Phase 2 additions

| System | Provider | Purpose |
|--------|----------|---------|
| Upstash Redis | Upstash Inc. | Class leaderboard sorted sets |
| Firebase Cloud Messaging | Google | Push notifications |

### 4.3 External Systems — Phase 3 additions

| System | Provider | Purpose |
|--------|----------|---------|
| OpenStreetMap | OSM Foundation | Map tiles (no API key, completely free) |

---

## 5. Architecture Overview

RecycLAR uses a standard **client-server architecture**.

The mobile app handles UI and camera capture.
The backend handles all AI calls, business logic, and data storage.
No AI keys ever touch the mobile device.

```
┌──────────────────────────────────────────────────┐
│              MOBILE (React Native + Expo)         │
│                                                   │
│  Screens (Expo Router)                            │
│  State (Zustand + TanStack Query)                 │
│  Camera (Expo Camera)                             │
│  HTTP calls (Axios)                               │
└──────────────────────┬───────────────────────────┘
                       │  HTTPS
┌──────────────────────▼───────────────────────────┐
│              BACKEND (Node.js + Express)          │
│                                                   │
│  Routes → Controllers → Services                  │
│  Auth middleware (Firebase token verify)          │
│  Validation middleware (Zod)                      │
│  Gemini API integration                           │
│  Prisma ORM                                       │
└──────────────────────┬───────────────────────────┘
                       │
                 ┌─────▼──────┐
                 │ PostgreSQL │
                 │ (Supabase) │
                 └────────────┘
```

---

## 6. Phase 1 — Scanner Architecture

### 6.1 Mobile Screens (Phase 1 only)

```
app/
├── (auth)/
│   └── login.tsx          Firebase Google SSO + municipality selection
└── (tabs)/
    ├── index.tsx           Home — prompts user to start scanning
    └── skeniraj.tsx        Camera + result card
```

Navigation is handled by Expo Router. File path = URL route.
No manual navigation configuration needed.

### 6.2 Mobile State (Phase 1)

Only one Zustand store is needed in Phase 1:

```ts
// useAuthStore.ts
{
  user: {
    uid: string
    name: string
    email: string
    municipality: string   // "Maribor" — drives bin rules
  } | null
  token: string | null     // Firebase JWT
  setUser: (user, token) => void
  logout: () => void
}
```

TanStack Query manages the scan API call state (loading, error, result).
No additional stores are needed in Phase 1.

### 6.3 Scan Flow

```
MOBILE                          BACKEND                    GEMINI
──────                          ───────                    ──────

User taps Slikaj
  │
takePictureAsync()
  {base64, quality: 0.6}
  │
POST /scan
  {imageBase64, municipality}
  ├── Authorization: Bearer token
  └─────────────────────────────→ verifyFirebaseToken()
                                  validateRequest(Zod)
                                       │
                                       │  image + Slovenian prompt
                                       └──────────────────────────→
                                                                   │
                                       ←──────────────────────────┘
                                  parseResponse()
                                  handleLowConfidence()
                                  saveScanToDb()
                                       │
  ←─────────────────────────────────── │
  {
    item, bin, binColor,
    confidence, tip
  }
  │
showResultCard()
```

### 6.4 Backend Components (Phase 1)

```
routes/
  auth.routes.ts       POST /auth/verify
  scan.routes.ts       POST /scan

controllers/
  auth.controller.ts   Create/find user from Firebase UID
  scan.controller.ts   Orchestrate scan: validate → Gemini → save → respond

services/
  scanService.ts       Call Gemini Vision API, parse JSON response

middleware/
  auth.middleware.ts   Verify Firebase JWT, populate req.user
  validate.ts          Zod schema validation on request body
```

### 6.5 The Gemini Prompt

The prompt is the core of the AI scanner. It is written in Slovenian
and instructs Gemini to return strictly structured JSON.

```ts
const prompt = `
  You are a waste sorting assistant for Slovenian schools.
  The user lives in the municipality of ${municipality}.

  Look at this image and identify the waste item.

  Respond ONLY with valid JSON, no markdown, no explanation:
  {
    "item": "Item name in Slovenian (e.g. Plastenka PET)",
    "category": "Embalaža | Papir | Steklo | Bio odpadki | Mešani odpadki",
    "bin": "Correct bin name (e.g. Rumeni zabojnik)",
    "binColor": "yellow | blue | green | brown | black",
    "confidence": 0.95,
    "tip": "One practical tip in Slovenian, max 12 words"
  }

  Slovenian bin rules:
  - Rumeni zabojnik (yellow): plastic, cans, packaging, Tetra Pak
  - Modri zabojnik (blue): paper, cardboard, newspapers
  - Zeleni zabojnik (green): glass bottles and jars
  - Rjavi zabojnik (brown): food waste, organic material
  - Črni zabojnik (black): everything else

  If you cannot identify a clear waste item, set confidence below 0.5
  and use category "Mešani odpadki".
`
```

**The prompt is the model.** Improving classification accuracy means
improving the prompt — not retraining anything.

### 6.6 Low Confidence Handling

When Gemini returns `confidence < 0.6`, the app always gives
a safe, usable answer rather than showing an error:

```ts
if (result.confidence < 0.6) {
  return {
    item: 'Neznan odpadek',
    bin: 'Črni zabojnik',
    binColor: 'black',
    tip: 'Nisem prepričan — odloži v črni zabojnik ali vprašaj učitelja.',
    confidence: result.confidence
  }
}
```

---

## 7. Phase 2 — Quiz and Gamification (planned)

This section documents the planned architecture for Phase 2.
Nothing here should be built until Phase 1 is complete and tested.

### 7.1 New backend services

| Service | Responsibility |
|---------|---------------|
| `quizService` | Prompt Gemini to generate quiz questions by topic |
| `gamificationService` | Award points for scans and correct quiz answers |
| `leaderboardService` | Read/write Redis sorted sets for class rankings |
| `notificationService` | Send push notifications via Firebase Cloud Messaging |

### 7.2 New infrastructure

| Addition | Why |
|----------|-----|
| Upstash Redis | Sorted sets for real-time class leaderboards |
| Socket.IO | Push leaderboard updates to all connected students |

### 7.3 New API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/quiz` | Get AI-generated quiz for a topic |
| POST | `/quiz/:id/answer` | Submit answer, receive points |
| GET | `/leaderboard` | Class or individual rankings |
| GET | `/user/me` | Profile, points, badges, streak |

### 7.4 Quiz flow

The quiz uses the same Gemini integration as the scanner —
instead of an image, a topic string is sent:

```ts
const prompt = `
  Generate a recycling quiz question for Slovenian students aged 12-14.
  Topic: ${topic}
  Municipality: ${municipality}

  Respond ONLY with valid JSON:
  {
    "question": "Question text in Slovenian",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 1,
    "explanation": "Brief explanation in Slovenian"
  }
`
```

---

## 8. Data Architecture

### 8.1 Phase 1 Database Schema

Only the tables needed for Phase 1 are created initially.
Phase 2 tables are added via new migrations when needed.

**Users**
```
id             UUID (PK)
firebaseUid    String (unique)
name           String
email          String (unique)
municipality   String          "Maribor"
createdAt      DateTime
```

**Scans**
```
id             UUID (PK)
userId         UUID (FK → User)
wasteType      String          "Plastenka PET"
wasteCategory  String          "Embalaža"
binColor       String          "Rumeni zabojnik"
confidence     Float
tip            String
municipality   String
createdAt      DateTime
```

### 8.2 Phase 2 additions to schema

**QuizSessions**
```
id             UUID (PK)
userId         UUID (FK → User)
topic          String
score          Int
total          Int
pointsEarned   Int
completedAt    DateTime
```

**Badges, UserBadges** — seeded badge definitions and earned records.

**Users table additions:**
```
ekoPoints      Int (default 0)
streak         Int (default 0)
groupName      String          "7.B"
lastActiveAt   DateTime
```

### 8.3 Phase 2 Redis structure

```
# Weekly class leaderboard — sorted set
leaderboard:weekly:{year}:{week}:class
  ZADD groupName score

# Weekly individual leaderboard
leaderboard:weekly:{year}:{week}:user
  ZADD userId score

# Keys expire automatically after 30 days via TTL
```

---

## 9. Integration Architecture

### 9.1 Firebase Authentication

1. Mobile calls Firebase SDK → Google OAuth
2. Firebase returns a JWT token to the mobile app
3. Token stored in Zustand, persisted via AsyncStorage
4. Every API request: `Authorization: Bearer {token}`
5. Backend middleware: `firebase-admin.auth().verifyIdToken(token)`
6. Valid → `req.user = { uid, email, name }`
7. Invalid → `401 Unauthorized`

Firebase tokens expire after 1 hour. The Firebase SDK refreshes them
automatically. The Axios interceptor always reads the latest token.

### 9.2 Gemini Vision API

- **Called from:** `apps/backend/src/services/scanService.ts` only
- **Model:** `gemini-1.5-flash`
- **Input:** base64 JPEG + Slovenian text prompt
- **Free tier:** 1,500 requests/day — sufficient for school pilot
- **Rate limiting:** 10 scans per user per hour (enforced in middleware)
- **Key location:** Backend `.env` only — never in mobile app

### 9.3 Image handling

Images are compressed on the mobile device before sending:
- Quality: 0.6 (JPEG)
- Result: ~100KB per image
- Reason: faster API calls, lower Gemini latency, stays within free tier

Images are not stored permanently in Phase 1. If scan history with
images is needed, Supabase Storage will be added in Phase 2.

---

## 10. Security Architecture

### 10.1 API Key Protection

All secret keys live on the backend server as environment variables.
The mobile app never holds a Gemini, Supabase, or Firebase Admin key.

The mobile app only holds Firebase client-side configuration, which
is safe to expose — it identifies the Firebase project but grants no
admin access.

### 10.2 Request Authentication

Every API endpoint requires a valid Firebase JWT.
The `auth.middleware.ts` verifies every request before it reaches
a controller.

### 10.3 Input Validation

All request bodies are validated with Zod before processing.
Invalid requests return `400 Bad Request` immediately.

Scan requests are additionally validated:
- `imageBase64` must be a non-empty string (max 600KB base64)
- `municipality` must be a non-empty string

### 10.4 Rate Limiting

| Endpoint | Limit | Reason |
|----------|-------|--------|
| POST /scan | 10/user/hour | Protect Gemini daily quota |
| All endpoints | 100/IP/minute | Prevent abuse |

### 10.5 Student Privacy

- No student real names appear on any public or shared screen
- No social features, no direct messaging
- Municipality stored as a plain string, not GPS coordinates
- Scan images not stored by default in Phase 1

---

## 11. Deployment and Distribution

### 11.1 Backend — Render (free tier)

```
GitHub push → Render auto-deploy
  Build: npm ci && prisma generate && prisma migrate deploy && npm run build
  Start: node dist/index.js
  Port: 3000
```

Cold start behaviour: server sleeps after 15 minutes of inactivity.
First request of the day triggers a ~30-second wake-up.
Acceptable for school-hours usage (wakes with first morning user).

### 11.2 Mobile App — Expo EAS

The compiled app is a fully native iOS/Android application.
Users never see or install Expo Go.

```
Development:   npx expo start          → Expo Go (no camera)
               npx expo run:android    → Dev Build (camera works)

Pilot:         eas build --profile preview
               → Android: .apk file, share directly (free)
               → iOS: TestFlight via eas submit (free, up to 10k testers)

Production:    eas build --profile production
               eas submit
               → Google Play ($25 one-time)
               → App Store ($99/year)
```

### 11.3 CI/CD — GitHub Actions

On every push to `main`:
1. Install dependencies
2. Run TypeScript type check
3. Run tests
4. If tagged `v*.*.*`: trigger EAS build

---

## 12. Architecture Decision Records (ADRs)

### ADR-001: Scanner is Phase 1, quiz is Phase 2

**Status:** Accepted  
**Decision:** Build and ship a working scanner before adding quiz,
leaderboard, or gamification.  
**Rationale:** The scanner is the unique value of the app. The quiz is
a supporting feature. Building both simultaneously risks shipping neither
well. A working scanner can be piloted immediately; quiz adds retention.  
**Consequences:** Phase 1 architecture is simpler. Redis, Socket.IO, and
leaderboard infrastructure are deferred.

---

### ADR-002: React Native over Flutter

**Status:** Accepted  
**Decision:** React Native with Expo.  
**Rationale:** The team has existing React and JavaScript knowledge.
Flutter requires learning Dart from scratch, adding weeks of ramp-up.
React Native's new architecture (JSI/Fabric) resolves historical
performance concerns.  
**Consequences:** Team productive immediately. Flutter performance
advantages foregone but not needed at this scale.

---

### ADR-003: Gemini Vision over on-device ML Kit

**Status:** Accepted  
**Decision:** Google Gemini 1.5 Flash via backend API.  
**Rationale:** ML Kit returns generic English labels ("Bottle").
Gemini understands context — it knows a Tetra Pak carton from a
plastic bottle, responds in Slovenian, and handles edge cases without
any training data. The prompt is the model.  
**Consequences:** Requires internet for scanning. Gemini daily quota
limits scale. Improving accuracy = improving the prompt.

---

### ADR-004: Gemini API called from backend only

**Status:** Accepted  
**Decision:** All Gemini calls go through the Node.js backend.  
**Rationale:** API keys in mobile app bundles are extractable.
Backend keeps the key secret and enforces rate limiting.  
**Consequences:** Every scan requires a network round-trip. No offline
scanning.

---

### ADR-005: All-free infrastructure

**Status:** Accepted  
**Decision:** Supabase, Upstash, Firebase, Render, Expo EAS, Gemini —
all free tiers.  
**Rationale:** Pre-revenue pilot phase. Zero financial risk.  
**Consequences:** Render cold-start latency. Gemini daily limits.
Clear upgrade path when the pilot scales.

---

### ADR-006: OpenStreetMap over Google Maps (Phase 3)

**Status:** Accepted (deferred to Phase 3)  
**Decision:** OpenStreetMap tiles via react-native-maps UrlTile.  
**Rationale:** Google Maps charges per map load. OpenStreetMap
is completely free with no API key.  
**Consequences:** Less polished map style. No address autocomplete
(Nominatim can be added later, also free).

---

## 13. Quality Attributes

| Attribute | Target | How |
|-----------|--------|-----|
| **Accuracy** | >85% correct bin on first try | Detailed Slovenian Gemini prompt |
| **Speed** | Scan result in <3s on 4G | 100KB compressed image, Flash model |
| **Reliability** | Graceful cold-start | Friendly retry UI, TanStack Query retry |
| **Maintainability** | New developer productive in <1 day | TypeScript, Prisma, clear folder structure |
| **Security** | No key exposure | All secrets on backend only |

---

## 14. Risks and Technical Debt

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Render cold start frustrates morning users | High | Medium | Friendly "Poskusi čez trenutek" UI |
| Gemini misclassifies edge cases | Medium | Medium | Low-confidence fallback to Črni zabojnik |
| Gemini free tier removed or changed | Low | High | Prompt is provider-agnostic; switchable to OpenAI |
| Firebase token refresh race condition | Low | Medium | Axios interceptor always reads latest token |
| Apple $99/year blocks public iOS launch | Medium | High | TestFlight covers pilot; cost expected before public launch |

### Technical Debt

The following are known gaps acceptable for Phase 1 but must be
addressed before wider rollout:

- **No admin panel** — EKO otok data requires direct database access to manage
- **No image moderation** — students could submit inappropriate images
  (Gemini ignores them, but a moderation layer is needed for public launch)
- **Municipality rules in prompt only** — rules should move to a database
  table for proper multi-municipality support
- **No offline mode** — scanner requires internet; a queue for offline
  scans should be considered for Phase 3
