import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  SharedValue,
  withSpring,
  Layout,
  FadeIn,
} from 'react-native-reanimated';
import { 
  LayoutGrid, 
  Bookmark, 
  Share2, 
  ThumbsUp,
} from 'lucide-react-native';
import { Typography } from '../../components/Typography';

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
    cardColor: '#FDF1CB',
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
    cardColor: '#E0F2FE',
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
    cardColor: '#FADADD',
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
    cardColor: '#E0E7FF',
  }
];

type AnimationMode = 'TRENDING' | 'SQUADS' | 'PROJECTS' | 'DESIGN' | 'STACK';

const NewsCard = ({ 
  item, 
  index, 
  scrollX, 
  cardWidth, 
  mode 
}: { 
  item: any, 
  index: number, 
  scrollX: SharedValue<number>, 
  cardWidth: number,
  mode: AnimationMode 
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const x = scrollX.value || 0;
    const w = cardWidth || 300;
    
    const inputRange = [
      (index - 1) * w,
      index * w,
      (index + 1) * w,
    ];

    if (mode === 'TRENDING') {
      // 3D Perspective Stack
      const scale = interpolate(x, inputRange, [0.85, 1, 0.85], Extrapolate.CLAMP);
      const rotate = interpolate(x, inputRange, [-10, 0, 10], Extrapolate.CLAMP);
      const opacity = interpolate(x, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP);
      return {
        transform: [{ scale: scale || 1 }, { rotateY: `${rotate || 0}deg` }],
        opacity: opacity || 1,
      };
    }

    if (mode === 'SQUADS') {
      // Vertical Elevation
      const translateY = interpolate(x, inputRange, [40, 0, 40], Extrapolate.CLAMP);
      const scale = interpolate(x, inputRange, [0.9, 1, 0.9], Extrapolate.CLAMP);
      return {
        transform: [{ translateY }, { scale: scale || 1 }],
      };
    }

    if (mode === 'PROJECTS') {
      // Flip Effect
      const rotateX = interpolate(x, inputRange, [90, 0, -90], Extrapolate.CLAMP);
      return {
        transform: [{ perspective: 1000 }, { rotateX: `${rotateX}deg` }],
      };
    }

    // Default: Horizontal Carousel
    const scale = interpolate(x, inputRange, [0.95, 1, 0.95], Extrapolate.CLAMP);
    return {
      transform: [{ scale: scale || 1 }],
    };
  });

  return (
    <Animated.View style={[styles.newsCard, { backgroundColor: item.cardColor, width: cardWidth }, animatedStyle]}>
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
  const { width: windowWidth } = useWindowDimensions();
  const [activeCategory, setActiveCategory] = useState<AnimationMode>('TRENDING');
  const scrollX = useSharedValue(0);

  const cardWidth = windowWidth * 0.82;
  const spacing = (windowWidth - cardWidth) / 2;

  const filteredData = useMemo(() => {
    if (activeCategory === 'TRENDING') return COLLAB_DATA;
    return COLLAB_DATA.filter(item => item.category.toUpperCase() === activeCategory);
  }, [activeCategory]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
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

      <View style={styles.categoriesWrapper}>
        <Animated.ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map(cat => {
            const mode = cat.toUpperCase() as AnimationMode;
            const isActive = activeCategory === mode;
            return (
              <TouchableOpacity 
                key={cat} 
                onPress={() => {
                  setActiveCategory(mode);
                  scrollX.value = 0; // Reset scroll on category change
                }}
                style={styles.categoryTab}
              >
                <Typography style={[styles.categoryText, isActive && styles.categoryActive]}>
                  {cat}
                </Typography>
                {isActive && (
                  <Animated.View 
                    entering={FadeIn.duration(300)}
                    style={styles.activeIndicator} 
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>
      </View>

      <Animated.ScrollView 
        key={activeCategory} // Force re-render to reset layout for new mode
        horizontal 
        onScroll={onScroll}
        scrollEventThrottle={16}
        snapToInterval={cardWidth + 20} // Width + Margin
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.feedScroll, { paddingHorizontal: spacing }]}
      >
        {filteredData.map((item, index) => (
          <NewsCard 
            key={item.id} 
            item={item} 
            index={index} 
            scrollX={scrollX} 
            cardWidth={cardWidth} 
            mode={activeCategory}
          />
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
    paddingVertical: 20,
  },
  newsCard: {
    height: 520,
    borderRadius: 40,
    padding: 24,
    marginRight: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
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
    color: 'rgba(0,0,0,0.5)',
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
    color: 'rgba(0,0,0,0.4)',
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
    color: 'rgba(0,0,0,0.7)',
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
