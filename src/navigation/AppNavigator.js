import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import MealLogScreen from '../screens/MealLogScreen';
import ProgressScreen from '../screens/ProgressScreen';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

const tabIcons = {
  Dashboard: { focused: 'view-dashboard', unfocused: 'view-dashboard-outline' },
  Training: { focused: 'dumbbell', unfocused: 'dumbbell' },
  Meals: { focused: 'food-apple', unfocused: 'food-apple-outline' },
  Progress: { focused: 'chart-line', unfocused: 'chart-line-variant' },
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = tabIcons[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="Training"
        component={WorkoutScreen}
        options={{ tabBarLabel: 'Training' }}
      />
      <Tab.Screen
        name="Meals"
        component={MealLogScreen}
        options={{ tabBarLabel: 'Meals' }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ tabBarLabel: 'Progress' }}
      />
    </Tab.Navigator>
  );
}
