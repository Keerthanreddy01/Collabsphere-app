import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image, 
  StatusBar,
  InteractionManager,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LucidIcons from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  FadeInUp,
  FadeInDown
} from 'react-native-reanimated';
import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const SafeIcon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (LucidIcons as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

// ─── Spring config ──────────────────────────────────────────────────
const SPRING = { damping: 22, stiffness: 300, mass: 0.9 };

const MOCK_LEADERBOARD = [
  { id: '1', name: 'lilyonetw...', score: 146, avatar: 'https://i.pravatar.cc/150?u=lily', rank: 1 },
  { id: '2', name: 'josheleve...', score: 105, avatar: 'https://i.pravatar.cc/150?u=josh', rank: 2 },
  { id: '3', name: 'herotaylo...', score: 99, avatar: 'https://i.pravatar.cc/150?u=hero', rank: 3 },
  { id: '4', name: 'whitefish664', score: 96, avatar: 'https://i.pravatar.cc/150?u=wf', rank: 4 },
  { id: '5', name: 'sadpanda176', score: 88, avatar: 'https://i.pravatar.cc/150?u=sp', rank: 5 },
  { id: '6', name: 'silverduck204', score: 87, avatar: 'https://i.pravatar.cc/150?u=sd', rank: 6 },
  { id: '7', name: 'beautifo...', score: 85, avatar: 'https://i.pravatar.cc/150?u=bm', rank: 7 },
  { id: '8', name: 'cryptoking', score: 82, avatar: 'https://i.pravatar.cc/150?u=ck', rank: 8 },
];

// Memoized rank row
const RankRow = memo(({ item, index }: { item: any; index: number }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 80).springify().damping(20)}
    style={styles.rankRow}
  >
    <View style={styles.rankSide}>
      <Typography style={styles.rankNumber}>{item?.rank || '-'}</Typography>
      <Image
        source={{ uri: item?.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.rowAvatar}
      />
    </View>
    <Typography numberOfLines={1} style={styles.rowName}>{item?.name || 'Builder'}</Typography>
    <View style={styles.rowScorePill}>
      <Typography style={styles.rowScoreValue}>{item?.score || 0}</Typography>
    </View>
  </Animated.View>
));

export const DiscoveryScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [ready, setReady] = useState(false);

  const podiumHeight1 = useSharedValue(0);
  const podiumHeight2 = useSharedValue(0);
  const podiumHeight3 = useSharedValue(0);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setReady(true);
      podiumHeight1.value = withDelay(300, withSpring(160, SPRING));
      podiumHeight2.value = withDelay(100, withSpring(110, SPRING));
      podiumHeight3.value = withDelay(500, withSpring(90, SPRING));
    });
    return () => task.cancel();
  }, []);

  const rPodium1 = useAnimatedStyle(() => ({ height: podiumHeight1.value }));
  const rPodium2 = useAnimatedStyle(() => ({ height: podiumHeight2.value }));
  const rPodium3 = useAnimatedStyle(() => ({ height: podiumHeight3.value }));

  const topThree = useMemo(() => MOCK_LEADERBOARD.slice(0, 3), []);
  const otherUsers = useMemo(() => MOCK_LEADERBOARD.slice(3), []);

  const [activeTab, setActiveTab] = React.useState('Worldwide');
  const tabs = ['Worldwide', 'Local', 'Friends'];

  const renderRankRow = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <RankRow item={item} index={index} />
    ),
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <SafeIcon name="Search" size={22} color="#000" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>RANKING</Typography>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
            <SafeIcon name="Filter" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabScroll}
            decelerationRate="fast"
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabItem, activeTab === tab && styles.tabActive]}
                activeOpacity={0.85}
              >
                <Typography
                  style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
                >
                  {tab}
                </Typography>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Podium Section */}
        <View style={styles.podiumWrapper}>
          {/* Rank 2 */}
          <View style={styles.podiumColumn}>
            <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.podiumUser}>
              <View style={styles.avatarBorder}>
                <Image source={{ uri: topThree[1]?.avatar }} style={styles.podiumAvatar} />
                <View style={[styles.rankBadge, { backgroundColor: '#FFEB3B' }]}>
                  <Typography style={styles.rankBadgeText}>2</Typography>
                </View>
              </View>
              <Typography numberOfLines={1} style={styles.podiumName}>{topThree[1]?.name}</Typography>
              <View style={styles.scorePill}>
                <SafeIcon name="Trophy" size={10} color="#000" />
                <Typography style={styles.scoreText}>{topThree[1]?.score}</Typography>
              </View>
            </Animated.View>
            <Animated.View style={[styles.podiumBase, styles.baseTwo, rPodium2]}>
              <Typography style={styles.podiumRankText}>2</Typography>
            </Animated.View>
          </View>

          {/* Rank 1 */}
          <View style={styles.podiumColumn}>
            <Animated.View entering={FadeInUp.springify()} style={styles.podiumUser}>
              <View style={[styles.avatarBorder, styles.crownBorder]}>
                <Image source={{ uri: topThree[0]?.avatar }} style={[styles.podiumAvatar, styles.largeAvatar]} />
                <View style={[styles.rankBadge, styles.crownBadge]}>
                  <Typography style={styles.rankBadgeText}>1</Typography>
                </View>
              </View>
              <Typography numberOfLines={1} style={[styles.podiumName, { fontWeight: '900' }]}>{topThree[0]?.name}</Typography>
              <View style={[styles.scorePill, styles.goldPill]}>
                <SafeIcon name="Trophy" size={12} color="#000" />
                <Typography style={styles.scoreText}>{topThree[0]?.score}</Typography>
              </View>
            </Animated.View>
            <Animated.View style={[styles.podiumBase, styles.baseOne, rPodium1]}>
              <Typography style={[styles.podiumRankText, { fontSize: 48 }]}>1</Typography>
            </Animated.View>
          </View>

          {/* Rank 3 */}
          <View style={styles.podiumColumn}>
            <Animated.View entering={FadeInUp.delay(400).springify()} style={styles.podiumUser}>
              <View style={styles.avatarBorder}>
                <Image source={{ uri: topThree[2]?.avatar }} style={styles.podiumAvatar} />
                <View style={[styles.rankBadge, { backgroundColor: '#FFEB3B' }]}>
                  <Typography style={styles.rankBadgeText}>3</Typography>
                </View>
              </View>
              <Typography numberOfLines={1} style={styles.podiumName}>{topThree[2]?.name}</Typography>
              <View style={styles.scorePill}>
                <SafeIcon name="Trophy" size={10} color="#000" />
                <Typography style={styles.scoreText}>{topThree[2]?.score}</Typography>
              </View>
            </Animated.View>
            <Animated.View style={[styles.podiumBase, styles.baseThree, rPodium3]}>
              <Typography style={styles.podiumRankText}>3</Typography>
            </Animated.View>
          </View>
        </View>

        {/* Leaderboard List — production tuned */}
        <View style={styles.listSection}>
          <View style={styles.panelHandle} />
          <FlatList
            data={otherUsers}
            keyExtractor={keyExtractor}
            renderItem={renderRankRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 160 }}
            removeClippedSubviews={Platform.OS === 'android'}
            maxToRenderPerBatch={8}
            windowSize={10}
            initialNumToRender={4}
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
    paddingVertical: 18,
  },
  iconBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#000', letterSpacing: -1 },

  tabContainer: { paddingVertical: 8 },
  tabScroll: { paddingHorizontal: 25, gap: 12 },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
  },
  tabActive: { backgroundColor: '#000' },
  tabText: { fontSize: 13, fontWeight: '900', color: '#000', textTransform: 'uppercase' },
  tabTextActive: { color: '#FFF' },

  podiumWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 310,
    paddingHorizontal: 20,
    marginTop: 15,
  },
  podiumColumn: { flex: 1, alignItems: 'center' },
  podiumUser: { alignItems: 'center', marginBottom: 12, zIndex: 10 },
  avatarBorder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  crownBorder: { width: 86, height: 86, borderRadius: 43, borderWidth: 4 },
  podiumAvatar: { width: 62, height: 62, borderRadius: 31 },
  largeAvatar: { width: 76, height: 76, borderRadius: 38 },
  rankBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#FFF',
  },
  crownBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFD700' },
  rankBadgeText: { fontSize: 11, fontWeight: '900', color: '#000' },
  podiumName: { fontSize: 12, color: '#000', fontWeight: '800', marginTop: 4 },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 6,
    gap: 5,
    borderWidth: 2,
    borderColor: '#000',
  },
  goldPill: { backgroundColor: '#FFD700' },
  scoreText: { fontSize: 12, fontWeight: '900', color: '#000' },
  podiumBase: {
    width: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderBottomWidth: 0,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  baseOne: { backgroundColor: '#FF1744' },
  baseTwo: { backgroundColor: '#2979FF' },
  baseThree: { backgroundColor: '#00E676' },
  podiumRankText: { fontSize: 30, fontWeight: '900', color: 'rgba(0,0,0,0.12)' },

  listSection: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderTopWidth: 4,
    borderColor: '#000',
    paddingTop: 15,
    paddingHorizontal: 25,
    marginTop: -20,
    zIndex: 20,
  },
  panelHandle: {
    width: 50,
    height: 6,
    backgroundColor: '#000',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rankSide: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rankNumber: { fontSize: 15, fontWeight: '900', color: 'rgba(0,0,0,0.2)', width: 24 },
  rowAvatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#000' },
  rowName: { flex: 1, fontSize: 15, fontWeight: '900', color: '#000', marginLeft: 14 },
  rowScorePill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFEB3B',
    borderWidth: 2,
    borderColor: '#000',
  },
  rowScoreValue: { fontSize: 13, fontWeight: '900', color: '#000' },
});
