import React, { memo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  Layout
} from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const APP_STACK = [
  { name: 'React Native', level: 90, icon: 'Layout', color: '#6193F5' },
  { name: 'Rust', level: 75, icon: 'Cpu', color: '#F59E0B' },
  { name: 'TypeScript', level: 95, icon: 'Code2', color: '#3178C6' },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Elite Architect', icon: 'Trophy', color: '#FACC15' },
  { id: 2, title: 'Code Vanguard', icon: 'Shield', color: '#10B981' },
  { id: 3, title: 'System Pulse', icon: 'Zap', color: '#6366F1' },
];

// ─── Memoized Stat Item ─────────────────────────────────────────────
const StatText = memo(({ count, label }: { count: string; label: string }) => (
  <View style={{ alignItems: 'center' }}>
    <Typography style={styles.statCount}>{count}</Typography>
    <Typography style={styles.statLabel}>{label}</Typography>
  </View>
));

// ─── Main Screen ────────────────────────────────────────────────────
export const ProfileScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#F8F9FF' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800' }}
          style={styles.coverArea}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.8)', 'transparent', 'rgba(248,249,255,1)']}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView style={styles.headerNav}>
            <View style={styles.headerTitleContainer}>
               <Typography variant="bodyBold" color="rgba(255,255,255,0.9)" style={{ letterSpacing: 1 }}>
                @keerthan
              </Typography>
              <View style={styles.verifiedBadge}>
                <Icon name="CheckCircle2" size={12} color="#6366F1" />
              </View>
            </View>
            <TouchableOpacity style={styles.headerCircleBtn}>
               <Icon name="Settings" color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        {/* PROFILE CONTENT */}
        <View style={styles.detailsContainer}>
          <Animated.View 
            entering={FadeInDown.delay(200).springify()}
            style={styles.avatarWrapper}
          >
            <View style={styles.avatarGlow} />
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }}
              style={styles.avatar}
            />
            <View style={styles.activeDot} />
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(300).springify()}
            style={styles.titleSection}
          >
            <Typography style={styles.nameText}>
              Keerthan Reddy
            </Typography>
            <Typography style={styles.roleText}>
              Principal Engineering Architect
            </Typography>
            
            <View style={styles.statsRow}>
              <StatText count="4.9k" label="Builders" />
              <View style={styles.statDivider} />
              <StatText count="1.2k" label="Vouched" />
              <View style={styles.statDivider} />
              <StatText count="21" label="Launch" />
            </View>
            
            <Typography style={styles.bio}>
              Engineering the future of collaborative tech. {"\n"}Building CollabSphere with absolute precision.
            </Typography>
          </Animated.View>

          {/* ACHIEVEMENTS */}
          <View style={styles.sectionHeader}>
            <Typography style={styles.sectionLabel}>Achievements</Typography>
            <TouchableOpacity><Typography style={styles.viewAll}>View All</Typography></TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.achievementList}
          >
            {ACHIEVEMENTS.map((item, idx) => (
              <Animated.View 
                key={item.id}
                entering={FadeInRight.delay(400 + (idx * 100)).springify()}
                style={styles.achievementCard}
              >
                <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                <View style={[styles.achievementIconBox, { backgroundColor: `${item.color}20` }]}>
                  <Icon name={item.icon} size={24} color={item.color} />
                </View>
                <Typography style={styles.achievementTitle}>{item.title}</Typography>
              </Animated.View>
            ))}
          </ScrollView>

          {/* THE ARSENAL */}
          <Animated.View 
            entering={FadeInDown.delay(600).springify()}
            style={[styles.card, { marginTop: 32 }]}
          >
            <Typography style={styles.cardLabel}>The Arsenal</Typography>
            <View style={styles.stackList}>
              {APP_STACK.map((item, idx) => (
                <View key={idx} style={styles.stackItemCard}>
                  <View style={[styles.stackIconOuter, { backgroundColor: `${item.color}10` }]}>
                    <Icon name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Typography style={styles.stackName}>{item.name}</Typography>
                       <Typography style={[styles.stackLevel, { color: item.color }]}>{item.level}%</Typography>
                    </View>
                    <View style={styles.progressPath}>
                       <View style={[styles.progressFill, { width: `${item.level}%`, backgroundColor: item.color }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(800).springify()}>
            <TouchableOpacity style={styles.primaryAction}>
               <Typography style={styles.btnText}>Collaborate Now</Typography>
               <Icon name="ArrowUpRight" color="#FFF" size={20} style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 150 },
  coverArea: { width: width, height: 420, justifyContent: 'flex-start' },
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    backgroundColor: '#F8F9FF',
    marginTop: -100,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    alignSelf: 'center',
    top: -60,
  },
  avatarGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#6366F1',
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F8F9FF',
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    borderWidth: 4,
    borderColor: '#F8F9FF',
  },
  titleSection: { marginTop: -40, alignItems: 'center' },
  nameText: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
  roleText: { fontSize: 14, fontWeight: '700', color: '#6366F1', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#FFF',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 10,
    shadowColor: '#6366F1',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: 20 },
  statCount: { fontSize: 18, fontWeight: '800', color: '#000' },
  statLabel: { fontSize: 10, color: 'rgba(0,0,0,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bio: { marginTop: 24, textAlign: 'center', color: '#475569', lineHeight: 22, fontWeight: '600', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, marginBottom: 16 },
  sectionLabel: { fontSize: 18, fontWeight: '900', color: '#1E293B' },
  viewAll: { fontSize: 12, fontWeight: '800', color: '#6366F1' },
  achievementList: { gap: 12, paddingRight: 24 },
  achievementCard: {
    width: 140,
    height: 160,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  achievementIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementTitle: { fontSize: 13, fontWeight: '800', color: '#1E293B', textAlign: 'center' },
  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 40, 
    padding: 24, 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  cardLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(0,0,0,0.2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 },
  stackList: { gap: 16 },
  stackItemCard: { flexDirection: 'row', alignItems: 'center' },
  stackIconOuter: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  stackName: { fontSize: 15, fontWeight: '800', color: '#000' },
  stackLevel: { fontSize: 12, fontWeight: '700' },
  progressPath: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  primaryAction: {
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1E293B',
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#1E293B',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: '900' }
});
