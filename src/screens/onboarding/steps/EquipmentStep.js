import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Checkbox } from 'react-native-paper';
import { colors, spacing, typography, borderRadius } from '../../../theme';
import { useOnboardingStore } from '../../../store/onboardingStore';

const EQUIPMENT_OPTIONS = [
  {
    id: 'bodyweight',
    title: 'Bodyweight Only',
    description: 'No equipment needed',
    icon: '🤸',
  },
  {
    id: 'dumbbells',
    title: 'Dumbbells',
    description: 'Adjustable or fixed weight dumbbells',
    icon: '🏋️',
  },
  {
    id: 'barbell',
    title: 'Barbell & Plates',
    description: 'Olympic or standard barbell with weight plates',
    icon: '🔩',
  },
  {
    id: 'kettlebell',
    title: 'Kettlebells',
    description: 'One or more kettlebells',
    icon: '⚫',
  },
  {
    id: 'resistance_bands',
    title: 'Resistance Bands',
    description: 'Loop or tube resistance bands',
    icon: '🎀',
  },
  {
    id: 'pull_up_bar',
    title: 'Pull-up Bar',
    description: 'Doorway or mounted pull-up bar',
    icon: '📏',
  },
  {
    id: 'bench',
    title: 'Weight Bench',
    description: 'Flat or adjustable bench',
    icon: '🛋️',
  },
  {
    id: 'gym_machines',
    title: 'Gym Machines',
    description: 'Access to cable machines and gym equipment',
    icon: '🏢',
  },
];

export default function EquipmentStep() {
  const { onboardingData, updateOnboardingData } = useOnboardingStore();

  const toggleEquipment = (id) => {
    const current = onboardingData.availableEquipment || [];
    if (current.includes(id)) {
      updateOnboardingData({
        availableEquipment: current.filter((item) => item !== id),
      });
    } else {
      updateOnboardingData({
        availableEquipment: [...current, id],
      });
    }
  };

  const isSelected = (id) => {
    return onboardingData.availableEquipment?.includes(id);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.description}>
        What equipment do you have access to? Select all that apply.
      </Text>

      <View style={styles.equipmentList}>
        {EQUIPMENT_OPTIONS.map((equipment) => (
          <TouchableOpacity
            key={equipment.id}
            testID={`equipment-${equipment.id}`}
            onPress={() => toggleEquipment(equipment.id)}
          >
            <Card
              style={[
                styles.equipmentCard,
                isSelected(equipment.id) && styles.selectedCard,
              ]}
            >
              <Card.Content style={styles.cardContent}>
                <Text style={styles.equipmentIcon}>{equipment.icon}</Text>
                <View style={styles.equipmentInfo}>
                  <Text style={styles.equipmentTitle}>{equipment.title}</Text>
                  <Text style={styles.equipmentDescription}>
                    {equipment.description}
                  </Text>
                </View>
                <Checkbox.Android
                  status={isSelected(equipment.id) ? 'checked' : 'unchecked'}
                  color={colors.primary}
                  uncheckedColor={colors.textSecondary}
                />
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
  equipmentList: {
    marginBottom: spacing.lg,
  },
  equipmentCard: {
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
  equipmentIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  equipmentInfo: {
    flex: 1,
  },
  equipmentTitle: {
    ...typography.body1,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  equipmentDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
