// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '@screens/HomeScreen';
import { TeamsScreen } from '@screens/TeamsScreen';
import { ProjectsScreen } from '@screens/ProjectsScreen';
import { TasksScreen } from '@screens/TasksScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // tabBarIcon: ({ color, size }) => {
        //   let iconName: string;
        //   if (route.name === 'Home') iconName = 'home';
        //   else if (route.name === 'Teams') iconName = 'people';
        //   else if (route.name === 'Projects') iconName = 'briefcase';
        //   else iconName = 'list'; // Tasks
        //   return <Ionicons name={iconName} size={size} color={color} />;
        // },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
      <Tab.Screen name="Teams" component={TeamsScreen} options={{headerShown:false}}/>
      <Tab.Screen name="Projects" component={ProjectsScreen} options={{headerShown:false}}/>
      <Tab.Screen name="Tasks" component={TasksScreen} options={{headerShown:false}}/>
    </Tab.Navigator>
  );
};