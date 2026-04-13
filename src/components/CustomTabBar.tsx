import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
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
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { Typography } from './Typography';

const { width } = Dimensions.get('window');
const BAR_WIDTH = width - 40;
const TAB_COUNT = 5;
const TAB_WIDTH = (BAR_WIDTH - 16) / TAB_COUNT;

const Icon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent color={color} size={size} strokeWidth={2.5} />;
};

export const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const translateX = useSharedValue(state.index * TAB_WIDTH);
  const isDragging = useSharedValue(false);

  useEffect(() => {
    if (!isDragging.value) {
      translateX.value = withTiming(state.index * TAB_WIDTH, {
        duration: 350,
      });
    }
  }, [state.index]);

  const onDragEnd = (index: number) => {
    if (index !== state.index) {
      const route = state.routes[index];
      navigation.navigate(route.name);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart((_) => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      let nextX = (state.index * TAB_WIDTH) + event.translationX;
      if (nextX < 0) nextX = 0;
      if (nextX > (TAB_COUNT - 1) * TAB_WIDTH) nextX = (TAB_COUNT - 1) * TAB_WIDTH;
      translateX.value = nextX;
    })
    .onEnd((_) => {
      isDragging.value = false;
      const targetIndex = Math.round(translateX.value / TAB_WIDTH);
      translateX.value = withSpring(targetIndex * TAB_WIDTH, { damping: 20 });
      runOnJS(onDragEnd)(targetIndex);
    });

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: withTiming(isDragging.value ? 1.05 : 1) }
    ],
    backgroundColor: 'rgba(97,147,245,0.08)',
  }));

  return (
    <View style={styles.outerContainer}>
      <View style={styles.barWrapper}>
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.content}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.activeBubble, indicatorStyle]} />
          </GestureDetector>

          {state.routes.map((route: any, index: number) => {
            const isFocused = state.index === index;

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

            const config = getTabConfig(route.name);

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
              >
                <Icon
                  name={config.icon}
                  color={isFocused ? '#6193F5' : 'rgba(0,0,0,0.2)'}
                  size={24}
                />
                <Typography
                  variant="caption"
                  color={isFocused ? '#6193F5' : 'rgba(0,0,0,0.2)'}
                  style={[styles.tabLabel, isFocused && { fontWeight: '900' }]}
                >
                  {config.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
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
    width: width - 40,
    height: 75,
    borderRadius: 38,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.9)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 8,
      }
    })
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
    width: (width - 56) / 5,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(97,147,245,0.15)',
    zIndex: -1,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase'
  }
});
