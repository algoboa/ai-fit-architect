import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, SegmentedButtons } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

const EXPERIENCE_LEVELS = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to fitness or returning after a long break',
    icon: '🌱',
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: '1-3 years of consistent training experience',
    icon: '🌿',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: '3+ years of structured training experience',
    icon: '🌳',
  },
];

const FREQUENCY_OPTIONS = [
  { value: '2', label: '2x/week' },
  { value: '3', label: '3x/week' },
  { value: '4', label: '4x/week' },
  { value: '5', label: '5+/week' },
];

export default function ExperienceStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        What's your current fitness experience level?
      </Text>

      <View style={styles.levelsContainer}>
        {EXPERIENCE_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.id}
            testID={`level-${level.id}`}
            onPress={() => updateOnboardingData({ experienceLevel: level.id })}
          >
            <Card
              style={[
                styles.levelCard,
                onboardingData.experienceLevel === level.id && styles.selectedCard,
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>How often do you want to train?</Text>
        <SegmentedButtons
          testID="frequency-selector"
          value={onboardingData.weeklyFrequency}
          onValueChange={(value) => updateOnboardingData({ weeklyFrequency: value })}
          buttons={FREQUENCY_OPTIONS}
          style={styles.segmentedButtons}
        />
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
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  segmentedButtons: {
    backgroundColor: colors.surface,
  },
});
