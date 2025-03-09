// src/screens/ProjectsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProjectsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Projects Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});