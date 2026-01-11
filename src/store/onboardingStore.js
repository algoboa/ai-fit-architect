import { create } from 'zustand';

export const useOnboardingStore = create((set, get) => ({
  currentStep: 0,
  totalSteps: 6,
  onboardingData: {
    // Step 1: Profile
    age: '',
    gender: '',
    height: '',
    weight: '',

    // Step 2: Goals
    primaryGoal: '', // 'muscle_gain', 'weight_loss', 'maintenance'
    targetWeight: '',
    targetBodyFat: '',

    // Step 3: Experience
    experienceLevel: '', // 'beginner', 'intermediate', 'advanced'
    weeklyFrequency: '',

    // Step 4: Lifestyle
    activityLevel: '', // 'sedentary', 'light', 'moderate', 'active', 'very_active'

    // Step 5: Diet restrictions
    dietRestrictions: [],
    allergies: [],

    // Step 6: Equipment
    availableEquipment: [],
  },
  isComplete: false,

  // Update onboarding data
  updateOnboardingData: (data) => {
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        ...data,
      },
    }));
  },

  // Go to next step
  nextStep: () => {
    const { currentStep, totalSteps } = get();
    if (currentStep < totalSteps - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  // Go to previous step
  previousStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // Go to specific step
  goToStep: (step) => {
    const { totalSteps } = get();
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step });
    }
  },

  // Mark onboarding as complete
  completeOnboarding: () => {
    set({ isComplete: true });
  },

  // Reset onboarding
  resetOnboarding: () => {
    set({
      currentStep: 0,
      onboardingData: {
        age: '',
        gender: '',
        height: '',
        weight: '',
        primaryGoal: '',
        targetWeight: '',
        targetBodyFat: '',
        experienceLevel: '',
        weeklyFrequency: '',
        activityLevel: '',
        dietRestrictions: [],
        allergies: [],
        availableEquipment: [],
      },
      isComplete: false,
    });
  },

  // Get current progress percentage
  getProgress: () => {
    const { currentStep, totalSteps } = get();
    return ((currentStep + 1) / totalSteps) * 100;
  },
}));
