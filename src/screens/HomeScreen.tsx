// src/screens/HomeScreen.tsx
import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootNavProp } from '@navigation/types';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootNavProp>();
  
  
  const handleLogout = async () => {
    try {
      // Clear user data from AsyncStorage
      await AsyncStorage.removeItem('currentUser');
      
      // Navigate to Auth screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  return (
    <View style={styles.container}>
     <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          testID="logout-button"
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      <Text style={styles.text}>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
  logoutButton: { 
    marginRight: 15,
    padding: 8,
  },
  logoutText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});