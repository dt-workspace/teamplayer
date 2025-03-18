// src/navigation/MainNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList } from './types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { TeamMemberDetailScreen, TeamsStackParamList } from '@screens/TeamMemberDetailScreen';
import { ProjectDetailScreen } from '@screens/ProjectDetailScreen';
import { TaskViewScreen } from '@screens/TaskViewScreen';

const MainStack = createStackNavigator();
const TeamsStack = createStackNavigator<TeamsStackParamList>();

// Teams Stack Navigator
const TeamsNavigator = () => {
  return (
    <TeamsStack.Navigator initialRouteName="TeamsList">
      <TeamsStack.Screen 
        name="TeamsList" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }}
      />
      <TeamsStack.Screen 
        name="TeamMemberDetail" 
        component={TeamMemberDetailScreen}
        options={{ headerShown: false }}
      />
      <TeamsStack.Screen
        name="ProjectDetailScreen"
        component={ProjectDetailScreen}
        options={{ headerShown: false }}
      />
      <TeamsStack.Screen
        name="TaskViewScreen"
        component={TaskViewScreen}
        options={{ headerShown: false }}
      />
    </TeamsStack.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Main" component={TeamsNavigator} />
    </MainStack.Navigator>
  );
};