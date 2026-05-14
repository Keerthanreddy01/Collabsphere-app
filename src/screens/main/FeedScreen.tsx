import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  useAnimatedScrollHandler, 
  useSharedValue, 
  useAnimatedStyle,
  interpolate,
  withSpring,
  FadeInRight
} from 'react-native-reanimated';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Bell, 
  Search, 
  Play, 
  Sparkles,
  Zap
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { mockFeedPosts } from '../../data/mockBuilders';

const { width, height } = Dimensions.get('window');

// Using high-fidelity remote images as a fallback to ensure immediate visibility
const STORY_DATA = [
  { id: '1', type: 'audio', title: 'Audio space\nLive', uri: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=600&fit=crop', bg: ['#FF00CC', '#333399'] },
  { id: '2', type: 'post', title: 'Creative\nWork', uri: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=400&h=600&fit=crop', bg: ['#4A4A4A', '#111111'] },
  { id: '3', type: 'share', title: '@theKappe\nmade a post', uri: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop', bg: ['#FF4D4D', '#800000'] },
  { id: '4', type: 'live', title: 'Orb v2\nRelease', uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop', bg: ['#6C63FF', '#330066'] },
];

export const FeedScreen = () => {
  const data = useMemo(() => mockFeedPosts, []);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 60], [1, 0.2]);
    const scale = interpolate(scrollY.value, [0, 60], [1, 0.95]);
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const renderHeader = () => (
    <View style={styles.topHeaderWrapper}>
      {/* Top Navigation - Still Padded */}
      <Animated.View style={[styles.navHeader, headerStyle]}>
        <View style={styles.leftNav}>
          <Pressable style={styles.iconCircle}>
            <Bell size={20} color="#FFF" />
            <View style={styles.badge} />
          </Pressable>
          <Pressable style={[styles.iconCircle, { marginLeft: 12 }]}>
            <Search size={20} color="#FFF" />
          </Pressable>
        </View>
        <Typography style={styles.logoText}>CollabSphere</Typography>
        <Image 
          source={{ uri: 'https://i.pravatar.cc/100?u=me' }} 
          style={styles.profileAvatar} 
        />
      </Animated.View>

      {/* Hero Section / Stories - EDGE TO EDGE */}
      <View style={styles.heroSection}>
        <View style={styles.heroHeader}>
           <Typography style={styles.sectionTitle}>Active Spaces</Typography>
           <Sparkles size={16} color="#6C63FF" />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.storiesContent}
          decelerationRate="fast"
          snapToInterval={140 + 16} // card width + gap
        >
          {STORY_DATA.map((story, index) => (
            <Animated.View 
              key={story.id} 
              entering={FadeInRight.delay(index * 100)}
              style={styles.storyCardWrapper}
            >
              <Image 
                source={{ uri: story.uri }} 
                style={StyleSheet.absoluteFill} 
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                style={styles.storyCard}
              >
                <View style={styles.storyOverlay}>
                   <Typography style={styles.storyTitle}>{story.title}</Typography>
                   <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Typography style={styles.liveText}>LIVE</Typography>
                   </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 150)} style={styles.postWrapper}>
      {/* Glass Post Card */}
      <View style={styles.postCard}>
        {/* Social Proof Bar */}
        <View style={styles.socialProof}>
           <View style={styles.miniAvatars}>
              <Image source={{ uri: 'https://i.pravatar.cc/50?u=a' }} style={styles.miniAvatar} />
              <Image source={{ uri: 'https://i.pravatar.cc/50?u=b' }} style={[styles.miniAvatar, { marginLeft: -8 }]} />
           </View>
           <Typography style={styles.socialProofText}>Trusted by 12 builders</Typography>
        </View>

        {/* Post Header */}
        <View style={styles.postHeader}>
          <Image source={{ uri: item.avatar }} style={styles.postAvatar} />
          <View style={styles.authorInfo}>
            <Typography style={styles.authorName}>{item.author}</Typography>
            <View style={styles.authorSubRow}>
               <Typography style={styles.authorHandle}>@builder</Typography>
               <View style={styles.dot} />
               <Typography style={styles.postTime}>{item.timeAgo}</Typography>
            </View>
          </View>
          <Pressable style={styles.moreBtn}>
             <MoreHorizontal size={20} color="#666" />
          </Pressable>
        </View>

        {/* Post Content */}
        <Typography style={styles.postContent}>
          {item.update || "Exploring the intersection of AI and Collaborative design. 🚀 @collabsphere v2 coming soon."}
        </Typography>

        {/* Visual Media - Floating Style */}
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: `https://picsum.photos/seed/${item.id}/800/600` }} 
            style={styles.mediaImage} 
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.mediaOverlay}
          >
            <View style={styles.mediaDetails}>
               <Typography style={styles.mediaLabel}>Orbital Update</Typography>
               <Typography style={styles.mediaTitle}>Designing the Future</Typography>
            </View>
            <Pressable style={styles.glassPlay}>
               <Play size={18} fill="#FFF" color="#FFF" />
            </Pressable>
          </LinearGradient>
        </View>

        {/* Interaction Bar */}
        <View style={styles.postFooter}>
           <View style={styles.actionGroup}>
              <Pressable style={styles.actionBtn}>
                 <Heart size={22} color="#FF2D55" />
                 <Typography style={styles.actionValue}>{item.likes}</Typography>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                 <MessageCircle size={22} color="#FFF" />
                 <Typography style={styles.actionValue}>{item.comments}</Typography>
              </Pressable>
              <Pressable style={styles.actionBtn}>
                 <Share2 size={22} color="#FFF" />
              </Pressable>
           </View>
           <View style={styles.zapBadge}>
              <Zap size={14} color="#FFD60A" fill="#FFD60A" />
              <Typography style={styles.zapText}>TOP</Typography>
           </View>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  listPadding: {
    paddingBottom: 120,
  },
  topHeaderWrapper: {
    paddingTop: 60,
    marginBottom: 20,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  leftNav: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF2D55',
    borderWidth: 1.5,
    borderColor: '#111',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -1,
  },
  profileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#333',
  },
  heroSection: {
    marginBottom: 12,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  storiesContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  storyCardWrapper: {
    width: 140,
    height: 210,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#111',
    borderWidth: 1.5,
    borderColor: '#222',
  },
  storyCard: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  storyOverlay: {
    gap: 8,
  },
  storyTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    letterSpacing: -0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 45, 85, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF2D55',
  },
  liveText: {
    color: '#FF2D55',
    fontSize: 8,
    fontWeight: '900',
  },
  postWrapper: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  postCard: {
    backgroundColor: '#111',
    borderRadius: 50,
    padding: 26,
    borderWidth: 1,
    borderColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  socialProof: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignSelf: 'flex-start',
    paddingRight: 12,
    borderRadius: 20,
  },
  miniAvatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  miniAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#111',
  },
  socialProofText: {
    fontSize: 11,
    color: '#AAA',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },
  authorSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  authorHandle: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#444',
    marginHorizontal: 6,
  },
  postTime: {
    fontSize: 13,
    color: '#666',
  },
  moreBtn: {
    padding: 4,
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#DDD',
    fontWeight: '500',
    marginBottom: 20,
  },
  mediaContainer: {
    width: '100%',
    height: 280,
    borderRadius: 40,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  mediaDetails: {
    flex: 1,
  },
  mediaLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mediaTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
  },
  glassPlay: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  actionGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionValue: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
  zapBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,214,10,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  zapText: {
    color: '#FFD60A',
    fontSize: 10,
    fontWeight: '900',
  },
});
