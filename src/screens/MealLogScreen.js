import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Text,
  Card,
  FAB,
  Chip,
  ProgressBar,
  Portal,
  Modal,
  Button,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useMealsStore } from '../store/mealsStore';
import { useAuthStore } from '../store/authStore';
import CameraModal from '../components/CameraModal';
import logger from '../utils/logger';

const NUTRITION_TARGETS = {
  calories: 2200,
  protein: 150,
  carbs: 220,
  fat: 70,
};

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealSection = React.memo(function MealSection({ title, meals, icon }) {
  const sectionCalories = useMemo(
    () => meals.reduce((sum, meal) => sum + (meal.calories || 0), 0),
    [meals]
  );

  return (
    <View style={styles.mealSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionCalories}>{sectionCalories} kcal</Text>
      </View>
      {meals.length === 0 ? (
        <Card style={styles.emptyMealCard}>
          <Card.Content>
            <Text style={styles.emptyText}>No meals logged yet</Text>
          </Card.Content>
        </Card>
      ) : (
        meals.map((meal) => (
          <Card key={meal.id} style={styles.mealCard}>
            <Card.Content style={styles.mealContent}>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>
                  {new Date(meal.createdAt).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </Text>
                <View style={styles.macroChips}>
                  <Chip compact textStyle={styles.chipText} style={styles.chip}>
                    P: {meal.protein}g
                  </Chip>
                  <Chip compact textStyle={styles.chipText} style={styles.chip}>
                    C: {meal.carbs}g
                  </Chip>
                  <Chip compact textStyle={styles.chipText} style={styles.chip}>
                    F: {meal.fat}g
                  </Chip>
                </View>
              </View>
              <Text style={styles.mealCalories}>{meal.calories}</Text>
            </Card.Content>
          </Card>
        ))
      )}
    </View>
  );
});

export default function MealLogScreen() {
  const [showCamera, setShowCamera] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState('lunch');

  const { user } = useAuthStore();
  const {
    todaysMeals,
    isLoading,
    isAnalyzing,
    analysisResult,
    analyzeFood,
    saveMeal,
    clearAnalysis,
    fetchMealsByDate,
    getMealsByType,
    getTodaysTotals,
  } = useMealsStore();

  useEffect(() => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      fetchMealsByDate(user.uid, today).catch(console.error);
    }
  }, [user]);

  const totals = getTodaysTotals();

  const handleOpenCamera = useCallback(() => {
    setShowCamera(true);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setShowCamera(false);
  }, []);

  const handlePhotoCapture = useCallback(async (photo) => {
    setCapturedPhoto(photo);
    setShowCamera(false);
    setShowAnalysisModal(true);

    try {
      await analyzeFood(photo.uri);
    } catch (error) {
      logger.error('Error analyzing food', error);
    }
  }, [analyzeFood]);

  const handleSaveMeal = useCallback(async () => {
    if (!analysisResult || !user) return;

    try {
      await saveMeal(user.uid, {
        name: analysisResult.food.name,
        calories: analysisResult.food.calories,
        protein: analysisResult.food.protein,
        carbs: analysisResult.food.carbs,
        fat: analysisResult.food.fat,
        servingSize: analysisResult.food.servingSize,
        mealType: selectedMealType,
        imageUri: capturedPhoto?.uri,
      });

      setShowAnalysisModal(false);
      setCapturedPhoto(null);
      clearAnalysis();
    } catch (error) {
      logger.error('Error saving meal', error);
    }
  }, [analysisResult, user, saveMeal, selectedMealType, capturedPhoto, clearAnalysis]);

  const handleCancelAnalysis = useCallback(() => {
    setShowAnalysisModal(false);
    setCapturedPhoto(null);
    clearAnalysis();
  }, [clearAnalysis]);

  // Memoize meal sections to prevent re-renders
  const breakfastMeals = useMemo(() => getMealsByType('breakfast'), [todaysMeals]);
  const lunchMeals = useMemo(() => getMealsByType('lunch'), [todaysMeals]);
  const dinnerMeals = useMemo(() => getMealsByType('dinner'), [todaysMeals]);
  const snackMeals = useMemo(() => getMealsByType('snack'), [todaysMeals]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Log</Text>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Nutrition Summary Card */}
        <Card style={styles.summaryCard} testID="nutrition-summary">
          <Card.Content>
            <View style={styles.caloriesHeader}>
              <View>
                <Text style={styles.caloriesValue}>{totals.calories}</Text>
                <Text style={styles.caloriesLabel}>of {NUTRITION_TARGETS.calories} kcal</Text>
              </View>
              <View style={styles.remainingCalories}>
                <Text style={styles.remainingValue}>
                  {Math.max(NUTRITION_TARGETS.calories - totals.calories, 0)}
                </Text>
                <Text style={styles.remainingLabel}>remaining</Text>
              </View>
            </View>
            <ProgressBar
              progress={Math.min(totals.calories / NUTRITION_TARGETS.calories, 1)}
              color={colors.primary}
              style={styles.caloriesProgress}
            />

            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Protein</Text>
                <ProgressBar
                  progress={Math.min(totals.protein / NUTRITION_TARGETS.protein, 1)}
                  color={colors.success}
                  style={styles.macroProgress}
                />
                <Text style={styles.macroValue}>
                  {Math.round(totals.protein)}g / {NUTRITION_TARGETS.protein}g
                </Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Carbs</Text>
                <ProgressBar
                  progress={Math.min(totals.carbs / NUTRITION_TARGETS.carbs, 1)}
                  color={colors.warning}
                  style={styles.macroProgress}
                />
                <Text style={styles.macroValue}>
                  {Math.round(totals.carbs)}g / {NUTRITION_TARGETS.carbs}g
                </Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroLabel}>Fat</Text>
                <ProgressBar
                  progress={Math.min(totals.fat / NUTRITION_TARGETS.fat, 1)}
                  color={colors.accent}
                  style={styles.macroProgress}
                />
                <Text style={styles.macroValue}>
                  {Math.round(totals.fat)}g / {NUTRITION_TARGETS.fat}g
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Meal Sections */}
        <MealSection
          title="Breakfast"
          meals={breakfastMeals}
          icon="🍳"
        />
        <MealSection
          title="Lunch"
          meals={lunchMeals}
          icon="🥗"
        />
        <MealSection
          title="Dinner"
          meals={dinnerMeals}
          icon="🍽️"
        />
        <MealSection
          title="Snacks"
          meals={snackMeals}
          icon="🍎"
        />
      </ScrollView>

      {/* Add Meal FAB */}
      <FAB
        style={styles.fab}
        icon="camera"
        label="Add Meal"
        onPress={handleOpenCamera}
        color={colors.background}
        testID="add-meal-fab"
      />

      {/* Camera Modal */}
      <CameraModal
        visible={showCamera}
        onClose={handleCloseCamera}
        onCapture={handlePhotoCapture}
      />

      {/* AI Analysis Modal */}
      <Portal>
        <Modal
          visible={showAnalysisModal}
          onDismiss={handleCancelAnalysis}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>AI Analysis Result</Text>

          {isAnalyzing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Analyzing your food...</Text>
            </View>
          ) : analysisResult ? (
            <View style={styles.modalContent}>
              {capturedPhoto && (
                <Image
                  source={{ uri: capturedPhoto.uri }}
                  style={styles.previewImage}
                />
              )}

              <Text style={styles.analyzedName}>{analysisResult.food.name}</Text>
              <Text style={styles.servingSize}>
                Serving: {analysisResult.food.servingSize}
              </Text>

              <View style={styles.analyzedMacros}>
                <View style={styles.analyzedMacro}>
                  <Text style={styles.analyzedValue}>
                    {analysisResult.food.calories}
                  </Text>
                  <Text style={styles.analyzedLabel}>Calories</Text>
                </View>
                <View style={styles.analyzedMacro}>
                  <Text style={styles.analyzedValue}>
                    {analysisResult.food.protein}g
                  </Text>
                  <Text style={styles.analyzedLabel}>Protein</Text>
                </View>
                <View style={styles.analyzedMacro}>
                  <Text style={styles.analyzedValue}>
                    {analysisResult.food.carbs}g
                  </Text>
                  <Text style={styles.analyzedLabel}>Carbs</Text>
                </View>
                <View style={styles.analyzedMacro}>
                  <Text style={styles.analyzedValue}>
                    {analysisResult.food.fat}g
                  </Text>
                  <Text style={styles.analyzedLabel}>Fat</Text>
                </View>
              </View>

              <Text style={styles.mealTypeLabel}>Meal Type</Text>
              <SegmentedButtons
                value={selectedMealType}
                onValueChange={setSelectedMealType}
                buttons={[
                  { value: 'breakfast', label: 'Breakfast' },
                  { value: 'lunch', label: 'Lunch' },
                  { value: 'dinner', label: 'Dinner' },
                  { value: 'snack', label: 'Snack' },
                ]}
                style={styles.mealTypeButtons}
              />
            </View>
          ) : null}

          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={handleCancelAnalysis}
              style={styles.modalButton}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveMeal}
              buttonColor={colors.primary}
              style={styles.modalButton}
              disabled={isAnalyzing || isLoading}
              loading={isLoading}
            >
              Save Meal
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  date: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  caloriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  caloriesValue: {
    ...typography.h1,
    color: colors.primary,
  },
  caloriesLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  remainingCalories: {
    alignItems: 'flex-end',
  },
  remainingValue: {
    ...typography.h3,
    color: colors.success,
  },
  remainingLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  caloriesProgress: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.lg,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  macroLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  macroProgress: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceVariant,
    marginBottom: spacing.xs,
  },
  macroValue: {
    ...typography.caption,
    color: colors.text,
    fontSize: 10,
  },
  mealSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  sectionCalories: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  emptyMealCard: {
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  mealContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    ...typography.body1,
    fontWeight: '500',
    color: colors.text,
  },
  mealTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  macroChips: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  chip: {
    marginRight: spacing.xs,
    backgroundColor: colors.surfaceVariant,
    height: 24,
  },
  chipText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text,
  },
  mealCalories: {
    ...typography.h3,
    color: colors.primary,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    maxHeight: '80%',
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  loadingText: {
    ...typography.body1,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  modalContent: {
    marginBottom: spacing.lg,
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  analyzedName: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
  },
  servingSize: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  analyzedMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.lg,
  },
  analyzedMacro: {
    alignItems: 'center',
  },
  analyzedValue: {
    ...typography.h3,
    color: colors.primary,
  },
  analyzedLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mealTypeLabel: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  mealTypeButtons: {
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
