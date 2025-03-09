// src/screens/TasksScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const TasksScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tasks Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});