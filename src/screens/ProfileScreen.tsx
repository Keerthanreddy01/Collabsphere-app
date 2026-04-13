import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Typography } from '../components/Typography';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string;[key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const APP_STACK = [
  { name: 'React Native', level: 90, icon: 'Layout' },
  { name: 'Rust', level: 75, icon: 'Cpu' },
  { name: 'TypeScript', level: 95, icon: 'Code2' },
];

export const ProfileScreen = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#F7F6F2' }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?w=800' }}
          style={styles.coverArea}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent', '#F7F6F2']}
            style={StyleSheet.absoluteFill}
          />

          <SafeAreaView style={styles.headerNav}>
            <TouchableOpacity style={styles.headerCircleBtn}>
              <Icon name="ChevronLeft" color="#FFFFFF" size={24} />
            </TouchableOpacity>
            <Typography variant="bodyBold" color="rgba(255,255,255,0.9)" style={{ letterSpacing: 1 }}>
              @keerthan
            </Typography>
            <TouchableOpacity style={styles.headerCircleBtn}>
               <Icon name="Settings" color="#FFFFFF" size={24} />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        {/* PROFILE CONTENT */}
        <View style={styles.detailsContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }}
              style={styles.avatar}
            />
            <View style={styles.activeDot} />
          </View>

          <View style={styles.titleSection}>
            <Typography style={styles.nameText}>
              Keerthan Reddy
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
          </View>

          <View style={[styles.card, { marginTop: 40 }]}>
            <Typography style={styles.cardLabel}>The Arsenal</Typography>
            <View style={styles.stackList}>
              {APP_STACK.map((item, idx) => (
                <View key={idx} style={styles.stackItemCard}>
                  <View style={styles.stackIconOuter}>
                    <Icon name={item.icon} size={20} color="#000" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 16 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                       <Typography style={styles.stackName}>{item.name}</Typography>
                       <Typography style={styles.stackLevel}>{item.level}%</Typography>
                    </View>
                    <View style={styles.progressPath}>
                       <View style={[styles.progressFill, { width: `${item.level}%` }]} />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.primaryAction}>
             <Typography style={styles.btnText}>Network Request</Typography>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
};

const StatText = ({ count, label }: any) => (
  <View style={{ alignItems: 'center' }}>
    <Typography style={styles.statCount}>{count}</Typography>
    <Typography style={styles.statLabel}>{label}</Typography>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 150 },
  coverArea: { width: width, height: 400, justifyContent: 'flex-start' },
  headerNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 10,
  },
  headerCircleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailsContainer: {
    backgroundColor: '#F7F6F2',
    marginTop: -80,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 24,
  },
  avatarWrapper: {
    alignSelf: 'center',
    top: -60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#F7F6F2',
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
    borderColor: '#F7F6F2',
  },
  titleSection: { marginTop: -40, alignItems: 'center' },
  nameText: { fontSize: 32, fontWeight: '900', color: '#000', letterSpacing: -1 },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    backgroundColor: '#FFF',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.05)', marginHorizontal: 20 },
  statCount: { fontSize: 18, fontWeight: '800', color: '#000' },
  statLabel: { fontSize: 10, color: 'rgba(0,0,0,0.3)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  bio: { marginTop: 20, textAlign: 'center', color: 'rgba(0,0,0,0.4)', lineHeight: 22, fontWeight: '600', fontSize: 15 },
  card: { backgroundColor: '#FFF', borderRadius: 32, padding: 24, elevation: 2, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 8 },
  cardLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(0,0,0,0.2)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 20 },
  stackList: { gap: 16 },
  stackItemCard: { flexDirection: 'row', alignItems: 'center' },
  stackIconOuter: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#F7F6F2', justifyContent: 'center', alignItems: 'center' },
  stackName: { fontSize: 15, fontWeight: '800', color: '#000' },
  stackLevel: { fontSize: 12, fontWeight: '700', color: '#6193F5' },
  progressPath: { height: 6, backgroundColor: '#F7F6F2', borderRadius: 3, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#6193F5', borderRadius: 3 },
  primaryAction: {
    height: 64,
    borderRadius: 32,
    backgroundColor: '#000',
    marginTop: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  btnText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});
