import { create } from 'zustand';
import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { analyzeImage, calculateTotalNutrition } from '../services/NutritionAPI';

export const useMealsStore = create((set, get) => ({
  meals: [],
  todaysMeals: [],
  isLoading: false,
  isAnalyzing: false,
  error: null,
  analysisResult: null,

  // Analyze a food image
  analyzeFood: async (imageUri) => {
    set({ isAnalyzing: true, error: null, analysisResult: null });
    try {
      const result = await analyzeImage(imageUri);
      set({ analysisResult: result, isAnalyzing: false });
      return result;
    } catch (error) {
      set({ error: error.message, isAnalyzing: false });
      throw error;
    }
  },

  // Clear analysis result
  clearAnalysis: () => {
    set({ analysisResult: null });
  },

  // Save a meal to Firestore
  saveMeal: async (userId, mealData) => {
    set({ isLoading: true, error: null });
    try {
      const mealRef = collection(db, 'users', userId, 'meals');
      const docRef = await addDoc(mealRef, {
        ...mealData,
        createdAt: Timestamp.now(),
        date: new Date().toISOString().split('T')[0],
      });

      const newMeal = {
        id: docRef.id,
        ...mealData,
        createdAt: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
      };

      set((state) => ({
        meals: [...state.meals, newMeal],
        todaysMeals: [...state.todaysMeals, newMeal],
        isLoading: false,
        analysisResult: null,
      }));

      return newMeal;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch meals for a specific date
  fetchMealsByDate: async (userId, date) => {
    set({ isLoading: true, error: null });
    try {
      const mealRef = collection(db, 'users', userId, 'meals');
      const q = query(
        mealRef,
        where('date', '==', date),
        orderBy('createdAt', 'asc')
      );

      const snapshot = await getDocs(q);
      const meals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ todaysMeals: meals, isLoading: false });
      return meals;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Fetch all meals for the user
  fetchAllMeals: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const mealRef = collection(db, 'users', userId, 'meals');
      const q = query(mealRef, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      const meals = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({ meals, isLoading: false });
      return meals;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Get meals by type (breakfast, lunch, dinner, snack)
  getMealsByType: (type) => {
    const { todaysMeals } = get();
    return todaysMeals.filter((meal) => meal.mealType === type);
  },

  // Calculate today's nutrition totals
  getTodaysTotals: () => {
    const { todaysMeals } = get();
    return calculateTotalNutrition(todaysMeals);
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  resetMeals: () => {
    set({
      meals: [],
      todaysMeals: [],
      isLoading: false,
      isAnalyzing: false,
      error: null,
      analysisResult: null,
    });
  },
}));
