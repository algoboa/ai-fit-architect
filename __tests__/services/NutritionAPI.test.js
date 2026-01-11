import {
  analyzeImage,
  searchFood,
  getFoodInfo,
  calculateTotalNutrition,
} from '../../src/services/NutritionAPI';

describe('NutritionAPI', () => {
  describe('analyzeImage', () => {
    it('should return analysis result with food data', async () => {
      const result = await analyzeImage('mock-image-uri');

      expect(result.success).toBe(true);
      expect(result.confidence).toBeGreaterThanOrEqual(0.85);
      expect(result.confidence).toBeLessThanOrEqual(0.99);
      expect(result.food).toBeDefined();
      expect(result.food.name).toBeDefined();
      expect(result.food.calories).toBeDefined();
      expect(result.food.protein).toBeDefined();
      expect(result.food.carbs).toBeDefined();
      expect(result.food.fat).toBeDefined();
      expect(result.food.servingSize).toBeDefined();
    });

    it('should return alternatives', async () => {
      const result = await analyzeImage('mock-image-uri');

      expect(result.alternatives).toBeDefined();
      expect(Array.isArray(result.alternatives)).toBe(true);
      expect(result.alternatives.length).toBeGreaterThan(0);
    });

    it('should include timestamp', async () => {
      const result = await analyzeImage('mock-image-uri');

      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('searchFood', () => {
    it('should return matching foods', async () => {
      const results = await searchFood('chicken');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name.toLowerCase()).toContain('chicken');
    });

    it('should return empty array for no matches', async () => {
      const results = await searchFood('xyz123nonexistent');

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBe(0);
    });

    it('should be case insensitive', async () => {
      const results1 = await searchFood('CHICKEN');
      const results2 = await searchFood('chicken');

      expect(results1.length).toBe(results2.length);
    });
  });

  describe('getFoodInfo', () => {
    it('should return food info for valid name', async () => {
      const result = await getFoodInfo('Chicken Breast');

      expect(result).toBeDefined();
      expect(result.name).toBe('Chicken Breast');
      expect(result.calories).toBeDefined();
    });

    it('should return null for non-existent food', async () => {
      const result = await getFoodInfo('NonExistent Food');

      expect(result).toBeNull();
    });

    it('should be case insensitive', async () => {
      const result = await getFoodInfo('chicken breast');

      expect(result).toBeDefined();
      expect(result.name).toBe('Chicken Breast');
    });
  });

  describe('calculateTotalNutrition', () => {
    it('should calculate totals correctly', () => {
      const foods = [
        { calories: 100, protein: 10, carbs: 20, fat: 5 },
        { calories: 200, protein: 20, carbs: 30, fat: 10 },
      ];

      const totals = calculateTotalNutrition(foods);

      expect(totals.calories).toBe(300);
      expect(totals.protein).toBe(30);
      expect(totals.carbs).toBe(50);
      expect(totals.fat).toBe(15);
    });

    it('should handle empty array', () => {
      const totals = calculateTotalNutrition([]);

      expect(totals.calories).toBe(0);
      expect(totals.protein).toBe(0);
      expect(totals.carbs).toBe(0);
      expect(totals.fat).toBe(0);
    });

    it('should handle missing properties', () => {
      const foods = [
        { calories: 100 },
        { protein: 10 },
      ];

      const totals = calculateTotalNutrition(foods);

      expect(totals.calories).toBe(100);
      expect(totals.protein).toBe(10);
    });
  });
});
