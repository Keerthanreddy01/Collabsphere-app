import React from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../components/Typography';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// Bulletproof Icon Resolver
const Icon = ({ name, ...props }: { name: string; [key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

export const SquadScreen = ({ navigation }: any) => {
  return (
    <View style={[styles.container, { backgroundColor: '#FFEB3B' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
           <Typography style={styles.headerTitle}>SQUADS</Typography>
           <TouchableOpacity style={styles.addBtn}>
              <Icon name="Plus" color="#000" size={28} />
           </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           
           {/* Section 1: Active Collab Rooms */}
           <View style={styles.section}>
              <View style={styles.sectionHeader}>
                 <Typography style={styles.sectionTitle}>COLLAB ROOMS</Typography>
                 <TouchableOpacity>
                   <Typography style={styles.seeAllText}>VIEW ALL</Typography>
                 </TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll} contentContainerStyle={{ paddingRight: 50 }}>
                 <RoomCard 
                   title="NEXUS PROTOCOL" 
                   members={12} 
                   status="DEEP WORK" 
                   color="#2979FF"
                   image="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400"
                 />
                 <RoomCard 
                   title="QUANTUM ML" 
                   members={5} 
                   status="CODE REVIEW" 
                   color="#FF1744"
                   image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"
                 />
              </ScrollView>
           </View>

           {/* Section 2: Technical Workshops */}
           <View style={styles.section}>
              <View style={styles.sectionHeader}>
                  <Typography style={styles.sectionTitle}>WORKSHOPS</Typography>
               </View>
               <View style={styles.workshopList}>
                  <WorkshopItem 
                     title="RUST MEMORY SAFETY" 
                     time="TODAY, 6:00 PM"
                     host="Alex_Dev"
                     rsvps={142}
                     onPressHost={() => navigation.navigate('Chat', { name: 'Alex_Dev' })}
                  />
                  <WorkshopItem 
                     title="SCALING LLMS" 
                     time="TOMORROW, 10:00 AM"
                     host="Marcus_AI"
                     rsvps={289}
                     onPressHost={() => navigation.navigate('Chat', { name: 'Marcus_AI' })}
                  />
               </View>
           </View>

           {/* Section 3: Open Roles (Recruitment) */}
           <View style={styles.section}>
              <View style={styles.sectionHeader}>
                  <Typography style={styles.sectionTitle}>OPEN MISSIONS</Typography>
               </View>
               
               <ProjectCard 
                 name="AROMI FRONTEND"
                 stack="REACT NATIVE • REANIMATED"
                 mission="Building a world-class health companion for rural regions."
                 role="LEAD UI BUILDER"
                 onPress={() => navigation.navigate('Chat', { name: 'AroMi Team' })}
               />

               <ProjectCard 
                 name="CHAINLINK BRIDGE"
                 stack="SOLIDITY • RUST"
                 mission="Trustless cross-chain asset migration protocol."
                 role="CONTRACT DEV"
                 onPress={() => navigation.navigate('Chat', { name: 'ChainLink Team' })}
               />
           </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Floating Action Bar */}
      <View style={styles.bottomBar}>
         <View style={styles.barInner}>
            <View style={styles.barMeta}>
               <Typography style={styles.barLabel}>NETWORK STATUS</Typography>
               <Typography style={styles.barValue}>● ACTIVE SYNCHRONIZATION</Typography>
            </View>
            <TouchableOpacity style={styles.createBtn}>
               <Typography style={styles.createBtnText}>NEW PROJECT</Typography>
            </TouchableOpacity>
         </View>
      </View>
    </View>
  );
};

const RoomCard = ({ title, members, status, color, image }: any) => (
  <View style={styles.roomCard}>
    <Image source={{ uri: image }} style={styles.roomImage} />
    <View style={styles.roomOverlay}>
       <View style={[styles.statusBadge, { backgroundColor: color }]}>
          <Typography style={styles.statusBadgeText}>{status}</Typography>
       </View>
       <View>
          <Typography style={styles.roomTitle}>{title}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
             <Icon name="Users" size={14} color="#FFF" />
             <Typography style={styles.membersCount}>{members} ACTIVE</Typography>
          </View>
       </View>
    </View>
  </View>
);

const WorkshopItem = ({ title, time, host, rsvps, onPressHost }: any) => (
  <TouchableOpacity style={styles.workshopItem} onPress={onPressHost}>
     <View style={[styles.workshopIcon, { backgroundColor: '#FFEB3B' }]}>
        <Icon name="Calendar" size={24} color="#000" />
     </View>
     <View style={{ flex: 1, marginLeft: 20 }}>
        <Typography style={styles.workshopTitle}>{title}</Typography>
        <Typography style={styles.workshopMeta}>{time} • BY {host.toUpperCase()}</Typography>
     </View>
     <View style={styles.rsvpBadge}>
        <Typography style={styles.rsvpText}>{rsvps}</Typography>
     </View>
  </TouchableOpacity>
);

const ProjectCard = ({ name, stack, mission, role, onPress }: any) => (
  <TouchableOpacity style={styles.projectCard} onPress={onPress}>
     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
           <Typography style={styles.projNameText}>{name}</Typography>
           <Typography style={styles.projStackText}>{stack}</Typography>
        </View>
        <View style={styles.roleBadge}>
           <Typography style={styles.roleBadgeText}>{role}</Typography>
        </View>
     </View>
     <Typography style={styles.projMissionText}>
        {mission}
     </Typography>
     <View style={styles.projectFooter}>
        <View style={styles.priorityBox}>
           <Icon name="Zap" size={16} color="#000" />
           <Typography style={styles.priorityText}>HIGH PRIORITY</Typography>
        </View>
        <View style={styles.applySmallBtn}>
           <Typography style={styles.applyText}>APPLY</Typography>
        </View>
     </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerTitle: { fontSize: 36, fontWeight: '900', color: '#000', letterSpacing: -2 },
  addBtn: {
     width: 60,
     height: 60,
     borderRadius: 30,
     backgroundColor: '#FFF',
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 3,
     borderColor: '#000',
     elevation: 8,
     shadowColor: '#000',
     shadowOpacity: 1,
     shadowRadius: 0,
     shadowOffset: { width: 4, height: 4 }
  },
  scrollContent: { paddingBottom: 220 },
  section: { marginTop: 35, paddingHorizontal: 25 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#000', letterSpacing: -1 },
  seeAllText: { fontSize: 13, fontWeight: '900', color: '#000', textDecorationLine: 'underline' },
  horizontalScroll: { marginHorizontal: -25, paddingLeft: 25 },
  roomCard: {
    width: 260,
    height: 180,
    borderRadius: 35,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#000',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 }
  },
  roomImage: { ...StyleSheet.absoluteFillObject, opacity: 0.6 },
  roomOverlay: { ...StyleSheet.absoluteFillObject, padding: 25, justifyContent: 'space-between' },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 2, borderColor: '#000' },
  statusBadgeText: { color: '#000', fontWeight: '900', fontSize: 10 },
  roomTitle: { fontSize: 22, fontWeight: '900', color: '#FFF' },
  membersCount: { marginLeft: 8, color: '#FFF', fontWeight: '900', fontSize: 11 },
  workshopList: { gap: 20 },
  workshopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 }
  },
  workshopIcon: { width: 54, height: 54, borderRadius: 12, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center' },
  workshopTitle: { fontSize: 17, fontWeight: '900', color: '#000' },
  workshopMeta: { fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: '900', marginTop: 4 },
  rsvpBadge: { backgroundColor: '#FFEB3B', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, borderWidth: 2, borderColor: '#000' },
  rsvpText: { color: '#000', fontWeight: '900', fontSize: 14 },
  projectCard: {
    backgroundColor: '#FFF',
    borderRadius: 40,
    padding: 25,
    borderWidth: 4,
    borderColor: '#000',
    marginBottom: 25,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 10, height: 10 }
  },
  projNameText: { fontSize: 24, fontWeight: '900', color: '#000', letterSpacing: -1 },
  projStackText: { fontSize: 12, fontWeight: '900', color: '#2979FF', marginTop: 4 },
  roleBadge: { backgroundColor: '#00E676', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 2, borderColor: '#000' },
  roleBadgeText: { fontWeight: '900', fontSize: 10, color: '#000' },
  projMissionText: { fontSize: 16, color: '#444', marginTop: 20, fontWeight: '700', lineHeight: 22 },
  projectFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 25, paddingTop: 20, borderTopWidth: 2, borderTopColor: '#000', borderStyle: 'dashed' },
  priorityBox: { flexDirection: 'row', alignItems: 'center' },
  priorityText: { marginLeft: 10, color: '#000', fontWeight: '900', fontSize: 11 },
  applySmallBtn: { backgroundColor: '#000', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  applyText: { color: '#FFF', fontWeight: '900', fontSize: 13 },
  bottomBar: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#000',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 10 }
  },
  barInner: { padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  barMeta: { flex: 1 },
  barLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(0,0,0,0.4)', letterSpacing: 1 },
  barValue: { fontSize: 12, fontWeight: '900', color: '#00E676', marginTop: 2 },
  createBtn: { backgroundColor: '#000', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 25 },
  createBtnText: { color: '#FFF', fontWeight: '900', fontSize: 14 }
});
