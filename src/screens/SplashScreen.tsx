// src/screens/SplashScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SplashScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Team Player</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#007AFF' },
  text: { fontSize: 32, color: 'white', fontWeight: 'bold' },
});