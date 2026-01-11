import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, borderRadius, spacing } from '../theme';

// Base skeleton component with shimmer animation
function SkeletonBox({ width, height, borderRadius: radius = borderRadius.sm, style }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius: radius,
          opacity,
        },
        style,
      ]}
    />
  );
}

// Card skeleton for dashboard cards
export function SkeletonCard({ style }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonBox width="40%" height={12} style={styles.marginBottom} />
      <SkeletonBox width="80%" height={24} style={styles.marginBottom} />
      <SkeletonBox width="60%" height={16} />
    </View>
  );
}

// Nutrition summary skeleton
export function SkeletonNutritionSummary() {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <SkeletonBox width={80} height={48} style={styles.marginBottom} />
          <SkeletonBox width={100} height={14} />
        </View>
        <View style={styles.alignEnd}>
          <SkeletonBox width={60} height={32} style={styles.marginBottom} />
          <SkeletonBox width={70} height={14} />
        </View>
      </View>
      <SkeletonBox width="100%" height={8} borderRadius={4} style={styles.progressBar} />
      <View style={styles.macroGrid}>
        <View style={styles.macroItem}>
          <SkeletonBox width={50} height={12} style={styles.marginBottomSm} />
          <SkeletonBox width="100%" height={6} borderRadius={3} style={styles.marginBottomSm} />
          <SkeletonBox width={60} height={10} />
        </View>
        <View style={styles.macroItem}>
          <SkeletonBox width={50} height={12} style={styles.marginBottomSm} />
          <SkeletonBox width="100%" height={6} borderRadius={3} style={styles.marginBottomSm} />
          <SkeletonBox width={60} height={10} />
        </View>
        <View style={styles.macroItem}>
          <SkeletonBox width={50} height={12} style={styles.marginBottomSm} />
          <SkeletonBox width="100%" height={6} borderRadius={3} style={styles.marginBottomSm} />
          <SkeletonBox width={60} height={10} />
        </View>
      </View>
    </View>
  );
}

// Meal section skeleton
export function SkeletonMealSection() {
  return (
    <View style={styles.mealSection}>
      <View style={styles.sectionHeader}>
        <SkeletonBox width={24} height={24} borderRadius={12} />
        <SkeletonBox width={80} height={16} style={styles.marginLeft} />
        <View style={styles.flex1} />
        <SkeletonBox width={60} height={14} />
      </View>
      <View style={styles.mealCard}>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <SkeletonBox width="70%" height={16} style={styles.marginBottomSm} />
            <SkeletonBox width="40%" height={12} style={styles.marginBottomSm} />
            <View style={styles.chipRow}>
              <SkeletonBox width={45} height={20} borderRadius={10} style={styles.chip} />
              <SkeletonBox width={45} height={20} borderRadius={10} style={styles.chip} />
              <SkeletonBox width={45} height={20} borderRadius={10} />
            </View>
          </View>
          <SkeletonBox width={50} height={28} />
        </View>
      </View>
    </View>
  );
}

// Workout exercise skeleton
export function SkeletonExercise() {
  return (
    <View style={styles.exerciseCard}>
      <SkeletonBox width={40} height={40} borderRadius={20} />
      <View style={[styles.flex1, styles.marginLeft]}>
        <SkeletonBox width="60%" height={18} style={styles.marginBottomSm} />
        <SkeletonBox width="80%" height={14} style={styles.marginBottomSm} />
        <SkeletonBox width="40%" height={12} />
      </View>
      <SkeletonBox width={32} height={32} borderRadius={16} />
    </View>
  );
}

// Progress stat card skeleton
export function SkeletonStatCard() {
  return (
    <View style={styles.statCard}>
      <SkeletonBox width="60%" height={12} style={styles.marginBottomSm} />
      <SkeletonBox width="80%" height={28} style={styles.marginBottomSm} />
      <SkeletonBox width="40%" height={14} />
    </View>
  );
}

// Chart skeleton
export function SkeletonChart() {
  return (
    <View style={styles.card}>
      <View style={styles.chartHeader}>
        <SkeletonBox width={100} height={16} />
        <View style={styles.alignEnd}>
          <SkeletonBox width={60} height={20} style={styles.marginBottomSm} />
          <SkeletonBox width={50} height={12} />
        </View>
      </View>
      <View style={styles.chartBars}>
        {[...Array(7)].map((_, i) => (
          <View key={i} style={styles.barWrapper}>
            <SkeletonBox width={20} height={40 + Math.random() * 60} style={styles.bar} />
            <SkeletonBox width={24} height={10} style={styles.barLabel} />
          </View>
        ))}
      </View>
    </View>
  );
}

// Full screen loading skeleton
export function SkeletonScreen({ variant = 'dashboard' }) {
  if (variant === 'meals') {
    return (
      <View style={styles.screen}>
        <SkeletonNutritionSummary />
        <SkeletonMealSection />
        <SkeletonMealSection />
      </View>
    );
  }

  if (variant === 'workout') {
    return (
      <View style={styles.screen}>
        <SkeletonCard />
        <SkeletonExercise />
        <SkeletonExercise />
        <SkeletonExercise />
      </View>
    );
  }

  if (variant === 'progress') {
    return (
      <View style={styles.screen}>
        <View style={styles.statsRow}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>
        <View style={styles.statsRow}>
          <SkeletonStatCard />
          <SkeletonStatCard />
        </View>
        <SkeletonChart />
      </View>
    );
  }

  // Default dashboard
  return (
    <View style={styles.screen}>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.surfaceVariant,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  marginBottom: {
    marginBottom: spacing.md,
  },
  marginBottomSm: {
    marginBottom: spacing.sm,
  },
  marginLeft: {
    marginLeft: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  progressBar: {
    marginVertical: spacing.md,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroItem: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  mealSection: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: spacing.xs,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    marginBottom: spacing.xs,
  },
  barLabel: {
    marginTop: spacing.xs,
  },
  screen: {
    padding: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.sm,
  },
});

export default SkeletonBox;
