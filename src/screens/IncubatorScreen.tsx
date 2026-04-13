import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, Users, Layout, ChevronRight, Zap, Target } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';
import { projectStorage } from '../storage/projectStorage';
import { Project } from '../types';

const { width } = Dimensions.get('window');

export const IncubatorScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await projectStorage.getProjects();
      setProjects(data);
    };
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: '#F7F6F2' }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
           <View style={{ flex: 1 }}>
              <Typography style={styles.headerTitle}>Startup Incubator</Typography>
              <Typography style={styles.headerSub}>Building the next unicorn</Typography>
           </View>
           <TouchableOpacity style={styles.targetBtn}>
              <Target size={20} color="#000" />
           </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
           <View style={styles.statsRow}>
              <StatCard label="Live Missions" value={projects.length.toString()} icon={<Zap size={20} color="#6193F5" />} />
              <StatCard label="Pipeline" value="156" icon={<Briefcase size={20} color="#F59E0B" />} />
           </View>

           <View style={styles.section}>
              <View style={styles.sectionHeader}>
                 <Typography style={styles.sectionTitle}>Recommended Squads</Typography>
                 <TouchableOpacity>
                    <Typography style={styles.seeAll}>See All</Typography>
                 </TouchableOpacity>
              </View>
              {projects.map((proj, idx) => (
                <ProjectCard key={proj.id} project={proj} index={idx} />
              ))}
           </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const StatCard = ({ label, value, icon }: any) => {
  return (
    <View style={styles.statCard}>
       <View style={styles.iconBox}>{icon}</View>
       <View style={{ marginTop: 15 }}>
          <Typography style={styles.statValue}>{value}</Typography>
          <Typography style={styles.statLabel}>{label}</Typography>
       </View>
    </View>
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.projectCard}>
       <View style={styles.cardHeader}>
          <View style={styles.pIconBg}>
             <Layout size={24} color="#000" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
             <Typography style={styles.projName}>{project.name}</Typography>
             <Typography style={styles.founderName}>by {project.founderId}</Typography>
          </View>
          <View style={[styles.priorityBadge, { backgroundColor: project.priority === 'High' ? '#FEE2E2' : '#F7F6F2' }]}>
             <Typography style={[styles.priorityText, { color: project.priority === 'High' ? '#EF4444' : 'rgba(0,0,0,0.3)' }]}>{project.priority}</Typography>
          </View>
       </View>

       <Typography style={styles.projDesc}>
          {project.description}
       </Typography>

       <View style={styles.tagRow}>
          {project.stack.map(s => (
             <View key={s} style={styles.tag}>
                <Typography style={styles.tagText}>{s}</Typography>
             </View>
          ))}
          <View style={[styles.tag, { backgroundColor: '#EAFF8C', borderColor: '#EAFF8C' }]}>
             <Typography style={[styles.tagText, { color: '#000', fontWeight: '800' }]}>SERIES A</Typography>
          </View>
       </View>

       <TouchableOpacity style={styles.missionBtn}>
          <Typography style={styles.missionBtnText}>Join Mission</Typography>
          <ChevronRight size={18} color="#000" />
       </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 24, 
    paddingVertical: 20 
  },
  headerTitle: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
  headerSub: { fontSize: 13, color: 'rgba(0,0,0,0.3)', fontWeight: '700', marginTop: 2 },
  targetBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statsRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 24, marginTop: 12 },
  statCard: { 
    flex: 1, 
    padding: 24, 
    borderRadius: 32, 
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: '#F7F6F2', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  statValue: { fontSize: 28, fontWeight: '900', color: '#000' },
  statLabel: { fontSize: 11, fontWeight: '700', color: 'rgba(0,0,0,0.2)', textTransform: 'uppercase', letterSpacing: 1 },
  section: { marginTop: 35 },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'baseline', 
    paddingHorizontal: 24, 
    marginBottom: 20 
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#000' },
  seeAll: { fontSize: 13, fontWeight: '700', color: '#6193F5' },
  projectCard: { 
    marginHorizontal: 24, 
    padding: 24, 
    borderRadius: 36, 
    backgroundColor: '#FFF', 
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  pIconBg: { 
    width: 54, 
    height: 54, 
    borderRadius: 18, 
    backgroundColor: '#F7F6F2', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  projName: { fontSize: 17, fontWeight: '800', color: '#000' },
  founderName: { fontSize: 12, color: 'rgba(0,0,0,0.3)', fontWeight: '600' },
  priorityBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  priorityText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  projDesc: { fontSize: 15, color: '#4B5563', lineHeight: 22, marginTop: 20, fontWeight: '500' },
  tagRow: { flexDirection: 'row', gap: 8, marginTop: 22, flexWrap: 'wrap' },
  tag: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 12, 
    backgroundColor: '#F7F6F2',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  tagText: { fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: '800' },
  missionBtn: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 25, 
    paddingTop: 20, 
    borderTopWidth: 1, 
    borderTopColor: '#F3F4F6' 
  },
  missionBtnText: { fontSize: 15, fontWeight: '800', color: '#000' }
});
