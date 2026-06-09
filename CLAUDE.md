# CLAUDE.md — RecycLAR

## Project Overview
RecycLAR is a React Native (Expo) app for recycling education in Slovenian schools. Students scan waste to find the correct bin, do quizzes to earn points, and compete with classmates on a leaderboard. Teachers manage classes and monitor progress.
The entire product lives in apps/mobile/. There is no separate backend — Firebase handles auth and data.


## Tech Stack
- React Native + Expo (TypeScript)
- Firebase Auth + Firestore
- Google Gemini Vision AI
- TensorFlow Lite (on-device ML)
- React Navigation

## Code Rules
- All styles go in `.styles.ts` files — never inline in screen files
- Shared constants in `utils/theme.ts` (COLORS, SPACING, TYPOGRAPHY)
- One component per file
- Never touch navigation or business logic during UI changes

## Project Structure
- `screens/` — one file per screen
- `styles/` — one `.styles.ts` per screen
- `components/` — shared components
- `utils/` — helpers, asset maps, theme
- `firebase/` — Firebase config only

## Running the project
cd apps/mobile && npm install
cp .env.example .env  # add Firebase + Gemini keys
npx expo run:android  # or run:ios on Mac

## Key Patterns
- Asset maps: `getIconAsset()`, `getBadgeAsset()`, `getAvatarAsset()`
- Background: `<DecorativeBackground variant="screen" />`
- Navigation: React Navigation native stack

## What Claude helped build
- Full UI polish pass across all screens
- TFLite integration with jpeg-js image decoding
- Leaderboard podium animations
- Quiz duolingo-style path system
- Lari mascot integration
