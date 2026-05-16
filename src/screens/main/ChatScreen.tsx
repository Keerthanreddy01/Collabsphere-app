import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSpring,
  FadeInUp,
  createAnimatedComponent,
  interpolate,
} from 'react-native-reanimated';
import { Pin } from 'lucide-react-native';
import { Typography } from '../../components/Typography';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

const JAMS = [
  {
    id: '1',
    tag: '/orb',
    authorName: 'nilesh',
    authorAvatar: 'https://i.pravatar.cc/100?u=nilesh',
    mainImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop',
    time: '12:56',
    message: 'Introducing Jams!\nIn this release:',
    unreadCount: 28,
    isPinned: true,
  },
  {
    id: '2',
    tag: '/aiart',
    authorName: 'artem',
    authorAvatar: 'https://i.pravatar.cc/100?u=artem',
    mainImage: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop',
    time: '1 min ago',
    message: 'reacted on your message',
    unreadCount: 5,
    mention: true,
  },
  {
    id: '3',
    tag: '/lens',
    authorName: 'mia',
    authorAvatar: 'https://i.pravatar.cc/100?u=mia',
    mainImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=200&auto=format&fit=crop',
    time: '37 min ago',
    message: 'Check out the new photo collection!\nShare your favorites and discuss...',
    unreadCount: 2,
  },
  {
    id: '4',
    tag: '/creators',
    authorName: 'michael',
    authorAvatar: 'https://i.pravatar.cc/100?u=michael',
    mainImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200&auto=format&fit=crop',
    time: '2 hours ago',
    message: 'Check out the latest collection and share\nyour thoughts with other collectors...',
    unreadCount: 1,
    mention: true,
  }
];

const DMS = [
  {
    id: '1',
    name: 'jacob',
    avatar: 'https://i.pravatar.cc/200?u=jacob',
    time: '1 min ago',
    unreadCount: 2,
  }
];

const AnimatedPressable = createAnimatedComponent(Pressable);

// Premium Glass Card Component
const JamCard = ({ item, index, navigation, isDM = false }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View entering={FadeInUp.delay(index * 150).springify().damping(18).stiffness(120)}>
      <AnimatedPressable 
        style={[styles.cardWrapper, animatedStyle]}
        onPressIn={() => scale.value = withSpring(0.96, { damping: 15, stiffness: 200 })}
        onPressOut={() => scale.value = withSpring(1, { damping: 15, stiffness: 200 })}
        onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, title: item.authorName || item.name })}
      >
        <BlurView intensity={35} tint="dark" style={styles.blurCard}>
          <View style={styles.cardInner}>
            
            {/* Left Image Section */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: isDM ? item.avatar : item.mainImage }} style={isDM ? styles.dmAvatar : styles.jamImage} />
              {!isDM && item.isPinned && (
                <View style={styles.pinBadge}>
                  <Pin size={12} color="#000" fill="#000" />
                </View>
              )}
            </View>

            {/* Content Section */}
            <View style={styles.cardContent}>
              {!isDM && (
                <View style={styles.cardHeaderRow}>
                  <Typography style={styles.tagText}>{item.tag}</Typography>
                  <Typography style={styles.timeText}>{item.time}</Typography>
                </View>
              )}
              
              {isDM && (
                <View style={[styles.cardHeaderRow, { marginBottom: 8 }]}>
                  <Typography style={styles.authorName}>{item.name}</Typography>
                  <Typography style={styles.timeText}>{item.time}</Typography>
                </View>
              )}

              {!isDM && (
                <View style={styles.authorRow}>
                  <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                  <Typography style={styles.authorName}>{item.authorName}</Typography>
                </View>
              )}

              {!isDM ? (
                <Typography style={styles.messageText} numberOfLines={2}>
                  {item.message}
                </Typography>
              ) : (
                <View style={styles.placeholderLines}>
                  <View style={styles.placeholderLine} />
                  <View style={[styles.placeholderLine, { width: '60%' }]} />
                </View>
              )}
            </View>

            {/* Badges */}
            <View style={styles.badgesWrapper}>
              {item.unreadCount > 0 && (
                <LinearGradient
                  colors={['#FF4B2B', '#FF416C']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBadge}
                >
                  <Typography style={styles.badgeText}>{item.unreadCount}</Typography>
                </LinearGradient>
              )}
              {item.mention && (
                <LinearGradient
                  colors={['#8A2BE2', '#FF69B4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBadge}
                >
                  <Typography style={styles.badgeText}>@</Typography>
                </LinearGradient>
              )}
            </View>
          </View>
        </BlurView>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const ChatScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  // Background animation
  const time = useSharedValue(0);
  useEffect(() => {
    time.value = withRepeat(withTiming(2 * Math.PI, { duration: 15000 }), -1, false);
  }, []);

  const orb1Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.sin(time.value) * 50 },
      { translateY: Math.cos(time.value) * 30 },
      { scale: interpolate(Math.sin(time.value), [-1, 1], [0.9, 1.1]) }
    ]
  }));

  const orb2Style = useAnimatedStyle(() => ({
    transform: [
      { translateX: Math.cos(time.value) * -40 },
      { translateY: Math.sin(time.value) * 60 },
      { scale: interpolate(Math.cos(time.value), [-1, 1], [0.8, 1.2]) }
    ]
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Animated Background Mesh */}
      <View style={StyleSheet.absoluteFill}>
        <Animated.View style={[styles.orb1, orb1Style]}>
          <LinearGradient colors={['#FF3B30', '#FF9500']} style={StyleSheet.absoluteFill} />
        </Animated.View>
        <Animated.View style={[styles.orb2, orb2Style]}>
          <LinearGradient colors={['#E50000', '#8A2BE2']} style={StyleSheet.absoluteFill} />
        </Animated.View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 50) }]}
      >
        <Animated.View entering={FadeInUp.delay(50).springify()}>
          <Typography style={styles.headerTitle}>My Jams</Typography>
        </Animated.View>

        <View style={styles.listContainer}>
          {JAMS.map((jam, index) => (
            <JamCard key={jam.id} item={jam} index={index} navigation={navigation} />
          ))}
        </View>

        <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.dmDividerSection}>
          <LinearGradient
            colors={['#FF8E53', '#FF6B6B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.soonBadge}
          >
            <Typography style={styles.soonText}>SOON</Typography>
          </LinearGradient>
          <Typography style={styles.dmTitle}>DM</Typography>
        </Animated.View>

        <View style={styles.listContainer}>
          {DMS.map((dm, index) => (
            <JamCard key={dm.id} item={dm} index={index + JAMS.length} navigation={navigation} isDM={true} />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', 
  },
  orb1: {
    position: 'absolute',
    top: -50,
    left: -100,
    width: width * 1.5,
    height: 400,
    borderRadius: width,
    opacity: 0.45,
    filter: 'blur(60px)', // Web/Newer RN support, otherwise opacity drives it
  },
  orb2: {
    position: 'absolute',
    top: 200,
    right: -100,
    width: width,
    height: 400,
    borderRadius: width / 2,
    opacity: 0.35,
    filter: 'blur(80px)',
  },
  scrollContent: {
    paddingBottom: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    letterSpacing: -1,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  cardWrapper: {
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  blurCard: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Darken the blur slightly
  },
  cardInner: {
    flexDirection: 'row',
    padding: 16,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  jamImage: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: '#222',
  },
  dmAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#222',
  },
  pinBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#1A1A1A', // Match dark bg slightly
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  authorName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  messageText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  badgesWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    gap: 8,
  },
  gradientBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#FF416C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  dmDividerSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  soonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  soonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  dmTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    opacity: 0.9,
  },
  placeholderLines: {
    gap: 10,
    marginTop: 8,
  },
  placeholderLine: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 4,
    width: '85%',
  },
});
