import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, Button, IconButton } from 'react-native-paper';
import { colors, spacing, typography } from '../../theme';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';

// Import step components
import ProfileStep from './steps/ProfileStep';
import GoalsStep from './steps/GoalsStep';
import ExperienceStep from './steps/ExperienceStep';
import LifestyleStep from './steps/LifestyleStep';
import DietStep from './steps/DietStep';
import EquipmentStep from './steps/EquipmentStep';

const STEP_TITLES = [
  'Personal Profile',
  'Fitness Goals',
  'Experience Level',
  'Lifestyle',
  'Diet & Restrictions',
  'Equipment',
];

export default function OnboardingScreen({ navigation }) {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    onboardingData,
    completeOnboarding,
    getProgress,
  } = useOnboardingStore();

  const { user, saveUserProfile } = useAuthStore();

  const handleNext = async () => {
    if (currentStep === totalSteps - 1) {
      // Final step - save data to Firestore
      try {
        await saveUserProfile(user.uid, {
          ...onboardingData,
          onboardingComplete: true,
        });
        completeOnboarding();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      navigation.goBack();
    } else {
      previousStep();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <ProfileStep />;
      case 1:
        return <GoalsStep />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <LifestyleStep />;
      case 4:
        return <DietStep />;
      case 5:
        return <EquipmentStep />;
      default:
        return null;
    }
  };

  const progress = getProgress() / 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          testID="back-button"
          icon="arrow-left"
          iconColor={colors.text}
          size={24}
          onPress={handleBack}
        />
        <View style={styles.progressContainer}>
          <Text style={styles.stepIndicator}>
            Step {currentStep + 1} of {totalSteps}
          </Text>
          <ProgressBar
            testID="progress-bar"
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
        </View>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.stepTitle}>{STEP_TITLES[currentStep]}</Text>
        {renderStep()}
      </View>

      <View style={styles.footer}>
        <Button
          testID="next-button"
          mode="contained"
          onPress={handleNext}
          style={styles.nextButton}
          labelStyle={styles.buttonLabel}
          buttonColor={colors.primary}
          textColor={colors.background}
        >
          {currentStep === totalSteps - 1 ? 'Complete' : 'Continue'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.lg,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  stepIndicator: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  progressBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surfaceVariant,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  stepTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  nextButton: {
    borderRadius: 8,
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    ...typography.button,
  },
});
