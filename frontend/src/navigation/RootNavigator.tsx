import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export const RootNavigator = () => {
  const { token } = useSelector((s: RootState) => s.auth);
  return (
    <NavigationContainer>
      {token ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
