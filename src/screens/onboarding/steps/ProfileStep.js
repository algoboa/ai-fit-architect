import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { colors, spacing, typography } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

export default function ProfileStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        Let's start with some basic information to personalize your experience.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Age</Text>
        <TextInput
          testID="age-input"
          value={onboardingData.age}
          onChangeText={(text) => updateOnboardingData({ age: text })}
          mode="outlined"
          keyboardType="number-pad"
          placeholder="25"
          style={styles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          textColor={colors.text}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender</Text>
        <SegmentedButtons
          testID="gender-selector"
          value={onboardingData.gender}
          onValueChange={(value) => updateOnboardingData({ gender: value })}
          buttons={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Height (cm)</Text>
        <TextInput
          testID="height-input"
          value={onboardingData.height}
          onChangeText={(text) => updateOnboardingData({ height: text })}
          mode="outlined"
          keyboardType="number-pad"
          placeholder="170"
          style={styles.input}
          outlineColor={colors.border}
          activeOutlineColor={colors.primary}
          textColor={colors.text}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Current Weight (kg)</Text>
        <TextInput
          testID="weight-input"
          value={onboardingData.weight}
          onChangeText={(text) => updateOnboardingData({ weight: text })}
          mode="outlined"
          keyboardType="decimal-pad"
          placeholder="70"
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
  segmentedButtons: {
    backgroundColor: colors.surface,
  },
});
