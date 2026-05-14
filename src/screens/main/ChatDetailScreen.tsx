import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Send } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { ChatMessage, RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'ChatDetail'>;

export const ChatDetailScreen = ({ route }: Props) => {
  const { chatId, title } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError(sessionError.message);
      }
      if (mounted) {
        setUserId(data.session?.user?.id ?? null);
      }
    };

    loadSession();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      setLoading(true);
      const { data, error: loadError } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (!mounted) return;

      if (loadError) {
        setError(loadError.message);
      } else {
        setMessages((data ?? []) as ChatMessage[]);
      }
      setLoading(false);
    };

    loadMessages();

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const next = payload.new as ChatMessage;
          setMessages((current) => {
            if (current.some((msg) => msg.id === next.id)) {
              return current;
            }
            return [...current, next];
          });
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    if (!userId) {
      setError('No active user session.');
      return;
    }

    setSending(true);
    setError(null);

    const { error: sendError } = await supabase.from('messages').insert({
      chat_id: chatId,
      user_id: userId,
      content: input.trim(),
    });

    if (sendError) {
      setError(sendError.message);
      setSending(false);
      return;
    }

    setInput('');
    setSending(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.detailContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.screen}>
        <View style={styles.detailHeader}>
          <Typography style={styles.detailHeaderTitle}>{title}</Typography>
          <Typography style={styles.detailHeaderSubtitle}>Realtime squad chat</Typography>
        </View>

        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator color={colors.accent} />
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.messagesContent}
            renderItem={({ item }) => {
              const isMe = item.user_id === userId;
              return (
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.messageRight : styles.messageLeft,
                  ]}
                >
                  <Typography style={[styles.messageText, isMe && styles.messageTextMe]}>{item.content}</Typography>
                </View>
              );
            }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {error ? <Typography style={styles.error}>{error}</Typography> : null}

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Write a message"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            {sending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Send size={18} color={colors.white} />
            )}
          </Pressable>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  detailContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  screen: {
    flex: 1,
  },
  detailHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: spacing.md,
  },
  detailHeaderTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  detailHeaderSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  loadingArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  messageLeft: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
  },
  messageRight: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
  },
  messageText: {
    ...typography.body,
    color: colors.black,
  },
  messageTextMe: {
    color: colors.white,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.black,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.white,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
