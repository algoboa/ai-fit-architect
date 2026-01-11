import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useAuthStore } from '../store/authStore';

// Mock data for dashboard
const MOCK_DATA = {
  todayWorkout: {
    name: 'Upper Body Strength',
    exercises: 6,
    duration: '45 min',
  },
  nutrition: {
    calories: { current: 1450, target: 2200 },
    protein: { current: 85, target: 150 },
    carbs: { current: 120, target: 220 },
    fat: { current: 45, target: 70 },
  },
  weekProgress: {
    workoutsCompleted: 3,
    workoutsTotal: 5,
    streak: 7,
  },
  bodyStats: {
    weight: [72.5, 72.3, 72.1, 71.8, 71.5],
    dates: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
};

const NutritionRing = React.memo(function NutritionRing({ label, current, target, color }) {
  const progress = useMemo(() => Math.min(current / target, 1), [current, target]);

  return (
    <View style={styles.nutritionRing}>
      <View style={styles.ringContainer}>
        <ProgressBar
          progress={progress}
          color={color}
          style={styles.progressRing}
        />
        <Text style={styles.ringValue}>{current}</Text>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
      <Text style={styles.ringTarget}>of {target}</Text>
    </View>
  );
});

export default function DashboardScreen({ navigation }) {
  const { userProfile, logout } = useAuthStore();
  const userName = userProfile?.name || 'Athlete';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
            <Text style={styles.date}>{formatDate()}</Text>
          </View>
          <Button
            mode="text"
            onPress={logout}
            textColor={colors.textSecondary}
          >
            Logout
          </Button>
        </View>

        {/* Today's Workout Card */}
        <Card style={styles.workoutCard} testID="workout-card">
          <Card.Content>
            <Text style={styles.cardLabel}>TODAY'S WORKOUT</Text>
            <Text style={styles.workoutName}>{MOCK_DATA.todayWorkout.name}</Text>
            <View style={styles.workoutDetails}>
              <Text style={styles.workoutDetail}>
                {MOCK_DATA.todayWorkout.exercises} exercises
              </Text>
              <Text style={styles.workoutDetailDivider}>•</Text>
              <Text style={styles.workoutDetail}>
                {MOCK_DATA.todayWorkout.duration}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Training')}
              style={styles.startButton}
              buttonColor={colors.primary}
              textColor={colors.background}
            >
              Start Workout
            </Button>
          </Card.Content>
        </Card>

        {/* Nutrition Card */}
        <Card style={styles.nutritionCard} testID="nutrition-card">
          <Card.Content>
            <Text style={styles.cardLabel}>TODAY'S NUTRITION</Text>
            <View style={styles.nutritionGrid}>
              <NutritionRing
                label="Calories"
                current={MOCK_DATA.nutrition.calories.current}
                target={MOCK_DATA.nutrition.calories.target}
                color={colors.primary}
              />
              <NutritionRing
                label="Protein"
                current={MOCK_DATA.nutrition.protein.current}
                target={MOCK_DATA.nutrition.protein.target}
                color={colors.success}
              />
              <NutritionRing
                label="Carbs"
                current={MOCK_DATA.nutrition.carbs.current}
                target={MOCK_DATA.nutrition.carbs.target}
                color={colors.warning}
              />
              <NutritionRing
                label="Fat"
                current={MOCK_DATA.nutrition.fat.current}
                target={MOCK_DATA.nutrition.fat.target}
                color={colors.accent}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Progress Summary Card */}
        <Card style={styles.progressCard} testID="progress-card">
          <Card.Content>
            <Text style={styles.cardLabel}>THIS WEEK</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressValue}>
                  {MOCK_DATA.weekProgress.workoutsCompleted}/{MOCK_DATA.weekProgress.workoutsTotal}
                </Text>
                <Text style={styles.progressLabel}>Workouts</Text>
              </View>
              <View style={styles.progressDivider} />
              <View style={styles.progressStat}>
                <Text style={styles.progressValue}>
                  {MOCK_DATA.weekProgress.streak}
                </Text>
                <Text style={styles.progressLabel}>Day Streak</Text>
              </View>
            </View>
            <ProgressBar
              progress={MOCK_DATA.weekProgress.workoutsCompleted / MOCK_DATA.weekProgress.workoutsTotal}
              color={colors.success}
              style={styles.weekProgressBar}
            />
          </Card.Content>
        </Card>

        {/* Weight Chart Placeholder */}
        <Card style={styles.chartCard} testID="chart-card">
          <Card.Content>
            <Text style={styles.cardLabel}>WEIGHT TREND</Text>
            <View style={styles.chartPlaceholder}>
              <View style={styles.chartBars}>
                {MOCK_DATA.bodyStats.weight.map((weight, index) => (
                  <View key={index} style={styles.chartBarContainer}>
                    <View
                      style={[
                        styles.chartBar,
                        {
                          height: ((weight - 70) / 5) * 100 + 20,
                          backgroundColor: index === MOCK_DATA.bodyStats.weight.length - 1
                            ? colors.primary
                            : colors.surfaceVariant,
                        },
                      ]}
                    />
                    <Text style={styles.chartLabel}>
                      {MOCK_DATA.bodyStats.dates[index]}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartStats}>
                <Text style={styles.chartCurrentWeight}>
                  {MOCK_DATA.bodyStats.weight[MOCK_DATA.bodyStats.weight.length - 1]} kg
                </Text>
                <Text style={styles.chartChange}>
                  -1.0 kg this week
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    ...typography.h2,
    color: colors.text,
  },
  date: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  workoutName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  workoutDetail: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  workoutDetailDivider: {
    ...typography.body2,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
  startButton: {
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
  },
  nutritionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  nutritionRing: {
    alignItems: 'center',
    flex: 1,
  },
  ringContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressRing: {
    position: 'absolute',
    width: '100%',
    height: 8,
    borderRadius: 4,
    top: 26,
  },
  ringValue: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
  },
  ringLabel: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
  },
  ringTarget: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressStat: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  progressValue: {
    ...typography.h2,
    color: colors.primary,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  progressDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  weekProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceVariant,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  chartPlaceholder: {
    marginTop: spacing.md,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: spacing.md,
  },
  chartBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 24,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  chartLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartCurrentWeight: {
    ...typography.h3,
    color: colors.text,
  },
  chartChange: {
    ...typography.body2,
    color: colors.success,
  },
});
