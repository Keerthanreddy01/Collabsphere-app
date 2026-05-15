import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  StatusBar,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  FadeInDown,
} from 'react-native-reanimated';
import { 
  LayoutGrid, 
  Bookmark, 
  Share2, 
  ThumbsUp,
} from 'lucide-react-native';
import { Typography } from '../../components/Typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SPACING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

const CATEGORIES = ['Trending', 'Squads', 'Projects', 'Design', 'Stack'];

const COLLAB_DATA = [
  {
    id: '1',
    category: 'Squads',
    isLive: true,
    title: 'React Native Devs needed for an AI-powered Whiteboard app',
    updatedAt: 'Posted just now',
    author: 'Keerthan Reddy',
    authorAvatar: 'https://i.pravatar.cc/100?u=keerthan',
    summary: 'We are building a real-time collaborative whiteboard using Socket.io and Supabase. Looking for 2 builders to join the squad and ship by next week!',
    cardColor: '#FDF1CB', // Cream
  },
  {
    id: '2',
    category: 'Projects',
    isLive: false,
    title: 'Showcase: Modern Glassmorphism UI Kit for Expo',
    updatedAt: '3h ago',
    author: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/100?u=sarah',
    summary: 'Just shipped a premium UI kit with 50+ components featuring sleek blur effects and high-fidelity animations. Open for collaborations!',
    cardColor: '#E0F2FE', // Light blue
  },
  {
    id: '3',
    category: 'Design',
    isLive: true,
    title: 'Join the Design Squad for CollabSphere v2.0',
    updatedAt: 'Updated 5m ago',
    author: 'Alex Rivera',
    authorAvatar: 'https://i.pravatar.cc/100?u=alex',
    summary: 'We are redesigning the entire interaction model for project matching. If you love Figma and high-fidelity prototypes, join us!',
    cardColor: '#FADADD', // Light pink
  },
  {
    id: '4',
    category: 'Stack',
    isLive: false,
    title: 'Why Expo is the ultimate choice for shipping fast',
    updatedAt: '1d ago',
    author: 'James Wilson',
    authorAvatar: 'https://i.pravatar.cc/100?u=james',
    summary: 'Expo Router, EAS, and the new Modules API have changed the game for cross-platform development. Let\'s discuss the best setup.',
    cardColor: '#E0E7FF', // Indigo
  }
];

const NewsCard = ({ item, index, scrollX }: { item: any, index: number, scrollX: Animated.SharedValue<number> }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.9, 1, 0.9],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      ['-2deg', '0deg', '2deg'],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { scale },
        { rotateZ: rotate }
      ],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.newsCard, { backgroundColor: item.cardColor }, animatedStyle]}>
      <View style={styles.cardHeader}>
        {item.isLive && (
          <View style={styles.liveBadge}>
            <Typography style={styles.liveText}>BUILDING</Typography>
          </View>
        )}
      </View>

      <Typography style={styles.cardTitle}>{item.title}</Typography>
      <Typography style={styles.updatedText}>{item.updatedAt}</Typography>

      <View style={styles.authorSection}>
        <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <Typography style={styles.publishedBy}>Posted by</Typography>
          <Typography style={styles.authorName}>{item.author}</Typography>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Typography style={styles.followText}>Join Squad</Typography>
        </TouchableOpacity>
      </View>

      <Typography style={styles.summaryText} numberOfLines={4}>
        {item.summary}
      </Typography>

      <View style={styles.interactionIcons}>
        <TouchableOpacity style={styles.iconBtn}>
          <ThumbsUp size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Bookmark size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <Share2 size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export const FeedScreen = () => {
  const [activeCategory, setActiveCategory] = useState('Trending');
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Typography style={styles.logoChar}>C</Typography>
          </View>
          <Typography style={styles.logoText}>Sphere</Typography>
        </View>
        <TouchableOpacity style={styles.gridBtn}>
          <LayoutGrid size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <Animated.ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={styles.categoryTab}
            >
              <Typography style={[styles.categoryText, activeCategory === cat && styles.categoryActive]}>
                {cat}
              </Typography>
              {activeCategory === cat && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      </View>

      {/* Main Feed perspective carousel */}
      <Animated.ScrollView 
        horizontal 
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
      >
        {COLLAB_DATA.map((item, index) => (
          <NewsCard key={item.id} item={item} index={index} scrollX={scrollX} />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoChar: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  gridBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesWrapper: {
    marginBottom: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 24,
    gap: 24,
  },
  categoryTab: {
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
  },
  categoryActive: {
    color: '#FFF',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginTop: 6,
  },
  feedScroll: {
    paddingHorizontal: SPACING,
    paddingVertical: 20,
  },
  newsCard: {
    width: CARD_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    borderRadius: 40,
    padding: 24,
    justifyContent: 'space-between',
    // Shadow for elevation effect
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 10,
  },
  liveBadge: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    lineHeight: 34,
  },
  updatedText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  publishedBy: {
    fontSize: 12,
    color: '#888',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  followBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    marginBottom: 20,
  },
  interactionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
