import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { COLORS } from '../theme/theme';

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: any;
  onPress?: () => void;
  glowColor?: string;
  enterDelay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  style, 
  onPress,
  glowColor = COLORS.primary,
  enterDelay = 0,
}) => {
  const press = useSharedValue(0);
  const reveal = useSharedValue(0);

  React.useEffect(() => {
    reveal.value = withTiming(1, { duration: 450 + enterDelay });
  }, [enterDelay, reveal]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: reveal.value,
      transform: [
        {
          translateY: interpolate(reveal.value, [0, 1], [16, 0]),
        },
        {
          scale: withSpring(press.value ? 0.97 : 1, {
            damping: 15,
            stiffness: 180,
          }),
        },
      ],
      shadowColor: glowColor,
      shadowOpacity: withTiming(press.value ? 0.16 : 0.09),
      shadowRadius: withTiming(press.value ? 16 : 10),
      elevation: withTiming(press.value ? 8 : 4),
    };
  });

  const handlePressIn = () => {
    press.value = 1;
  };

  const handlePressOut = () => {
    press.value = 0;
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.card, style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowOffset: { width: 0, height: 8 },
    overflow: 'hidden',
  },
});
