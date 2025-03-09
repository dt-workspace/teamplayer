// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';

const MainStack = createStackNavigator();

export const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Main" component={BottomTabNavigator} />
    </MainStack.Navigator>
  );
};