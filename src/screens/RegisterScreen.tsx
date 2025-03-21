// src/screens/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text,SafeAreaView, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/types';
import { AuthController } from '@controllers/AuthController';
;

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [profileName, setProfileName] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // PIN validation
    if (!pin) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length < 4 || pin.length > 6) {
      newErrors.pin = 'PIN must be 4-6 digits';
    } else if (!/^\d+$/.test(pin)) {
      newErrors.pin = 'PIN must contain only digits';
    }

    // Confirm PIN validation
    if (pin !== confirmPin) {
      newErrors.confirmPin = 'PINs do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const authController = new AuthController();
      const result = await authController.createUser(
        username,
        pin,
        profileName || undefined,
        recoveryAnswer || undefined
      );

      if (result.success) {
        Alert.alert('Success', 'Account created successfully', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create account');
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
            <Text style={styles.title}>Create Account</Text>

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
              <Text style={styles.label}>PIN (4-6 digits)</Text>
              <TextInput
                style={[styles.input, errors.pin ? styles.inputError : null]}
                placeholder="Enter PIN"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                testID="pin-input"
              />
              {errors.pin ? <Text style={styles.errorText}>{errors.pin}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm PIN</Text>
              <TextInput
                style={[styles.input, errors.confirmPin ? styles.inputError : null]}
                placeholder="Confirm PIN"
                value={confirmPin}
                onChangeText={setConfirmPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={6}
                testID="confirm-pin-input"
              />
              {errors.confirmPin ? <Text style={styles.errorText}>{errors.confirmPin}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Name (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter profile name"
                value={profileName}
                onChangeText={setProfileName}
                testID="profile-name-input"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Recovery Answer (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recovery answer"
                value={recoveryAnswer}
                onChangeText={setRecoveryAnswer}
                testID="recovery-answer-input"
              />
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}
              testID="register-button"
            >
              <Text style={styles.buttonText}>{isLoading ? 'Creating Account...' : 'Create Account'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.goBack()}
              testID="back-to-login-button"
            >
              <Text style={styles.linkText}>Already have an account? Login</Text>
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