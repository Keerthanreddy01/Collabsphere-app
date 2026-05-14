import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Compass, Home, MessageCircle, User, Users } from 'lucide-react-native';

import { colors } from '../theme/colors';
import { Typography } from './Typography';

const ICONS = {
  Feed: Home,
  Discovery: Compass,
  Chat: MessageCircle,
  CollabBoard: Users,
  Profile: User,
};

const TAB_BAR_HEIGHT = 85;

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.outerWrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.wrapper} onLayout={onLayout}>
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
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              Icon={Icon}
              label={route.name === 'CollabBoard' ? 'Board' : route.name}
              showBadge={route.name === 'Discovery'} // "NEW" badge on Discovery
            />
          );
        })}
      </View>
    </View>
  );
};

const TabItem = ({ isFocused, onPress, Icon, label, showBadge }: any) => {
  const animatedValue = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    animatedValue.value = withTiming(isFocused ? 1 : 0, { duration: 200 });
  }, [isFocused, animatedValue]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(animatedValue.value, [0, 1], [1, 1.1]) }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.tab}>
      <View style={styles.iconContainer}>
        <Animated.View style={iconStyle}>
          <Icon
            size={24}
            color={isFocused ? '#FFFFFF' : '#666666'}
            fill={isFocused ? '#FFFFFF' : 'transparent'}
            strokeWidth={2}
          />
        </Animated.View>
        
        {showBadge && (
          <View style={styles.badge}>
            <Typography style={styles.badgeText}>NEW</Typography>
          </View>
        )}
      </View>
      <Typography
        style={[
          styles.label,
          { color: isFocused ? '#FFFFFF' : '#666666', fontWeight: isFocused ? '800' : '500' }
        ]}
      >
        {label}
      </Typography>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  wrapper: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    width: '94%',
    height: TAB_BAR_HEIGHT,
    borderRadius: 40,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 15,
  },
  tab: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    marginBottom: 6,
    position: 'relative',
  },
  label: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: -18,
    backgroundColor: '#6C63FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    // Glow effect
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
});
