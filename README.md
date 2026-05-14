# CollabSphere

CollabSphere is a React Native + Expo app for developers, designers, and builders to find squads and ship projects together. The UI focuses on pure OLED black surfaces, glassmorphism cards, and high-contrast accent colors.

## Stack

- React Native + Expo (TypeScript)
- Supabase for auth and realtime
- React Navigation for routing
- React Native Reanimated for animations
- Lucide React Native for icons

## Local development

1. Install dependencies
  ```bash
  npm install
  ```

2. Start the app
  ```bash
  npx expo start
  ```

## Structure

```text
src/
├── lib/
├── navigation/
├── screens/
│   ├── auth/
│   └── main/
├── components/
└── theme/
```

## Supabase

This app expects a `profiles` table and a `messages` table in Supabase. The auth flow uses email and password with persisted sessions via AsyncStorage.
