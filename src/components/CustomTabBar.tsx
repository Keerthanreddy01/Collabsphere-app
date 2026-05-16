import React from 'react';
import { Pressable, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, MessageSquare, Layers, User } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  createAnimatedComponent,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_WIDTH = SCREEN_WIDTH * 0.92;

const ICONS = {
  Feed: Home,
  Discovery: Compass,
  Chat: MessageSquare,
  CollabBoard: Layers,
  Profile: User,
};

const LABELS = {
  Feed: 'Home',
  Discovery: 'Explore',
  Chat: 'Jams',
  CollabBoard: 'Board',
  Profile: 'Me',
};

const AnimatedPressable = createAnimatedComponent(Pressable);

const TabItem = ({ 
  route, 
  isFocused, 
  onPress,
  showBadge = false,
}: { 
  route: any, 
  isFocused: boolean,
  onPress: () => void,
  showBadge?: boolean,
}) => {
  const Icon = ICONS[route.name as keyof typeof ICONS] ?? Home;
  const label = LABELS[route.name as keyof typeof LABELS] ?? route.name;

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isFocused ? 1.15 : 1, { damping: 15, stiffness: 150 }) },
        { translateY: withSpring(isFocused ? -2 : 0, { damping: 15 }) }
      ],
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isFocused ? 1 : 0.6, { duration: 200 }),
      transform: [
        { scale: withSpring(isFocused ? 1.05 : 1, { damping: 15 }) }
      ],
    };
  });

  const color = isFocused ? '#FFFFFF' : '#8E8E93';
  const fill = isFocused ? '#FFFFFF' : 'transparent';

  return (
    <AnimatedPressable 
      onPress={onPress} 
      style={styles.tabItemContainer}
    >
      <View style={styles.iconContainer}>
        <Animated.View style={animatedIconStyle}>
          <Icon 
            size={24} 
            color={color} 
            fill={fill}
            strokeWidth={isFocused ? 2 : 2} 
          />
        </Animated.View>

        {showBadge && (
          <View style={styles.badgeContainer}>
            {/* Glow Effect */}
            <LinearGradient
              colors={['rgba(138, 43, 226, 0.8)', 'rgba(255, 105, 180, 0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeGlow}
            />
            {/* Actual Badge */}
            <LinearGradient
              colors={['#8A2BE2', '#FF69B4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badge}
            >
              <Typography style={styles.badgeText}>NEW</Typography>
            </LinearGradient>
          </View>
        )}
      </View>

      <Animated.View style={animatedTextStyle}>
        <Typography 
          style={[styles.tabLabel, { color: color }]}
        >
          {label}
        </Typography>
      </Animated.View>
    </AnimatedPressable>
  );
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
      <View style={styles.tabBarBackground}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          // Add the "NEW" badge specifically to the CollabBoard tab for the aesthetic
          const showBadge = route.name === 'CollabBoard';

          return (
            <TabItem 
              key={route.key}
              isFocused={isFocused}
              route={route}
              showBadge={showBadge}
              onPress={() => navigation.navigate(route.name)}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  tabBarBackground: {
    width: CONTAINER_WIDTH,
    height: 76,
    backgroundColor: '#09090B',
    borderRadius: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  tabItemContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 6,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -18,
    zIndex: 10,
  },
  badgeGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 10,
    opacity: 0.6,
    transform: [{ scale: 1.2 }],
    ...Platform.select({
      ios: {
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
