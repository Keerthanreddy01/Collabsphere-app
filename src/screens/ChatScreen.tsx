import React, { useState, useRef, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowUp, Plus, Heart, ChevronLeft, MoreVertical } from 'lucide-react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';
import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

const INITIAL_MESSAGES = [
  {
    id: '1',
    type: 'in',
    author: 'ATHÉ THE BLOOD',
    text: "HEY WHO'S UP FOR SHERLOCK PUB TONIGHT??? 🍻",
    time: '18:42',
    reaction: 6,
  },
  {
    id: '2',
    type: 'out',
    author: 'ENRICOOOO',
    text: 'COUNT ME IN! BRINGING THE CORE TEAM. 🚀',
    time: '18:45',
  },
  {
    id: '3',
    type: 'in',
    author: 'ATHÉ THE BLOOD',
    text: 'BRING THE RUST SNIPPETS TOO! WE NEED TO OPTIMIZE THE MATCHING ENGINE ASAP.',
    time: '18:47',
  },
];

const MessageBubble = ({ item }: { item: any }) => {
  const isIn = item.type === 'in';
  return (
    <Animated.View
      entering={isIn ? FadeInLeft.springify().damping(20) : FadeInRight.springify().damping(20)}
      style={isIn ? styles.messageInWrapper : styles.messageOutWrapper}
    >
      <View style={isIn ? styles.bubbleIn : styles.bubbleOut}>
        {isIn && (
          <View style={styles.bubbleHeader}>
            <Typography style={styles.bubbleName}>{item.author}</Typography>
            {item.reaction != null && item.reaction > 0 && (
              <View style={styles.reactionBadge}>
                <Heart size={12} color="#000" fill="#FF1744" />
                <Typography style={styles.reactionText}>{item.reaction}</Typography>
              </View>
            )}
          </View>
        )}
        {!isIn && (
          <View style={styles.bubbleHeaderOut}>
            <Typography style={styles.bubbleNameOut}>{item.author}</Typography>
          </View>
        )}
        <Typography style={isIn ? styles.bubbleText : styles.bubbleTextOut}>
          {item.text}
        </Typography>
        <Typography style={isIn ? styles.timestamp : styles.timestampOut}>
          {item.time}
        </Typography>
      </View>
    </Animated.View>
  );
};

export const ChatScreen = ({ navigation, route }: any) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const userName = route?.params?.name || 'ATHÉ THE BLOOD';
  const flatRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const sendMessage = useCallback(() => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'out',
        author: 'YOU',
        text: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessage('');
    setTimeout(() => {
      flatRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, [message]);

  const renderMessage = useCallback(
    ({ item }: any) => <MessageBubble item={item} />,
    []
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="dark-content" />

      {/* Grid background */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 15 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 40 }]} />
        ))}
        {Array.from({ length: 25 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.headerSquareBtn}
            activeOpacity={0.85}
          >
            <ChevronLeft color="#000" size={24} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Typography style={styles.headerTitle}>{userName}</Typography>
            <View style={styles.activeRow}>
              <View style={styles.activeDot} />
              <Typography style={styles.headerSub}>ACTIVE SYNCHRONIZATION</Typography>
            </View>
          </View>
          <TouchableOpacity style={styles.headerSquareBtn} activeOpacity={0.85}>
            <MoreVertical color="#000" size={24} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={keyExtractor}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={10}
          windowSize={10}
        />

        {/* Input Footer */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="START WRITING..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              value={message}
              onChangeText={setMessage}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              multiline={false}
            />
            <TouchableOpacity style={styles.plusBtn} activeOpacity={0.85}>
              <Plus color="#000" size={22} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendBtn, message.trim().length > 0 && styles.sendBtnActive]}
            onPress={sendMessage}
            activeOpacity={0.85}
          >
            <ArrowUp color="#000" size={26} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFEB3B' },
  gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  gridLineV: { position: 'absolute', width: 1.5, height: '100%', backgroundColor: '#000' },
  gridLineH: { position: 'absolute', height: 1.5, width: '100%', backgroundColor: '#000' },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 18,
    backgroundColor: '#FFEB3B',
    borderBottomWidth: 4,
    borderColor: '#000',
  },
  headerSquareBtn: {
    width: 52,
    height: 52,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 },
  },
  headerInfo: { flex: 1, marginLeft: 18 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#000', letterSpacing: -0.5 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00E676',
  },
  headerSub: { fontSize: 9, fontWeight: '900', color: '#000', opacity: 0.5, letterSpacing: 1 },

  chatContent: { padding: 25, paddingBottom: 20 },

  messageInWrapper: { marginBottom: 28, alignItems: 'flex-start' },
  bubbleIn: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 25,
    borderTopLeftRadius: 4,
    maxWidth: width * 0.78,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 6, height: 6 },
  },
  bubbleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bubbleName: { fontWeight: '900', fontSize: 12, color: '#000', letterSpacing: 0.5 },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#000',
    position: 'absolute',
    top: -28,
    right: -10,
  },
  reactionText: { fontSize: 11, fontWeight: '900', marginLeft: 5, color: '#000' },
  bubbleText: { fontSize: 15, lineHeight: 22, color: '#000', fontWeight: '800' },
  timestamp: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.3)',
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  messageOutWrapper: { marginBottom: 28, alignItems: 'flex-end' },
  bubbleOut: {
    backgroundColor: '#2979FF',
    padding: 20,
    borderRadius: 25,
    borderTopRightRadius: 4,
    maxWidth: width * 0.78,
    borderWidth: 3,
    borderColor: '#000',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: -6, height: 6 },
  },
  bubbleHeaderOut: { marginBottom: 8 },
  bubbleNameOut: { fontWeight: '900', fontSize: 12, color: '#FFF', letterSpacing: 0.5 },
  bubbleTextOut: { fontSize: 15, lineHeight: 22, color: '#FFF', fontWeight: '800' },
  timestampOut: {
    fontSize: 10,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    alignSelf: 'flex-end',
  },

  footer: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFEB3B',
    borderTopWidth: 4,
    borderColor: '#000',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    height: 62,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  input: { flex: 1, fontSize: 15, color: '#000', fontWeight: '900' },
  plusBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtn: {
    width: 62,
    height: 62,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    borderWidth: 3,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 5, height: 5 },
  },
  sendBtnActive: {
    backgroundColor: '#00E676',
  },
});
