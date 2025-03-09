// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Root Stack Params
export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Auth Stack Params
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ResetPin: undefined;
};

// Main Tab Params
export type MainTabParamList = {
  Home: undefined;
  Teams: undefined;
  Projects: undefined;
  Tasks: undefined;
};

// Navigation Prop Types
export type RootNavProp = StackNavigationProp<RootStackParamList>;
export type AuthNavProp = StackNavigationProp<AuthStackParamList>;
export type MainNavProp = BottomTabNavigationProp<MainTabParamList>;