import React, { useState, useEffect, useCallback, memo } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Dimensions,
  StatusBar,
  Platform,
  InteractionManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Briefcase, ChevronRight, Zap, Target, Layout } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Typography } from '../components/Typography';
import { useTheme } from '../context/ThemeContext';
import { projectStorage } from '../storage/projectStorage';
import { Project } from '../types';

const { width } = Dimensions.get('window');

// ─── Memoized StatCard ──────────────────────────────────────────────
const StatCard = memo(({ label, value, icon, color }: any) => (
  <View style={[styles.statCard, { backgroundColor: '#FFF' }]}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>{icon}</View>
    <View style={{ marginTop: 14 }}>
      <Typography style={styles.statValue}>{value}</Typography>
      <Typography style={styles.statLabel}>{label}</Typography>
    </View>
  </View>
));

// ─── Memoized ProjectCard ────────────────────────────────────────────
const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => (
  <Animated.View
    entering={FadeInDown.delay(Math.min(index * 100, 400)).springify().damping(20)}
    style={styles.projectCard}
  >
    <View style={styles.cardHeader}>
      <View style={styles.pIconBg}>
        <Layout size={30} color="#000" />
      </View>
      <View style={{ flex: 1, marginLeft: 16 }}>
        <Typography style={styles.projName}>{project.name.toUpperCase()}</Typography>
        <Typography style={styles.founderName}>by @{project.founderId.toLowerCase()}</Typography>
      </View>
      <View
        style={[
          styles.priorityBadge,
          {
            backgroundColor: project.priority === 'High' ? '#FF1744' : '#00E676',
            borderWidth: 2,
            borderColor: '#000',
          },
        ]}
      >
        <Typography style={styles.priorityText}>{project.priority}</Typography>
      </View>
    </View>

    <Typography style={styles.projDesc}>{project.description}</Typography>

    <View style={styles.tagRow}>
      {project.stack.map((s) => (
        <View key={s} style={styles.tag}>
          <Typography style={styles.tagText}>#{s.toUpperCase()}</Typography>
        </View>
      ))}
      <View style={[styles.tag, { backgroundColor: '#FFF', borderColor: '#000' }]}>
        <Typography style={[styles.tagText, { color: '#000', fontWeight: '900' }]}>
          SERIES A
        </Typography>
      </View>
    </View>

    <TouchableOpacity style={styles.missionBtn} activeOpacity={0.85}>
      <Typography style={styles.missionBtnText}>JOIN MISSION</Typography>
      <ChevronRight size={20} color="#000" />
    </TouchableOpacity>
  </Animated.View>
));

// ─── Main Screen ────────────────────────────────────────────────────
export const IncubatorScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(async () => {
      const data = await projectStorage.getProjects();
      setProjects(data);
    });
    return () => task.cancel();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Typography style={styles.headerTitle}>INCUBATOR</Typography>
            <Typography style={styles.headerSub}>BUILDING THE NEXT UNICORN</Typography>
          </View>
          <TouchableOpacity style={styles.targetBtn} activeOpacity={0.85}>
            <Target size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          decelerationRate="fast"
        >
          <View style={styles.statsRow}>
            <StatCard
              label="Live Missions"
              value={projects.length.toString()}
              icon={<Zap size={22} color="#000" />}
              color="#2979FF"
            />
            <StatCard
              label="Pipeline"
              value="156"
              icon={<Briefcase size={22} color="#000" />}
              color="#FF1744"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Typography style={styles.sectionTitle}>RECOMMENDED SQUADS</Typography>
              <TouchableOpacity activeOpacity={0.85}>
                <Typography style={styles.seeAll}>SEE ALL</Typography>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
  },
  headerTitle: { fontSize: 36, fontWeight: '900', color: '#000', letterSpacing: -2 },
  headerSub: {
    fontSize: 12,
    color: '#000',
    opacity: 0.5,
    fontWeight: '900',
    marginTop: 2,
    letterSpacing: 1,
  },
  targetBtn: {
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
  statsRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 25, marginTop: 10 },
  statCard: {
    flex: 1,
    padding: 22,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  statValue: { fontSize: 30, fontWeight: '900', color: '#000', letterSpacing: -1 },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { marginTop: 32 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 18,
  },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#000', letterSpacing: -1 },
  seeAll: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000',
    textDecorationLine: 'underline',
  },
  projectCard: {
    marginHorizontal: 25,
    padding: 22,
    borderRadius: 38,
    backgroundColor: '#FFF',
    marginBottom: 22,
    borderWidth: 4,
    borderColor: '#000',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 },
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  pIconBg: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#FFEB3B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  projName: { fontSize: 19, fontWeight: '900', color: '#000' },
  founderName: { fontSize: 11, color: 'rgba(0,0,0,0.4)', fontWeight: '800', marginTop: 2 },
  priorityBadge: { paddingHorizontal: 11, paddingVertical: 6, borderRadius: 10 },
  priorityText: { fontSize: 10, fontWeight: '900' },
  projDesc: { fontSize: 15, color: '#444', lineHeight: 21, marginTop: 20, fontWeight: '700' },
  tagRow: { flexDirection: 'row', gap: 10, marginTop: 22, flexWrap: 'wrap' },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#000',
  },
  tagText: { fontSize: 10, color: '#000', fontWeight: '900' },
  missionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    paddingTop: 18,
    borderTopWidth: 2,
    borderTopColor: '#000',
    borderStyle: 'dashed',
  },
  missionBtnText: { fontSize: 14, fontWeight: '900', color: '#000' },
});
