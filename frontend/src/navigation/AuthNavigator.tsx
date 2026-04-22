import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { COLORS } from '../utils/constants';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.background }, headerTintColor: COLORS.text, headerBackTitle: '' }}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
  </Stack.Navigator>
);
