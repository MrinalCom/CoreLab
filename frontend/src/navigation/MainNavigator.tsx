import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/home/HomeScreen';
import { WorkoutScreen } from '../screens/workout/WorkoutScreen';
import { PlanDetailScreen } from '../screens/workout/PlanDetailScreen';
import { TrackingScreen } from '../screens/tracking/TrackingScreen';
import { ActiveSessionScreen } from '../screens/tracking/ActiveSessionScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { COLORS } from '../utils/constants';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();
const TrackingStack = createNativeStackNavigator();

const WorkoutStackNav = () => (
  <WorkoutStack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.background }, headerTintColor: COLORS.text }}>
    <WorkoutStack.Screen name="WorkoutList" component={WorkoutScreen} options={{ title: 'Workouts' }} />
    <WorkoutStack.Screen name="PlanDetail" component={PlanDetailScreen} options={{ title: 'Plan Details' }} />
  </WorkoutStack.Navigator>
);

const TrackingStackNav = () => (
  <TrackingStack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.background }, headerTintColor: COLORS.text }}>
    <TrackingStack.Screen name="TrackingList" component={TrackingScreen} options={{ title: 'Log' }} />
    <TrackingStack.Screen name="ActiveSession" component={ActiveSessionScreen} options={{ title: 'Active Workout' }} />
  </TrackingStack.Navigator>
);

export const MainNavigator = () => (
  <Tab.Navigator screenOptions={{
    tabBarStyle: { backgroundColor: COLORS.card, borderTopColor: COLORS.border },
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: COLORS.textSecondary,
    headerStyle: { backgroundColor: COLORS.background },
    headerTintColor: COLORS.text,
  }}>
    <Tab.Screen name="Home" component={HomeScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text> }} />
    <Tab.Screen name="Workouts" component={WorkoutStackNav}
      options={{ headerShown: false, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💪</Text> }} />
    <Tab.Screen name="Log" component={TrackingStackNav}
      options={{ headerShown: false, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text> }} />
    <Tab.Screen name="Profile" component={ProfileScreen}
      options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text> }} />
  </Tab.Navigator>
);
