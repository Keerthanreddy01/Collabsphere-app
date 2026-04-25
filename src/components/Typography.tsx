import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../theme/theme';

interface TypographyProps extends TextProps {
  variant?: keyof typeof TYPOGRAPHY;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = COLORS.textPrimary,
  align = 'left',
  style, 
  children,
  ...props 
}) => {
  return (
    <Text 
      style={[
        TYPOGRAPHY[getTypographyVariant(variant)], 
        { 
          color, 
          textAlign: align,
          fontFamily: (variant === 'h1' || variant === 'h2' || variant === 'h3') ? 'Inter_800ExtraBold' : 'Inter_400Regular'
        },
        style
      ]} 
      {...props}
    >
      {children}
    </Text>
  );
};

function getTypographyVariant(v: string): keyof typeof TYPOGRAPHY {
    if (v in TYPOGRAPHY) return v as keyof typeof TYPOGRAPHY;
    return 'body';
}
