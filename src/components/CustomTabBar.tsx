import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, MessageCircle, Bookmark, User, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
} from 'react-native-reanimated';
import { Typography } from './Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NAV_WIDTH = SCREEN_WIDTH - 48;
const TAB_WIDTH = NAV_WIDTH / 5;
const BUBBLE_SIZE = 58;

const ICONS = {
  Feed: Home,
  Chat: MessageCircle,
  CollabBoard: Bookmark,
  Profile: User,
  Discovery: Search,
};

const LABELS = {
  Feed: 'Today',
  Chat: 'Games',
  CollabBoard: 'Apps',
  Profile: 'Arcade',
  Discovery: 'Search',
};

// --- Tab Item Component ---
const TabItem = ({ route, isFocused, onPress }: { route: any, isFocused: boolean, onPress: () => void }) => {
  const Icon = ICONS[route.name as keyof typeof ICONS] ?? Home;
  const label = LABELS[route.name as keyof typeof LABELS] ?? route.name;

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(isFocused ? -28 : 0, { damping: 12, stiffness: 90 }) },
      { scale: withSpring(isFocused ? 1.1 : 1) }
    ],
  }));

  const iconOpacityStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isFocused ? 1 : 0.5),
  }));

  return (
    <Pressable onPress={onPress} style={styles.tabBtn}>
      <Animated.View style={[styles.iconWrapper, animatedIconStyle, iconOpacityStyle]}>
        <Icon size={24} color={isFocused ? "#FFF" : "#AAA"} strokeWidth={isFocused ? 2.5 : 2} />
      </Animated.View>
      <Typography style={[
        styles.tabLabel, 
        { color: isFocused ? '#3b9fe8' : '#888' }
      ]}>
        {label}
      </Typography>
    </Pressable>
  );
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;
  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(activeIndex * TAB_WIDTH, { 
      damping: 15, 
      stiffness: 90,
    });
  }, [activeIndex]);

  const activeBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.outerContainer, { bottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.navBar}>
        {/* THE FLOATING BUBBLE */}
        <Animated.View style={[styles.bubbleContainer, activeBubbleStyle]}>
          <View style={styles.bubbleShadow} />
          <LinearGradient
            colors={['#3b9fe8', '#1e40af']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.bubble}
          >
            <View style={styles.glare} />
          </LinearGradient>
        </Animated.View>

        {/* NAV CONTENT */}
        <View style={styles.navContent}>
          {state.routes.map((route, i) => (
            <TabItem 
              key={route.key}
              route={route}
              isFocused={activeIndex === i}
              onPress={() => navigation.navigate(route.name)}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  navBar: {
    width: NAV_WIDTH,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(20,20,20,0.95)',
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
  },
  bubbleContainer: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubble: {
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    marginTop: -56,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  glare: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '35%',
    height: '25%',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 20,
    transform: [{ rotate: '-15deg' }],
  },
  bubbleShadow: {
    position: 'absolute',
    width: BUBBLE_SIZE * 0.8,
    height: 20,
    backgroundColor: '#3b9fe8',
    borderRadius: 20,
    top: -30,
    opacity: 0.3,
    shadowColor: '#3b9fe8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  tabBtn: {
    width: TAB_WIDTH,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
});
