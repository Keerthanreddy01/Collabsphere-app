import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
  Platform
} from 'react-native';
import * as Lucid from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Typography } from './Typography';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width - 40;
const TAB_COUNT = 5;
const TAB_WIDTH = (BAR_WIDTH - 16) / TAB_COUNT;

// Premium spring config — matches 60fps feel
const SPRING_CONFIG = {
  damping: 22,
  stiffness: 300,
  mass: 0.8,
  overshootClamping: false,
};

const Icon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent color={color} size={size} strokeWidth={2.5} />;
};

// Individual animated tab item for press-scale micro-animation
const TabItem = ({
  route,
  isFocused,
  onPress,
  config,
}: {
  route: any;
  isFocused: boolean;
  onPress: () => void;
  config: { label: string; icon: string };
}) => {
  const pressScale = useSharedValue(1);
  const iconProgress = useSharedValue(isFocused ? 1 : 0);

  React.useEffect(() => {
    iconProgress.value = withSpring(isFocused ? 1 : 0, SPRING_CONFIG);
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const iconScale = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          iconProgress.value,
          [0, 1],
          [0.9, 1.1],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const handlePressIn = () => {
    pressScale.value = withSpring(0.88, { damping: 20, stiffness: 500 });
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1, SPRING_CONFIG);
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.tabItem}
      android_ripple={null}
    >
      <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
        <Animated.View style={iconScale}>
          <Icon
            name={config.icon}
            color={isFocused ? '#000' : 'rgba(0,0,0,0.28)'}
            size={22}
          />
        </Animated.View>
        <Typography
          variant="caption"
          color={isFocused ? '#000' : 'rgba(0,0,0,0.28)'}
          style={[
            styles.tabLabel,
            isFocused && { fontWeight: '900', color: '#000' },
          ]}
        >
          {config.label}
        </Typography>
      </Animated.View>
    </Pressable>
  );
};

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const translateX = useSharedValue(state.index * TAB_WIDTH);
  const isDragging = useSharedValue(false);
  const barScale = useSharedValue(1);

  React.useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withSpring(state.index * TAB_WIDTH, SPRING_CONFIG);
    }
  }, [state.index]);

  const onDragEnd = useCallback(
    (index: number) => {
      if (index !== state.index) {
        const route = state.routes[index];
        navigation.navigate(route.name);
      }
    },
    [state.index, state.routes, navigation]
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isDragging.value = true;
      barScale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
    })
    .onUpdate((event) => {
      let nextX = state.index * TAB_WIDTH + event.translationX;
      if (nextX < 0) nextX = 0;
      if (nextX > (TAB_COUNT - 1) * TAB_WIDTH) nextX = (TAB_COUNT - 1) * TAB_WIDTH;
      translateX.value = nextX;
    })
    .onEnd(() => {
      isDragging.value = false;
      barScale.value = withSpring(1, SPRING_CONFIG);
      const targetIndex = Math.round(translateX.value / TAB_WIDTH);
      translateX.value = withSpring(targetIndex * TAB_WIDTH, SPRING_CONFIG);
      runOnJS(onDragEnd)(targetIndex);
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    backgroundColor: '#FFEB3B',
  }));

  const containerAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: barScale.value }],
  }));

  const getTabConfig = (name: string) => {
    switch (name) {
      case 'Home': return { label: 'Main', icon: 'LayoutDashboard' };
      case 'Discovery': return { label: 'Rank', icon: 'Trophy' };
      case 'Feed': return { label: 'Social', icon: 'Globe' };
      case 'Incubator': return { label: 'Build', icon: 'Rocket' };
      case 'Profile': return { label: 'You', icon: 'UserCircle2' };
      default: return { label: name, icon: 'Circle' };
    }
  };

  return (
    <Animated.View style={[styles.outerContainer, containerAnimStyle]}>
      <View style={styles.barWrapper}>
        <BlurView
          intensity={90}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.activeBubble, indicatorStyle]} />
          </GestureDetector>

          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;
            const config = getTabConfig(route.name);

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
                route={route}
                isFocused={isFocused}
                onPress={onPress}
                config={config}
              />
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    bottom: 25,
    width: width,
    alignItems: 'center',
    zIndex: 1000,
  },
  barWrapper: {
    width: BAR_WIDTH,
    height: 75,
    borderRadius: 38,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 2.5,
    borderColor: '#000',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 12 },
      },
      android: {
        elevation: 15,
      },
    }),
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  activeBubble: {
    position: 'absolute',
    left: 8,
    width: (BAR_WIDTH - 16) / TAB_COUNT,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFEB3B',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: -1,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 9,
    marginTop: 4,
    fontWeight: '800',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
});
