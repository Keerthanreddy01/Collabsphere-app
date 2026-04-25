import React, { useCallback } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

// Premium 60fps spring configs
const SPRING_PRESS = { damping: 18, stiffness: 500, mass: 0.8 };
const SPRING_RELEASE = { damping: 22, stiffness: 300, mass: 0.9 };

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  enterDelay?: number;
  disabled?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  style, 
  onPress,
  enterDelay = 0,
  disabled = false,
}) => {
  const press = useSharedValue(0);
  const reveal = useSharedValue(0);

  React.useEffect(() => {
    reveal.value = withTiming(1, {
      duration: 380,
      easing: Easing.out(Easing.cubic),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(reveal.value, [0, 1], [0, 1]),
    transform: [
      {
        translateY: interpolate(reveal.value, [0, 1], [20, 0]),
      },
      {
        // True 60fps spring scale — uses worklet, runs on UI thread
        scale: withSpring(
          press.value === 1 ? 0.965 : 1,
          press.value === 1 ? SPRING_PRESS : SPRING_RELEASE
        ),
      },
    ],
  }));

  const handlePressIn = useCallback(() => {
    'worklet';
    press.value = 1;
  }, []);

  const handlePressOut = useCallback(() => {
    'worklet';
    press.value = 0;
  }, []);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      android_ripple={null}
    >
      <Animated.View style={[styles.card, style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
});
