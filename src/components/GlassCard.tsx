import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS } from '../theme/theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  intensity = 20, 
  tint = 'light', 
  children, 
  style,
  ...rest 
}) => {
  const { ...props } = rest as any;
  // Explicitly remove custom props from spreading to native View
  delete props.intensity;
  delete props.tint;

  if (Platform.OS === 'ios') {
    return (
      <BlurView 
        intensity={intensity} 
        tint={tint} 
        style={[styles.container, style]}
        {...props}
      >
        {children}
      </BlurView>
    );
  }

  // Fallback for Android where blur can be inconsistent.
  return (
    <View 
      style={[
        styles.container, 
        styles.androidFallback,
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    backgroundColor: COLORS.glassBackground,
  },
  androidFallback: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});
