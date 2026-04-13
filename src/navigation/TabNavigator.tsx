import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomTabBar } from '../components/CustomTabBar';

// Screen Imports
import { HomeScreen } from '../screens/HomeScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { IncubatorScreen } from '../screens/IncubatorScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { MessagesListScreen } from '../screens/MessagesListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TabStack = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Feed" component={FeedScreen} />
    <Tab.Screen name="Discovery" component={DiscoveryScreen} />
    <Tab.Screen name="Incubator" component={IncubatorScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export const TabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabStack} />
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={{ gestureEnabled: true }}
      />
      <Stack.Screen 
        name="MessagesList" 
        component={MessagesListScreen} 
        options={{ gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
};
