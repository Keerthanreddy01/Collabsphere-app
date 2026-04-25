import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import { TabNavigator } from './src/navigation/TabNavigator';
import { ChatScreen } from './src/screens/ChatScreen';
import { MessagesListScreen } from './src/screens/MessagesListScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/components/Toast';

// Forced refresh — production build v2.0.0
const Stack = createStackNavigator();

// 60fps-tuned slide transition
const forSlide = {
  cardStyleInterpolator: ({ current, layouts }: any) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width * 0.3, 0],
      extrapolate: 'clamp',
    });
    const opacity = current.progress.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0.8, 1],
      extrapolate: 'clamp',
    });
    return {
      cardStyle: {
        transform: [{ translateX }],
        opacity,
      },
    };
  },
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 400,
        damping: 38,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 400,
        damping: 38,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      },
    },
  },
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#FFEB3B' }}>
      <ThemeProvider>
        <ToastProvider>
           <SafeAreaProvider>
             <StatusBar
               barStyle="dark-content"
               backgroundColor="transparent"
               translucent={true}
             />
             <NavigationContainer
               theme={{
                 dark: false,
                 colors: {
                   primary: '#000',
                   background: '#FFEB3B',
                   card: '#FFEB3B',
                   text: '#000',
                   border: 'transparent',
                   notification: '#FF1744',
                 },
               }}
             >
                <Stack.Navigator
                  screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#FFEB3B' },
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    ...forSlide,
                  }}
                >
                   <Stack.Screen
                     name="Splash"
                     component={SplashScreen}
                     options={{ gestureEnabled: false }}
                   />
                   <Stack.Screen name="Main" component={TabNavigator} />
                   <Stack.Screen name="Chat" component={ChatScreen} />
                   <Stack.Screen name="MessagesList" component={MessagesListScreen} />
                </Stack.Navigator>
             </NavigationContainer>
           </SafeAreaProvider>
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
