import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  FlatList
} from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { 
  LayoutGrid, 
  Search, 
  Bookmark, 
  Share2, 
  ThumbsUp,
  ChevronRight,
  Home
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../../components/Typography';

const { width, height } = Dimensions.get('window');

const CATEGORIES = ['Trending', 'Health', 'Sports', 'Finance', 'Tech'];

const NEWS_DATA = [
  {
    id: '1',
    category: 'Trending',
    isLive: true,
    title: 'Demand for Indian generic drugs skyrockets in China amid shortage',
    updatedAt: 'Updated just now',
    author: 'Wade Warren',
    authorAvatar: 'https://i.pravatar.cc/100?u=wade',
    summary: 'The demand for Indian generic drugs has shot up in China amid the massive COVID surge in the country, with Chinese experts cautioning that fake versions of these drugs are flooding the market.',
    cardColor: '#FDF1CB', // Cream color from design
  },
  {
    id: '2',
    category: 'Health',
    isLive: false,
    title: 'New breakthroughs in AI-assisted surgery announced',
    updatedAt: '2h ago',
    author: 'Jane Cooper',
    authorAvatar: 'https://i.pravatar.cc/100?u=jane',
    summary: 'Researchers have developed a new robotic system that can assist surgeons with 99% precision during complex neurosurgical procedures.',
    cardColor: '#FADADD', // Light pink color
  }
];

const NewsCard = ({ item, index }: { item: any, index: number }) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 200).springify()}
      style={[styles.newsCard, { backgroundColor: item.cardColor }]}
    >
      <View style={styles.cardHeader}>
        {item.isLive && (
          <View style={styles.liveBadge}>
            <Typography style={styles.liveText}>LIVE</Typography>
          </View>
        )}
      </View>

      <Typography style={styles.cardTitle}>{item.title}</Typography>
      <Typography style={styles.updatedText}>{item.updatedAt}</Typography>

      <View style={styles.authorSection}>
        <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <Typography style={styles.publishedBy}>Published by</Typography>
          <Typography style={styles.authorName}>{item.author}</Typography>
        </View>
        <TouchableOpacity style={styles.followBtn}>
          <Typography style={styles.followText}>Follow</Typography>
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Typography style={styles.logoChar}>Z</Typography>
          </View>
          <Typography style={styles.logoText}>News</Typography>
        </View>
        <TouchableOpacity style={styles.gridBtn}>
          <LayoutGrid size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
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
        </ScrollView>
      </View>

      {/* Main Feed Carousel */}
      <ScrollView 
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.feedScroll}
      >
        {NEWS_DATA.map((item, index) => (
          <NewsCard key={item.id} item={item} index={index} />
        ))}
      </ScrollView>
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
    paddingLeft: 24,
    paddingRight: 60, // Peak into next card
  },
  newsCard: {
    width: width * 0.8,
    height: height * 0.6,
    borderRadius: 40,
    padding: 24,
    marginRight: 20,
    justifyContent: 'space-between',
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
  navWrapper: {
    position: 'absolute',
    bottom: 40,
    width: width,
    alignItems: 'center',
  },
  floatingNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
    padding: 6,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  navBtn: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnActive: {
    backgroundColor: '#FFF',
    borderRadius: 27,
  },
});
