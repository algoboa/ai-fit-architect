import { create } from 'zustand';
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../services/firebase';

// Helper to get date range based on period
const getDateRange = (period) => {
  const now = new Date();
  const end = now;
  let start = new Date();

  switch (period) {
    case '1w':
      start.setDate(now.getDate() - 7);
      break;
    case '1m':
      start.setMonth(now.getMonth() - 1);
      break;
    case '3m':
      start.setMonth(now.getMonth() - 3);
      break;
    case '6m':
      start.setMonth(now.getMonth() - 6);
      break;
    default:
      start.setMonth(now.getMonth() - 1);
  }

  return { start, end };
};

// Format date for display
const formatDate = (date) => {
  const d = date instanceof Date ? date : date.toDate();
  return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
};

export const useProgressStore = create((set, get) => ({
  // Body measurements
  bodyMeasurements: [],
  weightHistory: [],
  bodyFatHistory: [],
  muscleHistory: [],

  // Performance data
  performanceData: [],
  weeklyVolume: [],
  personalRecords: {},

  // Achievements
  achievements: [],

  // Loading states
  isLoading: false,
  error: null,

  // Fetch body measurements from Firestore
  fetchBodyMeasurements: async (userId, period = '1m') => {
    set({ isLoading: true, error: null });
    try {
      const { start } = getDateRange(period);
      const measurementsRef = collection(db, 'users', userId, 'measurements');
      const q = query(
        measurementsRef,
        where('createdAt', '>=', Timestamp.fromDate(start)),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      const measurements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().createdAt),
      }));

      // Separate by type
      const weightHistory = measurements
        .filter((m) => m.weight)
        .map((m) => ({ date: m.date, value: m.weight }));

      const bodyFatHistory = measurements
        .filter((m) => m.bodyFat)
        .map((m) => ({ date: m.date, value: m.bodyFat }));

      const muscleHistory = measurements
        .filter((m) => m.muscleMass)
        .map((m) => ({ date: m.date, value: m.muscleMass }));

      set({
        bodyMeasurements: measurements,
        weightHistory,
        bodyFatHistory,
        muscleHistory,
        isLoading: false,
      });

      return measurements;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Add new body measurement
  addBodyMeasurement: async (userId, data) => {
    set({ isLoading: true, error: null });
    try {
      const measurementsRef = collection(db, 'users', userId, 'measurements');
      const measurementData = {
        ...data,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(measurementsRef, measurementData);

      // Refresh measurements
      await get().fetchBodyMeasurements(userId);

      set({ isLoading: false });
      return docRef.id;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch workout performance data
  fetchPerformanceData: async (userId, period = '1m') => {
    set({ isLoading: true, error: null });
    try {
      const { start } = getDateRange(period);
      const workoutsRef = collection(db, 'users', userId, 'workouts');
      const q = query(
        workoutsRef,
        where('createdAt', '>=', Timestamp.fromDate(start)),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      const workouts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().createdAt),
      }));

      // Calculate weekly volume
      const volumeByWeek = {};
      workouts.forEach((workout) => {
        const weekStart = getWeekStart(workout.createdAt.toDate());
        const weekKey = `W${getWeekNumber(workout.createdAt.toDate())}`;
        volumeByWeek[weekKey] = (volumeByWeek[weekKey] || 0) + (workout.totalVolume || 0);
      });

      const weeklyVolume = Object.entries(volumeByWeek).map(([week, value]) => ({
        week,
        value,
      }));

      // Extract personal records from completed sets
      const prs = {};
      workouts.forEach((workout) => {
        if (workout.completedSets) {
          workout.completedSets.forEach((setData) => {
            const exerciseName = setData.exerciseName;
            const weight = setData.weight;
            if (!prs[exerciseName] || prs[exerciseName] < weight) {
              prs[exerciseName] = weight;
            }
          });
        }
      });

      set({
        performanceData: workouts,
        weeklyVolume,
        personalRecords: prs,
        isLoading: false,
      });

      return workouts;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch achievements
  fetchAchievements: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const achievementsRef = collection(db, 'users', userId, 'achievements');
      const q = query(achievementsRef, orderBy('unlockedAt', 'desc'), limit(10));

      const snapshot = await getDocs(q);
      const achievements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: formatDate(doc.data().unlockedAt),
      }));

      set({ achievements, isLoading: false });
      return achievements;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Add achievement
  addAchievement: async (userId, achievement) => {
    try {
      const achievementsRef = collection(db, 'users', userId, 'achievements');
      await addDoc(achievementsRef, {
        ...achievement,
        unlockedAt: Timestamp.now(),
      });

      await get().fetchAchievements(userId);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Get latest stats
  getLatestStats: () => {
    const { weightHistory, bodyFatHistory, muscleHistory, personalRecords } = get();

    const getLatestAndChange = (history) => {
      if (history.length === 0) return { current: 0, change: 0 };
      const current = history[history.length - 1]?.value || 0;
      const first = history[0]?.value || current;
      return { current, change: current - first };
    };

    return {
      weight: getLatestAndChange(weightHistory),
      bodyFat: getLatestAndChange(bodyFatHistory),
      muscle: getLatestAndChange(muscleHistory),
      personalRecords,
    };
  },

  // Calculate estimated 1RM using Epley formula
  calculate1RM: (weight, reps) => {
    if (reps === 1) return weight;
    return Math.round(weight * (1 + reps / 30));
  },

  // Reset store
  resetStore: () => {
    set({
      bodyMeasurements: [],
      weightHistory: [],
      bodyFatHistory: [],
      muscleHistory: [],
      performanceData: [],
      weeklyVolume: [],
      personalRecords: {},
      achievements: [],
      isLoading: false,
      error: null,
    });
  },
}));

// Helper functions
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function getWeekNumber(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}
