import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, FAB, TextInput, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useWorkoutStore } from '../store/workoutStore';
import { useAuthStore } from '../store/authStore';
import PoseOverlay from '../components/PoseOverlay';
import logger from '../utils/logger';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const RestTimer = React.memo(function RestTimer({ timeRemaining, onSkip }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <View style={styles.restTimerContainer}>
      <Text style={styles.restTitle}>Rest Time</Text>
      <Text style={styles.restTime}>
        {minutes}:{seconds.toString().padStart(2, '0')}
      </Text>
      <Button mode="contained" onPress={onSkip} buttonColor={colors.accent}>
        Skip Rest
      </Button>
    </View>
  );
});

const ExerciseCard = React.memo(function ExerciseCard({ exercise, completedSets, isActive, onStart }) {
  const setsCompleted = completedSets.length;
  const isCompleted = setsCompleted >= exercise.sets;

  return (
    <Card
      style={[
        styles.exerciseCard,
        isCompleted && styles.completedCard,
        isActive && styles.activeCard,
      ]}
    >
      <Card.Content style={styles.exerciseContent}>
        <Text style={styles.exerciseIcon}>{exercise.icon}</Text>
        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDetails}>
            {exercise.sets} sets × {exercise.targetReps} • {exercise.weight} kg
          </Text>
          <Text style={styles.exerciseProgress}>
            {setsCompleted}/{exercise.sets} sets completed
          </Text>
        </View>
        <IconButton
          icon={isCompleted ? 'check-circle' : isActive ? 'play-circle' : 'play-circle-outline'}
          iconColor={isCompleted ? colors.success : isActive ? colors.primary : colors.textSecondary}
          size={32}
          onPress={() => !isCompleted && onStart()}
        />
      </Card.Content>
    </Card>
  );
});

export default function WorkoutScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showSetModal, setShowSetModal] = useState(false);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const intervalRef = useRef(null);

  const { user } = useAuthStore();
  const {
    currentWorkout,
    currentExerciseIndex,
    currentSetIndex,
    completedSets,
    isWorkoutActive,
    isResting,
    restTimeRemaining,
    workoutDuration,
    isCameraActive,
    poseKeypoints,
    formScore,
    formFeedback,
    startWorkout,
    endWorkout,
    getCurrentExercise,
    completeSet,
    skipRest,
    updateRestTime,
    updateDuration,
    toggleCamera,
    generateMockPose,
    saveWorkout,
    getExerciseSets,
    isWorkoutComplete,
  } = useWorkoutStore();

  const currentExercise = getCurrentExercise();

  // Update workout duration every second
  useEffect(() => {
    if (isWorkoutActive) {
      intervalRef.current = setInterval(() => {
        updateDuration();
        if (isResting) {
          updateRestTime(restTimeRemaining - 1);
        }
        if (isCameraActive) {
          generateMockPose();
        }
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [isWorkoutActive, isResting, isCameraActive, restTimeRemaining]);

  // Memoize format duration function
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Memoize formatted duration string
  const formattedDuration = useMemo(() => formatDuration(workoutDuration), [workoutDuration, formatDuration]);

  const handleStartWorkout = useCallback(() => {
    startWorkout();
  }, [startWorkout]);

  const handleEndWorkout = useCallback(async () => {
    if (user && completedSets.length > 0) {
      try {
        await saveWorkout(user.uid);
      } catch (error) {
        logger.error('Error saving workout', error);
      }
    }
    endWorkout();
  }, [user, completedSets.length, saveWorkout, endWorkout]);

  const handleCompleteSet = useCallback(() => {
    if (currentExercise) {
      setWeight(currentExercise.weight.toString());
    }
    setShowSetModal(true);
  }, [currentExercise]);

  const handleSaveSet = useCallback(() => {
    const numReps = parseInt(reps, 10) || 0;
    const numWeight = parseFloat(weight) || 0;
    completeSet(numReps, numWeight);
    setShowSetModal(false);
    setReps('');
    setWeight('');
  }, [reps, weight, completeSet]);

  // Pre-workout view
  if (!isWorkoutActive) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.headerLabel}>TODAY'S WORKOUT</Text>
            <Text style={styles.headerTitle}>Upper Body Strength</Text>
          </View>

          <Card style={styles.summaryCard}>
            <Card.Content style={styles.summaryContent}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>6</Text>
                <Text style={styles.summaryLabel}>Exercises</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>20</Text>
                <Text style={styles.summaryLabel}>Total Sets</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStat}>
                <Text style={styles.summaryValue}>~45</Text>
                <Text style={styles.summaryLabel}>Minutes</Text>
              </View>
            </Card.Content>
          </Card>

          <Text style={styles.sectionTitle}>Exercises</Text>

          {/* Mock exercise preview */}
          {['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Shoulder Press', 'Lateral Raises', 'Tricep Pushdowns'].map((name, index) => (
            <Card key={index} style={styles.previewCard}>
              <Card.Content style={styles.previewContent}>
                <Text style={styles.previewNumber}>{index + 1}</Text>
                <Text style={styles.previewName}>{name}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <FAB
          style={styles.fab}
          icon="play"
          label="Start Workout"
          onPress={handleStartWorkout}
          color={colors.background}
        />
      </SafeAreaView>
    );
  }

  // Active workout view
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with exercise info and timer */}
      <View style={styles.activeHeader}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.currentExerciseLabel}>
            Exercise {currentExerciseIndex + 1} of {currentWorkout?.exercises.length}
          </Text>
          <Text style={styles.currentExerciseName}>{currentExercise?.name}</Text>
          <Text style={styles.setInfo}>
            Set {currentSetIndex + 1} of {currentExercise?.sets}
          </Text>
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Duration</Text>
          <Text style={styles.timerValue}>{formattedDuration}</Text>
        </View>
      </View>

      {/* Camera View with Pose Overlay */}
      {isCameraActive && permission?.granted ? (
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="front">
            <PoseOverlay keypoints={poseKeypoints} width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.5} />

            {/* Form Score Overlay */}
            <View style={styles.formScoreOverlay}>
              <Text style={styles.formScoreLabel}>Form Score</Text>
              <Text style={styles.formScoreValue}>{formScore}</Text>
            </View>

            {/* Form Feedback */}
            {formFeedback && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>{formFeedback}</Text>
              </View>
            )}
          </CameraView>
        </View>
      ) : (
        <View style={styles.cameraPlaceholder}>
          <IconButton
            icon="camera"
            size={48}
            iconColor={colors.textSecondary}
            onPress={toggleCamera}
          />
          <Text style={styles.cameraPlaceholderText}>
            Tap to enable form coaching
          </Text>
        </View>
      )}

      {/* Rest Timer Overlay */}
      {isResting && (
        <View style={styles.restOverlay}>
          <RestTimer timeRemaining={restTimeRemaining} onSkip={skipRest} />
        </View>
      )}

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <View style={styles.controlButtons}>
          <IconButton
            icon={isCameraActive ? 'camera-off' : 'camera'}
            iconColor={colors.text}
            size={28}
            onPress={toggleCamera}
            style={styles.controlButton}
          />
          <Button
            mode="contained"
            onPress={handleCompleteSet}
            style={styles.completeSetButton}
            buttonColor={colors.primary}
            disabled={isResting}
          >
            Complete Set
          </Button>
          <IconButton
            icon="stop"
            iconColor={colors.error}
            size={28}
            onPress={handleEndWorkout}
            style={styles.controlButton}
          />
        </View>

        {/* Exercise progress */}
        <View style={styles.progressIndicator}>
          {currentWorkout?.exercises.map((ex, index) => (
            <View
              key={ex.id}
              style={[
                styles.progressDot,
                index === currentExerciseIndex && styles.progressDotActive,
                getExerciseSets(ex.id).length >= ex.sets && styles.progressDotComplete,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Set Completion Modal */}
      <Portal>
        <Modal
          visible={showSetModal}
          onDismiss={() => setShowSetModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Log Set</Text>
          <Text style={styles.modalSubtitle}>
            {currentExercise?.name} - Set {currentSetIndex + 1}
          </Text>

          <TextInput
            label="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="number-pad"
            mode="outlined"
            style={styles.modalInput}
            placeholder={currentExercise?.targetReps}
          />

          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.modalInput}
          />

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowSetModal(false)}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSaveSet}
              buttonColor={colors.primary}
            >
              Save Set
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
  headerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.h2,
    color: colors.primary,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  previewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewNumber: {
    ...typography.h3,
    color: colors.primary,
    width: 40,
    textAlign: 'center',
  },
  previewName: {
    ...typography.body1,
    color: colors.text,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.primary,
  },
  // Active workout styles
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  exerciseHeader: {},
  currentExerciseLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  currentExerciseName: {
    ...typography.h2,
    color: colors.text,
  },
  setInfo: {
    ...typography.body2,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  timerValue: {
    ...typography.h3,
    color: colors.primary,
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
  },
  cameraPlaceholderText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  formScoreOverlay: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  formScoreLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  formScoreValue: {
    ...typography.h2,
    color: colors.success,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  feedbackText: {
    ...typography.body1,
    color: colors.text,
    textAlign: 'center',
  },
  restOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  restTimerContainer: {
    alignItems: 'center',
  },
  restTitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  restTime: {
    fontSize: 72,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  bottomControls: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  controlButton: {
    backgroundColor: colors.surfaceVariant,
    marginHorizontal: spacing.sm,
  },
  completeSetButton: {
    marginHorizontal: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.surfaceVariant,
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.3 }],
  },
  progressDotComplete: {
    backgroundColor: colors.success,
  },
  // Exercise card styles
  exerciseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  activeCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  exerciseContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
  },
  exerciseDetails: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },
  exerciseProgress: {
    ...typography.caption,
    color: colors.primary,
    marginTop: 4,
  },
  modalContainer: {
    backgroundColor: colors.surface,
    margin: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalInput: {
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
});
