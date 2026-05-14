import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, typography } from '../theme/colors';

type Variant = keyof typeof typography;

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = colors.textPrimary,
  align = 'left',
  style,
  children,
  ...props
}) => (
  <Text
    style={[styles.base, typography[variant], { color, textAlign: align }, style]}
    {...props}
  >
    {children}
  </Text>
);

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0.1,
  },
});
