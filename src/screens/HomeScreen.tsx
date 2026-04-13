import React, { useState, useEffect } from 'react';
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
import {
   Bell,
   MoreVertical,
   Mail,
   Video,
   Activity,
   Zap,
   ChevronRight,
   TrendingUp,
   Target,
   Users,
   Server,
   MoveUpRight
} from 'lucide-react-native';
import Animated, {
   FadeInDown,
   useAnimatedStyle,
   useSharedValue,
   withSpring,
   withTiming,
   withDelay
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const RECENT_ACTIVITY = [
   { id: 1, user: 'Josh', avatar: 'https://i.pravatar.cc/150?u=1', action: 'pushed to', target: 'Art-Team', time: '2m', color: '#6193F5' },
   { id: 2, user: 'Sarah', avatar: 'https://i.pravatar.cc/150?u=2', action: 'reviewed', target: 'Seed V2', time: '15m', color: '#F59E0B' },
   { id: 3, user: 'Sphere', avatar: 'https://i.pravatar.cc/150?u=sphere', action: 'synced', target: 'Global Stats', time: '1h', color: '#10B981' },
];

export const HomeScreen = ({ navigation }: any) => {
   const peekerY = useSharedValue(100);

   useEffect(() => {
      // Pop up so legs stay hidden behind the metrics ledge
      peekerY.value = withDelay(600, withSpring(-115, { damping: 15, stiffness: 80 }));
   }, []);

   const peekerStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: peekerY.value }]
   }));

   return (
      <View style={styles.container}>
         <StatusBar barStyle="dark-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               {/* Fixed Branding Header */}
               <View style={styles.header}>
                  <View>
                     <Typography style={styles.titleBlack}>CollabSphere</Typography>
                     <Typography style={styles.titleGrey}>WORKSTATION</Typography>
                  </View>
                  <TouchableOpacity
                     style={styles.bellBtn}
                     onPress={() => navigation?.navigate('MessagesList')}
                  >
                     <Bell size={24} color="#3B82F6" />
                     <View style={styles.bellNavDot} />
                  </TouchableOpacity>
               </View>

               {/* CUSTOM 3D PEEKER (USER IMAGE) */}
               <View style={styles.metricsWrapper}>
                  <Animated.View style={[styles.sneakyPeeker, peekerStyle]}>
                     <Image
                        source={require('../assets/user_peeker.png')}
                        style={styles.peekerImg}
                        resizeMode="contain"
                     />
                  </Animated.View>

                  <View style={styles.classicMetricsBar}>
                     <View style={styles.metricItem}>
                        <Typography style={styles.metricValue}>24.5k</Typography>
                        <Typography style={styles.metricLabel}>Reach</Typography>
                     </View>
                     <View style={styles.metricDivider} />
                     <View style={styles.metricItem}>
                        <Typography style={styles.metricValue}>92%</Typography>
                        <Typography style={styles.metricLabel}>Uptime</Typography>
                     </View>
                     <View style={styles.metricDivider} />
                     <View style={styles.metricItem}>
                        <Typography style={[styles.metricValue, { color: '#10B981' }]}>+12</Typography>
                        <Typography style={styles.metricLabel}>Growth</Typography>
                     </View>
                  </View>
               </View>

               {/* Milestones / Pulse Row (REFINED) */}
               <View style={styles.milestoneRowContent}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
                     <View style={styles.milestoneCard}>
                        <View style={styles.milestoneHeader}>
                           <Target size={14} color="#6193F5" />
                           <Typography style={styles.milestoneTitle}>Project Intel</Typography>
                        </View>
                        <Typography style={styles.milestoneName}>Mainnet Launch</Typography>
                        <Typography style={[styles.milestoneTime, { color: '#6193F5' }]}>4 Days Left</Typography>
                     </View>
                     <View style={styles.milestoneCard}>
                        <View style={styles.milestoneHeader}>
                           <Users size={14} color="#F59E0B" />
                           <Typography style={styles.milestoneTitle}>Builder Status</Typography>
                        </View>
                        <Typography style={styles.milestoneName}>12 Active</Typography>
                        <Typography style={[styles.milestoneTime, { color: '#F59E0B' }]}>Syncing Now</Typography>
                     </View>
                     <View style={styles.milestoneCard}>
                        <View style={styles.milestoneHeader}>
                           <Server size={14} color="#10B981" />
                           <Typography style={styles.milestoneTitle}>Global Node</Typography>
                        </View>
                        <Typography style={styles.milestoneName}>88% Uptime</Typography>
                        <Typography style={[styles.milestoneTime, { color: '#10B981' }]}>Optimized</Typography>
                     </View>
                  </ScrollView>
               </View>

               {/* Grid section */}
               <View style={styles.gridRow}>
                  <View style={styles.leftCol}>
                     <TouchableOpacity onPress={() => navigation?.navigate('Chat')} style={styles.blueCard}>
                        <View style={styles.cardHeaderSmall}>
                           <Typography style={styles.cardBadge}>Art-Team</Typography>
                           <MoreVertical size={16} color="#FFF" opacity={0.6} />
                        </View>
                        <Typography style={styles.cardSub}>Syncing Project</Typography>
                        <Typography style={styles.cardMainVal}>09:45</Typography>
                        <View style={styles.liveIndicator}>
                           <View style={styles.liveDot} />
                           <Typography style={styles.liveText}>LIVE NOW</Typography>
                        </View>
                     </TouchableOpacity>
                  </View>
                  <View style={styles.rightCol}>
                     <View style={styles.actionRow}>
                        <TouchableOpacity 
                           style={styles.actionBtn}
                           onPress={() => navigation?.navigate('MessagesList')}
                        >
                           <Mail size={22} color="#EF4444" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                           style={styles.actionBtn}
                           onPress={() => navigation?.navigate('Feed')}
                        >
                           <Video size={22} color="#10B981" />
                        </TouchableOpacity>
                     </View>
                     <TouchableOpacity style={styles.teamCard}>
                        <Typography style={styles.teamLabel}>THE SPHERE</Typography>
                        <View style={styles.avatarRow}>
                           <Image source={{ uri: 'https://i.pravatar.cc/150?u=a' }} style={styles.miniAvatar} />
                           <Image source={{ uri: 'https://i.pravatar.cc/150?u=b' }} style={styles.miniAvatar} />
                           <Image source={{ uri: 'https://i.pravatar.cc/150?u=c' }} style={styles.miniAvatar} />
                           <View style={styles.moreAvatar}>
                              <Typography style={styles.moreText}>+8</Typography>
                           </View>
                        </View>
                        <View style={styles.activeDot} />
                     </TouchableOpacity>
                  </View>
               </View>

               <View style={styles.gridRow}>
                  <View style={styles.statBox}>
                     <View style={styles.statHeader}>
                        <Typography style={styles.statVal}>98</Typography>
                        <TrendingUp size={16} color="rgba(0,0,0,0.1)" />
                     </View>
                     <Typography style={styles.statLabel}>In Progress</Typography>
                     <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: '70%', backgroundColor: '#000' }]} />
                     </View>
                  </View>
                  <View style={[styles.statBox, { backgroundColor: '#C8FF8C' }]}>
                     <View style={styles.statHeader}>
                        <Typography style={styles.statVal}>55</Typography>
                        <Zap size={16} color="rgba(0,0,0,0.1)" />
                     </View>
                     <Typography style={styles.statLabel}>Complete</Typography>
                     <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { width: '45%', backgroundColor: '#000' }]} />
                     </View>
                  </View>
               </View>

               {/* Activity Feed */}
               <View style={styles.feedSection}>
                  <View style={styles.feedHeader}>
                     <Typography style={styles.feedTitle}>Live Feed</Typography>
                     <View style={styles.feedLiveDot} />
                  </View>
                  {RECENT_ACTIVITY.map(item => (
                     <View key={item.id} style={styles.feedItem}>
                        <Image source={{ uri: item.avatar }} style={styles.feedAvatar} />
                        <View style={styles.feedContent}>
                           <View style={styles.feedTextRow}>
                              <Typography style={styles.feedUser}>{item.user}</Typography>
                              <Typography style={styles.feedAction}> {item.action} </Typography>
                              <Typography style={[styles.feedTarget, { color: item.color }]}>{item.target}</Typography>
                           </View>
                           <Typography style={styles.feedTime}>{item.time} ago</Typography>
                        </View>
                        <ChevronRight size={16} color="rgba(0,0,0,0.1)" />
                     </View>
                  ))}
               </View>
            </ScrollView>
         </SafeAreaView>
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#F7F6F2' },
   scrollContent: { paddingHorizontal: 24, paddingBottom: 250 },
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 35, marginBottom: 25 },
   titleBlack: { fontSize: 38, fontWeight: '900', color: '#000', lineHeight: 42, letterSpacing: -1 },
   titleGrey: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: 'rgba(0,0,0,0.15)', 
    lineHeight: 22, 
    letterSpacing: 2, 
    marginTop: 4,
    textTransform: 'uppercase'
  },
   bellBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
   bellNavDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 2, borderColor: '#FFF' },
   metricsWrapper: { marginBottom: 35, marginTop: 45, zIndex: 1 },
   sneakyPeeker: { 
      position: 'absolute', 
      top: 0, 
      right: 5, 
      width: 220, 
      height: 220, 
      zIndex: 1, 
   },
   peekerImg: { 
      width: '100%', 
      height: '100%' 
   },
   classicMetricsBar: { 
      flexDirection: 'row', 
      backgroundColor: '#FFF', 
      borderRadius: 28, 
      padding: 22, 
      elevation: 10, 
      shadowColor: '#000', 
      shadowOpacity: 0.1, 
      shadowRadius: 20, 
      alignItems: 'center',
      zIndex: 10, 
   },
   metricItem: { flex: 1, alignItems: 'center' },
   metricValue: { fontSize: 18, fontWeight: '900', color: '#000' },
   metricLabel: { fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.15)', textTransform: 'uppercase', marginTop: 4 },
   metricDivider: { width: 1, height: 26, backgroundColor: 'rgba(0,0,0,0.05)' },
   milestoneRowContent: { 
    marginBottom: 10, 
    marginHorizontal: -24, 
    paddingLeft: 24,
    height: 140, 
  },
  milestoneCard: { 
    width: 155, 
    height: 110, 
    borderRadius: 24, 
    padding: 18, 
    marginRight: 12,
    marginTop: 5, 
    marginBottom: 20, 
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    elevation: 5, 
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }
  },
  milestoneHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  milestoneTitle: { fontSize: 10, fontWeight: '800', color: 'rgba(0,0,0,0.25)', textTransform: 'uppercase', letterSpacing: 0.5 },
  milestoneName: { fontSize: 14, fontWeight: '900', color: '#000', lineHeight: 18 },
  milestoneTime: { fontSize: 11, fontWeight: '800' },
   gridRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
   leftCol: { flex: 1.15 },
   blueCard: { height: 215, borderRadius: 28, padding: 22, justifyContent: 'space-between', overflow: 'hidden', backgroundColor: '#6193F5' },
   cardHeaderSmall: { flexDirection: 'row', justifyContent: 'space-between' },
   cardBadge: { fontSize: 12, fontWeight: '800', color: '#FFF' },
   cardSub: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.6)', marginTop: 4 },
   cardMainVal: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#FFF', 
    letterSpacing: 0, // Reset to natural spacing to avoid horizontal clipping
    marginVertical: 12,
    lineHeight: 50, // Higher than fontSize to prevent vertical clipping
    textAlignVertical: 'center', // Android optimization
    includeFontPadding: false,
  },
   liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
   liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
   liveText: { fontSize: 10, fontWeight: '800', color: '#FFF', letterSpacing: 1 },
   rightCol: { flex: 1 },
   actionRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
   actionBtn: { flex: 1, height: 75, borderRadius: 28, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
   teamCard: { flex: 1, height: 126, borderRadius: 28, backgroundColor: '#FFF', padding: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
   teamLabel: { fontSize: 9, fontWeight: '800', color: 'rgba(0,0,0,0.15)', letterSpacing: 1, textTransform: 'uppercase' },
   avatarRow: { flexDirection: 'row', marginTop: 14, alignItems: 'center' },
   miniAvatar: { width: 28, height: 28, borderRadius: 14, borderSize: 2, borderColor: '#FFF', marginRight: -8 },
   moreAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C8FF8C', justifyContent: 'center', alignItems: 'center', borderSize: 2, borderColor: '#FFF' },
   moreText: { fontSize: 10, fontWeight: '900', color: '#000' },
   activeDot: { position: 'absolute', top: 18, right: 18, width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
   statBox: { flex: 1, height: 165, borderRadius: 28, backgroundColor: '#FFF', padding: 22, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
   statHeader: { flexDirection: 'row', justifyContent: 'space-between' },
   statVal: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
   statLabel: { fontSize: 13, fontWeight: '800', color: 'rgba(0,0,0,0.25)', marginTop: 15 },
   progressTrack: { height: 4, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
   progressBar: { height: '100%', borderRadius: 2 },
   feedSection: { marginTop: 25 },
   feedHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 },
   feedTitle: { fontSize: 18, fontWeight: '900', color: '#000' },
   feedLiveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
   feedItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 24, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5 },
   feedAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 14 },
   feedContent: { flex: 1 },
   feedTextRow: { flexDirection: 'row', alignItems: 'center' },
   feedUser: { fontSize: 14, fontWeight: '800', color: '#000' },
   feedAction: { fontSize: 14, color: 'rgba(0,0,0,0.5)' },
   feedTarget: { fontSize: 14, fontWeight: '800' },
   feedTime: { fontSize: 12, color: 'rgba(0,0,0,0.2)', marginTop: 2 },
});
