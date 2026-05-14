import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius } from '../theme/colors';
import { Typography } from './Typography';

interface BadgeProps {
  label: string;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = colors.panel,
  textColor = colors.textSecondary,
  style,
}) => (
  <View style={[styles.container, { backgroundColor: color }, style]}>
    <Typography style={[styles.label, { color: textColor }]}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
});
