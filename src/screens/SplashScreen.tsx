import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Lucid from 'lucide-react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ChevronRight } from 'lucide-react-native';
import { Typography } from '../components/Typography';

const { width, height } = Dimensions.get('window');

const Icon = ({ name, ...props }: { name: string;[key: string]: any }) => {
  const IconComponent = (Lucid as any)[name];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const SPRING = { damping: 20, stiffness: 280, mass: 0.85 };

export const SplashScreen = ({ navigation }: any) => {
  const btnScale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 2500 }),
        withTiming(0, { duration: 2500 })
      ),
      -1,
      true
    );
    
    logoOpacity.value = withDelay(200, withTiming(1, { duration: 1000 }));
    logoScale.value = withDelay(200, withSpring(1, SPRING));
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const btnAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    btnScale.value = withSpring(0.94, { damping: 20, stiffness: 500 });
  }, []);

  const handlePressOut = useCallback(() => {
    btnScale.value = withSpring(1, SPRING);
  }, []);

  const handlePress = useCallback(() => {
    navigation.replace('Main');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Mesh Gradient Background */}
      <LinearGradient
        colors={['#FFFFFF', '#F0F4FF', '#E0E7FF']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      {/* Decorative Orbs */}
      <Animated.View style={[styles.orb, styles.orb1, floatStyle]} />
      <Animated.View style={[styles.orb, styles.orb2, floatStyle]} />
      <Animated.View style={[styles.orb, styles.orb3, floatStyle]} />

      <SafeAreaView style={styles.content}>
        <View style={styles.mainArea}>
          {/* Logo Section */}
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <View style={styles.logoBadge}>
               <Typography style={styles.logoBadgeText}>V1.0</Typography>
            </View>
            <Typography style={styles.logoTextMain}>COLLABSPHERE</Typography>
            <View style={styles.collabBox}>
              <Typography style={[styles.logoTitle, { color: '#6366F1' }]}>BUILD</Typography>
              <Typography style={[styles.logoTitle, styles.sphereText]}>BEYOND</Typography>
            </View>
          </Animated.View>

          {/* Value Prop */}
          <Animated.View 
            entering={FadeInDown.delay(400).springify().damping(20)}
            style={styles.heroTextContainer}
          >
            <Typography style={styles.heroSub}>
              Where Elite{'\n'}Architects{'\n'}Converge.
            </Typography>
            <View style={styles.taglineBox}>
              <View style={styles.accentLine} />
              <Typography style={styles.heroTagline}>THE HUB FOR NEXT-GEN DEVS</Typography>
            </View>
          </Animated.View>
        </View>

        {/* Footer Area */}
        <View style={styles.bottomArea}>
          <Animated.View
            entering={FadeInDown.delay(700).springify().damping(18)}
            style={styles.footerRow}
          >
            <View style={styles.socialIcons}>
              <TouchableOpacity style={styles.circleIcon}>
                <Icon name="Github" size={20} color="#1E293B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleIcon}>
                <Icon name="Linkedin" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Animated.View style={btnAnimStyle}>
              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
              >
                <Typography style={styles.btnText}>Enter Arena</Typography>
                <View style={styles.arrowCircle}>
                  <ChevronRight size={20} color="#6366F1" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: '#6366F1',
    opacity: 0.05,
  },
  orb1: {
    width: 300,
    height: 300,
    top: -50,
    right: -50,
  },
  orb2: {
    width: 200,
    height: 200,
    bottom: 100,
    left: -50,
  },
  orb3: {
    width: 150,
    height: 150,
    top: height * 0.4,
    right: -20,
    backgroundColor: '#818CF8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  logoBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 1,
  },
  logoTextMain: {
    fontSize: 14,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  collabBox: {
    height: 140, 
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -4,
    textTransform: 'uppercase',
    lineHeight: 70,
  },
  sphereText: {
    fontSize: 48,
    marginTop: -10,
    color: '#1E293B',
    opacity: 0.1,
  },
  heroTextContainer: {
    marginTop: 20,
  },
  heroSub: {
    fontSize: 44,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 46,
    letterSpacing: -2,
  },
  taglineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
  },
  accentLine: {
    width: 40,
    height: 2,
    backgroundColor: '#6366F1',
  },
  heroTagline: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  bottomArea: {
    paddingBottom: 40,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  circleIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 8,
    borderRadius: 18,
    gap: 16,
    shadowColor: '#6366F1',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
