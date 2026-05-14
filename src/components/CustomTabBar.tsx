import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Compass, Home, MessageCircle, User, Users } from 'lucide-react-native';

import { colors, radius, spacing, typography } from '../theme/colors';
import { Typography } from './Typography';

const ICONS = {
  Feed: Home,
  Discovery: Compass,
  Chat: MessageCircle,
  CollabBoard: Users,
  Profile: User,
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const tabWidth = width / state.routes.length || 0;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(state.index * tabWidth, { duration: 240 });
  }, [state.index, tabWidth, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]} onLayout={onLayout}>
      {tabWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            { left: tabWidth / 2 - 20 },
            indicatorStyle,
          ]}
        />
      )}
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

        const label = route.name === 'CollabBoard' ? 'Board' : route.name;

        return (
          <Pressable key={route.key} style={styles.tab} onPress={onPress}>
            <View style={styles.iconContainer}>
              <Icon size={20} color={isFocused ? colors.white : colors.textMuted} />
            </View>
            <Typography
              style={[
                styles.label,
                { color: isFocused ? colors.white : colors.textMuted },
              ]}
            >
              {label}
            </Typography>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.tabBar,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    top: '50%',
    marginTop: -28, // Adjust to center the 40x40 circle vertically with the icon
    width: 40,
    height: 40,
    backgroundColor: colors.accent,
    borderRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 4,
    zIndex: 1,
  },
  iconContainer: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
  },
});
