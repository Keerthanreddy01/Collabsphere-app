import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, View, Dimensions, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { 
  FadeInUp, 
  FadeInDown,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  createAnimatedComponent
} from 'react-native-reanimated';
import * as Lucide from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { CollabProject } from '../../types';
import { mockProjects } from '../../data/mockBuilders';

const { width } = Dimensions.get('window');
const AnimatedPressable = createAnimatedComponent(Pressable);

const ProjectCard = ({ item, index }: { item: CollabProject; index: number }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  // Create fake avatars based on teamSize
  const avatars = Array.from({ length: Math.min(item.teamSize, 3) }).map((_, i) => 
    `https://i.pravatar.cc/100?u=${item.id}${i}`
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open': return '#34C759'; // iOS Green
      case 'in progress': return '#FF9500'; // iOS Orange
      default: return '#0A84FF'; // iOS Blue
    }
  };

  const statusColor = getStatusColor(item.status);

  return (
    <Animated.View entering={FadeInUp.delay(index * 100).springify().damping(20).stiffness(120)}>
      <AnimatedPressable 
        style={[styles.cardWrapper, animatedStyle]}
        onPressIn={() => scale.value = withSpring(0.96, { damping: 15, stiffness: 300 })}
        onPressOut={() => scale.value = withSpring(1, { damping: 15, stiffness: 300 })}
      >
        <View style={styles.cardContainer}>
          {/* Subtle Accent Glow */}
          <View style={[styles.accentGlow, { backgroundColor: statusColor }]} />

          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <View style={[styles.statusDot, { backgroundColor: statusColor, shadowColor: statusColor }]} />
              <Typography style={styles.cardTitle} numberOfLines={1}>{item.name}</Typography>
            </View>
            <View style={[styles.statusBadge, { borderColor: statusColor + '40' }]}>
              <Typography style={[styles.statusText, { color: statusColor }]}>{item.status}</Typography>
            </View>
          </View>

          <Typography style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Typography>

          <View style={styles.tagsContainer}>
            {item.stack.slice(0, 4).map((tech, i) => (
              <View key={i} style={styles.tag}>
                <Typography style={styles.tagText}>{tech}</Typography>
              </View>
            ))}
            {item.stack.length > 4 && (
              <View style={styles.tag}>
                <Typography style={styles.tagText}>+{item.stack.length - 4}</Typography>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.teamContainer}>
              {avatars.map((uri, i) => (
                <Image 
                  key={i}
                  source={{ uri }} 
                  style={[styles.avatar, { marginLeft: i > 0 ? -12 : 0, zIndex: 10 - i }]} 
                />
              ))}
              {item.teamSize > 3 && (
                <View style={[styles.avatarRemain, { marginLeft: -12, zIndex: 1 }]}>
                  <Typography style={styles.avatarRemainText}>+{item.teamSize - 3}</Typography>
                </View>
              )}
            </View>

            <View style={styles.joinButton}>
              <Typography style={styles.joinText}>Review</Typography>
              <Lucide.ChevronRight size={16} color="#000000" />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const CollabBoardScreen = () => {
  const insets = useSafeAreaInsets();
  const data = useMemo(() => mockProjects, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" translucent={true} />
      
      <Animated.View entering={FadeInDown.duration(400)} style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <View style={styles.headerContent}>
          <Typography style={styles.headerTitle}>Board</Typography>
          <Pressable style={styles.createButton}>
            <LinearGradient
              colors={['#0A84FF', '#0055FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.createGradient}
            >
              <Lucide.Plus size={20} color="#FFF" />
              <Typography style={styles.createText}>New</Typography>
            </LinearGradient>
          </Pressable>
        </View>
        <Typography style={styles.headerSubtitle}>Discover active projects & collaborators</Typography>
      </Animated.View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ProjectCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBF0',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    zIndex: 10,
    backgroundColor: '#EBEBF0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000000',
    letterSpacing: -1.5,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: -0.2,
  },
  createButton: {
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  createText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 16,
  },
  cardWrapper: {
    width: '100%',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  accentGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(0,0,0,0.6)',
    lineHeight: 22,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarRemain: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRemainText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.6)',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  joinText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
