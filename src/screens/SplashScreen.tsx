import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { Typography } from '../components/Typography';

const { width, height } = Dimensions.get('window');

const FLOATING_IMAGES = [
  { uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400', top: '5%', left: '5%', rotate: '-15deg', size: 140 },
  { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', top: '10%', right: '5%', rotate: '12deg', size: 160 },
  { uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', top: '35%', left: '-10%', rotate: '8deg', size: 120 },
  { uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400', top: '45%', right: '-15%', rotate: '-10deg', size: 150 },
  { uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400', bottom: '15%', left: '5%', rotate: '-12deg', size: 180 },
  { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', bottom: '5%', right: '10%', rotate: '15deg', size: 160 },
];

const StarBackground = () => (
  <View style={styles.starContainer}>
    <Svg height="100%" width="100%" viewBox="0 0 100 100">
      <Path
        d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z"
        fill="#1A1AFF"
        transform="scale(2) translate(-25, -25)"
      />
    </Svg>
  </View>
);

export const SplashScreen = ({ navigation }: any) => {
  const floatAnim = useSharedValue(0);

  useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000 }),
        withTiming(0, { duration: 3000 })
      ),
      -1,
      true
    );
  }, []);

  const handlePress = useCallback(() => {
    navigation.replace('Main');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Star Shape */}
      <View style={styles.backgroundShape}>
         <StarBackground />
      </View>

      {/* Floating Images */}
      {FLOATING_IMAGES.map((img, idx) => {
        const translateY = useSharedValue(0);
        
        useEffect(() => {
          translateY.value = withRepeat(
            withSequence(
              withTiming(Math.random() * 20 - 10, { duration: 2000 + Math.random() * 2000 }),
              withTiming(0, { duration: 2000 + Math.random() * 2000 })
            ),
            -1,
            true
          );
        }, []);

        const animatedStyle = useAnimatedStyle(() => ({
          transform: [
            { translateY: translateY.value },
            { rotate: img.rotate }
          ]
        }));

        return (
          <Animated.View
            key={idx}
            entering={FadeIn.delay(idx * 200).duration(1000)}
            style={[
              styles.floatingImgContainer,
              { 
                top: img.top, 
                left: img.left, 
                right: img.right, 
                bottom: img.bottom,
                width: img.size,
                height: img.size * 1.2,
              },
              animatedStyle
            ]}
          >
            <Image source={{ uri: img.uri }} style={styles.floatingImg} />
          </Animated.View>
        );
      })}

      <SafeAreaView style={styles.content}>
        <View style={styles.mainArea}>
          {/* Central Logo */}
          <Animated.View 
            entering={FadeIn.delay(800).duration(1000)}
            style={styles.logoWrapper}
          >
            <Image 
              source={require('../../assets/friends_logo_3d.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Footer Area */}
        <View style={styles.bottomArea}>
          <Animated.View
            entering={FadeInDown.delay(1200).springify()}
            style={styles.footerContainer}
          >
            <TouchableOpacity
              style={styles.getMeInBtn}
              onPress={handlePress}
              activeOpacity={0.9}
            >
              <Text style={styles.btnText}>Get me in</Text>
            </TouchableOpacity>

            <Typography style={styles.termsText}>
              By tapping 'Get me in' you're accepting the <Text style={styles.underline}>terms</Text>
            </Typography>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000FF', // Vivid Blue
  },
  backgroundShape: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  starContainer: {
    width: width * 2,
    height: width * 2,
  },
  content: {
    flex: 1,
  },
  mainArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    width: width * 0.9,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: '100%',
    height: '100%',
  },
  floatingImgContainer: {
    position: 'absolute',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  floatingImg: {
    width: '100%',
    height: '100%',
  },
  bottomArea: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 20,
  },
  getMeInBtn: {
    width: '100%',
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4D4DFF', // Lighter blue for button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  termsText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
