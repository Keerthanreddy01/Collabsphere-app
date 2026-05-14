import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Plus } from 'lucide-react-native';

import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { CollabProject } from '../../types';
import { mockProjects } from '../../data/mockBuilders';

export const CollabBoardScreen = () => {
  const data = useMemo(() => mockProjects, []);

  const renderItem = ({ item, index }: { item: CollabProject; index: number }) => (
    <Animated.View entering={FadeIn.delay(index * 40)} style={styles.cardWrapper}>
      <View style={[styles.card, styles.cardStyle]}>
        <View style={styles.cardHeader}>
          <Typography style={styles.cardTitle}>{item.name}</Typography>
          <View style={styles.statusBadge}>
            <Typography style={styles.statusText}>{item.status}</Typography>
          </View>
        </View>
        <Typography style={styles.cardBody}>{item.description}</Typography>
        <View style={styles.tagsRow}>
          {item.stack.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Typography style={styles.tagText}>{tag}</Typography>
            </View>
          ))}
        </View>
        <View style={styles.metaRow}>
          <Typography style={styles.metaText}>Team size: {item.teamSize}</Typography>
          <Pressable style={styles.joinButton}>
            <Typography style={styles.joinText}>Join</Typography>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.screen}>
        <View style={styles.header}>
          <View>
            <Typography style={styles.headerTitle}>Collab Board</Typography>
            <Typography style={styles.headerSubtitle}>
              Open projects looking for collaborators
            </Typography>
          </View>
          <Pressable style={styles.createButton}>
            <Plus size={18} color={colors.white} />
            <Typography style={styles.createText}>New</Typography>
          </Pressable>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  createText: {
    ...typography.caption,
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  cardWrapper: {
    marginBottom: spacing.lg,
  },
  card: {
    padding: spacing.lg,
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
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.subtitle,
    color: colors.textCard,
    flex: 1,
  },
  statusBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  statusText: {
    ...typography.caption,
    color: colors.white,
  },
  cardBody: {
    ...typography.body,
    color: colors.textCard,
    marginTop: spacing.sm,
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
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.textCard,
  },
  joinButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  joinText: {
    ...typography.caption,
    color: colors.white,
  },
});
