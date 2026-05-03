import React, { memo } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   TouchableOpacity,
   Dimensions,
   Image,
   StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid, Plus, Users, Sparkles, MessageSquare, Clock, Activity } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
   return (
      <View style={styles.container}>
         <StatusBar barStyle="light-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               {/* Header Section */}
               <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                  <View style={styles.headerLeft}>
                     <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=keerthan' }}
                        style={styles.avatar}
                     />
                     <View>
                        <Typography style={styles.greeting}>Hi, Developer</Typography>
                        <Typography style={styles.subtitle}>Let's build something amazing</Typography>
                     </View>
                  </View>
                  <TouchableOpacity style={styles.menuBtn} activeOpacity={0.8}>
                     <Grid size={20} color="#FFF" />
                  </TouchableOpacity>
               </Animated.View>

               {/* Main Grid Content */}
               <View style={styles.gridContainer}>
                  {/* Left Column */}
                  <View style={styles.column}>
                     {/* Create New Project Widget */}
                     <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.card, styles.createProjectCard]}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between' }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>Create{'\n'}New Project</Typography>
                           <View style={styles.plusContainer}>
                              <Plus size={28} color="#FFF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* My Projects Widget */}
                     <Animated.View entering={FadeInDown.delay(400).springify()} style={[styles.card, styles.myProjectsCard]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>My Projects</Typography>
                           <Typography style={styles.cardSubtitle}>3 Active</Typography>
                           
                           <View style={styles.progressContainer}>
                              <View style={[styles.progressBar, { width: '70%' }]} />
                              <Typography style={styles.progressText}>70%</Typography>
                           </View>
                           
                           <View style={styles.avatarRow}>
                              <Image source={{ uri: 'https://i.pravatar.cc/150?u=1' }} style={[styles.miniAvatar, { zIndex: 3 }]} />
                              <Image source={{ uri: 'https://i.pravatar.cc/150?u=2' }} style={[styles.miniAvatar, { zIndex: 2, marginLeft: -12 }]} />
                              <Image source={{ uri: 'https://i.pravatar.cc/150?u=3' }} style={[styles.miniAvatar, { zIndex: 1, marginLeft: -12 }]} />
                              <Typography style={styles.plusCount}>+2</Typography>
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* Upcoming Deadlines Widget */}
                     <Animated.View entering={FadeInDown.delay(600).springify()} style={[styles.card, styles.deadlinesCard]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>Upcoming{'\n'}Deadlines</Typography>
                           <Typography style={styles.cardSubtitle}>2 Due Soon</Typography>
                           
                           <View style={styles.clockIconContainer}>
                              <Clock size={20} color="#FFF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* My Tasks Widget */}
                     <Animated.View entering={FadeInDown.delay(800).springify()} style={[styles.card, styles.myTasksCard]}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between' }} activeOpacity={0.8}>
                           <View>
                              <Typography style={styles.cardTitle}>My Tasks</Typography>
                              <Typography style={styles.cardSubtitle}>8 Pending</Typography>
                           </View>
                           
                           <View style={styles.progressContainer}>
                              <View style={[styles.progressBar, { width: '60%' }]} />
                              <Typography style={styles.progressText}>60%</Typography>
                           </View>
                        </TouchableOpacity>
                     </Animated.View>
                  </View>

                  {/* Right Column */}
                  <View style={styles.column}>
                     {/* AI Match Widget */}
                     <Animated.View entering={FadeInDown.delay(300).springify()} style={[styles.card, styles.aiMatchCard]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                           <View style={styles.cardBgDecoration} />
                           
                           <View style={styles.badgeContainer}>
                              <Users size={16} color="#FFF" />
                           </View>
                           
                           <View style={{ marginTop: 20 }}>
                              <Typography style={styles.cardTitle}>AI Match</Typography>
                              <Typography style={styles.cardSubtitle}>Find perfect{'\n'}squad</Typography>
                           </View>
                           
                           <View style={styles.largeIconContainer}>
                              <Sparkles size={32} color="#9C88FF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* Team Chat Widget */}
                     <Animated.View entering={FadeInDown.delay(500).springify()} style={[styles.card, styles.teamChatCard]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>Team Chat</Typography>
                           <Typography style={styles.cardSubtitle}>4 Unread</Typography>
                           
                           <View style={styles.chatIconContainer}>
                              <MessageSquare size={36} color="#9C88FF" fill="#9C88FF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* Activity Feed Widget */}
                     <Animated.View entering={FadeInDown.delay(700).springify()} style={[styles.card, styles.activityFeedCard]}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between' }} activeOpacity={0.8}>
                           <View>
                              <Typography style={styles.cardTitle}>Activity Feed</Typography>
                              <Typography style={styles.cardSubtitle}>12 New Updates</Typography>
                           </View>
                           
                           <View style={styles.activityGraph}>
                              <Activity size={32} color="#5C44FF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>

                     {/* My Profile Widget */}
                     <Animated.View entering={FadeInDown.delay(900).springify()} style={[styles.card, styles.myProfileCard]}>
                        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>My Profile</Typography>
                           <Typography style={styles.cardSubtitle}>View and edit</Typography>
                           
                           <View style={styles.profileBottomRight}>
                              <Image source={{ uri: 'https://i.pravatar.cc/150?u=keerthan' }} style={styles.profileSmallAvatar} />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>
                  </View>
               </View>

            </ScrollView>
         </SafeAreaView>
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#090A0F' },
   scrollContent: { paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 },
   
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
   },
   headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   avatar: { width: 48, height: 48, borderRadius: 24 },
   greeting: { fontSize: 18, fontWeight: '700', color: '#FFF' },
   subtitle: { fontSize: 13, color: '#8A8A93', marginTop: 2 },
   
   menuBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#5C44FF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   
   gridContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   column: {
      width: '47.5%',
      gap: 16,
   },
   
   card: {
      backgroundColor: '#15161E',
      borderRadius: 28,
      padding: 20,
      overflow: 'hidden',
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
      lineHeight: 22,
   },
   createProjectCard: {
      height: 200,
      borderStyle: 'dashed',
      borderWidth: 1.5,
      borderColor: '#2A2B36',
   },
   plusContainer: {
      alignSelf: 'center',
      marginBottom: 20,
   },
   aiMatchCard: {
      height: 190,
      backgroundColor: '#15161E',
   },
   badgeContainer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#5C44FF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   cardSubtitle: {
      fontSize: 12,
      color: '#8A8A93',
      marginTop: 4,
   },
   largeIconContainer: {
      position: 'absolute',
      bottom: -10,
      right: -10,
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(92, 68, 255, 0.15)',
      justifyContent: 'center',
      alignItems: 'center',
   },
   cardBgDecoration: {
      position: 'absolute',
      top: '10%',
      right: '-20%',
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(92, 68, 255, 0.05)',
   },
   myProjectsCard: {
      height: 160,
   },
   progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
   },
   progressBar: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#5C44FF',
   },
   progressText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#5C44FF',
   },
   avatarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
   },
   miniAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#15161E',
   },
   plusCount: {
      fontSize: 12,
      fontWeight: '600',
      color: '#8A8A93',
      marginLeft: 8,
   },
   teamChatCard: {
      height: 140,
   },
   chatIconContainer: {
      position: 'absolute',
      bottom: -10,
      left: 10,
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(92, 68, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      transform: [{ rotate: '-10deg' }],
   },
   deadlinesCard: {
      height: 140,
   },
   clockIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#5C44FF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   activityFeedCard: {
      height: 160,
   },
   activityGraph: {
      alignItems: 'center',
      marginTop: 'auto',
      marginBottom: 10,
   },
   myTasksCard: {
      height: 130,
   },
   myProfileCard: {
      height: 130,
   },
   profileBottomRight: {
      position: 'absolute',
      bottom: 0,
      right: 0,
   },
   profileSmallAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
   },
});
