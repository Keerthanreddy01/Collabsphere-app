import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { COLORS, BORDER_RADIUS } from '../theme/theme';

interface BadgeProps {
  label: string;
  color?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  color = COLORS.primary, 
  variant = 'solid',
  style 
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: color,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: `${color}20`, // 20 opacity
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: color,
          borderColor: 'transparent',
        };
    }
  };

  const getTextColor = () => {
    if (variant === 'solid') return '#FFF';
    return color;
  };

  return (
    <View style={[styles.container, getStyles(), style]}>
      <Typography variant="caption" color={getTextColor()} style={{ fontWeight: '700', textTransform: 'uppercase' }}>
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
});
