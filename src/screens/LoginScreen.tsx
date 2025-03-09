// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigation/types';
import { AuthController } from '@controllers/AuthController';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  navigation: StackNavigationProp<AuthStackParamList, 'Login'>;
};

type SavedAccount = {
  username: string;
  profileName?: string;
};

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadSavedAccounts();
  }, []);

  const loadSavedAccounts = async () => {
    try {
      const accountsJson = await AsyncStorage.getItem('savedAccounts');
      if (accountsJson) {
        const accounts = JSON.parse(accountsJson) as SavedAccount[];
        setSavedAccounts(accounts);
      }
    } catch (error) {
      console.error('Error loading saved accounts:', error);
    }
  };

  const saveAccount = async (account: SavedAccount) => {
    try {
      const existingAccounts = [...savedAccounts];
      const accountIndex = existingAccounts.findIndex(a => a.username === account.username);
      
      if (accountIndex >= 0) {
        existingAccounts[accountIndex] = account;
      } else {
        existingAccounts.push(account);
      }
      
      await AsyncStorage.setItem('savedAccounts', JSON.stringify(existingAccounts));
      setSavedAccounts(existingAccounts);
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!pin) {
      newErrors.pin = 'PIN is required';
    } else if (pin.length < 4 || pin.length > 6) {
      newErrors.pin = 'PIN must be 4-6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const authController = new AuthController();
      const result = await authController.login(username, pin);
      
      if (result.success) {
        // Save the account for future logins
        await saveAccount({
          username: result.data.username,
          profileName: result.data.profileName,
        });
        
        // Store current user data in AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(result.data));
        
        // Navigate to main app and reset navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else {
        Alert.alert('Login Failed', result.error || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectAccount = (account: SavedAccount) => {
    setUsername(account.username);
    setShowSavedAccounts(false);
  };

  return (
    <SafeAreaView style={{flex:1}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Team Player</Text>
          <Text style={styles.subtitle}>Login to your account</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.usernameInputContainer}>
              <TextInput
                style={[styles.input, errors.username ? styles.inputError : null, { flex: 1 }]}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                testID="username-input"
              />
              {/* {savedAccounts.length > 0 && (
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => setShowSavedAccounts(!showSavedAccounts)}
                  testID="accounts-dropdown-button"
                >
                  <Text style={styles.dropdownButtonText}>▼</Text>
                </TouchableOpacity>
              )} */}
            </View>
            {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
            
            {showSavedAccounts && savedAccounts.length > 0 && (
              <View style={styles.accountsDropdown}>
                {savedAccounts.map((account, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.accountItem}
                    onPress={() => selectAccount(account)}
                    testID={`account-item-${index}`}
                  >
                    <Text style={styles.accountName}>
                      {account.profileName || account.username}
                    </Text>
                    <Text style={styles.accountUsername}>{account.username}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>PIN</Text>
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
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
            testID="login-button"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('Register')}
            testID="register-button"
          >
            <Text style={styles.linkText}>Create New Account</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => navigation.navigate('ResetPin')}
            testID="reset-pin-button"
          >
            <Text style={styles.linkText}>Forgot PIN?</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#666',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dropdownButton: {
    padding: 12,
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  dropdownButtonText: {
    color: 'white',
    fontSize: 14,
  },
  accountsDropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 150,
  },
  accountItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
  },
  accountUsername: {
    fontSize: 14,
    color: '#666',
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