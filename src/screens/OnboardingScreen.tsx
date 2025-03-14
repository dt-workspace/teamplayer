// src/screens/OnboardingScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { localDB, resetDB } from '@database/db';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    navigation.replace('Auth');
  };

  const handleResetDatabase = async () => {
    try {
      const db = await resetDB();
      console.log('Database reset successful');
    } catch (error) {
      console.error('Error resetting database:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Team Player!</Text>
      <Button title="Get Started" onPress={completeOnboarding} />
      <View style={styles.buttonSpacing} />
      <Button title="Reset Database" onPress={handleResetDatabase} color="#666666" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 20 },
  buttonSpacing: { height: 10 },
});