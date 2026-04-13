import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Image 
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
    <View style={styles.container}>
      {/* Background Mesh */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#000000' }} />
        <LinearGradient 
          colors={['rgba(59, 130, 246, 0.05)', 'transparent']} 
          style={{ position: 'absolute', width: width, height: 400 }} 
        />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
           <Typography variant="h1" color="#FFFFFF" style={{ fontSize: 32 }}>Incubator</Typography>
           <TouchableOpacity style={styles.addBtn}>
              <Icon name="Plus" color="#FFFFFF" size={24} />
           </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
           
           {/* Section 1: Active Collab Rooms */}
           <View style={styles.section}>
              <View style={styles.sectionHeader}>
                 <Typography variant="bodyBold" color="#FFFFFF">Collab Rooms</Typography>
                 <Typography variant="caption" color="#3B82F6">View All</Typography>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                 <RoomCard 
                   title="Nexus Protocol" 
                   members={12} 
                   status="Deep Work" 
                   color="#3B82F6"
                   image="https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=400"
                 />
                 <RoomCard 
                   title="Quantum ML" 
                   members={5} 
                   status="Code Review" 
                   color="#8B5CF6"
                   image="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"
                 />
              </ScrollView>
           </View>

           {/* Section 2: Technical Workshops */}
           <View style={styles.section}>
             <View style={styles.sectionHeader}>
                 <Typography variant="bodyBold" color="#FFFFFF">Upcoming Workshops</Typography>
                 <Typography variant="caption" color="rgba(255,255,255,0.4)">Syncs with Google Cal</Typography>
              </View>
              <View style={styles.workshopList}>
                 <WorkshopItem 
                    title="Rust Memory Safety Patterns" 
                    time="Today, 6:00 PM"
                    host="Alex_Dev"
                    rsvps={142}
                    onPressHost={() => navigation.navigate('Chat', { name: 'Alex_Dev' })}
                 />
                 <WorkshopItem 
                    title="Scaling LLMs with QLoRA" 
                    time="Tomorrow, 10:00 AM"
                    host="Marcus_AI"
                    rsvps={289}
                    onPressHost={() => navigation.navigate('Chat', { name: 'Marcus_AI' })}
                 />
              </View>
           </View>

           {/* Section 3: Open Roles (Recruitment) */}
           <View style={styles.section}>
             <View style={styles.sectionHeader}>
                 <Typography variant="bodyBold" color="#FFFFFF">Open Missions</Typography>
                 <Typography variant="caption" color="#10B981">Recruiting</Typography>
              </View>
              
              <ProjectCard 
                name="AroMi Frontend"
                stack="React Native • Reanimated"
                mission="Building a world-class health companion for rural regions."
                role="Lead UI/UX Builder"
                onPress={() => navigation.navigate('Chat', { name: 'AroMi Team' })}
              />

              <ProjectCard 
                name="ChainLink Bridge"
                stack="Solidity • Rust"
                mission="Trustless cross-chain asset migration protocol."
                role="Smart Contract Dev"
                onPress={() => navigation.navigate('Chat', { name: 'ChainLink Team' })}
              />
           </View>
        </ScrollView>
      </SafeAreaView>
      
      {/* Strategic Floating Action Bar */}
      <View style={styles.bottomBar}>
         <LinearGradient colors={['#111', '#000']} style={styles.barInner}>
            <View style={styles.barMeta}>
               <Typography variant="caption" color="rgba(255,255,255,0.5)">Recruitment Status</Typography>
               <Typography variant="bodyBold" color="#10B981">● ACTIVE</Typography>
            </View>
            <TouchableOpacity style={styles.applyBtn}>
               <Typography variant="bodyBold" color="#000">Create Project</Typography>
            </TouchableOpacity>
         </LinearGradient>
      </View>
    </View>
  );
};

const RoomCard = ({ title, members, status, color, image }: any) => (
  <View style={styles.roomCard}>
    <Image source={{ uri: image }} style={styles.roomImage} />
    <View style={styles.roomOverlay}>
       <View style={[styles.statusBadge, { backgroundColor: color }]}>
          <Typography variant="caption" color="#FFFFFF" style={{ fontWeight: '900', fontSize: 8 }}>{status}</Typography>
       </View>
       <View>
          <Typography variant="bodyBold" color="#FFFFFF" style={{ fontSize: 16 }}>{title}</Typography>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
             <Icon name="Users" size={12} color="rgba(255,255,255,0.6)" />
             <Typography variant="caption" color="rgba(255,255,255,0.6)" style={{ marginLeft: 6 }}>{members} Active</Typography>
          </View>
       </View>
    </View>
  </View>
);

const WorkshopItem = ({ title, time, host, rsvps, onPressHost }: any) => (
  <TouchableOpacity style={styles.workshopItem} onPress={onPressHost}>
     <View style={styles.workshopIcon}>
        <Icon name="Calendar" size={20} color="#3B82F6" />
     </View>
     <View style={{ flex: 1, marginLeft: 16 }}>
        <Typography variant="bodyBold" color="#FFFFFF">{title}</Typography>
        <Typography variant="caption" color="rgba(255,255,255,0.4)">{time} • Hosted by {host}</Typography>
     </View>
     <View style={styles.rsvpBadge}>
        <Typography variant="caption" color="#FFFFFF" style={{ fontWeight: '800' }}>{rsvps}</Typography>
     </View>
  </TouchableOpacity>
);

const ProjectCard = ({ name, stack, mission, role, onPress }: any) => (
  <TouchableOpacity style={styles.projectCard} onPress={onPress}>
     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
           <Typography variant="h3" color="#FFFFFF">{name}</Typography>
           <Typography variant="caption" color="#3B82F6" style={{ marginTop: 2 }}>{stack}</Typography>
        </View>
        <View style={styles.roleBadge}>
           <Typography variant="caption" color="#10B981" style={{ fontWeight: '900', fontSize: 10 }}>{role}</Typography>
        </View>
     </View>
     <Typography variant="body" color="rgba(255,255,255,0.6)" style={{ marginTop: 12 }}>
        {mission}
     </Typography>
     <View style={styles.projectFooter}>
        <View style={styles.stackIcons}>
           <Icon name="Zap" size={14} color="#F59E0B" />
           <Typography variant="caption" color="#F59E0B" style={{ marginLeft: 6 }}>High Priority</Typography>
        </View>
        <View style={styles.applySmall}>
           <Typography variant="caption" color="#000" style={{ fontWeight: '900' }}>Apply</Typography>
        </View>
     </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  addBtn: {
     width: 48,
     height: 48,
     borderRadius: 24,
     backgroundColor: 'rgba(255,255,255,0.1)',
     justifyContent: 'center',
     alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 180,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  horizontalScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  roomCard: {
    width: 220,
    height: 140,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  roomImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  roomOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    justifyContent: 'space-between',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  workshopList: {
    gap: 12,
  },
  workshopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  workshopIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rsvpBadge: {
     backgroundColor: '#3B82F6',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 10,
  },
  projectCard: {
    backgroundColor: '#111111',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 16,
  },
  roleBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  stackIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applySmall: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 120, // Sit above the nav bar
    width: width - 40,
    left: 20,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  barInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  barMeta: {
    justifyContent: 'center',
  },
  applyBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  }
});
