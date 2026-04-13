import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  Modal, 
  TextInput,
  Share,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSequence, 
  withSpring,
} from 'react-native-reanimated';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../components/Toast';
import { postStorage } from '../storage/postStorage';
import { profileStorage } from '../storage/profileStorage';
import { MOCK_BUILDERS } from '../data/mockBuilders';
import { Post, PostTag } from '../types';

const { width } = Dimensions.get('window');
const TAGS: (PostTag | 'TRENDING')[] = ['SNIPPET', 'SHIPPING', 'HELP NEEDED', 'TRENDING'];

const Icon = ({ name, color, size, style, fill }: any) => {
  const Lucid = require('lucide-react-native');
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent color={color} size={size} style={style} fill={fill} />;
};

const PostCard = ({ post, index, onBoost }: any) => {
  const [collapsed, setCollapsed] = useState(true);
  const boostScale = useSharedValue(1);
  
  const handleBoost = () => {
    boostScale.value = withSequence(withSpring(1.5), withSpring(1));
    onBoost();
  };

  const rIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boostScale.value }]
  }));

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this Collabsphere ship: ${post.title}`,
        url: post.repoLink || ''
      });
    } catch (e) {}
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
         return <Typography key={i} style={[styles.cardText, { color: '#6193F5', fontWeight: '700' }]}>{part}</Typography>;
      }
      return <Typography key={i} style={styles.cardText}>{part}</Typography>;
    });
  };

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100)} 
      style={styles.postCard}
    >
       <View style={styles.friendsLikedRow}>
          <View style={styles.miniAvatarOverlay}>
             {[1, 2, 3].map(i => (
               <View key={i} style={[styles.miniAvatar, { marginLeft: i === 1 ? 0 : -8, zIndex: 10 - i }]}>
                  <Image source={{ uri: `https://i.pravatar.cc/50?u=${i + (index % 10)}` }} style={styles.miniAvatarImg} />
               </View>
             ))}
          </View>
          <Typography style={styles.socialProofText}>
             {post.boosts + 12} builders liked
          </Typography>
       </View>

       <View style={styles.cardHeader}>
          <View style={styles.cardAvatarContainer}>
             <Image source={{ uri: post?.avatar || 'https://i.pravatar.cc/150' }} style={styles.cardAvatar} />
          </View>
          <TouchableOpacity 
             style={{ flex: 1, marginLeft: 12 }}
             onPress={() => navigation.navigate('Chat', { name: post.author })}
          >
             <Typography style={styles.cardAuthor}>
                {post?.author?.toLowerCase()?.replace(' ', '_') || 'builder'}
             </Typography>
             <Typography style={styles.cardMeta}>
                collabsphere • {post.timeAgo}
             </Typography>
          </TouchableOpacity>
          <TouchableOpacity>
             <Icon name="MoreHorizontal" size={18} color="#9CA3AF" />
          </TouchableOpacity>
       </View>

       <View style={styles.cardBody}>
          <Typography style={styles.cardTitle}>{post.title}</Typography>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
             {renderContent(post.body)}
          </View>
          {post.repoLink && (
            <TouchableOpacity style={styles.premiumRepoBlock}>
               <View style={styles.repoThumbLarge}>
                  <Icon name="Github" size={28} color="#000" opacity={0.3} />
               </View>
               <View style={{ flex: 1, padding: 14 }}>
                  <Typography style={styles.repoNameLarge}>{post.repoLink.split('/').pop()}</Typography>
                  <Typography style={styles.repoMetaLarge}>repository</Typography>
               </View>
               <View style={styles.repoPlayBtn}>
                  <Icon name="ExternalLink" size={16} color="#FFF" />
               </View>
            </TouchableOpacity>
          )}
       </View>

       <View style={styles.cardFooter}>
          <TouchableOpacity onPress={handleBoost} style={styles.actionBtn}>
             <Animated.View style={rIconStyle}>
                <Icon 
                   name="Heart" 
                   size={20} 
                   color="#374151" 
                   fill={post.boosts > 0 ? "#EF4444" : "transparent"} 
                />
             </Animated.View>
             <Typography style={styles.actionText}>{post.boosts}</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
             <Icon name="MessageCircle" size={20} color="#374151" />
             <Typography style={styles.actionText}>{post.comments?.length || 0}</Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
             <Icon name="Share2" size={20} color="#374151" />
          </TouchableOpacity>
       </View>
    </Animated.View>
  );
};

export const FeedScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const { showToast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTag, setActiveTag] = useState<string>('ALL');

  const loadPosts = useCallback(async () => {
    const data = await postStorage.getPosts();
    setPosts(data);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const boostPost = async (id: string) => {
    const newCount = await postStorage.boostPost(id);
    setPosts(current => current.map(p => p.id === id ? { ...p, boosts: newCount } : p));
  };

  const filteredPosts = activeTag === 'ALL' 
    ? posts 
    : posts.filter(p => p.tag === activeTag || (activeTag === 'TRENDING' && p.boosts > 5));

  return (
    <View style={[styles.container, { backgroundColor: '#F7F6F2' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header Row */}
        <View style={styles.header}>
           <Typography style={styles.headerTitle}>The Feed</Typography>
           <TouchableOpacity style={styles.bellBtn}>
              <View style={styles.iconCircle}>
                 <Icon name="Bell" size={20} color="#FFF" fill="#FFF" />
              </View>
           </TouchableOpacity>
        </View>

        {/* Story Row */}
        <View style={styles.storyContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyContent}>
              {MOCK_BUILDERS.map((builder) => (
                <TouchableOpacity 
                   key={builder.id} 
                   style={styles.storyItem}
                   onPress={() => navigation.navigate('Chat', { name: builder.name })}
                >
                   <View style={styles.storyAvatar}>
                      <Image source={{ uri: builder.avatar || 'https://i.pravatar.cc/150' }} style={styles.avatarImg} />
                   </View>
                   <Typography style={styles.storyName}>{builder.name.split(' ')[0]}</Typography>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tagBar}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {['All', 'Snippet', 'Shipping', 'Help'].map((label, idx) => (
                <TouchableOpacity 
                  key={label}
                  onPress={() => setActiveTag(label.toUpperCase())}
                  style={[styles.filterTab, activeTag === label.toUpperCase() && styles.filterTabActive]}
                >
                   <Typography style={[styles.filterTabText, activeTag === label.toUpperCase() && styles.filterTabTextActive]}>{label}</Typography>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Post List */}
        <FlatList 
          data={filteredPosts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <PostCard 
              post={item} 
              index={index} 
              onBoost={() => boostPost(item.id)}
            />
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 28, fontWeight: '900', color: '#000', letterSpacing: -1 },
  iconCircle: {
     width: 44,
     height: 44,
     borderRadius: 22,
     backgroundColor: '#6193F5',
     justifyContent: 'center',
     alignItems: 'center',
  },
  bellBtn: { position: 'relative' },
  storyContainer: { marginVertical: 10 },
  storyContent: { paddingHorizontal: 24, gap: 16 },
  storyItem: { alignItems: 'center', width: 68 },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatarImg: { width: '100%', height: '100%', borderRadius: 32 },
  storyName: { fontSize: 11, color: 'rgba(0,0,0,0.3)', marginTop: 10, fontWeight: '700' },
  tagBar: { marginVertical: 15 },
  filterTab: {
     paddingHorizontal: 18,
     paddingVertical: 10,
     borderRadius: 20,
     marginRight: 10,
     backgroundColor: '#FFF',
     borderWidth: 1,
     borderColor: 'rgba(0,0,0,0.05)',
  },
  filterTabActive: { backgroundColor: '#000', borderColor: '#000' },
  filterTabText: { fontSize: 13, color: 'rgba(0,0,0,0.4)', fontWeight: '700' },
  filterTabTextActive: { color: '#FFF' },
  listContent: { paddingHorizontal: 24, paddingBottom: 160 },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  friendsLikedRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  miniAvatarOverlay: { flexDirection: 'row', marginRight: 10 },
  miniAvatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#FFF', overflow: 'hidden' },
  miniAvatarImg: { width: '100%', height: '100%' },
  socialProofText: { fontSize: 11, color: 'rgba(0,0,0,0.3)', fontWeight: '700' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardAvatarContainer: { 
    borderRadius: 22, 
    overflow: 'hidden',
  },
  cardAvatar: { width: 44, height: 44, borderRadius: 22 },
  cardAuthor: { fontSize: 16, fontWeight: '800', color: '#000' },
  cardMeta: { fontSize: 12, color: 'rgba(0,0,0,0.3)', marginTop: 2 },
  cardBody: { marginBottom: 15 },
  cardTitle: { fontSize: 19, fontWeight: '800', color: '#000', marginBottom: 10, lineHeight: 26 },
  cardText: { fontSize: 15, color: '#4B5563', lineHeight: 24 },
  premiumRepoBlock: {
     backgroundColor: '#F7F6F2',
     borderRadius: 22,
     marginTop: 20,
     flexDirection: 'row',
     alignItems: 'center',
     padding: 4,
     borderWidth: 1,
     borderColor: 'rgba(0,0,0,0.05)',
  },
  repoThumbLarge: { 
    width: 80, 
    height: 90, 
    backgroundColor: '#FFF', 
    borderRadius: 18,
    justifyContent: 'center', 
    alignItems: 'center',
    margin: 4,
  },
  repoNameLarge: { fontSize: 15, fontWeight: '700', color: '#000' },
  repoMetaLarge: { fontSize: 12, color: 'rgba(0,0,0,0.3)', marginTop: 3 },
  repoPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6193F5',
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', padding: 4, gap: 10 },
  actionText: { fontSize: 14, color: '#374151', fontWeight: '700' }
});
