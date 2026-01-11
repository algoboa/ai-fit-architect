import { create } from 'zustand';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

// Mock workout plan
const MOCK_WORKOUT_PLAN = {
  id: '1',
  name: 'Upper Body Strength',
  duration: 45,
  exercises: [
    {
      id: '1',
      name: 'Bench Press',
      sets: 4,
      targetReps: '8-10',
      weight: 60,
      restTime: 90,
      demoVideo: null,
      icon: '🏋️',
    },
    {
      id: '2',
      name: 'Incline Dumbbell Press',
      sets: 3,
      targetReps: '10-12',
      weight: 20,
      restTime: 60,
      demoVideo: null,
      icon: '💪',
    },
    {
      id: '3',
      name: 'Cable Flyes',
      sets: 3,
      targetReps: '12-15',
      weight: 15,
      restTime: 60,
      demoVideo: null,
      icon: '🔗',
    },
    {
      id: '4',
      name: 'Shoulder Press',
      sets: 4,
      targetReps: '8-10',
      weight: 40,
      restTime: 90,
      demoVideo: null,
      icon: '🙌',
    },
    {
      id: '5',
      name: 'Lateral Raises',
      sets: 3,
      targetReps: '12-15',
      weight: 8,
      restTime: 60,
      demoVideo: null,
      icon: '🦅',
    },
    {
      id: '6',
      name: 'Tricep Pushdowns',
      sets: 3,
      targetReps: '12-15',
      weight: 25,
      restTime: 60,
      demoVideo: null,
      icon: '💪',
    },
  ],
};

export const useWorkoutStore = create((set, get) => ({
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

  // Camera/pose detection state
  isCameraActive: false,
  poseKeypoints: [],
  formScore: 0,
  formFeedback: null,

  // Start a workout session
  startWorkout: () => {
    set({
      currentWorkout: MOCK_WORKOUT_PLAN,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      completedSets: [],
      isWorkoutActive: true,
      isResting: false,
      restTimeRemaining: 0,
      workoutStartTime: Date.now(),
      workoutDuration: 0,
      formScore: 0,
      formFeedback: null,
    });
  },

  // End workout session
  endWorkout: () => {
    set({
      currentWorkout: null,
      currentExerciseIndex: 0,
      currentSetIndex: 0,
      isWorkoutActive: false,
      isResting: false,
      restTimeRemaining: 0,
      workoutStartTime: null,
      isCameraActive: false,
      poseKeypoints: [],
      formScore: 0,
      formFeedback: null,
    });
  },

  // Get current exercise
  getCurrentExercise: () => {
    const { currentWorkout, currentExerciseIndex } = get();
    if (!currentWorkout) return null;
    return currentWorkout.exercises[currentExerciseIndex] || null;
  },

  // Complete current set
  completeSet: (reps, weight) => {
    const { currentWorkout, currentExerciseIndex, currentSetIndex, completedSets } = get();
    if (!currentWorkout) return;

    const exercise = currentWorkout.exercises[currentExerciseIndex];
    const setData = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      setNumber: currentSetIndex + 1,
      reps,
      weight,
      completedAt: new Date().toISOString(),
    };

    const newCompletedSets = [...completedSets, setData];
    const isLastSet = currentSetIndex + 1 >= exercise.sets;

    if (isLastSet) {
      // Move to next exercise
      const nextExerciseIndex = currentExerciseIndex + 1;
      if (nextExerciseIndex < currentWorkout.exercises.length) {
        set({
          completedSets: newCompletedSets,
          currentExerciseIndex: nextExerciseIndex,
          currentSetIndex: 0,
          isResting: true,
          restTimeRemaining: exercise.restTime,
        });
      } else {
        // Workout complete
        set({
          completedSets: newCompletedSets,
          isResting: false,
        });
      }
    } else {
      // Move to next set
      set({
        completedSets: newCompletedSets,
        currentSetIndex: currentSetIndex + 1,
        isResting: true,
        restTimeRemaining: exercise.restTime,
      });
    }
  },

  // Skip rest timer
  skipRest: () => {
    set({
      isResting: false,
      restTimeRemaining: 0,
    });
  },

  // Update rest time remaining
  updateRestTime: (time) => {
    set({ restTimeRemaining: time });
    if (time <= 0) {
      set({ isResting: false });
    }
  },

  // Update workout duration
  updateDuration: () => {
    const { workoutStartTime, isWorkoutActive } = get();
    if (workoutStartTime && isWorkoutActive) {
      const duration = Math.floor((Date.now() - workoutStartTime) / 1000);
      set({ workoutDuration: duration });
    }
  },

  // Toggle camera
  toggleCamera: () => {
    set((state) => ({ isCameraActive: !state.isCameraActive }));
  },

  // Update pose keypoints (mock for now)
  updatePoseKeypoints: (keypoints) => {
    set({ poseKeypoints: keypoints });
  },

  // Update form score and feedback
  updateFormFeedback: (score, feedback) => {
    set({ formScore: score, formFeedback: feedback });
  },

  // Generate mock pose keypoints for demonstration
  generateMockPose: () => {
    // Simplified skeleton keypoints for demonstration
    const mockKeypoints = [
      { x: 0.5, y: 0.15, part: 'nose', score: 0.95 },
      { x: 0.48, y: 0.22, part: 'leftShoulder', score: 0.92 },
      { x: 0.52, y: 0.22, part: 'rightShoulder', score: 0.91 },
      { x: 0.42, y: 0.38, part: 'leftElbow', score: 0.88 },
      { x: 0.58, y: 0.38, part: 'rightElbow', score: 0.87 },
      { x: 0.40, y: 0.52, part: 'leftWrist', score: 0.85 },
      { x: 0.60, y: 0.52, part: 'rightWrist', score: 0.84 },
      { x: 0.48, y: 0.55, part: 'leftHip', score: 0.90 },
      { x: 0.52, y: 0.55, part: 'rightHip', score: 0.89 },
      { x: 0.47, y: 0.75, part: 'leftKnee', score: 0.82 },
      { x: 0.53, y: 0.75, part: 'rightKnee', score: 0.81 },
      { x: 0.46, y: 0.95, part: 'leftAnkle', score: 0.78 },
      { x: 0.54, y: 0.95, part: 'rightAnkle', score: 0.77 },
    ];

    // Add slight random variation
    const variatedKeypoints = mockKeypoints.map((kp) => ({
      ...kp,
      x: kp.x + (Math.random() - 0.5) * 0.02,
      y: kp.y + (Math.random() - 0.5) * 0.02,
    }));

    set({
      poseKeypoints: variatedKeypoints,
      formScore: 85 + Math.floor(Math.random() * 15),
      formFeedback: 'Keep your core tight!',
    });
  },

  // Save workout to Firestore
  saveWorkout: async (userId) => {
    const { currentWorkout, completedSets, workoutDuration } = get();
    if (!currentWorkout || completedSets.length === 0) return;

    set({ isLoading: true });
    try {
      const workoutRef = collection(db, 'users', userId, 'workouts');
      await addDoc(workoutRef, {
        workoutName: currentWorkout.name,
        completedSets,
        duration: workoutDuration,
        totalVolume: completedSets.reduce((sum, set) => sum + set.reps * set.weight, 0),
        createdAt: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
      });

      set({ isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get completed sets for current exercise
  getExerciseSets: (exerciseId) => {
    const { completedSets } = get();
    return completedSets.filter((set) => set.exerciseId === exerciseId);
  },

  // Check if workout is complete
  isWorkoutComplete: () => {
    const { currentWorkout, completedSets } = get();
    if (!currentWorkout) return false;

    const totalSets = currentWorkout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    return completedSets.length >= totalSets;
  },

  // Reset store
  resetStore: () => {
    set({
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
  },
}));

// Zustand selectors for optimized re-renders
export const useIsWorkoutActive = () => useWorkoutStore((state) => state.isWorkoutActive);
export const useIsResting = () => useWorkoutStore((state) => state.isResting);
export const useRestTimeRemaining = () => useWorkoutStore((state) => state.restTimeRemaining);
export const useWorkoutDuration = () => useWorkoutStore((state) => state.workoutDuration);
export const useCurrentExerciseIndex = () => useWorkoutStore((state) => state.currentExerciseIndex);
export const useCompletedSets = () => useWorkoutStore((state) => state.completedSets);
export const useIsCameraActive = () => useWorkoutStore((state) => state.isCameraActive);
export const useFormScore = () => useWorkoutStore((state) => state.formScore);
export const useFormFeedback = () => useWorkoutStore((state) => state.formFeedback);
export const usePoseKeypoints = () => useWorkoutStore((state) => state.poseKeypoints);
