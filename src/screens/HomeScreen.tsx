import React, { useState, useEffect, useCallback, memo } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   TouchableOpacity,
   Dimensions,
   Image,
   StatusBar,
   InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
   ArrowRight,
   Zap,
   Activity,
   Bell,
} from 'lucide-react-native';
import Animated, {
   FadeInDown,
   FadeIn,
} from 'react-native-reanimated';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// ─── Memoized sub-components ────────────────────────────────────────
const StatLine = memo(({ val, name }: { val: string; name: string }) => (
  <View style={styles.statLine}>
    <Typography style={styles.statVal}>{val}</Typography>
    <Typography style={styles.statName}>{name}</Typography>
  </View>
));

const TableRow = memo(({ title, val, highlight }: { title: string; val: string; highlight?: string }) => (
  <View style={styles.tableRow}>
    <Typography style={styles.rowTitle}>{title}</Typography>
    <Typography style={[styles.rowVal, highlight ? { color: highlight } : {}]}>{val}</Typography>
  </View>
));

// ─── Main Screen ────────────────────────────────────────────────────
export const HomeScreen = ({ navigation }: any) => {
   const { colors } = useTheme();

   return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
         <StatusBar barStyle="dark-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
               decelerationRate="fast"
               scrollEventThrottle={16}
            >
               {/* ── Yellow top section ─────────────────── */}
               <View style={styles.topSection}>
                  <View style={styles.header}>
                     <Typography style={styles.brandingLogo}>COLLAB!</Typography>
                     <View style={{ flexDirection: 'row', gap: 12 }}>
                        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85}>
                           <Bell size={22} color="#000" />
                           <View style={styles.notifDot} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.profileBtn} activeOpacity={0.85}>
                           <Image
                              source={{ uri: 'https://i.pravatar.cc/150?u=keerthan' }}
                              style={styles.avatar}
                           />
                           <View style={styles.plusBadge}>
                              <Typography style={styles.plusTxt}>+</Typography>
                           </View>
                        </TouchableOpacity>
                     </View>
                  </View>

                  <Animated.View
                     entering={FadeInDown.delay(150).springify().damping(20)}
                     style={styles.heroTextContainer}
                  >
                     <Typography style={styles.mainTitle}>Team Insights &{'\n'}Project Flow</Typography>
                     <TouchableOpacity style={styles.visitBtn} activeOpacity={0.85}>
                        <Typography style={styles.visitTxt}>SYNC NOW</Typography>
                        <ArrowRight size={18} color="#FFF" />
                     </TouchableOpacity>
                  </Animated.View>

                  {/* Robot frame */}
                  <Animated.View
                     entering={FadeIn.delay(300).duration(600)}
                     style={styles.heroImgContainer}
                  >
                     <Image
                        source={require('../../assets/clay_robot.png')}
                        style={styles.heroImg}
                        resizeMode="cover"
                     />
                     <View style={styles.imageOverlay}>
                        <View style={styles.statusPill}>
                           <View style={styles.liveDot} />
                           <Typography style={styles.statusTxt}>ACTIVE</Typography>
                        </View>
                     </View>
                  </Animated.View>
               </View>

               {/* ── White bottom panel ─────────────────── */}
               <View style={styles.whitePanel}>
                  <View style={styles.panelHandle} />

                  <View style={styles.statsOverview}>
                     <StatLine val="75%" name="Design Progress" />
                     <StatLine val="15%" name="Dev Phase" />
                     <StatLine val="10%" name="Testing" />
                  </View>

                  <View style={styles.tableSection}>
                     <View style={styles.tableHeader}>
                        <Typography style={styles.colLabel}>Category</Typography>
                        <Typography style={styles.colLabel}>Status</Typography>
                     </View>
                     <TableRow title="Art-Team" val="Reviewing" />
                     <TableRow title="Backend" val="Synced" />
                     <TableRow title="UI Logic" val="Highly Safe" highlight="#00C853" />
                  </View>

                  {/* Horizontal feature cards */}
                  <View style={styles.featuresSection}>
                     <Typography style={styles.sectionTitle}>Discover</Typography>
                     <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.featureScroll}
                        decelerationRate="fast"
                     >
                        <TouchableOpacity
                           style={[styles.featCard, { backgroundColor: '#FF1744' }]}
                           activeOpacity={0.85}
                        >
                           <Typography style={styles.featTitle}>THE UNIVERSE{'\n'}OF COLAB</Typography>
                           <Typography style={styles.featSub}>Join the elite circle</Typography>
                           <View style={styles.featIcon}>
                              <Zap size={24} color="#FFF" />
                           </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={[styles.featCard, { backgroundColor: '#2979FF' }]}
                           activeOpacity={0.85}
                        >
                           <Typography style={styles.featTitle}>COLLECTIVE{'\n'}GOALS</Typography>
                           <Typography style={styles.featSub}>Achieve more together</Typography>
                           <View style={styles.featIcon}>
                              <Activity size={24} color="#FFF" />
                           </View>
                        </TouchableOpacity>
                     </ScrollView>
                  </View>
               </View>
            </ScrollView>
         </SafeAreaView>
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1 },
   scrollContent: { paddingBottom: 100 },

   topSection: { paddingHorizontal: 25, paddingBottom: 40, paddingTop: 10 },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8,
   },
   brandingLogo: {
      fontSize: 46,
      fontWeight: '900',
      letterSpacing: -3,
      color: '#000',
      textTransform: 'uppercase',
   },
   iconBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      borderColor: '#000',
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   notifDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 9,
      height: 9,
      borderRadius: 5,
      backgroundColor: '#FF1744',
      borderWidth: 1.5,
      borderColor: '#FFF',
   },
   profileBtn: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#000',
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   avatar: { width: 44, height: 44, borderRadius: 22 },
   plusBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#000',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFEB3B',
   },
   plusTxt: { color: '#FFF', fontSize: 11, fontWeight: '900' },

   heroTextContainer: { marginTop: 22, zIndex: 10 },
   mainTitle: {
      fontSize: 34,
      fontWeight: '900',
      lineHeight: 36,
      letterSpacing: -1,
      color: '#000',
   },
   visitBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: 18,
      backgroundColor: '#000',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 30,
      alignSelf: 'flex-start',
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
   },
   visitTxt: { fontSize: 14, fontWeight: '900', color: '#FFF', letterSpacing: 1 },

   heroImgContainer: {
      alignItems: 'center',
      marginTop: 30,
      backgroundColor: '#FFF',
      borderRadius: 40,
      borderWidth: 4,
      borderColor: '#000',
      overflow: 'hidden',
      elevation: 15,
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowOffset: { width: 10, height: 10 },
   },
   heroImg: { width: width * 0.75, height: width * 0.75 },
   imageOverlay: { position: 'absolute', bottom: 20, right: 20 },
   statusPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#000',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
   },
   liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C853' },
   statusTxt: { color: '#FFF', fontSize: 10, fontWeight: '900' },

   whitePanel: {
      backgroundColor: '#FFF',
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      borderTopWidth: 4,
      borderColor: '#000',
      paddingTop: 15,
      paddingHorizontal: 25,
      minHeight: height * 0.6,
      marginTop: -30,
      paddingBottom: 160,
   },
   panelHandle: {
      width: 50,
      height: 6,
      backgroundColor: '#000',
      borderRadius: 3,
      alignSelf: 'center',
      marginBottom: 40,
   },
   statsOverview: { marginBottom: 40 },
   statLine: { flexDirection: 'row', alignItems: 'baseline', gap: 14, marginBottom: 14 },
   statVal: { fontSize: 46, fontWeight: '900', color: '#000', letterSpacing: -2 },
   statName: {
      fontSize: 12,
      fontWeight: '900',
      color: 'rgba(0,0,0,0.4)',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
   },

   tableSection: { borderTopWidth: 3, borderColor: '#000', paddingTop: 25 },
   tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
   colLabel: {
      fontSize: 11,
      fontWeight: '900',
      color: 'rgba(0,0,0,0.3)',
      textTransform: 'uppercase',
   },
   tableRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)',
   },
   rowTitle: { fontSize: 18, fontWeight: '900' },
   rowVal: { fontSize: 16, fontWeight: '800', color: 'rgba(0,0,0,0.5)' },

   featuresSection: { marginTop: 50 },
   sectionTitle: { fontSize: 28, fontWeight: '900', marginBottom: 24, letterSpacing: -1 },
   featureScroll: { gap: 20, paddingRight: 40 },
   featCard: {
      width: 240,
      height: 220,
      borderRadius: 40,
      padding: 28,
      justifyContent: 'space-between',
      borderWidth: 4,
      borderColor: '#000',
      elevation: 12,
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowRadius: 0,
      shadowOffset: { width: 10, height: 10 },
   },
   featTitle: { color: '#FFF', fontSize: 22, fontWeight: '900', lineHeight: 24 },
   featSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '800' },
   featIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(255,255,255,0.25)',
      justifyContent: 'center',
      alignItems: 'center',
   },
});
