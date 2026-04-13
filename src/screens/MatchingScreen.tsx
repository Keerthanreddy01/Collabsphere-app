import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, MessageSquare, User, Zap, Rocket } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing,
  withSequence,
  interpolate
} from 'react-native-reanimated';
import { Typography } from '../components/Typography';
import { COLORS } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const AVATARS = [
  'https://i.pravatar.cc/150?u=1',
  'https://i.pravatar.cc/150?u=2',
  'https://i.pravatar.cc/150?u=3',
  'https://i.pravatar.cc/150?u=4',
  'https://i.pravatar.cc/150?u=5',
  'https://i.pravatar.cc/150?u=6',
  'https://i.pravatar.cc/150?u=7',
  'https://i.pravatar.cc/150?u=8',
];

export const MatchingScreen = () => {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 25000, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 2000, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.in(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const centerPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: interpolate(pulse.value, [1, 1.2], [0.3, 0])
  }));

  return (
    <View style={styles.container}>
      {/* Background Mesh */}
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#000000' }} />
        <LinearGradient 
          colors={['rgba(139, 92, 246, 0.1)', 'transparent']} 
          style={{ position: 'absolute', width: width, height: height, top: -width/2 }} 
        />
      </View>
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.discoveryContainer}>
          <View style={styles.orbitStage}>
             
             {/* Background Pulse Rings */}
             <Animated.View style={[styles.pulseRing, centerPulseStyle, { width: width * 0.7, height: width * 0.7, borderRadius: width * 0.35 }]} />
             <Animated.View style={[styles.pulseRing, centerPulseStyle, { width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25 }]} />
             
             <View style={styles.staticRing} />
             
             <Animated.View style={[styles.avatarOrbit, orbitStyle]}>
                {AVATARS.map((uri, i) => {
                  const angle = (i * 360) / AVATARS.length;
                  const radius = width * 0.38;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  
                  return (
                    <View 
                      key={i}
                      style={[
                        styles.avatarPod, 
                        { left: width / 2 + x - 32, top: width / 2 + y - 32 }
                      ]}
                    >
                       <Image 
                         source={{ uri }} 
                         style={styles.orbitImg} 
                       />
                       <View style={styles.avatarGlow} />
                    </View>
                  );
                })}
             </Animated.View>

             <View style={styles.logoAnchor}>
                <View style={styles.logoGlass}>
                   <Typography variant="h1" color="#000" style={{ fontSize: 44, fontWeight: '800' }}>h</Typography>
                </View>
                <View style={styles.logoBorderInner} />
             </View>
          </View>

          <Animated.View entering={FadeInDown.delay(700).springify()} style={styles.footerContent}>
             <View style={styles.aiBadge}>
                <Sparkles size={12} color="#A855F7" fill="#A855F7" />
                <Typography variant="caption" color="#A855F7" style={{ marginLeft: 8, fontWeight: '900' }}>AI MATCHMAKING LIVE</Typography>
             </View>
             
             <Typography variant="h1" color="#FFFFFF" align="center" style={styles.heroTitle}>
                Friend's Contact
             </Typography>
             <Typography variant="body" color="rgba(255,255,255,0.5)" align="center" style={styles.heroSub}>
                Connecting the next generation of builders through decentralized intelligence.
             </Typography>

             <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
                <LinearGradient colors={['#FFF', '#DDD']} style={styles.ctaInner}>
                   <Typography variant="bodyBold" color="#000">Enter Discovery</Typography>
                   <Rocket size={18} color="#000" style={{ marginLeft: 10 }} />
                </LinearGradient>
             </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  discoveryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitStage: {
     width: width,
     height: width,
     justifyContent: 'center',
     alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 1.5,
    borderColor: '#8B5CF6',
  },
  staticRing: {
    position: 'absolute',
    width: width * 0.76,
    height: width * 0.76,
    borderRadius: (width * 0.76) / 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  avatarOrbit: {
    width: width,
    height: width,
    position: 'absolute',
  },
  avatarPod: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  orbitImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarGlow: {
     position: 'absolute',
     width: '100%',
     height: '100%',
     borderRadius: 32,
     backgroundColor: '#8B5CF6',
     opacity: 0.1,
     zIndex: -1,
  },
  logoAnchor: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoGlass: {
     width: 100,
     height: 100,
     borderRadius: 50,
     backgroundColor: '#FFF',
     justifyContent: 'center',
     alignItems: 'center',
  },
  logoBorderInner: {
     position: 'absolute',
     width: 110,
     height: 110,
     borderRadius: 55,
     borderWidth: 1,
     borderColor: 'rgba(255,255,255,0.1)',
  },
  footerContent: {
    marginTop: 30,
    paddingHorizontal: 40,
    alignItems: 'center',
    paddingBottom: 160, // Ensure content is clear of the nav bar
  },
  aiBadge: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: 'rgba(139, 92, 246, 0.1)',
     paddingHorizontal: 12,
     paddingVertical: 6,
     borderRadius: 12,
     marginBottom: 24,
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroSub: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  ctaButton: {
    marginTop: 48,
    width: '100%',
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  ctaInner: {
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
  }
});
