import React from 'react';
import { Pressable, StyleSheet, View, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Search, MessageCircle, Bookmark, User } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ICONS = {
  Feed: Home,
  Discovery: Search,
  Chat: MessageCircle,
  CollabBoard: Bookmark,
  Profile: User,
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 20) }]}>
      <BlurView intensity={90} tint="dark" style={styles.blurWrapper}>
        <View style={styles.navContent}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const Icon = ICONS[route.name as keyof typeof ICONS] ?? Home;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable 
                key={route.key}
                onPress={onPress} 
                style={styles.tabBtn}
              >
                {isFocused && (
                  <Animated.View 
                    entering={FadeIn.duration(200)}
                    style={styles.activePill} 
                  />
                )}
                <Icon 
                  size={24} 
                  color={isFocused ? "#000" : "#888"} 
                  strokeWidth={isFocused ? 2.5 : 2}
                />
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  blurWrapper: {
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navContent: {
    flexDirection: 'row',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
    width: SCREEN_WIDTH - 60,
  },
  tabBtn: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
  },
});
