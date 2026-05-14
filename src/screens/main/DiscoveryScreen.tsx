import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { UserPlus } from 'lucide-react-native';

import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { BuilderProfile } from '../../types';
import { mockBuilders } from '../../data/mockBuilders';

export const DiscoveryScreen = () => {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query) return mockBuilders;
    const lowered = query.toLowerCase();
    return mockBuilders.filter((builder) =>
      `${builder.name} ${builder.role} ${builder.skills.join(' ')}`
        .toLowerCase()
        .includes(lowered)
    );
  }, [query]);

  const renderItem = ({ item, index }: { item: BuilderProfile; index: number }) => (
    <Animated.View entering={FadeIn.delay(index * 30)} style={styles.cardWrapper}>
      <View style={[styles.card, styles.cardStyle]}>
        <View style={styles.cardHeader}>
          <Typography style={styles.name}>{item.name}</Typography>
          <View style={styles.matchBadge}>
            <Typography style={styles.matchText}>{item.match}%</Typography>
          </View>
        </View>
        <Typography style={styles.role}>{item.role}</Typography>
        <View style={styles.tagsRow}>
          {item.skills.map((skill) => (
            <View key={skill} style={styles.tag}>
              <Typography style={styles.tagText}>{skill}</Typography>
            </View>
          ))}
        </View>
        <Pressable style={styles.connectButton}>
          <UserPlus size={16} color={colors.white} />
          <Typography style={styles.connectText}>Connect</Typography>
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.screen}>
        <View style={styles.header}>
          <Typography style={styles.headerTitle}>Discovery</Typography>
          <Typography style={styles.headerSubtitle}>
            Find builders and match with squads
          </Typography>
          <TextInput
            placeholder="Search builders"
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
        </View>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  search: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  column: {
    gap: spacing.md,
  },
  cardWrapper: {
    flex: 1,
    marginTop: spacing.md,
  },
  card: {
    padding: spacing.md,
    minHeight: 190,
  },
  cardStyle: {
    backgroundColor: colors.white,
    borderRadius: 20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    ...typography.subtitle,
    color: colors.textCard,
    flex: 1,
    marginRight: spacing.xs,
  },
  matchBadge: {
    backgroundColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  matchText: {
    ...typography.caption,
    color: colors.white,
  },
  role: {
    ...typography.body,
    color: colors.textCard,
    marginTop: spacing.xs,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.panel,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  connectButton: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  connectText: {
    ...typography.caption,
    color: colors.white,
  },
});
