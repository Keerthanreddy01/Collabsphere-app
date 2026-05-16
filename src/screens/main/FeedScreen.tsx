import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate,
  SharedValue,
  FadeIn,
} from 'react-native-reanimated';
import { 
  LayoutGrid, 
  Bookmark, 
  Share2, 
  ThumbsUp,
  MessageCircle,
} from 'lucide-react-native';
import { Typography } from '../../components/Typography';

const CATEGORIES = ['Trending', 'Squads', 'Projects', 'Design', 'Stack'];

const COLLAB_DATA = [
  {
    id: '1',
    category: 'Squads',
    isLive: true,
    title: 'React Native Devs needed for AI Whiteboard',
    updatedAt: 'Posted just now',
    author: 'Keerthan Reddy',
    authorAvatar: 'https://i.pravatar.cc/100?u=keerthan',
    summary: 'Building a real-time collaborative whiteboard using Socket.io and Supabase. Looking for 2 builders to join!',
    cardColor: '#FDF1CB',
  },
  {
    id: '2',
    category: 'Projects',
    isLive: false,
    title: 'Showcase: Modern Glassmorphism UI Kit',
    updatedAt: '3h ago',
    author: 'Sarah Chen',
    authorAvatar: 'https://i.pravatar.cc/100?u=sarah',
    summary: 'Just shipped a premium UI kit with 50+ components featuring sleek blur effects. Open for collabs!',
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
    summary: 'We are redesigning the entire interaction model for project matching. If you love Figma, join us!',
    cardColor: '#FADADD',
  },
  {
    id: '4',
    category: 'Stack',
    isLive: false,
    title: 'Why Expo is the ultimate choice for shipping',
    updatedAt: '1d ago',
    author: 'James Wilson',
    authorAvatar: 'https://i.pravatar.cc/100?u=james',
    summary: 'Expo Router, EAS, and the new Modules API have changed the game for cross-platform development.',
    cardColor: '#E0E7FF',
  }
];

const ACTIVE_SQUADS = [
  { id: '1', name: 'UI/UX', image: 'https://i.pravatar.cc/100?u=ui', members: 120 },
  { id: '2', name: 'React', image: 'https://i.pravatar.cc/100?u=react', members: 340 },
  { id: '3', name: 'AI Builders', image: 'https://i.pravatar.cc/100?u=ai', members: 89 },
  { id: '4', name: 'Design', image: 'https://i.pravatar.cc/100?u=design', members: 210 },
  { id: '5', name: 'Backend', image: 'https://i.pravatar.cc/100?u=backend', members: 150 },
];

const RECENT_DISCUSSIONS = [
  { id: '1', title: 'Best state management in 2024?', replies: 45, time: '2h ago', tag: 'React Native' },
  { id: '2', title: 'Supabase vs Firebase for MVP', replies: 128, time: '5h ago', tag: 'Backend' },
  { id: '3', title: 'Figma to Code workflows', replies: 32, time: '1d ago', tag: 'Design' },
];

const SAVED_NEWS = [
  { id: '1', title: 'Demand for Indian generic drugs...', body: 'The demand for Indian generic drugs has shot up in China amid the massive COVID-19 wave.', color: '#FFF4CC' },
  { id: '2', title: 'Novak Djokovic, Nick Kyrgios To Play...', body: 'The two tennis stars will face off in an exhibition match before the upcoming grand slam.', color: '#FFDFE4' },
  { id: '3', title: 'Apple Hiring Workers for Retail Stores Across...', body: 'Apple is rapidly expanding its retail footprint with new stores popping up globally.', color: '#DDF1FF' },
  { id: '4', title: 'Facebook owner Meta removes 4,800 fake...', body: 'Meta has taken down thousands of accounts linked to coordinated inauthentic behavior.', color: '#EFDEFF' },
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
      const scale = interpolate(x, inputRange, [0.85, 1, 0.85], Extrapolate.CLAMP);
      const rotate = interpolate(x, inputRange, [-10, 0, 10], Extrapolate.CLAMP);
      const opacity = interpolate(x, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP);
      return {
        transform: [{ scale: scale || 1 }, { rotateY: `${rotate || 0}deg` }],
        opacity: opacity || 1,
      };
    }

    if (mode === 'SQUADS') {
      const translateY = interpolate(x, inputRange, [40, 0, 40], Extrapolate.CLAMP);
      const scale = interpolate(x, inputRange, [0.9, 1, 0.9], Extrapolate.CLAMP);
      return {
        transform: [{ translateY }, { scale: scale || 1 }],
      };
    }

    if (mode === 'PROJECTS') {
      const rotateX = interpolate(x, inputRange, [90, 0, -90], Extrapolate.CLAMP);
      return {
        transform: [{ perspective: 1000 }, { rotateX: `${rotateX}deg` }],
      };
    }

    const scale = interpolate(x, inputRange, [0.95, 1, 0.95], Extrapolate.CLAMP);
    return {
      transform: [{ scale: scale || 1 }],
    };
  });

  return (
    <Animated.View style={[styles.heroCard, { backgroundColor: item.cardColor, width: cardWidth }, animatedStyle]}>
      <View>
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
        </View>

        <Typography style={styles.summaryText} numberOfLines={3}>
          {item.summary}
        </Typography>
      </View>

      <View style={styles.interactionIcons}>
        <TouchableOpacity style={styles.iconBtn}>
          <ThumbsUp size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <MessageCircle size={20} color="#000" />
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

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.mainScrollContent}
      >
        {/* --- 1. HERO CAROUSEL --- */}
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
                    scrollX.value = 0; 
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
          key={activeCategory} 
          horizontal 
          onScroll={onScroll}
          scrollEventThrottle={16}
          snapToInterval={cardWidth + 20} 
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

        {/* --- 2. ACTIVE SQUADS --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Typography style={styles.sectionTitle}>Active Squads</Typography>
            <TouchableOpacity>
              <Typography style={styles.seeAllText}>Explore</Typography>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.squadsScroll}
          >
            {ACTIVE_SQUADS.map(squad => (
              <TouchableOpacity key={squad.id} style={styles.squadItem}>
                <Image source={{ uri: squad.image }} style={styles.squadImage} />
                <Typography style={styles.squadName}>{squad.name}</Typography>
                <Typography style={styles.squadMembers}>{squad.members} joined</Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- 3. RECENT DISCUSSIONS --- */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
             <Typography style={styles.sectionTitle}>Recent Discussions</Typography>
          </View>
          {RECENT_DISCUSSIONS.map(disc => (
            <TouchableOpacity key={disc.id} style={styles.discussionCard}>
              <View style={styles.discHeader}>
                <View style={styles.discTag}>
                  <Typography style={styles.discTagText}>{disc.tag}</Typography>
                </View>
                <Bookmark size={18} color="#666" />
              </View>
              <Typography style={styles.discTitle}>{disc.title}</Typography>
              <View style={styles.discFooter}>
                <MessageCircle size={14} color="#888" />
                <Typography style={styles.discStat}>{disc.replies} replies</Typography>
                <Typography style={styles.discStat}>•</Typography>
                <Typography style={styles.discStat}>{disc.time}</Typography>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* --- 4. SAVED NEWS (STACKED CARDS) --- */}
        <View style={[styles.sectionContainer, { marginTop: 48, marginBottom: 20 }]}>
          <View style={styles.sectionHeaderRow}>
             <Typography style={styles.sectionTitle}>Saved News</Typography>
          </View>
          
          <View style={styles.stackedCardsContainer}>
            {SAVED_NEWS.map((item, index) => {
              const rotations = ['0deg', '-2deg', '1.5deg', '-1deg'];
              const rotate = rotations[index % rotations.length];
              
              const overlap = 85;
              const marginTop = index === 0 ? 0 : -overlap;
              const paddingTop = index === 0 ? 24 : 24 + overlap - 15; 

              return (
                 <TouchableOpacity 
                   key={item.id} 
                   style={[
                     styles.stackedCard, 
                     { 
                       backgroundColor: item.color, 
                       zIndex: SAVED_NEWS.length - index,
                       marginTop: marginTop,
                       paddingTop: paddingTop,
                       transform: [{ rotate }]
                     }
                   ]}
                   activeOpacity={0.9}
                 >
                   <Typography style={styles.stackedCardTitle}>{item.title}</Typography>
                   {index === 0 && (
                     <Typography style={styles.stackedCardBody} numberOfLines={2}>
                       {item.body}
                     </Typography>
                   )}
                 </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Bottom padding for floating tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 10,
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
  mainScrollContent: {
    paddingBottom: 20,
  },
  categoriesWrapper: {
    marginBottom: 10,
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
    paddingVertical: 10,
  },
  heroCard: {
    height: 420,
    borderRadius: 36,
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
    marginBottom: 16,
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
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    lineHeight: 30,
    marginBottom: 4,
  },
  updatedText: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.5)',
    marginBottom: 16,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  publishedBy: {
    fontSize: 11,
    color: 'rgba(0,0,0,0.5)',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  summaryText: {
    fontSize: 15,
    color: 'rgba(0,0,0,0.75)',
    lineHeight: 22,
  },
  interactionIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  
  // Sections Styles
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFF',
  },
  seeAllText: {
    color: '#A855F7',
    fontWeight: '700',
    fontSize: 14,
  },
  squadsScroll: {
    gap: 20,
    paddingRight: 24,
  },
  squadItem: {
    alignItems: 'center',
    width: 72,
  },
  squadImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 8,
  },
  squadName: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  squadMembers: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
  },
  discussionCard: {
    backgroundColor: '#0F0F0F',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  discHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  discTag: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discTagText: {
    color: '#D8B4FE',
    fontSize: 11,
    fontWeight: '700',
  },
  discTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 22,
  },
  discFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  discStat: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },

  // Stacked Cards Styles
  stackedCardsContainer: {
    paddingBottom: 20,
  },
  stackedCard: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  stackedCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 24,
  },
  stackedCardBody: {
    fontSize: 13,
    color: '#444444',
    lineHeight: 18,
    fontWeight: '500',
  }
});
