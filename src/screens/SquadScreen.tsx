import React, { memo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

// ─── Memoized Room Card ─────────────────────────────────────────────
const RoomCard = memo(({ title, members, status, color, image, index }: any) => (
  <Animated.View
    entering={FadeInRight.delay(index * 120).springify().damping(20)}
    style={styles.roomCard}
  >
    <Image source={{ uri: image }} style={styles.roomImage} />
    <View style={styles.roomOverlay}>
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Typography style={styles.statusBadgeText}>{status}</Typography>
      </View>
      <View>
        <Typography style={styles.roomTitle}>{title}</Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Icon name="Users" size={13} color="#FFF" />
          <Typography style={styles.membersCount}>{members} ACTIVE</Typography>
        </View>
      </View>
    </View>
  </Animated.View>
));

// ─── Memoized Workshop Item ─────────────────────────────────────────
const WorkshopItem = memo(({ title, time, host, rsvps, onPressHost, index }: any) => (
  <Animated.View entering={FadeInDown.delay(index * 100).springify().damping(20)}>
    <TouchableOpacity style={styles.workshopItem} onPress={onPressHost} activeOpacity={0.85}>
      <View style={[styles.workshopIcon, { backgroundColor: '#FFEB3B' }]}>
        <Icon name="Calendar" size={22} color="#000" />
      </View>
      <View style={{ flex: 1, marginLeft: 18 }}>
        <Typography style={styles.workshopTitle}>{title}</Typography>
        <Typography style={styles.workshopMeta}>
          {time} • BY {host.toUpperCase()}
        </Typography>
      </View>
      <View style={styles.rsvpBadge}>
        <Typography style={styles.rsvpText}>{rsvps}</Typography>
      </View>
    </TouchableOpacity>
  </Animated.View>
));

// ─── Memoized Project Card ──────────────────────────────────────────
const ProjectCard = memo(({ name, stack, mission, role, onPress, index }: any) => (
  <Animated.View entering={FadeInDown.delay(200 + index * 100).springify().damping(20)}>
    <TouchableOpacity style={styles.projectCard} onPress={onPress} activeOpacity={0.85}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <Typography style={styles.projNameText}>{name}</Typography>
          <Typography style={styles.projStackText}>{stack}</Typography>
        </View>
        <View style={styles.roleBadge}>
          <Typography style={styles.roleBadgeText}>{role}</Typography>
        </View>
      </View>
      <Typography style={styles.projMissionText}>{mission}</Typography>
      <View style={styles.projectFooter}>
        <View style={styles.priorityBox}>
          <Icon name="Zap" size={15} color="#000" />
          <Typography style={styles.priorityText}>HIGH PRIORITY</Typography>
        </View>
        <View style={styles.applySmallBtn}>
          <Typography style={styles.applyText}>APPLY NOW</Typography>
        </View>
      </View>
    </TouchableOpacity>
  </Animated.View>
));

// ─── Main Screen ────────────────────────────────────────────────────
export const SquadScreen = ({ navigation }: any) => {
  const ROOM_CARDS = [
    {
      title: 'NEXUS PROTOCOL',
      members: 12,
      status: 'DEEP WORK',
      color: '#2979FF',
      image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400',
    },
    {
      title: 'QUANTUM ML',
      members: 5,
      status: 'CODE REVIEW',
      color: '#FF1744',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    },
    {
      title: 'WEB3 LABS',
      members: 8,
      status: 'SHIPPING',
      color: '#00E676',
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Typography style={styles.headerTitle}>SQUADS</Typography>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.85}>
            <Icon name="Plus" color="#000" size={26} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          decelerationRate="fast"
          scrollEventThrottle={16}
        >
          {/* ── Collab Rooms ─────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>COLLAB ROOMS</Typography>
              <TouchableOpacity activeOpacity={0.85}>
                <Typography style={styles.seeAllText}>VIEW ALL</Typography>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
              contentContainerStyle={{ paddingRight: 50 }}
              decelerationRate="fast"
            >
              {ROOM_CARDS.map((card, idx) => (
                <RoomCard key={card.title} {...card} index={idx} />
              ))}
            </ScrollView>
          </View>

          {/* ── Workshops ────────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>WORKSHOPS</Typography>
            </View>
            <View style={styles.workshopList}>
              <WorkshopItem
                index={0}
                title="RUST MEMORY SAFETY"
                time="TODAY, 6:00 PM"
                host="Alex_Dev"
                rsvps={142}
                onPressHost={() => navigation.navigate('Chat', { name: 'Alex_Dev' })}
              />
              <WorkshopItem
                index={1}
                title="SCALING LLMS"
                time="TOMORROW, 10:00 AM"
                host="Marcus_AI"
                rsvps={289}
                onPressHost={() => navigation.navigate('Chat', { name: 'Marcus_AI' })}
              />
            </View>
          </View>

          {/* ── Open Missions ────────────────────────── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>OPEN MISSIONS</Typography>
            </View>
            <ProjectCard
              index={0}
              name="AROMI FRONTEND"
              stack="REACT NATIVE • REANIMATED"
              mission="Building a world-class health companion for rural regions."
              role="LEAD UI BUILDER"
              onPress={() => navigation.navigate('Chat', { name: 'AroMi Team' })}
            />
            <ProjectCard
              index={1}
              name="CHAINLINK BRIDGE"
              stack="SOLIDITY • RUST"
              mission="Trustless cross-chain asset migration protocol."
              role="CONTRACT DEV"
              onPress={() => navigation.navigate('Chat', { name: 'ChainLink Team' })}
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Floating Network Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.barInner}>
          <View style={styles.barMeta}>
            <Typography style={styles.barLabel}>NETWORK STATUS</Typography>
            <Typography style={styles.barValue}>● ACTIVE SYNCHRONIZATION</Typography>
          </View>
          <TouchableOpacity style={styles.createBtn} activeOpacity={0.85}>
            <Typography style={styles.createBtnText}>NEW PROJECT</Typography>
          </TouchableOpacity>
        </View>
      </View>
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
  headerTitle: { fontSize: 36, fontWeight: '900', color: '#000', letterSpacing: -2 },
  addBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  scrollContent: { paddingBottom: 220 },
  section: { marginTop: 30, paddingHorizontal: 25 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000', letterSpacing: -1 },
  seeAllText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    textDecorationLine: 'underline',
  },
  horizontalScroll: { marginHorizontal: -25, paddingLeft: 25 },
  roomCard: {
    width: 260,
    height: 178,
    borderRadius: 34,
    marginRight: 18,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#000',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  roomImage: { ...StyleSheet.absoluteFillObject, opacity: 0.55 },
  roomOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 22,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  statusBadgeText: { color: '#000', fontWeight: '900', fontSize: 10 },
  roomTitle: { fontSize: 21, fontWeight: '900', color: '#FFF' },
  membersCount: { marginLeft: 7, color: '#FFF', fontWeight: '900', fontSize: 11 },

  workshopList: { gap: 16 },
  workshopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 22,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  workshopIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workshopTitle: { fontSize: 16, fontWeight: '900', color: '#000' },
  workshopMeta: { fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: '900', marginTop: 4 },
  rsvpBadge: {
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#000',
  },
  rsvpText: { color: '#000', fontWeight: '900', fontSize: 13 },

  projectCard: {
    backgroundColor: '#FFF',
    borderRadius: 38,
    padding: 22,
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  projNameText: { fontSize: 22, fontWeight: '900', color: '#000', letterSpacing: -1 },
  projStackText: { fontSize: 11, fontWeight: '900', color: '#2979FF', marginTop: 4 },
  roleBadge: {
    backgroundColor: '#00E676',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  roleBadgeText: { fontWeight: '900', fontSize: 9, color: '#000' },
  projMissionText: {
    fontSize: 14,
    color: '#444',
    marginTop: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderStyle: 'dashed',
  },
  priorityBox: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  priorityText: { color: '#000', fontWeight: '900', fontSize: 11 },
  applySmallBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  applyText: { color: '#FFF', fontWeight: '900', fontSize: 12 },

  bottomBar: {
    position: 'absolute',
    bottom: 110,    // sits above the tab bar
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#000',
    elevation: 18,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 8 },
  },
  barInner: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  barMeta: { flex: 1 },
  barLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1,
  },
  barValue: { fontSize: 11, fontWeight: '900', color: '#00E676', marginTop: 2 },
  createBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 24,
  },
  createBtnText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
});
