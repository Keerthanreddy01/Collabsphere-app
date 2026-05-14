import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { NavigationContainer, Theme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Session } from '@supabase/supabase-js';
import { enableScreens } from 'react-native-screens';

import { supabase } from '../lib/supabase';
import { colors } from '../theme/colors';
import { CustomTabBar } from '../components/CustomTabBar';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignupScreen } from '../screens/auth/SignupScreen';
import { FeedScreen } from '../screens/main/FeedScreen';
import { DiscoveryScreen } from '../screens/main/DiscoveryScreen';
import { ChatScreen } from '../screens/main/ChatScreen';
import { CollabBoardScreen } from '../screens/main/CollabBoardScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { ChatDetailScreen } from '../screens/main/ChatDetailScreen';
import { AuthStackParamList, MainTabParamList, RootStackParamList } from '../types';

enableScreens(true);

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tabs = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color={colors.terracotta} />
  </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Signup" component={SignupScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <Tabs.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tabs.Screen name="Feed" component={FeedScreen} />
    <Tabs.Screen name="Discovery" component={DiscoveryScreen} />
    <Tabs.Screen name="Chat" component={ChatScreen} />
    <Tabs.Screen name="CollabBoard" component={CollabBoardScreen} />
    <Tabs.Screen name="Profile" component={ProfileScreen} />
  </Tabs.Navigator>
);

const RootNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="MainTabs" component={MainNavigator} />
    <RootStack.Screen name="ChatDetail" component={ChatDetailScreen} />
  </RootStack.Navigator>
);

export const AppNavigator = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.warn('Supabase session error', error.message);
      }
      if (mounted) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    };

    loadSession();

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const theme = useMemo<Theme>(
    () => ({
      ...DefaultTheme,
      dark: true,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.terracotta,
        background: colors.black,
        card: colors.black,
        text: colors.textPrimary,
        border: colors.glassBorder,
        notification: colors.ochre,
      },
    }),
    []
  );

  if (loading) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <LoadingScreen />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer theme={theme}>
          {session ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.black,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
