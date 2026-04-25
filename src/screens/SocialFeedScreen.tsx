import React, { useState, useCallback, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList,
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  Platform,
  Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import { Typography } from '../components/Typography';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSequence, 
  withSpring 
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const SPRING_FAST = { damping: 12, stiffness: 500 };
const SPRING_SMOOTH = { damping: 22, stiffness: 300 };

const FEED_DATA = [
  {
    id: '1',
    user: 'ALEX_DEV',
    avatar: 'https://i.pravatar.cc/100?u=alex',
    time: '20M AGO',
    type: 'SHIPPING',
    tag: 'RUST',
    title: 'VECTOR SEARCH INTEGRATED',
    content: 'Finally moved to Qdrant for the matchmaking engine. Latency dropped from 450ms to 42ms. Absolute game changer! 🚀',
    repo: 'collabsphere/core-engine',
    boosts: 124,
    comments: 18,
    color: '#00E676',
    icon: 'Rocket',
  },
  {
    id: '2',
    user: 'SARAH_CODES',
    avatar: 'https://i.pravatar.cc/100?u=sarah',
    time: '2H AGO',
    type: 'HELP_NEEDED',
    tag: 'NEXT.JS',
    title: 'HYDRATION ERROR IN PROD',
    content: 'Getting a weird hydration mismatch only on the pricing page. Works fine locally. Anyone seen this with Framer Motion + Next 14?',
    repo: 'nexus-app/frontend',
    boosts: 42,
    comments: 56,
    color: '#FF1744',
    icon: 'HelpCircle',
  },
  {
    id: '3',
    user: 'MARCUS_AI',
    avatar: 'https://i.pravatar.cc/100?u=marcus',
    time: '5H AGO',
    type: 'SOLVED',
    tag: 'PYTHON',
    title: 'OPTIMIZED LLM INFERENCE',
    content: 'Reduced memory footprint by 60% using 4-bit quantization with BitsAndBytes. Check the PR for detailed benchmarks.',
    repo: 'quantum-ml/v3',
    boosts: 890,
    comments: 12,
    color: '#2979FF',
    icon: 'CheckCircle',
  },
  {
    id: '4',
    user: 'PRIYA_BUILD',
    avatar: 'https://i.pravatar.cc/100?u=priya',
    time: '8H AGO',
    type: 'SHIPPING',
    tag: 'REACT NATIVE',
    title: 'LAUNCHED: COLLAB RADAR v2',
    content: 'Real-time proximity matching is live. Used websockets + CRDT for conflict-free sync. Zero lag on 10k concurrent users in stress test.',
    repo: 'collabsphere/radar-v2',
    boosts: 234,
    comments: 31,
    color: '#FFD600',
    icon: 'Zap',
  },
];

// ─── Tech Chip ─────────────────────────────────────────────────────
const TechChip = memo(({ iconName, label, color, active, onPress }: any) => (
  <TouchableOpacity
    style={[styles.chip, { backgroundColor: active ? '#000' : color }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Icon name={iconName} color={active ? color : '#000'} size={18} />
    <Typography style={[styles.chipLabel, { color: active ? color : '#000' }]}>
      {label}
    </Typography>
  </TouchableOpacity>
));

// ─── Post Card ─────────────────────────────────────────────────────
const PostCard = memo(({ post, index }: { post: any; index: number }) => {
  const [boosted, setBoosted] = useState(false);
  const [boostCount, setBoostCount] = useState(post.boosts);
  const zapScale = useSharedValue(1);

  const zapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zapScale.value }],
  }));

  const handleBoost = useCallback(() => {
    zapScale.value = withSequence(
      withSpring(1.6, SPRING_FAST),
      withSpring(1, SPRING_SMOOTH)
    );
    setBoosted((b) => {
      setBoostCount((c: number) => b ? c - 1 : c + 1);
      return !b;
    });
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await Share.share({ message: `Check out this Collabsphere post: ${post.title}` });
    } catch {}
  }, [post.title]);

  return (
    <Animated.View
      entering={FadeInDown.delay(Math.min(index * 100, 350)).springify().damping(20)}
      style={styles.postCard}
    >
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={[styles.avatarBorder, { borderColor: post.color }]}>
            <Image source={{ uri: post.avatar }} style={styles.avatar} />
          </View>
          <View style={{ marginLeft: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Typography style={styles.userNameText}>{post.user}</Typography>
              <View style={[styles.typeBadge, { backgroundColor: post.color }]}>
                <Typography style={styles.typeLabel}>{post.type}</Typography>
              </View>
            </View>
            <Typography style={styles.metaText}>{post.time} • {post.tag}</Typography>
          </View>
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="MoreHorizontal" color="#000" size={22} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <TouchableOpacity style={styles.contentBox} activeOpacity={0.88}>
        <View style={styles.contentHead}>
          <Typography style={styles.postTitle}>{post.title}</Typography>
          {post.type === 'SOLVED' && <Icon name="CheckCircle" size={20} color="#00E676" />}
        </View>
        <Typography style={styles.contentText}>{post.content}</Typography>
        <View style={styles.repoLink}>
          <Icon name="Github" size={15} color="#000" />
          <Typography style={styles.repoText}>{post.repo}</Typography>
          <Icon name="ArrowRight" size={15} color="#000" />
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.postFooter}>
        <View style={styles.engagement}>
          <TouchableOpacity
            style={[styles.boostBtn, boosted && { backgroundColor: '#000' }]}
            onPress={handleBoost}
            activeOpacity={0.85}
          >
            <Animated.View style={zapStyle}>
              <Icon name="Zap" color={boosted ? '#FFEB3B' : '#000'} size={18} />
            </Animated.View>
            <Typography style={[styles.engagementCount, boosted && { color: '#FFEB3B' }]}>
              {boostCount}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity style={styles.commentBtn} activeOpacity={0.85}>
            <Icon name="MessageSquare" color="#000" size={18} />
            <Typography style={styles.engagementCount}>{post.comments}</Typography>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn} activeOpacity={0.85}>
          <Icon name="Share2" color="#000" size={18} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
});

// ─── Main Screen ────────────────────────────────────────────────────
export const SocialFeedScreen = () => {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const CHIPS = [
    { iconName: 'Code2', label: 'SNIPPET', color: '#2979FF' },
    { iconName: 'Rocket', label: 'SHIPPING', color: '#00E676' },
    { iconName: 'HelpCircle', label: 'HELP', color: '#FF1744' },
    { iconName: 'Terminal', label: 'TOOL', color: '#FFD600' },
  ];

  const renderPost = useCallback(
    ({ item, index }: any) => <PostCard post={item} index={index} />,
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.typeSelector}>
            <Typography style={styles.headerTitle}>THE FEED</Typography>
            <Icon name="ChevronDown" color="#000" size={22} style={{ marginLeft: 6 }} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={styles.headerIcon} activeOpacity={0.85}>
              <Icon name="Github" color="#000" size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} activeOpacity={0.85}>
              <Icon name="Bell" color="#000" size={22} />
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tech chips */}
        <View style={styles.creationBar}>
          <FlatList
            horizontal
            data={CHIPS}
            keyExtractor={(c) => c.label}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipList}
            decelerationRate="fast"
            renderItem={({ item }) => (
              <TechChip
                {...item}
                active={activeChip === item.label}
                onPress={() => setActiveChip((prev) => (prev === item.label ? null : item.label))}
              />
            )}
          />
        </View>

        <View style={styles.feedWrapper} />
      </>
    ),
    [activeChip]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <FlatList
          data={FEED_DATA}
          keyExtractor={keyExtractor}
          renderItem={renderPost}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={4}
          windowSize={6}
          initialNumToRender={3}
          decelerationRate="fast"
        />
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
    paddingVertical: 18,
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -2 },
  typeSelector: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  bellDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF1744',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  scrollContent: { paddingBottom: 160 },
  creationBar: { paddingLeft: 25, marginBottom: 8 },
  chipList: { gap: 12, paddingRight: 50 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  chipLabel: { marginLeft: 8, fontWeight: '900', fontSize: 12 },
  feedWrapper: { height: 20 },

  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 38,
    marginHorizontal: 25,
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#000',
    paddingTop: 22,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 22,
    marginBottom: 18,
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarBorder: {
    width: 56,
    height: 56,
    borderRadius: 18,
    borderWidth: 3,
    overflow: 'hidden',
  },
  avatar: { width: '100%', height: '100%' },
  userNameText: { fontSize: 16, fontWeight: '900', color: '#000' },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  typeLabel: { fontSize: 8, fontWeight: '900', color: '#000' },
  metaText: { fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: '900', marginTop: 3 },

  contentBox: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: 12,
    padding: 22,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#000',
  },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.5,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    fontWeight: '700',
    marginBottom: 18,
  },
  repoLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000',
    gap: 8,
  },
  repoText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '900',
    flex: 1,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 22,
  },
  engagement: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  boostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: '#000',
  },
  commentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  engagementCount: { fontWeight: '900', color: '#000', fontSize: 13 },
  shareBtn: { padding: 8 },
});
