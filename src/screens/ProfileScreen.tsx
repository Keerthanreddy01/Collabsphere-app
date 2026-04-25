import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const APP_STACK = [
  { name: 'React Native', level: 90, icon: 'Layout' },
  { name: 'Rust', level: 75, icon: 'Cpu' },
  { name: 'TypeScript', level: 95, icon: 'Code2' },
];

// ─── Memoized Stat Item ─────────────────────────────────────────────
const StatText = memo(({ count, label }: { count: string; label: string }) => (
  <View style={{ alignItems: 'center' }}>
    <Typography style={styles.statCountText}>{count}</Typography>
    <Typography style={styles.statLabelText}>{label}</Typography>
  </View>
));

// ─── Memoized Arsenal Item ─────────────────────────────────────────
const ArsenalItem = memo(({ item, index }: { item: any; index: number }) => (
  <Animated.View
    entering={FadeInDown.delay(index * 100 + 400).springify().damping(20)}
    style={styles.arsenalItem}
  >
    <View style={[styles.skillIcon, { backgroundColor: '#FFF' }]}>
      <Icon name={item.icon} size={22} color="#000" />
    </View>
    <View style={{ flex: 1, marginLeft: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography style={styles.skillName}>{item.name.toUpperCase()}</Typography>
        <Typography style={styles.skillLevel}>{item.level}%</Typography>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressBlade, { width: `${item.level}%` }]} />
      </View>
    </View>
  </Animated.View>
));

// ─── Main Screen ────────────────────────────────────────────────────
export const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        scrollEventThrottle={16}
      >
        {/* ── Hero Section ─────────────────────────── */}
        <View style={styles.heroSection}>
          <SafeAreaView style={styles.headerNav}>
            <TouchableOpacity style={styles.headerSquareBtn} activeOpacity={0.85}>
              <Icon name="Settings2" color="#000" size={22} />
            </TouchableOpacity>
            <Typography style={styles.handleText}>@KEERTHAN_REDDY</Typography>
            <TouchableOpacity style={styles.headerSquareBtn} activeOpacity={0.85}>
              <Icon name="MoreHorizontal" color="#000" size={22} />
            </TouchableOpacity>
          </SafeAreaView>

          <Animated.View
            entering={FadeIn.delay(100).duration(600)}
            style={styles.avatarContainer}
          >
            <View style={styles.avatarBorder}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400' }}
                style={styles.avatar}
              />
              <View style={styles.activePill}>
                <View style={styles.activeDot} />
                <Typography style={styles.activeText}>ONLINE</Typography>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* ── Profile Info ──────────────────────────── */}
        <View style={styles.contentBody}>
          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(20)}
            style={styles.titleBlock}
          >
            <Typography style={styles.nameText}>KEERTHAN REDDY</Typography>
            <Typography style={styles.roleText}>FULLSTACK ARCHITECT</Typography>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(280).springify().damping(20)}
            style={styles.statsCard}
          >
            <StatText count="4.9K" label="BUILDERS" />
            <View style={styles.statLine} />
            <StatText count="1.2K" label="VOUCHED" />
            <View style={styles.statLine} />
            <StatText count="21" label="LAUNCHES" />
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(360).springify().damping(20)}
            style={styles.bioCard}
          >
            <Typography style={styles.bioTitle}>TRANSCRIPT</Typography>
            <Typography style={styles.bioBody}>
              Engineering the future of collaborative tech.{'\n'}
              Building CollabSphere with absolute precision. High speed, high impact.
            </Typography>
          </Animated.View>

          {/* Arsenal */}
          <View style={styles.arsenalSection}>
            <Typography style={styles.sectionHeading}>THE ARSENAL</Typography>
            {APP_STACK.map((item, idx) => (
              <ArsenalItem key={idx} item={item} index={idx} />
            ))}
          </View>

          <Animated.View
            entering={FadeInDown.delay(700).springify().damping(20)}
          >
            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88}>
              <Typography style={styles.btnText}>INITIATE COLLAB</Typography>
              <Icon name="Zap" size={20} color="#000" style={{ marginLeft: 12 }} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  scrollContent: { paddingBottom: 160 },

  heroSection: {
    height: 390,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  headerNav: {
    position: 'absolute',
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 0 : 38,
  },
  headerSquareBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  handleText: { fontSize: 12, fontWeight: '900', color: '#000', letterSpacing: 1 },

  avatarContainer: { marginTop: 40 },
  avatarBorder: {
    width: 180,
    height: 180,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 12, height: 12 },
  },
  avatar: { width: 162, height: 162, borderRadius: 12 },
  activePill: {
    position: 'absolute',
    bottom: -16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#00E676',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 10,
  },
  activeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#000' },
  activeText: { fontSize: 10, fontWeight: '900', color: '#000' },

  contentBody: { paddingHorizontal: 25, marginTop: 25 },
  titleBlock: { alignItems: 'center', marginBottom: 28 },
  nameText: { fontSize: 35, fontWeight: '900', color: '#000', letterSpacing: -2 },
  roleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    opacity: 0.5,
    letterSpacing: 1,
    marginTop: 4,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    paddingVertical: 24,
    borderRadius: 28,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  statLine: { width: 3, height: 28, backgroundColor: '#000' },
  statCountText: { fontSize: 24, fontWeight: '900', color: '#000' },
  statLabelText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  bioCard: {
    backgroundColor: '#000',
    padding: 24,
    borderRadius: 28,
    marginTop: 32,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  bioTitle: {
    color: '#FFEB3B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 14,
  },
  bioBody: { color: '#FFF', fontSize: 15, lineHeight: 22, fontWeight: '700' },

  arsenalSection: { marginTop: 38 },
  sectionHeading: { fontSize: 22, fontWeight: '900', color: '#000', marginBottom: 22, letterSpacing: -0.5 },
  arsenalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  skillIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillName: { fontSize: 14, fontWeight: '900', color: '#000' },
  skillLevel: { fontSize: 12, fontWeight: '900', color: '#2979FF' },
  progressTrack: {
    height: 10,
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#000',
    overflow: 'hidden',
  },
  progressBlade: { height: '100%', backgroundColor: '#2979FF', borderRadius: 5 },

  primaryBtn: {
    height: 68,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 34,
    marginTop: 38,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  btnText: { fontSize: 17, fontWeight: '900', color: '#000' },
});
