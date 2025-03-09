// src/screens/TeamsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TeamsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Teams Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});