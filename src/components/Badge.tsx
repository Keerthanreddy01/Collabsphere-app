import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  style?: ViewStyle;
}

/**
 * Badge — PLOP! Neo-Brutalist pill badge.
 * Always has a hard 2px black border for maximum punch.
 */
export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  color = '#FFEB3B',
  textColor,
  variant = 'solid',
  style,
}) => {
  const getBgStyle = () => {
    switch (variant) {
      case 'outline':
        return { backgroundColor: 'transparent', borderColor: color };
      case 'ghost':
        return { backgroundColor: `${color}22`, borderColor: color };
      default:
        return { backgroundColor: color, borderColor: '#000' };
    }
  };

  const resolvedTextColor = textColor ?? (variant === 'solid' ? '#000' : color);

  return (
    <View style={[styles.container, getBgStyle(), style]}>
      <Typography
        variant="caption"
        color={resolvedTextColor}
        style={styles.label}
      >
        {label}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 10,
  },
});
