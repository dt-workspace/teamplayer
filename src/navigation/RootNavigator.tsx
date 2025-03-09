// src/navigation/RootNavigator.tsx
import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '@screens/SplashScreen';
import { OnboardingScreen } from '@screens/OnboardingScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RootStack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [initialRouteName, setInitialRouteName] = useState<keyof RootStackParamList | undefined>('Onboarding');

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check if onboarding is complete
        const onboardingValue = await AsyncStorage.getItem('onboardingComplete');
        if (onboardingValue === 'true') {
          setIsOnboardingComplete(true);
          setInitialRouteName('Onboarding')
        }
        
        // Check if user is logged in
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          setInitialRouteName('Main')
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error checking app state:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAppState();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRouteName}>
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} options={{headerShown:false}}/>
      <RootStack.Screen name="Main" component={MainNavigator} options={{headerShown:false}}/>
      <RootStack.Screen name="Auth" component={AuthNavigator} options={{headerShown:false}}/>
    </RootStack.Navigator>
  );
};