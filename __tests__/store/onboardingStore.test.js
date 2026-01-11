import { useOnboardingStore } from '../../src/store/onboardingStore';

describe('OnboardingStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useOnboardingStore.getState().resetOnboarding();
  });

  it('should have correct initial state', () => {
    const state = useOnboardingStore.getState();

    expect(state.currentStep).toBe(0);
    expect(state.totalSteps).toBe(6);
    expect(state.isComplete).toBe(false);
    expect(state.onboardingData.age).toBe('');
    expect(state.onboardingData.gender).toBe('');
  });

  it('should update onboarding data', () => {
    const { updateOnboardingData } = useOnboardingStore.getState();

    updateOnboardingData({ age: '30', gender: 'male' });

    const state = useOnboardingStore.getState();
    expect(state.onboardingData.age).toBe('30');
    expect(state.onboardingData.gender).toBe('male');
  });

  it('should go to next step', () => {
    const { nextStep } = useOnboardingStore.getState();

    nextStep();

    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });

  it('should not exceed total steps', () => {
    const store = useOnboardingStore.getState();

    // Go to last step
    for (let i = 0; i < 10; i++) {
      store.nextStep();
    }

    expect(useOnboardingStore.getState().currentStep).toBe(5); // totalSteps - 1
  });

  it('should go to previous step', () => {
    const store = useOnboardingStore.getState();

    store.nextStep();
    store.nextStep();
    store.previousStep();

    expect(useOnboardingStore.getState().currentStep).toBe(1);
  });

  it('should not go below step 0', () => {
    const { previousStep } = useOnboardingStore.getState();

    previousStep();
    previousStep();

    expect(useOnboardingStore.getState().currentStep).toBe(0);
  });

  it('should go to specific step', () => {
    const { goToStep } = useOnboardingStore.getState();

    goToStep(3);

    expect(useOnboardingStore.getState().currentStep).toBe(3);
  });

  it('should mark onboarding as complete', () => {
    const { completeOnboarding } = useOnboardingStore.getState();

    completeOnboarding();

    expect(useOnboardingStore.getState().isComplete).toBe(true);
  });

  it('should reset onboarding', () => {
    const store = useOnboardingStore.getState();

    store.updateOnboardingData({ age: '30', gender: 'male' });
    store.nextStep();
    store.completeOnboarding();
    store.resetOnboarding();

    const state = useOnboardingStore.getState();
    expect(state.currentStep).toBe(0);
    expect(state.isComplete).toBe(false);
    expect(state.onboardingData.age).toBe('');
  });

  it('should calculate progress correctly', () => {
    const store = useOnboardingStore.getState();

    expect(store.getProgress()).toBe((1 / 6) * 100); // Step 0 = 16.67%

    store.nextStep();
    expect(store.getProgress()).toBe((2 / 6) * 100); // Step 1 = 33.33%

    store.goToStep(5);
    expect(store.getProgress()).toBe(100); // Step 5 = 100%
  });
});
