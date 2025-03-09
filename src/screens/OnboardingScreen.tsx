// src/screens/OnboardingScreen.tsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const completeOnboarding = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Team Player!</Text>
      <Button title="Get Started" onPress={completeOnboarding} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, marginBottom: 20 },
});