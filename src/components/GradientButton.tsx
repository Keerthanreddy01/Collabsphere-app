import React from 'react';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../theme/theme';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: readonly [string, string, ...string[]];
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ 
  title, 
  colors = COLORS.primaryGradient, 
  containerStyle,
  textStyle,
  icon,
  ...props 
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} {...props}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, containerStyle]}
      >
        {icon && icon}
        <Text style={[styles.text, textStyle, icon ? { marginLeft: 8 } : {}]}>
          {title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
