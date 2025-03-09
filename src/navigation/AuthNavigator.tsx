// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { LoginScreen } from '@screens/LoginScreen';
import { RegisterScreen } from '@screens/RegisterScreen';
import { ResetPinScreen } from '@screens/ResetPinScreen';

const AuthStack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ResetPin" component={ResetPinScreen} />
    </AuthStack.Navigator>
  );
};