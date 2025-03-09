// src/screens/ResetPinScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/types';
import { AuthController } from '@controllers/AuthController';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'ResetPin'>;
};

export const ResetPinScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Recovery answer validation
    if (!recoveryAnswer.trim()) {
      newErrors.recoveryAnswer = 'Recovery answer is required';
    }

    // PIN validation
    if (!newPin) {
      newErrors.newPin = 'New PIN is required';
    } else if (newPin.length < 4 || newPin.length > 6) {
      newErrors.newPin = 'PIN must be 4-6 digits';
    } else if (!/^\d+$/.test(newPin)) {
      newErrors.newPin = 'PIN must contain only digits';
    }

    // Confirm PIN validation
    if (newPin !== confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const authController = new AuthController();
      const result = await authController.resetPin(
        username,
        recoveryAnswer,
        newPin
      );

      if (result.success) {
        Alert.alert('Success', 'PIN reset successfully', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to reset PIN');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Reset PIN</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[styles.input, errors.username ? styles.inputError : null]}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                testID="username-input"
              />
              {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Recovery Answer</Text>
              <TextInput
                style={[styles.input, errors.recoveryAnswer ? styles.inputError : null]}
                placeholder="Enter recovery answer"
                value={recoveryAnswer}
                onChangeText={setRecoveryAnswer}
                testID="recovery-answer-input"
              />
              {errors.recoveryAnswer ? <Text style={styles.errorText}>{errors.recoveryAnswer}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>New PIN (4-6 digits)</Text>
              <TextInput
                style={[styles.input, errors.newPin ? styles.inputError : null]}
                placeholder="Enter new PIN"
                value={newPin}
                onChangeText={setNewPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                testID="new-pin-input"
              />
              {errors.newPin ? <Text style={styles.errorText}>{errors.newPin}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm New PIN</Text>
              <TextInput
                style={[styles.input, errors.confirmPin ? styles.inputError : null]}
                placeholder="Confirm new PIN"
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                testID="confirm-pin-input"
              />
              {errors.confirmPin ? <Text style={styles.errorText}>{errors.confirmPin}</Text> : null}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleResetPin}
              disabled={isLoading}
              testID="reset-pin-button"
            >
              <Text style={styles.buttonText}>{isLoading ? 'Resetting PIN...' : 'Reset PIN'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.goBack()}
              testID="back-to-login-button"
            >
              <Text style={styles.linkText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#007AFF',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  inputError: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});