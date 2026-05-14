import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Heart, MessageCircle } from 'lucide-react-native';

import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';

import { FeedPost } from '../../types';
import { mockFeedPosts } from '../../data/mockBuilders';

export const FeedScreen = () => {
  const data = useMemo(() => mockFeedPosts, []);

  const renderItem = ({ item, index }: { item: FeedPost; index: number }) => (
    <Animated.View entering={FadeIn.delay(index * 40)} style={styles.cardWrapper}>
      <View style={[styles.card, styles.cardStyle]}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Typography style={styles.name}>{item.author}</Typography>
            <Typography style={styles.caption}>{item.timeAgo}</Typography>
          </View>
        </View>
        <Typography style={styles.title}>{item.title}</Typography>
        <Typography style={styles.body}>{item.update}</Typography>
        <View style={styles.tagsRow}>
          {item.stack.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Typography style={styles.tagText}>{tag}</Typography>
            </View>
          ))}
        </View>
        <View style={styles.actionsRow}>
          <Pressable style={styles.actionButton}>
            <Heart size={16} color={colors.accent} />
            <Typography style={styles.actionText}>{item.likes}</Typography>
          </Pressable>
          <Pressable style={styles.actionButton}>
            <MessageCircle size={16} color={colors.accent} />
            <Typography style={styles.actionText}>{item.comments}</Typography>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View style={styles.screen} entering={FadeIn.duration(300)}>
        <View style={styles.header}>
          <Typography style={styles.headerTitle}>Feed</Typography>
          <Typography style={styles.headerSubtitle}>
            Builder updates from your network
          </Typography>
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
    paddingHorizontal: spacing.lg,
  },
  screen: {
    flex: 1,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
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
  listContent: {
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
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...typography.subtitle,
    color: colors.textCard,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  title: {
    ...typography.subtitle,
    color: colors.textCard,
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.textCard,
    marginBottom: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
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
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
