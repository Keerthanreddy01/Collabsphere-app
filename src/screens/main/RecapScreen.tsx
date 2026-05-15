import React from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions, 
  Image, 
  TouchableOpacity, 
  StatusBar,
  Pressable
} from 'react-native';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { 
  ChevronDown, 
  Calendar, 
  MoreHorizontal, 
  Home, 
  User, 
  BarChart2
} from 'lucide-react-native';
import { Typography } from '../../components/Typography';

const { width, height } = Dimensions.get('window');

const RECAP_DATA = [
  { id: '1', month: 'March', reports: 23, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80' },
  { id: '2', month: 'April', reports: 18, image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80' },
  { id: '3', month: 'May', reports: 29, image: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&q=80' },
];

const MonthCard = ({ item, index, scrollY }: { item: any, index: number, scrollY: Animated.SharedValue<number> }) => {
  const cardHeight = 220;
  
  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
      [0, 0, 20],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
      [0.95, 1, 0.95],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
      [0.8, 1, 1.2],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 200).springify()}
      style={[styles.cardContainer, animatedStyle]}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View style={styles.cardHeader}>
          <View style={styles.reportPill}>
            <Typography style={styles.reportText}>{item.reports} reports</Typography>
          </View>
          <TouchableOpacity style={styles.moreBtn}>
            <MoreHorizontal size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Animated.View style={[styles.monthTextWrapper, textStyle]}>
          <Typography style={styles.monthTitle}>{item.month}</Typography>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export const RecapScreen = () => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.yearSelector}>
          <Typography style={styles.yearText}>2026</Typography>
          <ChevronDown size={20} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.calendarBtn}>
          <Calendar size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {RECAP_DATA.map((item, index) => (
          <MonthCard key={item.id} item={item} index={index} scrollY={scrollY} />
        ))}
      </Animated.ScrollView>

      {/* Custom Tab Bar as seen in design */}
      <View style={styles.tabBarWrapper}>
        <View style={styles.tabBar}>
          <TouchableOpacity style={styles.tabItem}>
            <Home size={22} color="#666" />
            <Typography style={styles.tabLabel}>Home</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItem}>
            <User size={22} color="#666" />
            <Typography style={styles.tabLabel}>Profile</Typography>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabItem, styles.tabItemActive]}>
            <BarChart2 size={22} color="#FFF" />
            <Typography style={[styles.tabLabel, { color: '#FFF' }]}>Report</Typography>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yearText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
  },
  calendarBtn: {
    padding: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  cardContainer: {
    height: 220,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#111',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  cardOverlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  reportText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  moreBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  monthTitle: {
    fontSize: 80,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: -4,
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 40,
    width: width,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 40,
    padding: 8,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: '#222',
    borderRadius: 25,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#666',
  },
});
