import React, { useEffect, useCallback, memo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeIn,
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

const SPRING = { damping: 20, stiffness: 280, mass: 0.85 };

export const SplashScreen = ({ navigation }: any) => {
  const btnScale = useSharedValue(1);

  // Subtle floating hero animation
  const heroY = useSharedValue(0);
  useEffect(() => {
    heroY.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 1800 }),
          withTiming(0, { duration: 1800 })
        ),
        -1,
        true
      )
    );
  }, []);

  const heroStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: heroY.value }],
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
      <SafeAreaView style={styles.content}>

        {/* Logo */}
        <Animated.View entering={FadeIn.duration(700)} style={styles.logoContainer}>
          <Typography style={styles.logoTextMain}>THE UNIVERSE OF COLLAB</Typography>
          <Typography style={styles.logoTitle}>COLLAB!</Typography>
        </Animated.View>

        {/* Hero character — floating */}
        <Animated.View
          entering={FadeInDown.delay(350).duration(700).springify()}
          style={[styles.heroContainer, heroStyle]}
        >
          <Image
            source={require('../../assets/clay_hero.png')}
            style={styles.heroImg}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Bottom CTA */}
        <View style={styles.bottomArea}>
          <Animated.View entering={FadeInDown.delay(550).springify().damping(18)}>
            <Typography style={styles.heroSub}>
              Diverse and Colorful Teams{'\n'}for Your Projects
            </Typography>
            <Typography style={styles.heroTagline}>Only the best talent</Typography>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(750).springify().damping(18)}
            style={styles.footerRow}
          >
            {/* Social icons */}
            <View style={styles.socialIcons}>
              <View style={styles.circleIcon}>
                <Typography style={styles.iconTxt}>G</Typography>
              </View>
              <View style={styles.circleIcon}>
                <Typography style={styles.iconTxt}>in</Typography>
              </View>
            </View>

            {/* CTA Button */}
            <Animated.View style={btnAnimStyle}>
              <TouchableOpacity
                style={styles.getStartedBtn}
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={1}
              >
                <Typography style={styles.btnText}>Get Started</Typography>
                <View style={styles.arrowCircle}>
                  <ChevronRight size={20} color="#000" />
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
    backgroundColor: '#FFEB3B',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
  },
  logoContainer: {
    marginTop: 20,
  },
  logoTextMain: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.5,
  },
  logoTitle: {
    fontSize: 118,
    fontWeight: '900',
    color: '#000',
    marginTop: -15,
    letterSpacing: -8,
    textTransform: 'uppercase',
  },
  heroContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImg: {
    width: width * 1.05,
    height: width * 1.05,
  },
  bottomArea: {
    paddingBottom: 55,
  },
  heroSub: {
    fontSize: 32,
    fontWeight: '900',
    color: '#000',
    lineHeight: 34,
    maxWidth: '90%',
    letterSpacing: -1,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.4)',
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 14,
  },
  circleIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 5, height: 5 },
  },
  iconTxt: {
    fontSize: 20,
    fontWeight: '900',
  },
  getStartedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 18,
    paddingLeft: 30,
    paddingRight: 10,
    borderRadius: 45,
    gap: 20,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
