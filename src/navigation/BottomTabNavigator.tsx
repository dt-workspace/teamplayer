// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '@screens/HomeScreen';
import { TeamsScreen } from '@screens/TeamsScreen';
import { ProjectsScreen } from '@screens/ProjectsScreen';
import { TasksScreen } from '@screens/TasksScreen';
import Home from '../assets/icons/home';
import Team from '../assets/icons/team';
import Project from '../assets/icons/project';
import Task from '../assets/icons/task';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home />;
          else if (route.name === 'Teams') return <Team />;
          else if (route.name === 'Projects') return <Project />;
          else return <Task />

        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          borderTopWidth: 0,
          height: 60,
          // borderRadius: 20,
          // marginHorizontal: 20,
          marginBottom: 10,
          elevation: 0
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Teams" component={TeamsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Projects" component={ProjectsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};