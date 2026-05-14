import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { colors, spacing, typography } from '../theme/colors';
import { Typography } from '../components/Typography';

export const LegacyPlaceholder = ({ title }: { title: string }) => (
  <View style={styles.container}>
    <Animated.View entering={FadeIn.duration(250)} style={styles.content}>
      <Typography style={styles.title}>{title}</Typography>
      <Typography style={styles.subtitle}>
        This screen is reserved in the new CollabSphere layout.
      </Typography>
    </Animated.View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  content: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
