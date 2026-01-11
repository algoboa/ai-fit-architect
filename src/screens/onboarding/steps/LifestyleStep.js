import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

const ACTIVITY_LEVELS = [
  {
    id: 'sedentary',
    title: 'Sedentary',
    description: 'Little to no exercise, desk job',
    icon: '🪑',
    multiplier: 1.2,
  },
  {
    id: 'light',
    title: 'Lightly Active',
    description: 'Light exercise 1-3 days/week',
    icon: '🚶',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    title: 'Moderately Active',
    description: 'Moderate exercise 3-5 days/week',
    icon: '🏃',
    multiplier: 1.55,
  },
  {
    id: 'active',
    title: 'Very Active',
    description: 'Hard exercise 6-7 days/week',
    icon: '🏋️',
    multiplier: 1.725,
  },
  {
    id: 'very_active',
    title: 'Extremely Active',
    description: 'Very hard exercise, physical job',
    icon: '⚡',
    multiplier: 1.9,
  },
];

export default function LifestyleStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        How would you describe your daily activity level?
      </Text>

      <View style={styles.levelsContainer}>
        {ACTIVITY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            testID={`activity-${level.id}`}
            onPress={() => updateOnboardingData({ activityLevel: level.id })}
          >
            <Card
              style={[
                styles.levelCard,
                onboardingData.activityLevel === level.id && styles.selectedCard,
              ]}
            >
              <Card.Content style={styles.cardContent}>
                <Text style={styles.levelIcon}>{level.icon}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  <Text style={styles.levelDescription}>{level.description}</Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  description: {
    ...typography.body1,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  levelsContainer: {
    marginBottom: spacing.lg,
  },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceVariant,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  levelIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  levelDescription: {
    ...typography.body2,
    color: colors.textSecondary,
  },
});
