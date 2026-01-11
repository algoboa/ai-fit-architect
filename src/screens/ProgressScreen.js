import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Text, Card, SegmentedButtons, Button, TextInput, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, borderRadius } from '../theme';
import { useProgressStore } from '../store/progressStore';
import { useAuthStore } from '../store/authStore';
import logger from '../utils/logger';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Fallback mock data when no Firestore data
const MOCK_BODY_DATA = {
  weight: [
    { date: '12/01', value: 75 },
    { date: '12/08', value: 74.5 },
    { date: '12/15', value: 74.2 },
    { date: '12/22', value: 73.8 },
    { date: '12/29', value: 73.5 },
    { date: '01/05', value: 73.0 },
    { date: '01/11', value: 72.5 },
  ],
  bodyFat: [
    { date: '12/01', value: 22 },
    { date: '12/15', value: 21.5 },
    { date: '01/01', value: 21 },
    { date: '01/11', value: 20.5 },
  ],
  muscle: [
    { date: '12/01', value: 32 },
    { date: '12/15', value: 32.5 },
    { date: '01/01', value: 33 },
    { date: '01/11', value: 33.5 },
  ],
};

const MOCK_PERFORMANCE_DATA = {
  benchPress: [
    { date: '12/01', value: 60 },
    { date: '12/15', value: 62.5 },
    { date: '01/01', value: 65 },
    { date: '01/11', value: 67.5 },
  ],
  squat: [
    { date: '12/01', value: 80 },
    { date: '12/15', value: 85 },
    { date: '01/01', value: 90 },
    { date: '01/11', value: 92.5 },
  ],
  deadlift: [
    { date: '12/01', value: 100 },
    { date: '12/15', value: 105 },
    { date: '01/01', value: 110 },
    { date: '01/11', value: 115 },
  ],
  weeklyVolume: [
    { week: 'W1', value: 12000 },
    { week: 'W2', value: 14000 },
    { week: 'W3', value: 15500 },
    { week: 'W4', value: 16200 },
  ],
};

const MOCK_ACHIEVEMENTS = [
  { id: '1', icon: '🏆', name: '7 Day Streak', date: 'Jan 10' },
  { id: '2', icon: '💪', name: 'New Bench PR', date: 'Jan 8' },
  { id: '3', icon: '🎯', name: 'Weight Goal -2kg', date: 'Jan 5' },
];

const SimpleChart = React.memo(function SimpleChart({ data, color, label, unit }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return null;
    }

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;
    const latestValue = data[data.length - 1].value;
    const firstValue = data[0].value;
    const change = latestValue - firstValue;

    return { maxValue, minValue, range, latestValue, change };
  }, [data]);

  if (!chartData) {
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartLabel}>{label}</Text>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const { minValue, range, latestValue, change } = chartData;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartLabel}>{label}</Text>
        <View style={styles.chartStats}>
          <Text style={styles.chartValue}>
            {latestValue}{unit}
          </Text>
          <Text style={[
            styles.chartChange,
            change >= 0 ? { color: colors.success } : { color: colors.accent }
          ]}>
            {change >= 0 ? '+' : ''}{change.toFixed(1)}{unit}
          </Text>
        </View>
      </View>
      <View style={styles.chartArea}>
        <View style={styles.chartBars}>
          {data.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: ((item.value - minValue) / range) * 80 + 20,
                    backgroundColor: index === data.length - 1 ? color : colors.surfaceVariant,
                  },
                ]}
              />
              <Text style={styles.barLabel}>{item.date || item.week}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

const StatCard = React.memo(function StatCard({ title, value, unit, change, positive }) {
  return (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>
          {value}
          <Text style={styles.statUnit}>{unit}</Text>
        </Text>
        {change !== undefined && change !== null && (
          <Text style={[styles.statChange, positive ? styles.positive : styles.negative]}>
            {positive ? '+' : ''}{change}{unit}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
});

const AddMeasurementModal = React.memo(function AddMeasurementModal({ visible, onClose, onSave, isLoading }) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');

  const handleSave = () => {
    const data = {};
    if (weight) data.weight = parseFloat(weight);
    if (bodyFat) data.bodyFat = parseFloat(bodyFat);
    if (muscleMass) data.muscleMass = parseFloat(muscleMass);

    if (Object.keys(data).length > 0) {
      onSave(data);
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Log Measurement</Text>

          <TextInput
            label="Weight (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.modalInput}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
          />

          <TextInput
            label="Body Fat (%)"
            value={bodyFat}
            onChangeText={setBodyFat}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.modalInput}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
          />

          <TextInput
            label="Muscle Mass (kg)"
            value={muscleMass}
            onChangeText={setMuscleMass}
            keyboardType="decimal-pad"
            mode="outlined"
            style={styles.modalInput}
            outlineColor={colors.border}
            activeOutlineColor={colors.primary}
            textColor={colors.text}
          />

          <View style={styles.modalButtons}>
            <Button
              mode="outlined"
              onPress={onClose}
              style={styles.modalButton}
              textColor={colors.text}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.modalButton}
              loading={isLoading}
              disabled={isLoading || (!weight && !bodyFat && !muscleMass)}
            >
              Save
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
});

export default function ProgressScreen() {
  const [activeTab, setActiveTab] = useState('body');
  const [timePeriod, setTimePeriod] = useState('1m');
  const [showAddModal, setShowAddModal] = useState(false);

  const { user } = useAuthStore();
  const {
    weightHistory,
    bodyFatHistory,
    muscleHistory,
    weeklyVolume,
    personalRecords,
    achievements,
    isLoading,
    fetchBodyMeasurements,
    fetchPerformanceData,
    fetchAchievements,
    addBodyMeasurement,
    getLatestStats,
  } = useProgressStore();

  // Fetch data on mount and when period changes
  useEffect(() => {
    if (user?.uid) {
      fetchBodyMeasurements(user.uid, timePeriod);
      fetchPerformanceData(user.uid, timePeriod);
      fetchAchievements(user.uid);
    }
  }, [user?.uid, timePeriod]);

  const handleAddMeasurement = useCallback(async (data) => {
    if (user?.uid) {
      try {
        await addBodyMeasurement(user.uid, data);
        setShowAddModal(false);
      } catch (error) {
        logger.error('Error saving measurement', error);
      }
    }
  }, [user?.uid, addBodyMeasurement]);

  // Memoize display data to prevent recalculation on every render
  const displayWeightHistory = useMemo(
    () => (weightHistory.length > 0 ? weightHistory : MOCK_BODY_DATA.weight),
    [weightHistory]
  );
  const displayBodyFatHistory = useMemo(
    () => (bodyFatHistory.length > 0 ? bodyFatHistory : MOCK_BODY_DATA.bodyFat),
    [bodyFatHistory]
  );
  const displayMuscleHistory = useMemo(
    () => (muscleHistory.length > 0 ? muscleHistory : MOCK_BODY_DATA.muscle),
    [muscleHistory]
  );
  const displayWeeklyVolume = useMemo(
    () => (weeklyVolume.length > 0 ? weeklyVolume : MOCK_PERFORMANCE_DATA.weeklyVolume),
    [weeklyVolume]
  );
  const displayAchievements = useMemo(
    () => (achievements.length > 0 ? achievements : MOCK_ACHIEVEMENTS),
    [achievements]
  );

  // Memoize stats calculations
  const { latestWeight, weightChange, latestBodyFat, bodyFatChange, latestMuscle, muscleChange, bmi } = useMemo(() => {
    const stats = getLatestStats();
    const weight = stats.weight.current || displayWeightHistory[displayWeightHistory.length - 1]?.value || 72.5;
    const wChange = stats.weight.change || (displayWeightHistory[displayWeightHistory.length - 1]?.value - displayWeightHistory[0]?.value) || -2.5;
    const bodyFat = stats.bodyFat.current || displayBodyFatHistory[displayBodyFatHistory.length - 1]?.value || 20.5;
    const bfChange = stats.bodyFat.change || (displayBodyFatHistory[displayBodyFatHistory.length - 1]?.value - displayBodyFatHistory[0]?.value) || -1.5;
    const muscle = stats.muscle.current || displayMuscleHistory[displayMuscleHistory.length - 1]?.value || 33.5;
    const mChange = stats.muscle.change || (displayMuscleHistory[displayMuscleHistory.length - 1]?.value - displayMuscleHistory[0]?.value) || 1.5;
    const height = 1.75;
    const calculatedBmi = (weight / (height * height)).toFixed(1);

    return {
      latestWeight: weight,
      weightChange: wChange,
      latestBodyFat: bodyFat,
      bodyFatChange: bfChange,
      latestMuscle: muscle,
      muscleChange: mChange,
      bmi: calculatedBmi,
    };
  }, [getLatestStats, displayWeightHistory, displayBodyFatHistory, displayMuscleHistory]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress</Text>
          <Button
            mode="contained-tonal"
            onPress={() => setShowAddModal(true)}
            compact
          >
            Log Measurement
          </Button>
        </View>

        {/* Tab Selector */}
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'body', label: 'Body' },
            { value: 'performance', label: 'Performance' },
          ]}
          style={styles.tabs}
        />

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {['1w', '1m', '3m', '6m'].map((period) => (
            <Button
              key={period}
              mode={timePeriod === period ? 'contained' : 'text'}
              onPress={() => setTimePeriod(period)}
              compact
              style={styles.periodButton}
              buttonColor={timePeriod === period ? colors.primary : 'transparent'}
              textColor={timePeriod === period ? colors.background : colors.textSecondary}
            >
              {period.toUpperCase()}
            </Button>
          ))}
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading progress data...</Text>
          </View>
        ) : activeTab === 'body' ? (
          <>
            {/* Body Stats Cards */}
            <View style={styles.statsGrid}>
              <StatCard
                title="Weight"
                value={latestWeight}
                unit=" kg"
                change={weightChange.toFixed(1)}
                positive={weightChange < 0}
              />
              <StatCard
                title="Body Fat"
                value={latestBodyFat}
                unit="%"
                change={bodyFatChange.toFixed(1)}
                positive={bodyFatChange < 0}
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard
                title="Muscle Mass"
                value={latestMuscle}
                unit=" kg"
                change={muscleChange.toFixed(1)}
                positive={muscleChange > 0}
              />
              <StatCard
                title="BMI"
                value={bmi}
                unit=""
                change={null}
              />
            </View>

            {/* Weight Chart */}
            <Card style={styles.chartCard}>
              <Card.Content>
                <SimpleChart
                  data={displayWeightHistory}
                  color={colors.primary}
                  label="Weight Trend"
                  unit=" kg"
                />
              </Card.Content>
            </Card>

            {/* Body Fat Chart */}
            <Card style={styles.chartCard}>
              <Card.Content>
                <SimpleChart
                  data={displayBodyFatHistory}
                  color={colors.accent}
                  label="Body Fat %"
                  unit="%"
                />
              </Card.Content>
            </Card>
          </>
        ) : (
          <>
            {/* Performance Stats */}
            <View style={styles.statsGrid}>
              <StatCard
                title="Bench Press 1RM"
                value={personalRecords['Bench Press'] || 67.5}
                unit=" kg"
                change={7.5}
                positive={true}
              />
              <StatCard
                title="Squat 1RM"
                value={personalRecords['Squat'] || 92.5}
                unit=" kg"
                change={12.5}
                positive={true}
              />
            </View>
            <View style={styles.statsGrid}>
              <StatCard
                title="Deadlift 1RM"
                value={personalRecords['Deadlift'] || 115}
                unit=" kg"
                change={15}
                positive={true}
              />
              <StatCard
                title="Weekly Volume"
                value={(displayWeeklyVolume[displayWeeklyVolume.length - 1]?.value / 1000 || 16.2).toFixed(1)}
                unit="k kg"
                change={4.2}
                positive={true}
              />
            </View>

            {/* Lift Progress Chart */}
            <Card style={styles.chartCard}>
              <Card.Content>
                <SimpleChart
                  data={MOCK_PERFORMANCE_DATA.benchPress}
                  color={colors.primary}
                  label="Bench Press 1RM"
                  unit=" kg"
                />
              </Card.Content>
            </Card>

            {/* Volume Chart */}
            <Card style={styles.chartCard}>
              <Card.Content>
                <SimpleChart
                  data={displayWeeklyVolume}
                  color={colors.success}
                  label="Weekly Volume"
                  unit=" kg"
                />
              </Card.Content>
            </Card>
          </>
        )}

        {/* Achievements Section */}
        <Card style={styles.achievementsCard}>
          <Card.Content>
            <Text style={styles.achievementsTitle}>Recent Achievements</Text>
            <View style={styles.achievementsList}>
              {displayAchievements.map((achievement, index) => (
                <View
                  key={achievement.id || index}
                  style={[
                    styles.achievement,
                    index === displayAchievements.length - 1 && styles.lastAchievement,
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDate}>Achieved {achievement.date}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Measurement Modal */}
      <AddMeasurementModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddMeasurement}
        isLoading={isLoading}
      />
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
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  tabs: {
    marginBottom: spacing.md,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  periodButton: {
    marginHorizontal: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xxl,
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.text,
  },
  statUnit: {
    ...typography.body1,
    color: colors.textSecondary,
  },
  statChange: {
    ...typography.body2,
    marginTop: spacing.xs,
  },
  positive: {
    color: colors.success,
  },
  negative: {
    color: colors.error,
  },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  chartContainer: {
    paddingVertical: spacing.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartLabel: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
  },
  chartStats: {
    alignItems: 'flex-end',
  },
  chartValue: {
    ...typography.h3,
    color: colors.primary,
  },
  chartChange: {
    ...typography.caption,
  },
  chartArea: {
    height: 120,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  barLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 10,
  },
  noDataText: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  achievementsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  achievementsTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  achievementsList: {},
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastAchievement: {
    borderBottomWidth: 0,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementName: {
    ...typography.body1,
    color: colors.text,
  },
  achievementDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
