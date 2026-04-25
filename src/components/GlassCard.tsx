import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  children: React.ReactNode;
  borderColor?: string;
}

/**
 * GlassCard — PLOP! Neo-Brutalist floating card.
 * iOS: real BlurView glass. Android: solid white fallback.
 */
export const GlassCard: React.FC<GlassCardProps> = ({ 
  intensity = 85, 
  tint = 'light', 
  children, 
  style,
  borderColor = '#000',
  ...rest 
}) => {
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity} 
        tint={tint} 
        style={[styles.container, { borderColor }, style]}
        {...rest}
      >
        {children}
      </BlurView>
    );
  }

  return (
    <View 
      style={[styles.container, styles.androidSolid, { borderColor }, style]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.85)',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  androidSolid: {
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
  },
});
