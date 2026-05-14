import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Mail, Star } from 'lucide-react-native';

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
        withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
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
          zIndex: 5,
          shadowColor: '#FFFFFF',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
          elevation: 5,
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
  const [showForm, setShowForm] = useState(false);

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
      <ScrollView contentContainerStyle={styles.scrollContent} bounces={false} showsVerticalScrollIndicator={false}>
        <Animated.View style={styles.innerContainer} entering={FadeIn.duration(800)}>
          
          {/* Top Header Section */}
          <View style={styles.header}>
            <Typography style={styles.logoText}>CollabSphere</Typography>
            <Typography style={styles.subtitleText}>Find your squad. Ship together.</Typography>
          </View>

          {/* Center Globe Graphic */}
          <View style={styles.globeSection}>
            <View style={styles.globeContainer}>
              <View style={styles.globe} />
              
              {/* Floating Avatars on the globe */}
              <FloatingBubble initial="K" color="#6C63FF" size={48} top={-10} left={60} delay={0} />
              <FloatingBubble initial="A" color="#00BFA5" size={54} top={20} right={40} delay={500} />
              <FloatingBubble initial="S" color="#FF6B35" size={44} top={80} left={-10} delay={1000} />
              <FloatingBubble initial="M" color="#FF4081" size={50} top={100} right={-15} delay={1500} />
              <FloatingBubble initial="J" color="#2196F3" size={46} top={160} left={20} delay={800} />
              <FloatingBubble initial="T" color="#4CAF50" size={42} top={180} right={30} delay={1200} />
              <FloatingBubble initial="C" color="#FFC107" size={38} top={120} left={60} delay={300} />
              <FloatingBubble initial="R" color="#9C27B0" size={40} top={50} right={80} delay={700} />

              {/* Star Mascot */}
              <View style={styles.starContainer}>
                <Star fill="#000" color="#000" size={36} />
              </View>
            </View>
          </View>

          {/* Bottom Actions Section */}
          <View style={styles.bottomSection}>
            {!showForm ? (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.actionsContainer}>
                <ScaleButton
                  style={styles.whitePillButton}
                  onPress={() => setShowForm(true)}
                >
                  <Mail size={20} color="#000" style={{ marginRight: 8 }} />
                  <Typography style={styles.whitePillButtonText}>Sign in with Email</Typography>
                </ScaleButton>

                <Pressable onPress={handleGuestLogin} disabled={guestLoading} style={styles.anotherWayButton}>
                  {guestLoading ? (
                    <ActivityIndicator color="#A0A0A0" />
                  ) : (
                    <Typography style={styles.anotherWayText}>GUEST LOGIN</Typography>
                  )}
                </Pressable>

                <Typography style={styles.legalText}>
                  By pressing "Sign in", you agree to our{'\n'}
                  <Typography style={styles.legalLink}>license agreement</Typography> and <Typography style={styles.legalLink}>privacy policy</Typography>.
                </Typography>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.formContainer}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={styles.input}
                />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={styles.input}
                />
                
                <ScaleButton
                  style={[styles.whitePillButton, { marginTop: 8 }]}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#000" />
                  ) : (
                    <Typography style={styles.whitePillButtonText}>Log In</Typography>
                  )}
                </ScaleButton>

                {error ? <Typography style={styles.error}>{error}</Typography> : null}

                <Pressable onPress={() => navigation.navigate('Signup')} style={{ marginTop: 16 }}>
                  <Typography style={styles.anotherWayText}>NEW HERE? CREATE ACCOUNT</Typography>
                </Pressable>
                <Pressable onPress={() => setShowForm(false)} style={{ marginTop: 16 }}>
                  <Typography style={[styles.anotherWayText, { color: '#666' }]}>CANCEL</Typography>
                </Pressable>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  innerContainer: {
    flex: 1,
  },
  header: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    zIndex: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: 1,
  },
  subtitleText: {
    color: '#A0A0A0',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  globeSection: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  globeContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  globe: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#2b50ff',
    opacity: 0.6,
    shadowColor: '#6cb5ff',
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 10,
  },
  starContainer: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: '#FFFFFF',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFFFFF',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 10,
  },
  bottomSection: {
    flex: 0.3,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    zIndex: 10,
  },
  actionsContainer: {
    alignItems: 'center',
    width: '100%',
  },
  formContainer: {
    alignItems: 'center',
    width: '100%',
  },
  whitePillButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whitePillButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  anotherWayButton: {
    marginTop: 24,
    paddingVertical: 10,
  },
  anotherWayText: {
    color: '#A0A0A0',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  legalText: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 32,
    lineHeight: 18,
  },
  legalLink: {
    color: '#888888',
    textDecorationLine: 'underline',
  },
  input: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
});
