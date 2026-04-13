import React, { useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  Dimensions, 
  TouchableOpacity, 
  Image,
  FlatList,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  FadeInDown,
  FadeInUp,
  withDelay,
  withSpring
} from 'react-native-reanimated';
import * as Lucid from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, color, size, style }: any) => {
  const Lucid = require('lucide-react-native');
  const IconComponent = Lucid[name] || Lucid.Circle;
  return <IconComponent color={color} size={size} style={style} />;
};

const MOCK_LEADERBOARD = [
  { id: '1', name: 'lilyonetw...', score: 146, avatar: 'https://i.pravatar.cc/150?u=lily', rank: 1 },
  { id: '2', name: 'josheleve...', score: 105, avatar: 'https://i.pravatar.cc/150?u=josh', rank: 2 },
  { id: '3', name: 'herotaylo...', score: 99, avatar: 'https://i.pravatar.cc/150?u=hero', rank: 3 },
  { id: '4', name: 'whitefish664', score: 96, avatar: 'https://i.pravatar.cc/150?u=wf', rank: 4 },
  { id: '5', name: 'sadpanda176', score: 88, avatar: 'https://i.pravatar.cc/150?u=sp', rank: 5 },
  { id: '6', name: 'silverduck204', score: 87, avatar: 'https://i.pravatar.cc/150?u=sd', rank: 6 },
  { id: '7', name: 'beautifulmouse112', score: 85, avatar: 'https://i.pravatar.cc/150?u=bm', rank: 7 },
  { id: '8', name: 'cryptoking', score: 82, avatar: 'https://i.pravatar.cc/150?u=ck', rank: 8 },
];

export const DiscoveryScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  
  const podiumHeight1 = useSharedValue(0);
  const podiumHeight2 = useSharedValue(0);
  const podiumHeight3 = useSharedValue(0);
  const progressLine = useSharedValue(0);

  useEffect(() => {
    podiumHeight1.value = withDelay(300, withSpring(140));
    podiumHeight2.value = withDelay(100, withSpring(100));
    podiumHeight3.value = withDelay(500, withSpring(80));
    progressLine.value = withTiming(0.72, { duration: 3000 });
  }, []);

  const rPodium1 = useAnimatedStyle(() => ({ height: podiumHeight1.value }));
  const rPodium2 = useAnimatedStyle(() => ({ height: podiumHeight2.value }));
  const rPodium3 = useAnimatedStyle(() => ({ height: podiumHeight3.value }));
  const rProgress = useAnimatedStyle(() => ({ width: `${progressLine.value * 100}%` }));

  const topThree = useMemo(() => MOCK_LEADERBOARD.slice(0, 3), []);
  const otherUsers = useMemo(() => MOCK_LEADERBOARD.slice(3), []);

  const [activeTab, setActiveTab] = React.useState('Worldwide');
  const tabs = ['Worldwide', 'Local', 'Friends'];

  return (
    <View style={[styles.container, { backgroundColor: '#F7F6F2' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
           <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
              <Icon name="ArrowLeft" size={24} color="#000" />
           </TouchableOpacity>
           <Typography style={styles.headerTitle}>Leaderboard</Typography>
           <View style={{ width: 44 }} />
        </View>

        {/* Custom Progress Bar - Top */}
        <View style={styles.globalProgressContainer}>
           <Typography variant="caption" color="rgba(0,0,0,0.3)" style={{ marginBottom: 10, fontWeight: '800' }}>
              COMMUNITY VELOCITY: <Typography variant="caption" color="#6193F5">72%</Typography>
           </Typography>
           <View style={styles.progressBg}>
              <Animated.View style={[styles.progressFill, rProgress]} />
           </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
              {tabs.map(tab => (
                <TouchableOpacity 
                   key={tab} 
                   onPress={() => setActiveTab(tab)}
                   style={[styles.tabItem, activeTab === tab && styles.tabActive]}
                >
                   <Typography style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Typography>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        {/* Podium Section */}
        <View style={styles.podiumWrapper}>
           {/* Rank 2 */}
           <View style={styles.podiumColumn}>
              <Animated.View entering={FadeInUp.delay(200)} style={styles.podiumUser}>
                 <View style={styles.avatarBorder}>
                    <Image source={{ uri: topThree[1]?.avatar || 'https://i.pravatar.cc/150' }} style={styles.podiumAvatar} />
                    <View style={[styles.rankBadge, { backgroundColor: '#C0C0C0' }]}>
                       <Typography style={styles.rankBadgeText}>2</Typography>
                    </View>
                 </View>
                 <Typography numberOfLines={1} style={styles.podiumName}>{topThree[1]?.name || 'Player'}</Typography>
                 <View style={styles.scorePill}>
                    <Icon name="Trophy" size={10} color="#6193F5" />
                    <Typography style={styles.scoreText}>{topThree[1]?.score || 0}</Typography>
                 </View>
              </Animated.View>
              <Animated.View style={[styles.podiumBase, styles.baseTwo, rPodium2]}>
                 <Typography style={styles.podiumRankText}>2</Typography>
              </Animated.View>
           </View>

           {/* Rank 1 */}
           <View style={styles.podiumColumn}>
              <Animated.View entering={FadeInUp} style={styles.podiumUser}>
                 <View style={[styles.avatarBorder, { width: 84, height: 84, borderRadius: 42, borderColor: '#FFD700' }]}>
                    <Image source={{ uri: topThree[0]?.avatar || 'https://i.pravatar.cc/150' }} style={[styles.podiumAvatar, { width: 78, height: 78, borderRadius: 39 }]} />
                    <View style={[styles.rankBadge, { backgroundColor: '#FFD700', width: 24, height: 24, borderRadius: 12 }]}>
                       <Typography style={styles.rankBadgeText}>1</Typography>
                    </View>
                 </View>
                 <Typography numberOfLines={1} style={[styles.podiumName, { fontWeight: '900' }]}>{topThree[0]?.name || 'Champion'}</Typography>
                 <View style={[styles.scorePill, { backgroundColor: 'rgba(255, 215, 0, 0.1)' }]}>
                    <Icon name="Trophy" size={10} color="#FFD700" />
                    <Typography style={[styles.scoreText, { color: '#FFD700' }]}>{topThree[0]?.score || 0}</Typography>
                 </View>
              </Animated.View>
              <Animated.View style={[styles.podiumBase, styles.baseOne, rPodium1]}>
                 <Typography style={[styles.podiumRankText, { fontSize: 48 }]}>1</Typography>
              </Animated.View>
           </View>

           {/* Rank 3 */}
           <View style={styles.podiumColumn}>
              <Animated.View entering={FadeInUp.delay(400)} style={styles.podiumUser}>
                 <View style={styles.avatarBorder}>
                    <Image source={{ uri: topThree[2]?.avatar || 'https://i.pravatar.cc/150' }} style={styles.podiumAvatar} />
                    <View style={[styles.rankBadge, { backgroundColor: '#CD7F32' }]}>
                       <Typography style={styles.rankBadgeText}>3</Typography>
                    </View>
                 </View>
                 <Typography numberOfLines={1} style={styles.podiumName}>{topThree[2]?.name || 'Player'}</Typography>
                 <View style={styles.scorePill}>
                    <Icon name="Trophy" size={10} color="#6193F5" />
                    <Typography style={styles.scoreText}>{topThree[2]?.score || 0}</Typography>
                 </View>
              </Animated.View>
              <Animated.View style={[styles.podiumBase, styles.baseThree, rPodium3]}>
                 <Typography style={styles.podiumRankText}>3</Typography>
              </Animated.View>
           </View>
        </View>

        {/* List Section */}
        <View style={styles.listSection}>
           <FlatList 
             data={otherUsers}
             keyExtractor={item => item.id}
             showsVerticalScrollIndicator={false}
             contentContainerStyle={{ paddingBottom: 150 }}
             renderItem={({ item, index }) => (
               <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.rankRow}>
                  <Typography style={styles.rankNumber}>{item.rank}</Typography>
                  <Image source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }} style={styles.rowAvatar} />
                  <Typography numberOfLines={1} style={styles.rowName}>{item.name}</Typography>
                  <View style={styles.rowScorePill}>
                     <Icon name="Trophy" size={10} color="rgba(0,0,0,0.2)" />
                     <Typography style={styles.rowScoreValue}>{item.score}</Typography>
                  </View>
               </Animated.View>
             )}
           />
        </View>

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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#000' },
  globalProgressContainer: {
    paddingHorizontal: 24,
    marginTop: 10,
    marginBottom: 20,
  },
  progressBg: {
    height: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6193F5',
    borderRadius: 4,
  },
  tabContainer: {
    paddingVertical: 10,
  },
  tabScroll: { paddingHorizontal: 24, gap: 12 },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tabActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  tabText: { fontSize: 13, fontWeight: '700', color: 'rgba(0,0,0,0.4)' },
  tabTextActive: { color: '#FFF' },
  podiumWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 300,
    paddingHorizontal: 20,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
  },
  podiumUser: {
    alignItems: 'center',
    marginBottom: 10,
    zIndex: 10,
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  podiumAvatar: { width: 62, height: 62, borderRadius: 31 },
  rankBadge: {
    position: 'absolute',
    top: 0,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  rankBadgeText: { fontSize: 10, fontWeight: '900', color: '#000' },
  podiumName: { fontSize: 12, color: '#000', fontWeight: '700' },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  scoreText: { fontSize: 12, fontWeight: '800', color: '#6193F5' },
  podiumBase: {
    width: '90%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  baseOne: { backgroundColor: '#6193F5', borderWidth: 0 },
  baseTwo: { backgroundColor: '#FFF' },
  baseThree: { backgroundColor: '#FFF' },
  podiumRankText: { fontSize: 32, fontWeight: '900', color: 'rgba(0,0,0,0.05)' },
  listSection: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 24,
    paddingHorizontal: 24,
    marginTop: -20,
    zIndex: 20,
    elevation: 8,
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  rankNumber: { width: 30, fontSize: 15, fontWeight: '700', color: 'rgba(0,0,0,0.3)' },
  rowAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 16 },
  rowName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#000' },
  rowScorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#F7F6F2',
  },
  rowScoreValue: { fontSize: 14, fontWeight: '900', color: '#000' }
});
