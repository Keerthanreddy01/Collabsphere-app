import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles, MessageSquare, User, Zap, Rocket } from 'lucide-react-native';
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

const { width } = Dimensions.get('window');

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
      withTiming(360, { duration: 15000, easing: Easing.linear }),
      -1,
      false
    );
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.in(Easing.ease) })
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
  }));

  return (
    <View style={[styles.container, { backgroundColor: '#FFEB3B' }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Background Pattern */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: 10 }).map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 50 }]} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 40 }]} />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.discoveryContainer}>
          <View style={styles.orbitStage}>
             
             {/* Large Static Rings */}
             <View style={[styles.staticRing, { width: width * 0.75, height: width * 0.75, borderRadius: (width * 0.75)/2 }]} />
             <View style={[styles.staticRing, { width: width * 0.55, height: width * 0.55, borderRadius: (width * 0.55)/2 }]} />
             
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
                        { left: width / 2 + x - 35, top: width / 2 + y - 35 }
                      ]}
                    >
                       <Image 
                         source={{ uri }} 
                         style={styles.orbitImg} 
                       />
                       <View style={styles.badgeWrapper}>
                          <Zap size={10} color="#000" fill="#FFD600" />
                       </View>
                    </View>
                  );
                })}
             </Animated.View>

             <Animated.View style={[styles.logoAnchor, centerPulseStyle]}>
                <View style={styles.logoBox}>
                   <Typography style={styles.logoChar}>H</Typography>
                </View>
             </Animated.View>
          </View>

          <Animated.View entering={FadeInDown.delay(700)} style={styles.footerContent}>
             <View style={styles.aiBadge}>
                <Sparkles size={14} color="#000" fill="#2979FF" />
                <Typography style={styles.aiBadgeText}>DECIDED BY COLLAB-AI</Typography>
             </View>
             
             <Typography style={styles.heroTitle}>BUILDER DISCOVERY</Typography>
             <Typography style={styles.heroSub}>
                CONNECTING THE NEXT GENERATION OF BUILDERS THROUGH DECENTRALIZED INTELLIGENCE.
             </Typography>

             <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
                <Typography style={styles.ctaText}>START SCANNING</Typography>
                <Rocket size={24} color="#000" style={{ marginLeft: 15 }} />
             </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.1 },
  gridLineV: { position: 'absolute', width: 2, height: '100%', backgroundColor: '#000' },
  gridLineH: { position: 'absolute', height: 2, width: '100%', backgroundColor: '#000' },
  safeArea: { flex: 1 },
  discoveryContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orbitStage: { width: width, height: width, justifyContent: 'center', alignItems: 'center' },
  staticRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
  },
  avatarOrbit: { width: width, height: width, position: 'absolute' },
  avatarPod: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: '#000',
    padding: 3,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 4, height: 4 }
  },
  orbitImg: { width: '100%', height: '100%', borderRadius: 15 },
  badgeWrapper: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoAnchor: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
     width: 110,
     height: 110,
     backgroundColor: '#FFF',
     borderWidth: 4,
     borderColor: '#000',
     borderRadius: 30,
     justifyContent: 'center',
     alignItems: 'center',
     elevation: 20,
     shadowColor: '#000',
     shadowOpacity: 1,
     shadowRadius: 0,
     shadowOffset: { width: 10, height: 10 }
  },
  logoChar: { fontSize: 64, fontWeight: '900', color: '#000' },
  footerContent: {
    marginTop: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    paddingBottom: 160,
  },
  aiBadge: {
     flexDirection: 'row',
     alignItems: 'center',
     backgroundColor: '#FFF',
     paddingHorizontal: 15,
     paddingVertical: 8,
     borderRadius: 10,
     borderWidth: 2,
     borderColor: '#000',
     marginBottom: 30,
  },
  aiBadgeText: { fontSize: 11, fontWeight: '900', color: '#000', marginLeft: 10 },
  heroTitle: { fontSize: 44, fontWeight: '900', color: '#000', letterSpacing: -2, textAlign: 'center' },
  heroSub: { marginTop: 20, fontSize: 13, fontWeight: '900', color: '#000', opacity: 0.5, textAlign: 'center', letterSpacing: 0.5, lineHeight: 20 },
  ctaButton: {
    marginTop: 50,
    width: '100%',
    height: 74,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 8, height: 8 }
  },
  ctaText: { fontSize: 20, fontWeight: '900', color: '#000' }
});
