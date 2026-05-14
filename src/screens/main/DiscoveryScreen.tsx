import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
  Platform,
  Dimensions,
  TextInput,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInUp, SlideInRight } from 'react-native-reanimated';
import { Plus, X, Search, Sparkles, Code, Palette, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, radius, spacing } from '../../theme/colors';
import { Typography } from '../../components/Typography';

const { width } = Dimensions.get('window');

const DISCOVERY_DATA = [
  {
    id: '1',
    section: 'Suggested Squads',
    name: 'kamskry',
    avatar: 'https://i.pravatar.cc/150?u=10',
    role: 'UI/UX DESIGNER',
    time: '2H AGO',
    badge: '🎨',
  },
  {
    id: '2',
    section: 'Recently Joined',
    name: 'artem',
    avatar: 'https://i.pravatar.cc/150?u=11',
    role: 'FULLSTACK DEV',
    time: '5M AGO',
    badge: '💻',
  },
  {
    id: '3',
    section: 'All Builders',
    name: 'arp_misha',
    avatar: 'https://i.pravatar.cc/150?u=12',
    role: 'AI ENGINEER',
    time: 'JUST NOW',
    badge: '🤖',
  },
  {
    id: '4',
    section: 'All Builders',
    name: 'raffazerbaizan',
    avatar: 'https://i.pravatar.cc/150?u=13',
    role: 'PRODUCT LEAD',
    time: '3 HOURS AGO',
    badge: '🚀',
  },
  {
    id: '5',
    section: 'All Builders',
    name: 'mohosin',
    avatar: 'https://i.pravatar.cc/150?u=14',
    role: 'MOTION DESIGNER',
    time: '1 DAY AGO',
    badge: '🎬',
  },
];

const SKILL_CLUSTERS = [
  { id: '1', name: 'Design', icon: '🎨', count: 124 },
  { id: '2', name: 'Dev', icon: '💻', count: 89 },
  { id: '3', name: 'AI', icon: '🤖', count: 45 },
  { id: '4', name: 'Product', icon: '🚀', count: 32 },
];

export const DiscoveryScreen = () => {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const map = new Map();
    DISCOVERY_DATA.forEach((item) => {
      if (!map.has(item.section)) map.set(item.section, []);
      map.get(item.section).push(item);
    });
    return Array.from(map.entries());
  }, []);

  const renderSection = ([title, items]: [string, any[]], sectionIndex: number) => (
    <View key={title} style={styles.sectionContainer}>
      <Typography style={styles.sectionTitle}>{title}</Typography>
      {items.map((item, index) => (
        <Animated.View 
          key={item.id} 
          entering={FadeInUp.delay(sectionIndex * 150 + index * 50)}
          style={styles.builderRow}
        >
          <View style={styles.badgeContainer}>
             <Typography style={styles.badgeEmoji}>{item.badge}</Typography>
          </View>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <View style={styles.builderInfo}>
            <Typography style={styles.userName}>@{item.name}</Typography>
            <Typography style={styles.userRole}>
              {item.role} {item.time ? `• ${item.time}` : ''}
            </Typography>
          </View>
          <Pressable style={styles.miniConnect}>
             <Plus size={16} color="#FFF" />
          </Pressable>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Premium Pink Gradient Banner */}
      <Animated.View entering={FadeIn.delay(200)}>
        <LinearGradient
          colors={['#FF00CC', '#333399']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.matchBanner}
        >
          <View style={styles.matchContent}>
            <Sparkles size={20} color="#FFF" />
            <Typography style={styles.matchText}>AI SQUAD MATCHING</Typography>
            <View style={styles.matchBadge}>
               <Typography style={styles.matchPercentage}>98%</Typography>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)}>
          <View style={styles.header}>
            <Typography style={styles.mainTitle}>Discovery</Typography>
            
            {/* Skill Clusters Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.clusterScroll}>
              {SKILL_CLUSTERS.map((cluster, idx) => (
                <Animated.View 
                  key={cluster.id} 
                  entering={SlideInRight.delay(idx * 100)}
                  style={styles.clusterItem}
                >
                   <Typography style={styles.clusterEmoji}>{cluster.icon}</Typography>
                   <View style={styles.clusterBadge}>
                      <Typography style={styles.clusterCount}>{cluster.count}</Typography>
                   </View>
                   <Typography style={styles.clusterName}>{cluster.name}</Typography>
                </Animated.View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.searchContainer}>
             <Search size={18} color="#666" />
             <TextInput 
                placeholder="Search by skill or username"
                placeholderTextColor="#666"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
             />
          </View>

          {sections.map((section, index) => renderSection(section, index))}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  matchBanner: {
    marginHorizontal: 24,
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    borderRadius: 50, // Ultra smooth
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // Glow effect
    shadowColor: '#FF00CC',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  matchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  matchText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  matchBadge: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  matchPercentage: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 150,
  },
  header: {
    marginBottom: 32,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 24,
  },
  clusterScroll: {
    flexDirection: 'row',
  },
  clusterItem: {
    alignItems: 'center',
    marginRight: 28,
    position: 'relative',
  },
  clusterEmoji: {
    fontSize: 34,
  },
  clusterBadge: {
    position: 'absolute',
    top: 24,
    right: -4,
    backgroundColor: '#FF00CC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
  },
  clusterCount: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  clusterName: {
    color: '#999',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 14,
    textTransform: 'uppercase',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderRadius: 32, // Smoother
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 36,
  },
  sectionTitle: {
    color: '#555',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  builderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  badgeContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 14,
  },
  badgeEmoji: {
    fontSize: 26,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 14,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
  },
  builderInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  userRole: {
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  miniConnect: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
});
