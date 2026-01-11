/**
 * Mock Nutrition API Service
 * Simulates AI-powered food recognition and nutritional analysis
 */

// Mock food database for simulating AI recognition
const MOCK_FOODS = [
  {
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g',
  },
  {
    name: 'Brown Rice',
    calories: 216,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup cooked',
  },
  {
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    servingSize: '1 cup',
  },
  {
    name: 'Salmon Fillet',
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    servingSize: '100g',
  },
  {
    name: 'Greek Yogurt',
    calories: 100,
    protein: 17,
    carbs: 6,
    fat: 0.7,
    servingSize: '170g container',
  },
  {
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium',
  },
  {
    name: 'Egg',
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    servingSize: '1 large',
  },
  {
    name: 'Oatmeal',
    calories: 150,
    protein: 5,
    carbs: 27,
    fat: 3,
    servingSize: '1 cup cooked',
  },
  {
    name: 'Avocado',
    calories: 160,
    protein: 2,
    carbs: 9,
    fat: 15,
    servingSize: '1/2 fruit',
  },
  {
    name: 'Mixed Salad',
    calories: 45,
    protein: 2,
    carbs: 8,
    fat: 0.5,
    servingSize: '2 cups',
  },
];

/**
 * Simulates AI-powered food image analysis
 * In production, this would call a real Vision AI API (e.g., Google Cloud Vision, Clarifai)
 *
 * @param {string} imageData - Base64 encoded image data or image URI
 * @returns {Promise<Object>} - Analyzed food information with nutritional data
 */
export async function analyzeImage(imageData) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Randomly select a food item to simulate AI recognition
  const randomIndex = Math.floor(Math.random() * MOCK_FOODS.length);
  const recognizedFood = MOCK_FOODS[randomIndex];

  // Add some variation to simulate real-world variance
  const variationFactor = 0.9 + Math.random() * 0.2; // 90% to 110%

  return {
    success: true,
    confidence: 0.85 + Math.random() * 0.14, // 85% to 99% confidence
    food: {
      name: recognizedFood.name,
      calories: Math.round(recognizedFood.calories * variationFactor),
      protein: Math.round(recognizedFood.protein * variationFactor * 10) / 10,
      carbs: Math.round(recognizedFood.carbs * variationFactor * 10) / 10,
      fat: Math.round(recognizedFood.fat * variationFactor * 10) / 10,
      servingSize: recognizedFood.servingSize,
    },
    alternatives: MOCK_FOODS.slice(0, 3).map((food) => ({
      name: food.name,
      calories: food.calories,
    })),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Search for food items by name
 *
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of matching food items
 */
export async function searchFood(query) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 300));

  const lowerQuery = query.toLowerCase();
  const results = MOCK_FOODS.filter((food) =>
    food.name.toLowerCase().includes(lowerQuery)
  );

  return results;
}

/**
 * Get nutritional information for a specific food by name
 *
 * @param {string} foodName - Name of the food
 * @returns {Promise<Object|null>} - Nutritional data or null if not found
 */
export async function getFoodInfo(foodName) {
  // Simulate API latency
  await new Promise((resolve) => setTimeout(resolve, 200));

  const lowerName = foodName.toLowerCase();
  const food = MOCK_FOODS.find((f) => f.name.toLowerCase() === lowerName);

  return food || null;
}

/**
 * Calculate total nutrition from an array of food items
 *
 * @param {Array} foods - Array of food items with nutritional data
 * @returns {Object} - Total nutritional values
 */
export function calculateTotalNutrition(foods) {
  return foods.reduce(
    (totals, food) => ({
      calories: totals.calories + (food.calories || 0),
      protein: totals.protein + (food.protein || 0),
      carbs: totals.carbs + (food.carbs || 0),
      fat: totals.fat + (food.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
}

export default {
  analyzeImage,
  searchFood,
  getFoodInfo,
  calculateTotalNutrition,
};
