# AI-Fit Architect

An AI-powered fitness application built with React Native and Expo that provides personalized workout tracking, meal logging with food recognition, and comprehensive progress tracking.

## Features

### Authentication & Onboarding
- Email/password authentication via Firebase
- Multi-step onboarding flow to collect user preferences
- Profile customization (goals, experience level, dietary preferences, equipment access)

### Dashboard
- Daily overview of nutrition and workout goals
- Quick access to start workouts or log meals
- Progress summary with key metrics

### Meal Logging (Snap & Log)
- AI-powered food recognition via camera
- Manual food search functionality
- Nutritional information tracking (calories, protein, carbs, fat)
- Daily meal history organized by meal type
- Firestore integration for data persistence

### Training & Form Coaching
- Pre-built workout plans with exercises, sets, reps, and rest times
- Real-time workout tracking with timer
- Pose detection overlay for form feedback (mock implementation)
- Set completion logging with weight and rep tracking
- Rest timer between sets
- Workout history saved to Firestore

### Progress Tracking
- Body measurements tracking (weight, body fat, muscle mass)
- Performance metrics (1RM estimates, weekly volume)
- Visual charts for progress over time
- Achievement system
- Multiple time period views (1 week, 1 month, 3 months, 6 months)

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation (native-stack, bottom-tabs)
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Backend**: Firebase (Authentication, Firestore)
- **Graphics**: react-native-svg for pose overlay
- **Camera**: expo-camera
- **Testing**: Jest with jest-expo preset

## Project Structure

```
ai-fit-architect/
├── src/
│   ├── components/
│   │   ├── CameraModal.js        # Camera component for food photos
│   │   └── PoseOverlay.js        # SVG skeleton overlay for pose detection
│   ├── hooks/
│   │   └── (custom hooks)
│   ├── navigation/
│   │   ├── AppNavigator.js       # Main tab navigation
│   │   └── AuthNavigator.js      # Auth flow navigation
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   └── SignUpScreen.js
│   │   ├── onboarding/
│   │   │   ├── OnboardingScreen.js
│   │   │   └── steps/            # Onboarding step components
│   │   ├── DashboardScreen.js
│   │   ├── WorkoutScreen.js
│   │   ├── MealLogScreen.js
│   │   └── ProgressScreen.js
│   ├── services/
│   │   ├── firebase.js           # Firebase configuration
│   │   └── NutritionAPI.js       # Mock AI food recognition API
│   ├── store/
│   │   ├── authStore.js          # Authentication state
│   │   ├── onboardingStore.js    # Onboarding flow state
│   │   ├── mealsStore.js         # Meal tracking state
│   │   ├── workoutStore.js       # Workout session state
│   │   └── progressStore.js      # Progress tracking state
│   └── theme/
│       └── index.js              # Design system (colors, typography, spacing)
├── __tests__/
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── store/
├── e2e/
│   └── test-outline.md           # E2E test scenarios
├── App.js
├── app.json
├── package.json
├── jest.config.js
└── jest.setup.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-fit-architect
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Email/Password authentication
   - Create a Firestore database
   - Copy your Firebase config to environment variables or update `src/services/firebase.js`

4. Start the development server:
```bash
npm start
```

5. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android
```

## Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Testing

Run the test suite:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Current test coverage includes:
- Store tests (authStore, onboardingStore, mealsStore, workoutStore, progressStore)
- Service tests (NutritionAPI)
- Component tests (PoseOverlay)
- Screen tests (LoginScreen, OnboardingScreen)

## Firebase Data Structure

```
users/
  {userId}/
    profile/
      - name
      - age
      - gender
      - goals
      - experienceLevel
      - activityLevel
      - dietaryPreference
      - equipment
    workouts/
      {workoutId}/
        - workoutName
        - completedSets[]
        - duration
        - totalVolume
        - createdAt
    meals/
      {mealId}/
        - name
        - calories
        - protein
        - carbs
        - fat
        - servingSize
        - mealType
        - imageUri
        - createdAt
    measurements/
      {measurementId}/
        - weight
        - bodyFat
        - muscleMass
        - createdAt
    achievements/
      {achievementId}/
        - name
        - icon
        - unlockedAt
```

## Design System

The app uses a dark theme with the following color palette:

- **Primary**: #00D9FF (Cyan)
- **Accent**: #FF6B6B (Coral)
- **Background**: #0A0A0F (Near black)
- **Surface**: #1A1A24 (Dark gray)
- **Text**: #FFFFFF (White)
- **Text Secondary**: #8E8E93 (Gray)

Typography uses the system font stack with consistent sizing:
- h1: 32px bold
- h2: 28px bold
- h3: 24px semibold
- body1: 16px regular
- body2: 14px regular
- caption: 12px regular

## Mock Implementations

The following features use mock implementations that can be replaced with real services:

### Food Recognition (NutritionAPI.js)
Currently returns random mock food data. Replace with:
- Google Cloud Vision API
- Clarifai Food Recognition
- Custom ML model

### Pose Detection (workoutStore.js)
Currently generates random keypoints. Replace with:
- TensorFlow.js PoseNet
- MediaPipe Pose
- Custom pose detection model

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/) - React Native development platform
- [Firebase](https://firebase.google.com/) - Backend services
- [React Native Paper](https://reactnativepaper.com/) - UI components
- [Zustand](https://github.com/pmndrs/zustand) - State management
