import { useWorkoutStore } from '../../src/store/workoutStore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

jest.mock('../../src/services/firebase', () => ({
  db: {},
}));

describe('workoutStore', () => {
  beforeEach(() => {
    // Reset store state
    useWorkoutStore.setState({
      currentWorkout: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      completedSets: [],
      isWorkoutActive: false,
      isResting: false,
      restTimeRemaining: 0,
      workoutStartTime: null,
      workoutDuration: 0,
      isLoading: false,
      error: null,
      isCameraActive: false,
      poseKeypoints: [],
      formScore: 0,
      formFeedback: null,
    });
  });

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useWorkoutStore.getState();
      expect(state.currentWorkout).toBeNull();
      expect(state.isWorkoutActive).toBe(false);
      expect(state.isResting).toBe(false);
      expect(state.completedSets).toEqual([]);
      expect(state.isCameraActive).toBe(false);
    });
  });

  describe('startWorkout', () => {
    it('initializes workout state correctly', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();

      const newState = useWorkoutStore.getState();
      expect(newState.isWorkoutActive).toBe(true);
      expect(newState.currentWorkout).not.toBeNull();
      expect(newState.currentExerciseIndex).toBe(0);
      expect(newState.currentSetIndex).toBe(0);
      expect(newState.completedSets).toEqual([]);
      expect(newState.workoutStartTime).not.toBeNull();
    });
  });

  describe('endWorkout', () => {
    it('resets workout state', () => {
      // First start a workout
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.endWorkout();

      const newState = useWorkoutStore.getState();
      expect(newState.isWorkoutActive).toBe(false);
      expect(newState.currentWorkout).toBeNull();
      expect(newState.isResting).toBe(false);
      expect(newState.isCameraActive).toBe(false);
    });
  });

  describe('getCurrentExercise', () => {
    it('returns null when no workout is active', () => {
      const state = useWorkoutStore.getState();
      expect(state.getCurrentExercise()).toBeNull();
    });

    it('returns current exercise when workout is active', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();

      const exercise = useWorkoutStore.getState().getCurrentExercise();
      expect(exercise).not.toBeNull();
      expect(exercise.name).toBe('Bench Press');
    });
  });

  describe('completeSet', () => {
    it('adds set to completed sets', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);

      const newState = useWorkoutStore.getState();
      expect(newState.completedSets).toHaveLength(1);
      expect(newState.completedSets[0].reps).toBe(10);
      expect(newState.completedSets[0].weight).toBe(60);
    });

    it('starts rest timer after completing set', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);

      const newState = useWorkoutStore.getState();
      expect(newState.isResting).toBe(true);
      expect(newState.restTimeRemaining).toBeGreaterThan(0);
    });
  });

  describe('skipRest', () => {
    it('ends rest period immediately', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);
      state.skipRest();

      const newState = useWorkoutStore.getState();
      expect(newState.isResting).toBe(false);
      expect(newState.restTimeRemaining).toBe(0);
    });
  });

  describe('toggleCamera', () => {
    it('toggles camera state', () => {
      const state = useWorkoutStore.getState();
      expect(state.isCameraActive).toBe(false);

      state.toggleCamera();
      expect(useWorkoutStore.getState().isCameraActive).toBe(true);

      state.toggleCamera();
      expect(useWorkoutStore.getState().isCameraActive).toBe(false);
    });
  });

  describe('getExerciseSets', () => {
    it('filters sets by exercise id', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);
      state.skipRest();
      state.completeSet(8, 60);

      const newState = useWorkoutStore.getState();
      const exercise = newState.getCurrentExercise();
      const sets = newState.getExerciseSets(exercise.id);

      expect(sets).toHaveLength(2);
    });
  });

  describe('isWorkoutComplete', () => {
    it('returns false when no workout is active', () => {
      const state = useWorkoutStore.getState();
      expect(state.isWorkoutComplete()).toBe(false);
    });

    it('returns false when workout is not complete', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);

      expect(useWorkoutStore.getState().isWorkoutComplete()).toBe(false);
    });
  });

  describe('resetStore', () => {
    it('resets all state to initial values', () => {
      const state = useWorkoutStore.getState();
      state.startWorkout();
      state.completeSet(10, 60);
      state.toggleCamera();

      state.resetStore();

      const newState = useWorkoutStore.getState();
      expect(newState.currentWorkout).toBeNull();
      expect(newState.isWorkoutActive).toBe(false);
      expect(newState.completedSets).toEqual([]);
      expect(newState.isCameraActive).toBe(false);
    });
  });
});
