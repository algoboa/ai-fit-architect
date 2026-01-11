import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Card } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

const GOALS = [
  {
    id: 'muscle_gain',
    title: 'Build Muscle',
    description: 'Increase muscle mass and strength',
    icon: '💪',
  },
  {
    id: 'weight_loss',
    title: 'Lose Weight',
    description: 'Burn fat and achieve a leaner physique',
    icon: '🔥',
  },
  {
    id: 'maintenance',
    title: 'Stay Fit',
    description: 'Maintain current fitness and health',
    icon: '⚡',
  },
  {
    id: 'endurance',
    title: 'Build Endurance',
    description: 'Improve cardiovascular fitness',
    icon: '🏃',
  },
];

export default function GoalsStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        What's your primary fitness goal?
      </Text>

      <View style={styles.goalsGrid}>
        {GOALS.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            testID={`goal-${goal.id}`}
            onPress={() => updateOnboardingData({ primaryGoal: goal.id })}
            style={styles.goalCardWrapper}
          >
            <Card
              style={[
                styles.goalCard,
                onboardingData.primaryGoal === goal.id && styles.selectedCard,
              ]}
            >
              <Card.Content style={styles.cardContent}>
                <Text style={styles.goalIcon}>{goal.icon}</Text>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Target Weight (kg) - Optional</Text>
        <TextInput
          testID="target-weight-input"
          value={onboardingData.targetWeight}
          onChangeText={(text) => updateOnboardingData({ targetWeight: text })}
          mode="outlined"
          keyboardType="decimal-pad"
          placeholder="65"
          style={styles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          textColor={colors.text}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Target Body Fat % - Optional</Text>
        <TextInput
          testID="target-bodyfat-input"
          value={onboardingData.targetBodyFat}
          onChangeText={(text) => updateOnboardingData({ targetBodyFat: text })}
          mode="outlined"
          keyboardType="decimal-pad"
          placeholder="15"
          style={styles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          textColor={colors.text}
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
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  goalCardWrapper: {
    width: '50%',
    padding: spacing.xs,
  },
  goalCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceVariant,
  },
  cardContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  goalIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  goalTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  goalDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.body2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
  },
});
