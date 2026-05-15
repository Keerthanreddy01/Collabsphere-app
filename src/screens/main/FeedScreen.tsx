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
  MessageCircle, 
  Repeat, 
  Star, 
  MoreHorizontal, 
  Search, 
  Bell, 
  Mail, 
  Plus,
  Home,
  User,
  Layout
} from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { Typography } from '../../components/Typography';

const { width, height } = Dimensions.get('window');

const POSTS = [
  {
    id: '1',
    author: 'Unknown artist',
    handle: '@unknown',
    time: '9h',
    content: 'Another awesome image from @steve\n\n#design #games #4k',
    media: require('../../../assets/gundam.png'),
    comments: 4,
    shares: 7,
    likes: 68,
    avatar: 'https://i.pravatar.cc/100?u=artist'
  },
  {
    id: '2',
    author: 'Apple super user',
    handle: '@apple_fan',
    time: '11h',
    content: 'MacOS has replaced Windows in every part of my life.\n\nHere\'s why:\n\n- macOS simply works better for me.\n- It\'s a system built for people who create and build from scratch.\n- Apple sets the standard.',
    comments: 12,
    shares: 3,
    likes: 142,
    avatar: 'https://i.pravatar.cc/100?u=apple',
    verified: true
  }
];

const PostItem = ({ item, index }: { item: any, index: number }) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100)}
      style={styles.postContainer}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
           <View style={styles.authorRow}>
             <Typography style={styles.authorName}>{item.author}</Typography>
             {item.verified && <View style={styles.verifiedBadge} />}
             <Typography style={styles.postTime}>• {item.time}</Typography>
           </View>
        </View>
        <TouchableOpacity style={styles.moreBtn}>
           <MoreHorizontal size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.postContentWrapper}>
        <Typography style={styles.postText}>
          {item.content.split(' ').map((word, i) => {
            if (word.startsWith('#') || word.startsWith('@')) {
              return <Typography key={i} style={styles.highlightText}>{word} </Typography>;
            }
            return word + ' ';
          })}
        </Typography>

        {item.media && (
          <Image source={item.media} style={styles.mediaCard} resizeMode="cover" />
        )}

        <View style={styles.interactionBar}>
          <TouchableOpacity style={styles.interactionPill}>
             <MessageCircle size={18} color="#FFF" />
             <Typography style={styles.interactionCount}>{item.comments}</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.interactionPill}>
             <Repeat size={18} color="#FFF" />
             <Typography style={styles.interactionCount}>{item.shares}</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.interactionPill, { backgroundColor: '#332400' }]}>
             <Star size={18} color="#FFD60A" fill="#FFD60A" />
             <Typography style={[styles.interactionCount, { color: '#FFD60A' }]}>{item.likes}</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export const FeedScreen = () => {
  const [activeTab, setActiveTab] = useState('For you');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setActiveTab('For you')}>
            <Typography style={[styles.tabText, activeTab === 'For you' && styles.tabActive]}>For you</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('Follows')}>
            <Typography style={[styles.tabText, activeTab === 'Follows' && styles.tabActive]}>Follows</Typography>
          </TouchableOpacity>
        </View>
        <Image source={{ uri: 'https://i.pravatar.cc/100?u=me' }} style={styles.headerAvatar} />
      </View>

      <FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <PostItem item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Glass Navigation */}
      <View style={styles.navWrapper}>
        <BlurView intensity={80} tint="dark" style={styles.floatingNav}>
          <TouchableOpacity style={styles.navBtn}>
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Layout size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <MessageCircle size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn}>
            <Bell size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusBtn}>
            <Plus size={24} color="#FFF" />
          </TouchableOpacity>
        </BlurView>
      </View>
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
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  tabText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  tabActive: {
    color: '#FFF',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#333',
  },
  listContent: {
    paddingBottom: 150,
  },
  postContainer: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007AFF',
  },
  postTime: {
    color: '#666',
    fontSize: 14,
  },
  moreBtn: {
    padding: 4,
  },
  postContentWrapper: {
    paddingLeft: 48,
  },
  postText: {
    color: '#FFF',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  highlightText: {
    color: '#007AFF',
  },
  mediaCard: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    marginBottom: 16,
  },
  interactionBar: {
    flexDirection: 'row',
    gap: 12,
  },
  interactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  interactionCount: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
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
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
