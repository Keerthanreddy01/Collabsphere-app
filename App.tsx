import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Font from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold 
} from '@expo-google-fonts/inter';

import { TabNavigator } from './src/navigation/TabNavigator';
import { ChatScreen } from './src/screens/ChatScreen';
import { MessagesListScreen } from './src/screens/MessagesListScreen';
import { ThemeProvider } from './src/context/ThemeContext';
import { ToastProvider } from './src/components/Toast';

// Forced refresh version 1.0.1
const Stack = createStackNavigator();

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
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#F7F6F2' }}>
      <ThemeProvider>
        <ToastProvider>
           <SafeAreaProvider>
             <StatusBar
               barStyle="dark-content"
               backgroundColor="transparent"
               translucent={true}
             />
             <NavigationContainer theme={{ colors: { background: '#F7F6F2' } } as any}>
                <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#F7F6F2' } }}>
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
