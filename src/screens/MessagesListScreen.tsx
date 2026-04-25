import React, { memo, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar,
  TextInput,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Lucid from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

const FRIENDS = [
  { id: '1', name: 'Sarah Drasner', role: 'DevEx at Google', online: true, lastMsg: "The architecture looks solid. I'll review the PR tonight.", time: '2m', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: '2', name: 'Josh Comeau', role: 'Design Engineer', online: true, lastMsg: "Did you see the new Inter weight? It's beautiful.", time: '15m', avatar: 'https://i.pravatar.cc/150?u=josh' },
  { id: '3', name: 'Tobi Lütke', role: 'CEO, Shopify', online: false, lastMsg: "Let's scale the Sphere infrastructure.", time: '1h', avatar: 'https://i.pravatar.cc/150?u=tobi' },
  { id: '4', name: 'Naval Ravikant', role: 'Angel Philosopher', online: false, lastMsg: 'Specific knowledge is found by following your curiosity.', time: '3h', avatar: 'https://i.pravatar.cc/150?u=naval' },
  { id: '5', name: 'Amjad Masad', role: 'CEO, Replit', online: true, lastMsg: 'The AI integration is blowing my mind.', time: '5h', avatar: 'https://i.pravatar.cc/150?u=amjad' },
];

const ONLINE_FRIENDS = FRIENDS.filter((f) => f.online);

// ─── Memoized Online Bubble ────────────────────────────────────────
const OnlineBubble = memo(({ item, index }: { item: any; index: number }) => (
  <Animated.View
    entering={FadeInRight.delay(index * 80).springify().damping(20)}
    style={styles.onlineItem}
  >
    <View style={styles.avatarContainer}>
      <Image source={{ uri: item.avatar }} style={styles.onlineAvatar} />
      <View style={styles.greenStatus} />
    </View>
    <Typography style={styles.onlineName}>{item.name.split(' ')[0]}</Typography>
  </Animated.View>
));

// ─── Memoized Chat Row ─────────────────────────────────────────────
const ChatRow = memo(({ item, index, onPress }: { item: any; index: number; onPress: () => void }) => (
  <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(22)}>
    <TouchableOpacity style={styles.chatRow} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.msgAvatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.msgContent}>
        <View style={styles.nameRow}>
          <Typography style={styles.chatName}>{item.name}</Typography>
          <Typography style={styles.chatTime}>{item.time}</Typography>
        </View>
        <Typography style={styles.chatRole}>{item.role}</Typography>
        <Typography style={styles.lastMsg} numberOfLines={1}>{item.lastMsg}</Typography>
      </View>
    </TouchableOpacity>
  </Animated.View>
));

// ─── Main Screen ───────────────────────────────────────────────────
export const MessagesListScreen = ({ navigation }: any) => {
  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderChatRow = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <ChatRow
        item={item}
        index={index}
        onPress={() => navigation.navigate('Chat', { name: item.name })}
      />
    ),
    [navigation]
  );

  const ListHeader = useCallback(
    () => (
      <>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Lucid.Search size={20} color="rgba(0,0,0,0.3)" />
            <TextInput
              placeholder="Search connections..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              style={styles.input}
            />
          </View>
        </View>

        {/* Online builders */}
        <Typography style={styles.sectionLabel}>ACTIVE BUILDERS</Typography>
        <View style={styles.onlineRow}>
          {ONLINE_FRIENDS.map((f, idx) => (
            <OnlineBubble key={f.id} item={f} index={idx} />
          ))}
        </View>

        <Typography style={styles.sectionLabel}>CONVERSATIONS</Typography>
      </>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            activeOpacity={0.85}
          >
            <Lucid.ChevronLeft size={26} color="#000" />
          </TouchableOpacity>
          <Typography style={styles.headerTitle}>Network</Typography>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.85}>
            <Lucid.UserPlus size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Chat list — production tuned */}
        <FlatList
          data={FRIENDS}
          keyExtractor={keyExtractor}
          renderItem={renderChatRow}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={8}
          windowSize={8}
          initialNumToRender={5}
          decelerationRate="fast"
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFEB3B',
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },

  searchSection: { paddingHorizontal: 24, marginTop: 8, marginBottom: 4 },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 54,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2.5,
    borderColor: '#000',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },

  scroll: { paddingBottom: 160 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.4)',
    letterSpacing: 1.5,
    marginLeft: 24,
    marginTop: 28,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  onlineRow: {
    flexDirection: 'row',
    paddingLeft: 24,
    gap: 18,
  },
  onlineItem: { alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  onlineAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#000',
  },
  greenStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00E676',
    borderWidth: 2.5,
    borderColor: '#FFEB3B',
  },
  onlineName: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000',
    marginTop: 8,
    textTransform: 'uppercase',
  },

  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  avatarWrapper: { position: 'relative' },
  msgAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: '#000',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00E676',
    borderWidth: 2,
    borderColor: '#FFEB3B',
  },
  msgContent: { flex: 1, marginLeft: 16 },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: { fontSize: 16, fontWeight: '900', color: '#000' },
  chatTime: { fontSize: 11, fontWeight: '700', color: 'rgba(0,0,0,0.3)' },
  chatRole: { fontSize: 11, fontWeight: '800', color: '#2979FF', marginTop: 2 },
  lastMsg: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.45)',
    marginTop: 3,
    fontWeight: '600',
  },
});
