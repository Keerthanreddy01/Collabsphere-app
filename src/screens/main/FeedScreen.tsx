import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Heart, MessageCircle, Share2, MoreHorizontal, Bell, Search, Play } from 'lucide-react-native';

import { colors, radius, spacing } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { mockFeedPosts } from '../../data/mockBuilders';

const STORY_DATA = [
  { id: '1', type: 'audio', title: 'Audio space\nLive', icon: '🎧', bg: '#0052FF' },
  { id: '2', type: 'post', title: 'Creative\nWork', icon: '☁️', bg: '#4A4A4A' },
  { id: '3', type: 'share', title: '@theKappe\nmade a post', icon: '👤', bg: '#FF4D4D' },
  { id: '4', type: 'live', title: 'Orb v2\nRelease', icon: '🚀', bg: '#6C63FF' },
];

export const FeedScreen = () => {
  const data = useMemo(() => mockFeedPosts, []);

  const renderHeader = () => (
    <View style={styles.topContainer}>
      {/* Top Icons Header */}
      <View style={styles.navHeader}>
        <View style={styles.leftNav}>
          <Pressable style={styles.iconCircle}>
            <Bell size={20} color="#FFF" />
            <View style={styles.badge}>
              <Typography style={styles.badgeText}>3</Typography>
            </View>
          </Pressable>
          <Pressable style={[styles.iconCircle, { marginLeft: 12 }]}>
            <Search size={20} color="#FFF" />
          </Pressable>
        </View>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100?u=me' }} 
          style={styles.profileAvatar} 
        />
      </View>

      {/* Stories / Spaces Horizontal List */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.storiesContent}
      >
        {STORY_DATA.map((story) => (
          <View key={story.id} style={[styles.storyCard, { backgroundColor: story.bg }]}>
            <View style={styles.storyHeader}>
              <Typography style={styles.storyIcon}>{story.icon}</Typography>
              <Typography style={styles.storyTitle}>{story.title}</Typography>
            </View>
            <View style={styles.storyBottom} />
          </View>
        ))}
      </ScrollView>
    </View>
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInUp.delay(index * 100)} style={styles.postCard}>
      {/* Social Context */}
      <View style={styles.socialContext}>
        <View style={styles.socialAvatars}>
          <Image source={{ uri: 'https://i.pravatar.cc/50?u=1' }} style={styles.smallAvatar} />
          <Image source={{ uri: 'https://i.pravatar.cc/50?u=2' }} style={[styles.smallAvatar, { marginLeft: -8 }]} />
        </View>
        <Typography style={styles.contextText}>16 friends liked</Typography>
      </View>

      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
        <View style={styles.postAuthorInfo}>
          <Typography style={styles.postAuthorName}>{item.author}</Typography>
          <Typography style={styles.postTime}>Posted in orb • {item.timeAgo}</Typography>
        </View>
      </View>

      {/* Post Content */}
      <Typography style={styles.postContent}>
        {item.update || "Very excited to welcome you here on orb v2. Listen to our podcast with @kimmo to get all new features."}
      </Typography>

      {/* Media Attachment */}
      <View style={styles.mediaContainer}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=500' }} 
          style={styles.mediaImage} 
        />
        <View style={styles.mediaOverlay}>
          <View style={styles.mediaText}>
            <Typography style={styles.mediaTitle}>orb v2 release</Typography>
            <Typography style={styles.mediaSubtitle}>{item.author} x Kimmo</Typography>
          </View>
          <View style={styles.mediaControls}>
            <Typography style={styles.duration}>48:56</Typography>
            <Pressable style={styles.playButton}>
              <Play size={16} fill="#000" color="#000" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Footer Actions */}
      <View style={styles.postFooter}>
        <View style={styles.footerLeft}>
          <Pressable style={styles.footerAction}>
            <Heart size={20} color="#666" />
            <Typography style={styles.footerActionText}>{item.likes}</Typography>
          </Pressable>
          <Pressable style={styles.footerAction}>
            <MessageCircle size={20} color="#666" />
            <Typography style={styles.footerActionText}>{item.comments}</Typography>
          </Pressable>
          <Pressable style={styles.footerAction}>
            <Share2 size={20} color="#666" />
            <Typography style={styles.footerActionText}>17</Typography>
          </Pressable>
        </View>
        <Pressable>
          <MoreHorizontal size={20} color="#666" />
        </Pressable>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listPadding: {
    paddingBottom: 100,
  },
  topContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  leftNav: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 8,
    backgroundColor: '#FFF',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#333',
  },
  badgeText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#333',
  },
  storiesContent: {
    paddingRight: 20,
    gap: 12,
  },
  storyCard: {
    width: 100,
    height: 120,
    borderRadius: 20,
    padding: 12,
    justifyContent: 'space-between',
  },
  storyHeader: {
    gap: 4,
  },
  storyIcon: {
    fontSize: 24,
  },
  storyTitle: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  storyBottom: {},
  
  postCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  socialContext: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  socialAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  smallAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  contextText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postAuthorInfo: {},
  postAuthorName: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  postTime: {
    color: '#999',
    fontSize: 12,
  },
  postContent: {
    color: '#333',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 16,
  },
  mediaContainer: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaText: {},
  mediaTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  mediaSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
  },
  mediaControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  duration: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    gap: 16,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerActionText: {
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
  },
});
