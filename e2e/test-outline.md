# AI-Fit Architect E2E Test Outline

This document outlines the end-to-end test scenarios for the AI-Fit Architect application. These tests would be implemented using Detox or a similar React Native E2E testing framework.

## Prerequisites

- Detox setup with iOS Simulator or Android Emulator
- Test Firebase project with seeded data
- Mock camera permissions and responses

---

## 1. Authentication Flow Tests

### 1.1 User Registration
```
Scenario: New user can create an account
  Given I am on the Login screen
  When I tap "Create Account"
  And I enter valid email "test@example.com"
  And I enter valid password "SecurePass123!"
  And I confirm password "SecurePass123!"
  And I tap "Sign Up" button
  Then I should see the Onboarding screen
```

### 1.2 User Login
```
Scenario: Existing user can log in
  Given I am on the Login screen
  When I enter email "existing@example.com"
  And I enter password "ExistingPass123!"
  And I tap "Sign In" button
  Then I should see the Dashboard screen
```

### 1.3 Login Validation
```
Scenario: Invalid credentials show error
  Given I am on the Login screen
  When I enter email "wrong@example.com"
  And I enter password "wrongpassword"
  And I tap "Sign In" button
  Then I should see an error message "Invalid email or password"
```

### 1.4 Logout
```
Scenario: User can log out
  Given I am logged in and on the Dashboard
  When I navigate to Settings
  And I tap "Log Out"
  Then I should see the Login screen
```

---

## 2. Onboarding Flow Tests

### 2.1 Complete Onboarding
```
Scenario: New user completes full onboarding
  Given I am on the Onboarding screen (Step 1)
  When I enter my name "John"
  And I select age "25-34"
  And I select gender "Male"
  And I tap "Continue"
  Then I should see Step 2 (Goals)

  When I select goal "Build Muscle"
  And I tap "Continue"
  Then I should see Step 3 (Experience)

  When I select experience level "Intermediate"
  And I tap "Continue"
  Then I should see Step 4 (Lifestyle)

  When I select activity level "Moderately Active"
  And I tap "Continue"
  Then I should see Step 5 (Diet)

  When I select dietary preference "No Restrictions"
  And I tap "Continue"
  Then I should see Step 6 (Equipment)

  When I select equipment available "Full Gym"
  And I tap "Get Started"
  Then I should see the Dashboard screen
```

### 2.2 Back Navigation in Onboarding
```
Scenario: User can go back during onboarding
  Given I am on Step 3 of Onboarding
  When I tap "Back"
  Then I should see Step 2
  And my previous selections should be preserved
```

---

## 3. Dashboard Tests

### 3.1 Dashboard Data Display
```
Scenario: Dashboard shows user data
  Given I am logged in with workout history
  When I view the Dashboard
  Then I should see my daily calorie goal
  And I should see my workout completion status
  And I should see my progress summary
```

### 3.2 Quick Actions
```
Scenario: User can start workout from dashboard
  Given I am on the Dashboard
  When I tap "Start Workout" button
  Then I should be navigated to the Workout screen
```

---

## 4. Meal Logging Tests

### 4.1 Log Meal via Camera
```
Scenario: User logs meal using camera
  Given I am on the Meals screen
  When I tap the camera button
  And I grant camera permission
  And I take a photo of food
  Then I should see the AI analysis modal
  And the identified food should be displayed
  When I confirm the meal
  Then the meal should be added to today's log
```

### 4.2 Manual Meal Search
```
Scenario: User searches and logs food manually
  Given I am on the Meals screen
  When I tap "Search Food"
  And I type "chicken breast"
  Then I should see search results
  When I tap on "Chicken Breast"
  And I select portion size
  And I tap "Add to Log"
  Then the meal should be added to today's log
```

### 4.3 View Meal History
```
Scenario: User views past meal entries
  Given I am on the Meals screen
  When I scroll through the meal list
  Then I should see meals grouped by meal type
  And I should see nutritional information for each meal
```

---

## 5. Workout Tests

### 5.1 Start Workout Session
```
Scenario: User starts a workout
  Given I am on the Workout screen
  When I view the workout plan
  Then I should see list of exercises
  And I should see sets, reps, and weights for each
  When I tap "Start Workout"
  Then the workout timer should begin
  And I should see the first exercise
```

### 5.2 Complete Exercise Set
```
Scenario: User completes a set
  Given I am in an active workout
  And I am on the first exercise
  When I tap "Complete Set"
  And I enter reps completed "10"
  And I enter weight used "60"
  And I confirm
  Then I should see rest timer
  And set should be marked complete
```

### 5.3 Use Form Coaching Camera
```
Scenario: User enables form coaching
  Given I am in an active workout
  When I tap "Enable Camera"
  And I grant camera permission
  Then I should see the camera preview
  And I should see the pose overlay
  And I should see form score
```

### 5.4 Skip Rest Timer
```
Scenario: User skips rest period
  Given I am in rest period between sets
  When I tap "Skip Rest"
  Then I should immediately see next set
```

### 5.5 Complete Workout
```
Scenario: User completes entire workout
  Given I am on the last set of the last exercise
  When I complete the set
  Then I should see workout summary
  And total duration should be displayed
  And total volume should be calculated
  When I tap "Save Workout"
  Then workout should be saved to history
```

---

## 6. Progress Tracking Tests

### 6.1 View Body Progress
```
Scenario: User views body measurements
  Given I am on the Progress screen
  When I select "Body" tab
  Then I should see weight chart
  And I should see body fat percentage
  And I should see muscle mass data
```

### 6.2 Log New Measurement
```
Scenario: User logs body measurement
  Given I am on the Progress screen
  When I tap "Log Measurement"
  And I enter weight "73.5"
  And I enter body fat "18.5"
  And I tap "Save"
  Then the new measurement should appear in the chart
  And stats should be updated
```

### 6.3 View Performance Progress
```
Scenario: User views lift progress
  Given I am on the Progress screen
  When I select "Performance" tab
  Then I should see 1RM estimates for major lifts
  And I should see weekly volume chart
  And I should see personal records
```

### 6.4 Change Time Period
```
Scenario: User changes progress time range
  Given I am on the Progress screen
  When I tap "3M" time period
  Then charts should update to show 3-month data
  And stats should recalculate for 3-month period
```

---

## 7. Navigation Tests

### 7.1 Bottom Tab Navigation
```
Scenario: User navigates between tabs
  Given I am on the Dashboard
  When I tap "Training" tab
  Then I should see the Workout screen
  When I tap "Meals" tab
  Then I should see the Meals screen
  When I tap "Progress" tab
  Then I should see the Progress screen
```

### 7.2 Deep Link Navigation
```
Scenario: User opens workout via notification
  Given the app is in background
  When I receive a workout reminder notification
  And I tap the notification
  Then the app should open to the Workout screen
```

---

## 8. Offline Behavior Tests

### 8.1 View Cached Data Offline
```
Scenario: User views data while offline
  Given I have previously loaded the Dashboard
  When I lose internet connection
  Then I should still see cached data
  And I should see an offline indicator
```

### 8.2 Queue Actions Offline
```
Scenario: User logs meal while offline
  Given I am offline
  When I log a meal
  Then the meal should be saved locally
  And I should see "Pending sync" indicator
  When I regain connection
  Then the meal should sync to server
```

---

## 9. Error Handling Tests

### 9.1 Network Error Recovery
```
Scenario: App recovers from network error
  Given a network request fails
  Then I should see an error message
  And I should see a "Retry" button
  When I tap "Retry"
  Then the request should be attempted again
```

### 9.2 Camera Permission Denied
```
Scenario: User denies camera permission
  Given I am trying to use the camera
  When I deny camera permission
  Then I should see a message explaining why camera is needed
  And I should see a button to open settings
```

---

## Test Data Requirements

### Seeded Users
- `test_new_user@example.com` - Fresh account, no data
- `test_active_user@example.com` - Account with workout and meal history
- `test_progress_user@example.com` - Account with 3 months of progress data

### Seeded Workouts
- Upper Body Strength (6 exercises)
- Lower Body Power (5 exercises)
- Full Body HIIT (8 exercises)

### Mock API Responses
- Food recognition returns consistent mock data
- Pose detection returns mock keypoints

---

## Running E2E Tests

```bash
# Build for testing
npx detox build --configuration ios.sim.debug

# Run all E2E tests
npx detox test --configuration ios.sim.debug

# Run specific test file
npx detox test --configuration ios.sim.debug e2e/auth.e2e.js

# Run with specific device
npx detox test --configuration ios.sim.debug --device-name "iPhone 15"
```

---

## CI/CD Integration

E2E tests should run:
- On every PR to main branch
- Nightly on main branch
- Before production releases

Recommended CI configuration:
- Use macOS runners for iOS tests
- Use Linux runners with Android emulator for Android tests
- Parallel test execution by test file
- Artifact collection for failed test screenshots
