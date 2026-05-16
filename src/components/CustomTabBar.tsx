import React from 'react';
import { Pressable, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, MessageSquare, Layers, User, Plus } from 'lucide-react-native';
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

  const color = isFocused ? '#000000' : '#8E8E93';
  const fill = isFocused ? '#000000' : 'transparent';

  if (route.name === 'CollabBoard') {
    return (
      <AnimatedPressable 
        onPress={onPress} 
        style={[styles.tabItemContainer, styles.middleButtonContainer]}
      >
        <View style={styles.middleButton}>
          <Plus size={24} color="#FFFFFF" />
        </View>
      </AnimatedPressable>
    );
  }

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
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
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
  middleButtonContainer: {
    marginTop: -30,
    zIndex: 10,
  },
  middleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  badgeContainer: {
    position: 'absolute',
    top: -6,
    right: -18,
    zIndex: 10,
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
