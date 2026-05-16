import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSpring,
  FadeInUp,
  FadeInRight,
  createAnimatedComponent,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Search, Edit3, CheckCheck, MoreHorizontal } from 'lucide-react-native';
import { Typography } from '../../components/Typography';
import { RootStackParamList } from '../../types';

const { width } = Dimensions.get('window');

const JAMS_DATA = [
  {
    id: '1',
    name: 'Elena Rostova',
    avatar: 'https://i.pravatar.cc/200?u=elena',
    lastMessage: 'Are we still on for the design review tomorrow?',
    time: '2m ago',
    unreadCount: 3,
    isOnline: true,
    isTyping: false,
    hasRead: false,
  },
  {
    id: '2',
    name: 'Marcus Chen',
    avatar: 'https://i.pravatar.cc/200?u=marcus',
    lastMessage: 'Typing...',
    time: 'Just now',
    unreadCount: 0,
    isOnline: true,
    isTyping: true,
    hasRead: false,
  },
  {
    id: '3',
    name: 'Sophia Patel',
    avatar: 'https://i.pravatar.cc/200?u=sophia',
    lastMessage: 'Sent the Figma files. Take a look when you can! 🎨',
    time: '1h ago',
    unreadCount: 1,
    isOnline: false,
    isTyping: false,
    hasRead: false,
  },
  {
    id: '4',
    name: 'Alex Rivera',
    avatar: 'https://i.pravatar.cc/200?u=alex',
    lastMessage: 'The new liquid navigation looks insane! 🚀',
    time: '3h ago',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    hasRead: true,
  },
  {
    id: '5',
    name: 'David Kim',
    avatar: 'https://i.pravatar.cc/200?u=david',
    lastMessage: 'Let me check the repository and get back to you.',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    hasRead: true,
  },
  {
    id: '6',
    name: 'Sarah Jenkins',
    avatar: 'https://i.pravatar.cc/200?u=sarah',
    lastMessage: 'Sounds good to me.',
    time: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
    isTyping: false,
    hasRead: true,
  }
];

const AnimatedPressable = createAnimatedComponent(Pressable);

// Bouncing Typing Dots Component
const TypingIndicator = () => {
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const bounce = () => withRepeat(
      withSequence(
        withTiming(-4, { duration: 300 }),
        withTiming(0, { duration: 300 }),
        withDelay(400, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );

    dot1.value = bounce();
    setTimeout(() => { dot2.value = bounce(); }, 150);
    setTimeout(() => { dot3.value = bounce(); }, 300);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.typingDot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

// Active Avatar Ring Component (Live Sync)
const ActiveRingAvatar = ({ avatar, name, isOnline, size = 56 }: any) => {
  const ringScale = useSharedValue(1);
  const ringOpacity = useSharedValue(0.4);

  useEffect(() => {
    if (isOnline) {
      ringScale.value = withRepeat(withTiming(1.15, { duration: 2500 }), -1, true);
      ringOpacity.value = withRepeat(withTiming(0, { duration: 2500 }), -1, true);
    }
  }, [isOnline]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  return (
    <View style={{ alignItems: 'center', width: size + 16 }}>
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', marginBottom: 8 }}>
        {isOnline && (
          <Animated.View style={[
            styles.avatarRing, 
            ringStyle, 
            { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2, top: -4, left: -4 }
          ]} />
        )}
        <Image 
          source={{ uri: avatar }} 
          style={{ width: size, height: size, borderRadius: size / 2 }} 
        />
        {/* Overlay Border to avoid pixelation issues on images */}
        <View style={[StyleSheet.absoluteFill, { borderRadius: size / 2, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }]} />
        
        {isOnline && <View style={styles.onlineBadge} />}
      </View>
      {name && (
        <Typography style={styles.activeName} numberOfLines={1}>{name.split(' ')[0]}</Typography>
      )}
    </View>
  );
};

// Premium Jam Card Component
const JamCard = ({ item, index, navigation }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Animated.View entering={FadeInUp.delay(index * 60).springify().damping(22).stiffness(150)}>
      <AnimatedPressable 
        style={[styles.jamCardWrapper, animatedStyle]}
        onPressIn={() => scale.value = withSpring(0.97, { damping: 15, stiffness: 300 })}
        onPressOut={() => scale.value = withSpring(1, { damping: 15, stiffness: 300 })}
        onPress={() => navigation.navigate('ChatDetail', { chatId: item.id, title: item.name })}
      >
        <View style={[styles.cardBg, item.unreadCount > 0 && styles.cardBgUnread]}>
          <View style={styles.cardInner}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: item.avatar }} style={styles.jamAvatar} />
              <View style={[StyleSheet.absoluteFill, { borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }]} />
              {item.isOnline && <View style={styles.onlineBadgeSmall} />}
            </View>

            <View style={styles.jamContent}>
              <View style={styles.jamHeader}>
                <Typography style={[styles.jamName, item.unreadCount > 0 && styles.jamNameUnread]}>{item.name}</Typography>
                <Typography style={[styles.jamTime, item.unreadCount > 0 && styles.jamTimeUnread]}>{item.time}</Typography>
              </View>

              <View style={styles.jamMessageRow}>
                {item.isTyping ? (
                  <View style={styles.typingWrapper}>
                    <Typography style={styles.typingText}>Typing</Typography>
                    <TypingIndicator />
                  </View>
                ) : (
                  <Typography 
                    style={[styles.jamMessage, item.unreadCount > 0 && styles.jamMessageUnread]} 
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Typography>
                )}
                
                {/* Badges / Read Receipts */}
                <View style={styles.jamStatus}>
                  {item.unreadCount > 0 ? (
                    <View style={styles.unreadBadge}>
                      <Typography style={styles.unreadBadgeText}>{item.unreadCount}</Typography>
                    </View>
                  ) : item.hasRead ? (
                    <CheckCheck size={16} color="rgba(255,255,255,0.25)" />
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

export const ChatScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const onlineUsers = JAMS_DATA.filter(c => c.isOnline);

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#000000" translucent={true} />
      
      {/* Refined Dark Background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000000' }]} />
      </View>

      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerTop}>
          <Typography style={styles.headerTitle}>Jams</Typography>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton}>
              <MoreHorizontal size={22} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.iconButton}>
              <Edit3 size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <BlurView intensity={20} tint="dark" style={styles.searchBlur}>
            <Search size={18} color="rgba(255,255,255,0.4)" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search jams..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.searchInput}
            />
          </BlurView>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent]}
      >
        {/* Live Sync Section */}
        <Animated.View entering={FadeInRight.delay(100).springify()}>
          <Typography style={styles.sectionTitle}>Live Sync</Typography>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.activeScrollContent}
          >
            <View style={{ alignItems: 'center', width: 64, marginRight: 8 }}>
              <Pressable style={styles.myStoryButton}>
                <View style={styles.myStoryInner}>
                  <Typography style={styles.plusIcon}>+</Typography>
                </View>
              </Pressable>
              <Typography style={styles.activeName}>Broadcast</Typography>
            </View>
            
            {onlineUsers.map((user, idx) => (
              <Animated.View key={user.id} entering={FadeInRight.delay(200 + idx * 60).springify()} style={{ marginRight: 8 }}>
                <ActiveRingAvatar avatar={user.avatar} name={user.name} isOnline={user.isOnline} />
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Premium Jams List */}
        <View style={styles.listContainer}>
          {JAMS_DATA.map((jam, index) => (
            <JamCard key={jam.id} item={jam} index={index} navigation={navigation} />
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
    backgroundColor: '#EBEBF0', 
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchContainer: {
    marginBottom: 0,
  },
  searchBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
    fontWeight: '400',
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 20,
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  activeScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  myStoryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderStyle: 'dashed',
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myStoryInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 22,
    color: '#8E8E93',
    fontWeight: '300',
  },
  avatarRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#0A84FF',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#EBEBF0',
  },
  activeName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
  listContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  jamCardWrapper: {
    borderRadius: 20,
  },
  cardBg: {
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardBgUnread: {
    backgroundColor: '#F2F2F7',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cardInner: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  jamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  onlineBadgeSmall: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  jamContent: {
    flex: 1,
    justifyContent: 'center',
  },
  jamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jamName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.3,
  },
  jamNameUnread: {
    fontWeight: '700',
  },
  jamTime: {
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
  },
  jamTimeUnread: {
    color: '#0A84FF',
    fontWeight: '600',
  },
  jamMessageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jamMessage: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: '#8E8E93',
    marginRight: 12,
  },
  jamMessageUnread: {
    color: '#1C1C1E',
    fontWeight: '500',
  },
  jamStatus: {
    minWidth: 22,
    alignItems: 'flex-end',
  },
  unreadBadge: {
    paddingHorizontal: 8,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0A84FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  typingWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#8E8E93',
    marginRight: 4,
    fontStyle: 'italic',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingTop: 4,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#8E8E93',
  },
});
