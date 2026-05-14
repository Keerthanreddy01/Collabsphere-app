import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { supabase } from '../../lib/supabase';
import { colors, radius, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const FloatingBubble = ({ initial, color, size, top, left, right, bottom, delay }: any) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-20, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, [delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top, left, right, bottom,
          width: size, height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#6C63FF',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.6,
          shadowRadius: 12,
          elevation: 10,
        },
        animatedStyle,
      ]}
    >
      <Typography style={{ color: '#FFF', fontSize: size * 0.45, fontWeight: '900' }}>
        {initial}
      </Typography>
    </Animated.View>
  );
};

const ScaleButton = ({ onPress, disabled, style, children }: any) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withTiming(0.96, { duration: 100 }); }}
      onPressOut={() => { scale.value = withTiming(1, { duration: 100 }); }}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

export const LoginScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGuestLogin = async () => {
    setGuestLoading(true);
    setError(null);
    const guestEmail = 'guest@collabsphere.app';
    const guestPassword = 'guest123456';

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    });

    if (signInError) {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            full_name: 'Guest User',
            username: 'guest',
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        const userId = data.user?.id;
        if (userId) {
          await supabase.from('profiles').insert({
            id: userId,
            full_name: 'Guest User',
            username: 'guest',
            email: guestEmail,
          });
        }
      }
    }

    setGuestLoading(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter an email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Animated.View style={styles.innerContainer} entering={FadeIn.duration(800)}>
        
        {/* Glow Background */}
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <View style={styles.glowOuter} />
          <View style={styles.glowInner} />
        </View>

        {/* Top 55% - Hero & Bubbles */}
        <View style={styles.topSection}>
          <FloatingBubble initial="K" color="#6C63FF" size={60} top="15%" left="15%" delay={0} />
          <FloatingBubble initial="A" color="#00BFA5" size={75} top="35%" left="5%" delay={500} />
          <FloatingBubble initial="S" color="#FF6B35" size={80} top="10%" right="15%" delay={1000} />
          <FloatingBubble initial="M" color="#FF4081" size={65} top="30%" right="8%" delay={1500} />
          <FloatingBubble initial="J" color="#2196F3" size={70} top="50%" left="20%" delay={800} />
          <FloatingBubble initial="T" color="#4CAF50" size={65} top="48%" right="25%" delay={1200} />

          <View style={styles.heroContainer}>
            <Typography style={styles.heroTitle}>CollabSphere</Typography>
            <Typography style={styles.heroSubtitle}>Find your squad. Ship together.</Typography>
          </View>
        </View>

        {/* Bottom 35% - Form */}
        <View style={styles.bottomSection}>
          <View style={styles.form}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#888888"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#888888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            
            <ScaleButton
              style={[styles.primaryButton, (loading || guestLoading) && { opacity: 0.8 }]}
              onPress={handleLogin}
              disabled={loading || guestLoading}
            >
              {loading ? (
                <ActivityIndicator color={colors.black} />
              ) : (
                <Typography style={styles.primaryButtonText}>Sign In</Typography>
              )}
            </ScaleButton>

            <View style={styles.orContainer}>
              <Typography style={styles.orText}>or continue as</Typography>
            </View>

            <ScaleButton
              style={[styles.guestButton, (loading || guestLoading) && { opacity: 0.8 }]}
              onPress={handleGuestLogin}
              disabled={loading || guestLoading}
            >
              {guestLoading ? (
                <ActivityIndicator color="#6C63FF" />
              ) : (
                <Typography style={styles.guestButtonText}>Guest Login</Typography>
              )}
            </ScaleButton>

            {error ? <Typography style={styles.error}>{error}</Typography> : null}

            <Pressable
              onPress={() => navigation.navigate('Signup')}
              style={styles.linkButton}
            >
              <Typography style={styles.linkText}>New here? Create account</Typography>
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContainer: {
    flex: 1,
  },
  glowOuter: {
    position: 'absolute',
    top: '15%',
    left: '-20%',
    right: '-20%',
    height: 600,
    backgroundColor: '#2D1B69',
    borderRadius: 300,
    opacity: 0.4,
    transform: [{ scale: 1.2 }],
    filter: [{ blur: 60 }], // Fallback if supported
  },
  glowInner: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: 400,
    backgroundColor: '#6C63FF',
    borderRadius: 200,
    opacity: 0.2,
    transform: [{ scale: 1.4 }],
  },
  topSection: {
    flex: 0.55,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 60, // offset slightly to sit well with bubbles
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    textShadowColor: '#6C63FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    letterSpacing: 1,
  },
  heroSubtitle: {
    ...typography.body,
    color: '#A0A0A0',
    marginTop: 8,
    fontWeight: '500',
  },
  bottomSection: {
    flex: 0.45,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    zIndex: 20,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  orText: {
    fontSize: 14,
    color: '#888888',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6C63FF',
  },
  guestButtonText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  linkText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
});
