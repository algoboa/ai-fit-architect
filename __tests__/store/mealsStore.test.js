import { useMealsStore } from '../../src/store/mealsStore';

// Mock Firebase
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
  },
}));

jest.mock('../../src/services/firebase', () => ({
  db: {},
}));

jest.mock('../../src/services/NutritionAPI', () => ({
  analyzeImage: jest.fn(),
  calculateTotalNutrition: jest.fn((meals) => ({
    calories: meals.reduce((sum, m) => sum + (m.calories || 0), 0),
    protein: meals.reduce((sum, m) => sum + (m.protein || 0), 0),
    carbs: meals.reduce((sum, m) => sum + (m.carbs || 0), 0),
    fat: meals.reduce((sum, m) => sum + (m.fat || 0), 0),
  })),
}));

describe('mealsStore', () => {
  beforeEach(() => {
    // Reset store state
    useMealsStore.setState({
      meals: [],
      todaysMeals: [],
      isLoading: false,
      isAnalyzing: false,
      error: null,
      analysisResult: null,
    });
  });

  describe('initial state', () => {
    it('has correct initial values', () => {
      const state = useMealsStore.getState();
      expect(state.meals).toEqual([]);
      expect(state.todaysMeals).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.isAnalyzing).toBe(false);
      expect(state.error).toBeNull();
      expect(state.analysisResult).toBeNull();
    });
  });

  describe('getMealsByType', () => {
    it('filters meals by type correctly', () => {
      const mockMeals = [
        { id: '1', name: 'Eggs', mealType: 'breakfast', calories: 200 },
        { id: '2', name: 'Salad', mealType: 'lunch', calories: 300 },
        { id: '3', name: 'Steak', mealType: 'dinner', calories: 500 },
        { id: '4', name: 'Toast', mealType: 'breakfast', calories: 150 },
      ];

      useMealsStore.setState({ todaysMeals: mockMeals });

      const state = useMealsStore.getState();
      const breakfastMeals = state.getMealsByType('breakfast');
      const lunchMeals = state.getMealsByType('lunch');
      const dinnerMeals = state.getMealsByType('dinner');
      const snackMeals = state.getMealsByType('snack');

      expect(breakfastMeals).toHaveLength(2);
      expect(lunchMeals).toHaveLength(1);
      expect(dinnerMeals).toHaveLength(1);
      expect(snackMeals).toHaveLength(0);
    });
  });

  describe('getTodaysTotals', () => {
    it('calculates nutrition totals correctly', () => {
      const mockMeals = [
        { id: '1', calories: 200, protein: 20, carbs: 30, fat: 10 },
        { id: '2', calories: 300, protein: 25, carbs: 40, fat: 15 },
      ];

      useMealsStore.setState({ todaysMeals: mockMeals });

      const state = useMealsStore.getState();
      const totals = state.getTodaysTotals();

      expect(totals.calories).toBe(500);
      expect(totals.protein).toBe(45);
      expect(totals.carbs).toBe(70);
      expect(totals.fat).toBe(25);
    });

    it('returns zeros for empty meals', () => {
      const state = useMealsStore.getState();
      const totals = state.getTodaysTotals();

      expect(totals.calories).toBe(0);
      expect(totals.protein).toBe(0);
      expect(totals.carbs).toBe(0);
      expect(totals.fat).toBe(0);
    });
  });

  describe('clearAnalysis', () => {
    it('clears analysis result', () => {
      useMealsStore.setState({ analysisResult: { food: { name: 'Test' } } });

      const state = useMealsStore.getState();
      state.clearAnalysis();

      expect(useMealsStore.getState().analysisResult).toBeNull();
    });
  });

  describe('clearError', () => {
    it('clears error state', () => {
      useMealsStore.setState({ error: 'Test error' });

      const state = useMealsStore.getState();
      state.clearError();

      expect(useMealsStore.getState().error).toBeNull();
    });
  });

  describe('resetMeals', () => {
    it('resets all state to initial values', () => {
      useMealsStore.setState({
        meals: [{ id: '1' }],
        todaysMeals: [{ id: '1' }],
        isLoading: true,
        isAnalyzing: true,
        error: 'Test error',
        analysisResult: { food: { name: 'Test' } },
      });

      const state = useMealsStore.getState();
      state.resetMeals();

      const newState = useMealsStore.getState();
      expect(newState.meals).toEqual([]);
      expect(newState.todaysMeals).toEqual([]);
      expect(newState.isLoading).toBe(false);
      expect(newState.isAnalyzing).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.analysisResult).toBeNull();
    });
  });
});
