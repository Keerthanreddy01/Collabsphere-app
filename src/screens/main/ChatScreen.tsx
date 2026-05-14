import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Bell, Heart, MessageCircle, MoreHorizontal, Play, Send, Settings2, Share } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { ChatMessage, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

// Extended mock data for Orb.club style
const orbConversations = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=1',
    lastMessage: 'Hey, I just pushed the new design system to main.',
    time: '1h ago',
    subtitle: 'In CollabSphere · 1h ago',
    likes: 3,
    comments: 2,
    shares: 0,
    topText: '3 teammates liked',
    hasPreview: true,
    previewTitle: 'Orb UI Refactor',
    previewStack: 'React Native, Reanimated',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://i.pravatar.cc/150?u=2',
    lastMessage: 'Let\'s sync tomorrow on the backend schema.',
    time: '2h ago',
    subtitle: 'In Backend Squad · 2h ago',
    likes: 5,
    comments: 8,
    shares: 1,
    topText: 'New message',
    hasPreview: false,
    previewTitle: '',
    previewStack: '',
  },
];

const activeStories = [
  { id: 's1', name: 'Alice', avatar: 'https://i.pravatar.cc/150?u=1', isActive: true },
  { id: 's2', name: 'Bob', avatar: 'https://i.pravatar.cc/150?u=2', isActive: false },
  { id: 's3', name: 'Charlie', avatar: 'https://i.pravatar.cc/150?u=3', isActive: true },
  { id: 's4', name: 'Diana', avatar: 'https://i.pravatar.cc/150?u=4', isActive: false },
  { id: 's5', name: 'Eve', avatar: 'https://i.pravatar.cc/150?u=5', isActive: true },
];

const ChatScreen = ({ navigation }: any) => {
  const data = orbConversations;
  const stories = activeStories;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.screen}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View style={styles.topBarLeft}>
            <View style={styles.iconPill}>
              <Bell size={20} color={colors.white} />
              <View style={styles.badge}>
                <Typography style={styles.badgeText}>3</Typography>
              </View>
            </View>
            <View style={styles.iconPill}>
              <Settings2 size={20} color={colors.white} />
            </View>
          </View>
          <Image source={{ uri: 'https://i.pravatar.cc/150?u=me' }} style={styles.topBarAvatar} />
        </View>

        <View>
          <FlatList
            horizontal
            data={stories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesContent}
            renderItem={({ item }) => (
              <View style={styles.storyContainer}>
                <View style={styles.storyAvatarWrapper}>
                  <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
                  {item.isActive && <View style={styles.activeDot} />}
                </View>
                <Typography style={styles.storyName} numberOfLines={1}>{item.name}</Typography>
              </View>
            )}
          />
        </View>

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeIn.delay(index * 40)} style={styles.listItemWrapper}>
              <Pressable
                style={styles.card}
                onPress={() =>
                  navigation.navigate('ChatDetail', {
                    chatId: item.id,
                    title: item.name,
                  })
                }
              >
                {item.topText ? (
                  <Typography style={styles.cardTopText}>{item.topText}</Typography>
                ) : null}

                <View style={styles.cardHeader}>
                  <Image source={{ uri: item.avatar }} style={styles.cardAvatar} />
                  <View style={styles.cardHeaderText}>
                    <Typography style={styles.cardName}>{item.name}</Typography>
                    <Typography style={styles.cardSubtitle}>{item.subtitle}</Typography>
                  </View>
                </View>

                <Typography style={styles.cardMessage} numberOfLines={3}>
                  {item.lastMessage}
                </Typography>

                {item.hasPreview && (
                  <View style={styles.previewCard}>
                    <View style={{ flex: 1 }}>
                      <Typography style={styles.previewTitle}>{item.previewTitle}</Typography>
                      <Typography style={styles.previewStack}>{item.previewStack}</Typography>
                    </View>
                    <View style={styles.playButton}>
                      <Play size={16} color={colors.black} fill={colors.black} />
                    </View>
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <View style={styles.footerActions}>
                    <View style={styles.footerAction}>
                      <Heart size={16} color={colors.textMuted} />
                      <Typography style={styles.footerActionText}>{item.likes}</Typography>
                    </View>
                    <View style={styles.footerAction}>
                      <MessageCircle size={16} color={colors.textMuted} />
                      <Typography style={styles.footerActionText}>{item.comments}</Typography>
                    </View>
                    <View style={styles.footerAction}>
                      <Share size={16} color={colors.textMuted} />
                      <Typography style={styles.footerActionText}>{item.shares}</Typography>
                    </View>
                  </View>
                  <MoreHorizontal size={20} color={colors.textMuted} />
                </View>
              </Pressable>
            </Animated.View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </View>
  );
};

export { ChatScreen };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.md,
  },
  mintBanner: {
    backgroundColor: '#FF5C00',
    marginHorizontal: 24,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    borderRadius: 50, // Perfectly smooth
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarLeft: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 8,
    backgroundColor: colors.danger,
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.white,
  },
  topBarAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  storiesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  storyContainer: {
    alignItems: 'center',
    width: 70,
  },
  storyAvatarWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.surface,
    padding: 2, // Space for border/gradient
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  activeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E', // Green Live/Active badge
    borderWidth: 2,
    borderColor: colors.black,
  },
  storyName: {
    ...typography.caption,
    color: colors.white,
    marginTop: 6,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100, // Space for tab bar
  },
  listItemWrapper: {
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTopText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.accent,
    marginRight: spacing.sm,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardName: {
    ...typography.subtitle,
    color: colors.black,
  },
  cardSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardMessage: {
    ...typography.body,
    color: colors.black,
    marginBottom: spacing.md,
  },
  previewCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  previewTitle: {
    ...typography.subtitle,
    color: colors.white,
  },
  previewStack: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: spacing.sm,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
