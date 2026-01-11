import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { colors, spacing, typography } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

const DIET_OPTIONS = [
  { id: 'none', label: 'No Restrictions' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'halal', label: 'Halal' },
  { id: 'kosher', label: 'Kosher' },
];

const ALLERGY_OPTIONS = [
  { id: 'gluten', label: 'Gluten' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'nuts', label: 'Nuts' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'soy', label: 'Soy' },
  { id: 'shellfish', label: 'Shellfish' },
  { id: 'fish', label: 'Fish' },
  { id: 'wheat', label: 'Wheat' },
];

export default function DietStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  const toggleDietRestriction = (id) => {
    const current = onboardingData.dietRestrictions || [];
    if (current.includes(id)) {
      updateOnboardingData({
        dietRestrictions: current.filter((item) => item !== id),
      });
    } else {
      updateOnboardingData({
        dietRestrictions: [...current, id],
      });
    }
  };

  const toggleAllergy = (id) => {
    const current = onboardingData.allergies || [];
    if (current.includes(id)) {
      updateOnboardingData({
        allergies: current.filter((item) => item !== id),
      });
    } else {
      updateOnboardingData({
        allergies: [...current, id],
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Select any dietary preferences or restrictions you follow.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diet Type</Text>
        <View style={styles.chipContainer}>
          {DIET_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              testID={`diet-${option.id}`}
              selected={onboardingData.dietRestrictions?.includes(option.id)}
              onPress={() => toggleDietRestriction(option.id)}
              style={[
                styles.chip,
                onboardingData.dietRestrictions?.includes(option.id) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                onboardingData.dietRestrictions?.includes(option.id) && styles.selectedChipText,
              ]}
              showSelectedCheck={false}
            >
              {option.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allergies & Intolerances</Text>
        <Text style={styles.sectionDescription}>
          Select any foods you need to avoid.
        </Text>
        <View style={styles.chipContainer}>
          {ALLERGY_OPTIONS.map((option) => (
            <Chip
              key={option.id}
              testID={`allergy-${option.id}`}
              selected={onboardingData.allergies?.includes(option.id)}
              onPress={() => toggleAllergy(option.id)}
              style={[
                styles.chip,
                onboardingData.allergies?.includes(option.id) && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                onboardingData.allergies?.includes(option.id) && styles.selectedChipText,
              ]}
              showSelectedCheck={false}
            >
              {option.label}
            </Chip>
          ))}
        </View>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  chip: {
    margin: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.text,
  },
  selectedChipText: {
    color: colors.background,
  },
});
