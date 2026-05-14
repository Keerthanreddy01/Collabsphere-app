import React, { useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Mail } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { AuthStackParamList } from '../../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const { width } = Dimensions.get('window');
const BG_IMAGE = require('../../../src/assets/login-screen/loginscreen.png');

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
      style={{ width: '100%' }}
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
          data: { full_name: 'Guest User', username: 'guest' },
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
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) setError(authError.message);
    setLoading(false);
  };

  return (
    <ImageBackground
      source={BG_IMAGE}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={styles.inner} entering={FadeIn.duration(800)}>

            {/* Top Logo Section — Fixed text size and alignment */}
            <View style={styles.topSection}>
              <Typography style={styles.logoText} numberOfLines={1} adjustsFontSizeToFit>
                CollabSphere
              </Typography>
              <Typography style={styles.tagline}>Find your squad. Ship together.</Typography>
            </View>

            <View style={styles.spacer} />

            {/* Bottom Actions Section — Fixed button layout */}
            <View style={styles.bottomSection}>
              {!showForm ? (
                <Animated.View entering={FadeInUp.duration(600).delay(200)} style={styles.actions}>
                  <ScaleButton
                    style={styles.whitePill}
                    onPress={() => setShowForm(true)}
                  >
                    <View style={styles.pillContent}>
                      <Mail size={20} color="#000" style={{ marginRight: 12 }} />
                      <Typography style={styles.whitePillText}>Sign in with Email</Typography>
                    </View>
                  </ScaleButton>

                  <Pressable
                    style={styles.guestBtn}
                    onPress={handleGuestLogin}
                    disabled={guestLoading}
                  >
                    {guestLoading
                      ? <ActivityIndicator color="#FFFFFF" />
                      : <Typography style={styles.guestText}>GUEST LOGIN</Typography>
                    }
                  </Pressable>

                  <Pressable onPress={() => navigation.navigate('Signup')} style={styles.signupBtn}>
                    <Typography style={styles.signupText}>
                      New here? <Typography style={styles.signupLink}>Create account</Typography>
                    </Typography>
                  </Pressable>

                  <View style={styles.legalContainer}>
                    <Typography style={styles.legal}>
                      By continuing, you agree to our{' '}
                      <Typography style={styles.legalLink}>Terms</Typography> and{' '}
                      <Typography style={styles.legalLink}>Privacy Policy</Typography>.
                    </Typography>
                  </View>
                </Animated.View>
              ) : (
                <Animated.View entering={FadeInUp.duration(400)} style={styles.actions}>
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                  />

                  <ScaleButton
                    style={styles.whitePill}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                    <View style={styles.pillContent}>
                      {loading
                        ? <ActivityIndicator color="#000" />
                        : <Typography style={styles.whitePillText}>Log In</Typography>
                      }
                    </View>
                  </ScaleButton>

                  {error ? (
                    <Typography style={styles.error}>{error}</Typography>
                  ) : null}

                  <Pressable onPress={() => setShowForm(false)} style={styles.backBtn}>
                    <Typography style={styles.backText}>← CANCEL</Typography>
                  </Pressable>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: Dimensions.get('window').height,
  },
  topSection: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: width * 0.11, // Dynamic font size to prevent overflow
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
    textAlign: 'center',
    width: '100%',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 10,
  },
  tagline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  bottomSection: {
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 20,
  },
  actions: {
    alignItems: 'center',
    width: '100%',
  },
  whitePill: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  whitePillText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  guestBtn: {
    marginTop: 24,
    paddingVertical: 10,
  },
  guestText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    opacity: 0.8,
  },
  signupBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  signupText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    color: '#FFFFFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  legalContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  legal: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalLink: {
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    width: '100%',
    height: 60,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
  },
  backBtn: {
    marginTop: 20,
    paddingVertical: 10,
  },
  backText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  error: {
    color: '#FF4D4D',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
});
