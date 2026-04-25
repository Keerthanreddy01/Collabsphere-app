import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomTabBar } from '../components/CustomTabBar';
import { enableScreens } from 'react-native-screens';

// Enable native screens for maximum performance & GPU compositing
enableScreens(true);

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

// 60fps spring transition for sub-navigator
const panTransition = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width * 0.25, 0],
      extrapolate: 'clamp',
    });
    const opacity = current.progress.interpolate({
      inputRange: [0, 0.6, 1],
      outputRange: [0, 0.85, 1],
      extrapolate: 'clamp',
    });
    return {
      cardStyle: { transform: [{ translateX }], opacity },
    };
  },
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 450,
        damping: 40,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 450,
        damping: 40,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
  },
};

const TabStack = () => (
  <Tab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
      lazy: false, // Pre-mount all tabs for instant 0ms switching
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFEB3B' },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        ...panTransition,
      }}
    >
      <Stack.Screen name="MainTabs" component={TabStack} />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ gestureEnabled: true, gestureResponseDistance: 50 }}
      />
      <Stack.Screen
        name="MessagesList"
        component={MessagesListScreen}
        options={{ gestureEnabled: true, gestureResponseDistance: 50 }}
      />
    </Stack.Navigator>
  );
};
