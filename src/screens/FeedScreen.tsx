import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  Share,
  Platform,
  ScrollView,
  StatusBar,
  InteractionManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucidIcons from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSequence, 
  withSpring,
} from 'react-native-reanimated';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';
import { postStorage } from '../storage/postStorage';
import { MOCK_BUILDERS } from '../data/mockBuilders';
import { Post } from '../types';

const { width } = Dimensions.get('window');

// Safe icon fallback
const SafeIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (LucidIcons as any)[name];
  if (!IconComponent)
    return (
      <View
        style={{
          width: props.size || 24,
          height: props.size || 24,
          backgroundColor: 'rgba(0,0,0,0.05)',
          borderRadius: 4,
        }}
      />
    );
  return <IconComponent {...props} />;
};

// ─── Story Avatar (memoized) ─────────────────────────────────────────
const StoryAvatar = memo(({ item }: { item: any }) => (
  <TouchableOpacity style={styles.storyItem} activeOpacity={0.85}>
    <View style={styles.storyAvatarWrapper}>
      <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
    </View>
    <Typography style={styles.storyName}>
      {item.name?.split(' ')[0] || 'Builder'}
    </Typography>
  </TouchableOpacity>
));

// ─── Post Card (memoized to prevent re-renders) ─────────────────────
const PostCard = memo(({ post, index, onBoost }: any) => {
  const boostScale = useSharedValue(1);

  const handleBoost = useCallback(() => {
    boostScale.value = withSequence(
      withSpring(1.55, { damping: 5, stiffness: 600 }),
      withSpring(1, { damping: 15, stiffness: 300 })
    );
    onBoost();
  }, [onBoost]);

  const rIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boostScale.value }],
  }));

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `Check out this Collabsphere ship: ${post?.title || 'Amazing project'}`,
        url: post?.repoLink || '',
      });
    } catch (e) {}
  }, [post?.title, post?.repoLink]);

  if (!post) return null;

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 80, 400)).springify().damping(20)}
      style={styles.postCard}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardAvatarWrapper}>
          <Image
            source={{ uri: post?.avatar || 'https://i.pravatar.cc/150' }}
            style={styles.cardAvatar}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Typography style={styles.cardAuthor}>
            @{post?.author?.toLowerCase()?.replace(/\s+/g, '_') || 'anonymous'}
          </Typography>
          <Typography style={styles.cardMeta}>
            collabsphere • {post?.timeAgo || 'just now'}
          </Typography>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <SafeIcon name="MoreVertical" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBody}>
        <Typography style={styles.cardTitle}>{post?.title || 'Untitled Ship'}</Typography>
        <Typography style={styles.cardText}>{post?.body || ''}</Typography>

        {post?.repoLink && (
          <TouchableOpacity style={styles.repoBlock} activeOpacity={0.85}>
            <View style={styles.repoThumb}>
              <SafeIcon name="Github" size={28} color="#000" />
            </View>
            <View style={{ flex: 1, padding: 14 }}>
              <Typography style={styles.repoName}>
                {post?.repoLink?.split('/')?.pop() || 'repository'}
              </Typography>
              <Typography style={styles.repoMeta}>Repository</Typography>
            </View>
            <View style={styles.repoAction}>
              <SafeIcon name="ExternalLink" size={18} color="#000" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          onPress={handleBoost}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Animated.View style={rIconStyle}>
            <SafeIcon
              name="Heart"
              size={22}
              color="#000"
              fill={(post?.boosts || 0) > 0 ? '#FF1744' : 'transparent'}
            />
          </Animated.View>
          <Typography style={styles.actionText}>{post?.boosts || 0}</Typography>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <SafeIcon name="MessageCircle" size={22} color="#000" />
          <Typography style={styles.actionText}>{post?.comments?.length || 0}</Typography>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.actionBtn} activeOpacity={0.7}>
          <SafeIcon name="Share" size={22} color="#000" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

// ─── Main Screen ────────────────────────────────────────────────────
export const FeedScreen = ({ navigation }: any) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTag, setActiveTag] = useState<string>('ALL');
  const [ready, setReady] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const loadPosts = useCallback(async () => {
    try {
      const data = await postStorage.getPosts();
      setPosts(data || []);
    } catch (e) {
      setPosts([]);
    }
  }, []);

  useEffect(() => {
    // Defer heavy load until after navigation animation completes
    const task = InteractionManager.runAfterInteractions(() => {
      loadPosts();
      setReady(true);
    });
    return () => task.cancel();
  }, [loadPosts]);

  const boostPost = useCallback(async (id: string) => {
    try {
      const newCount = await postStorage.boostPost(id);
      setPosts((current) =>
        current.map((p) => (p.id === id ? { ...p, boosts: newCount } : p))
      );
    } catch (e) {}
  }, []);

  const filteredPosts =
    activeTag === 'ALL'
      ? posts
      : posts.filter(
          (p) => p.tag === activeTag || (activeTag === 'TRENDING' && (p.boosts || 0) > 5)
        );

  const renderPost = useCallback(
    ({ item, index }: { item: Post; index: number }) => (
      <PostCard post={item} index={index} onBoost={() => boostPost(item?.id)} />
    ),
    [boostPost]
  );

  const keyExtractor = useCallback(
    (item: Post) => item?.id || Math.random().toString(),
    []
  );

  const TAGS = ['All', 'Snippet', 'Shipping', 'Help'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Typography style={styles.headerTitle}>THE FEED</Typography>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.85}>
            <SafeIcon name="Bell" size={22} color="#000" />
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <View style={styles.storySection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storyScroll}
            decelerationRate="fast"
          >
            {(MOCK_BUILDERS || []).map((item) => (
              <StoryAvatar key={item.id} item={item} />
            ))}
          </ScrollView>
        </View>

        {/* Tag filter */}
        <View style={styles.tagBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 25 }}
            decelerationRate="fast"
          >
            {TAGS.map((label) => (
              <TouchableOpacity
                key={label}
                onPress={() => setActiveTag(label.toUpperCase())}
                style={[
                  styles.tagItem,
                  activeTag === label.toUpperCase() && styles.tagActive,
                ]}
                activeOpacity={0.85}
              >
                <Typography
                  style={[
                    styles.tagText,
                    activeTag === label.toUpperCase() && styles.tagTextActive,
                  ]}
                >
                  {label}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Posts FlatList — production tuned */}
        <View style={styles.whitePanel}>
          <View style={styles.panelHandle} />
          <FlatList
            ref={flatListRef}
            data={filteredPosts}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={renderPost}
            // ─── Performance levers ───────────────────────
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={6}
            updateCellsBatchingPeriod={30}
            windowSize={8}
            initialNumToRender={4}
            getItemLayout={undefined} // variable height posts
            decelerationRate="fast"
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -2 },
  bellBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  bellBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF1744',
    borderWidth: 2,
    borderColor: '#FFF',
  },

  storySection: { marginVertical: 10 },
  storyScroll: { paddingHorizontal: 25, gap: 14 },
  storyItem: { alignItems: 'center' },
  storyAvatarWrapper: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#FFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
    overflow: 'hidden',
  },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 33 },
  storyName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#000',
    marginTop: 8,
    textTransform: 'uppercase',
  },

  tagBar: { marginVertical: 10 },
  tagItem: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
  },
  tagActive: { backgroundColor: '#000' },
  tagText: { fontSize: 12, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  tagTextActive: { color: '#FFF' },

  whitePanel: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopWidth: 4,
    borderColor: '#000',
    paddingTop: 15,
    marginTop: 8,
  },
  panelHandle: {
    width: 50,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  listContent: { paddingHorizontal: 22, paddingBottom: 160 },

  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 22,
    marginBottom: 22,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 7, height: 7 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  cardAvatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  cardAvatar: { width: '100%', height: '100%' },
  cardAuthor: { fontSize: 17, fontWeight: '900', color: '#000' },
  cardMeta: { fontSize: 11, fontWeight: '800', color: 'rgba(0,0,0,0.3)' },

  cardBody: { marginBottom: 18 },
  cardTitle: { fontSize: 19, fontWeight: '900', color: '#000', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#444', lineHeight: 21, fontWeight: '700' },

  repoBlock: {
    backgroundColor: '#FFEB3B',
    borderRadius: 28,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    overflow: 'hidden',
  },
  repoThumb: {
    width: 56,
    height: 56,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 3,
    borderColor: '#000',
  },
  repoName: { fontSize: 15, fontWeight: '900', color: '#000' },
  repoMeta: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
  },
  repoAction: { marginRight: 16 },

  cardFooter: {
    flexDirection: 'row',
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  actionText: { fontSize: 15, color: '#000', fontWeight: '900' },
});
