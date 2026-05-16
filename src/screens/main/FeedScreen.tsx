import React from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { 
  Search, 
  LayoutGrid, 
  Flame, 
  Star, 
  MapPin, 
  Clock,
  Plus
} from 'lucide-react-native';
import { Typography } from '../../components/Typography';

const { width } = Dimensions.get('window');

const POLAROIDS = [
  {
    id: '1',
    author: 'Tanim',
    followers: '1.5M',
    avatar: 'https://i.pravatar.cc/100?u=tanim',
    text: 'A crime scene of melted cheddar and chunky beef. Can confidently say I cleared every crumb.',
    location: 'Momos Place, Banani • 0.5 km away',
    time: '10:00 AM to 11:00 PM',
    color: '#EE7E5C', 
    rotation: '-3deg',
    hasFollow: false,
    width: width * 0.82,
    marginTop: 10,
    marginLeft: -10,
    zIndex: 1,
  },
  {
    id: '2',
    author: 'Fadul',
    followers: '1.2M',
    avatar: 'https://i.pravatar.cc/100?u=fadul',
    images: [
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', 
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80'
    ],
    color: '#39B5C8', 
    rotation: '2deg',
    hasFollow: true,
    width: width * 0.88,
    marginTop: -50,
    marginLeft: 30,
    zIndex: 2,
  },
  {
    id: '3',
    author: 'Rahul',
    followers: '2.1M',
    avatar: 'https://i.pravatar.cc/100?u=rahul',
    text: "Didn't know heaven had a tasting menu. Tender lamb, smooth mash, and jazz in the background.",
    location: 'Sip Society, Gulshan • 1.2 km away',
    time: '11:00 AM to 10:00 PM',
    color: '#F5A8D0', 
    rotation: '5deg',
    hasFollow: false,
    width: width * 0.85,
    marginTop: -100,
    marginLeft: 45,
    zIndex: 3,
  },
  {
    id: '4',
    author: 'Sakib',
    followers: '850K',
    avatar: 'https://i.pravatar.cc/100?u=sakib',
    images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'],
    color: '#E9C46A', 
    rotation: '-2deg',
    hasFollow: true,
    width: width * 0.9,
    marginTop: -60,
    marginLeft: -15,
    zIndex: 4,
  },
  {
    id: '5',
    author: 'Jahin',
    followers: '1.1M',
    avatar: 'https://i.pravatar.cc/100?u=jahin',
    text: "Sip Society is dropping serious summer relief. The watermelon mint is a personal fave 🍉",
    location: 'Urban Terrace • 2.4 km away',
    time: '4:00 PM to 12:00 AM',
    color: '#25D366', 
    rotation: '-4deg',
    hasFollow: false,
    width: width * 0.86,
    marginTop: -90,
    marginLeft: 15,
    zIndex: 5,
  },
];

const HeaderChips = () => (
  <View style={styles.headerChipsRow}>
    <View style={styles.leftChips}>
      <TouchableOpacity style={styles.chip}>
        <Flame size={14} color="#FF9500" fill="#FF9500" />
        <Typography style={styles.chipText}>Post</Typography>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chip}>
        <Star size={14} color="#8E8E93" />
        <Typography style={styles.chipText}>Creator</Typography>
      </TouchableOpacity>
    </View>
    <View style={styles.rightIcons}>
      <TouchableOpacity style={styles.iconCircle}>
        <Search size={18} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconCircle}>
        <LayoutGrid size={18} color="#000" />
        <View style={styles.badge}><Typography style={styles.badgeText}>3</Typography></View>
      </TouchableOpacity>
    </View>
  </View>
);

export const FeedScreen = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="transparent" translucent />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingTop: Math.max(insets.top, 20) }]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Typography style={styles.headerBrand}>CollabSphere</Typography>
          <Typography style={styles.headerTitle}>Hey Keerthan!</Typography>
          <Typography style={styles.headerSubtitle}>What you upto?</Typography>
          
          <HeaderChips />
        </View>

        {/* Scattered Polaroids Layout */}
        <View style={styles.polaroidsContainer}>
          {POLAROIDS.map((card, index) => (
            <Animated.View 
              entering={FadeInDown.delay(index * 100).springify()}
              key={card.id} 
              style={[
                styles.cardContainer,
                {
                  backgroundColor: card.color,
                  width: card.width,
                  transform: [{ rotate: card.rotation }],
                  zIndex: card.zIndex,
                  marginTop: card.marginTop,
                  marginLeft: card.marginLeft,
                }
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={styles.authorRow}>
                  <Image source={{ uri: card.avatar }} style={styles.avatar} />
                  <Typography style={styles.authorName}>{card.author} • {card.followers}</Typography>
                </View>
                {card.hasFollow && (
                  <TouchableOpacity style={styles.followButton}>
                    <Plus size={14} color="#000" />
                    <Typography style={styles.followText}>Follow</Typography>
                  </TouchableOpacity>
                )}
              </View>

              {card.text && (
                <View style={styles.textContent}>
                  <Typography style={styles.cardText}>{card.text}</Typography>
                </View>
              )}

              {card.images && (
                <View style={styles.imageGrid}>
                  {card.images.map((img, i) => (
                    <Image key={i} source={{ uri: img }} style={styles.gridImage} />
                  ))}
                </View>
              )}

              {(card.location || card.time) && (
                <View style={styles.cardFooter}>
                  <View style={styles.footerRow}>
                    <MapPin size={12} color="rgba(0,0,0,0.5)" />
                    <Typography style={styles.footerText}>{card.location}</Typography>
                  </View>
                  <View style={styles.footerRow}>
                    <Clock size={12} color="rgba(0,0,0,0.5)" />
                    <Typography style={styles.footerText}>{card.time}</Typography>
                  </View>
                  <Typography style={styles.readMoreText}>Read more...</Typography>
                </View>
              )}
            </Animated.View>
          ))}
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBEBF0', // Light theme background
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerBrand: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    opacity: 0.6,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: -0.5,
    marginBottom: 24,
  },
  headerChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftChips: {
    flexDirection: 'row',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  rightIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#3D3D3D',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#EBEBF0',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  polaroidsContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  cardContainer: {
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingRight: 12,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: 20,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.7)',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  followText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
  },
  textContent: {
    marginBottom: 16,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  imageGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    height: 160,
  },
  gridImage: {
    flex: 1,
    height: '100%',
    borderRadius: 20,
  },
  cardFooter: {
    gap: 6,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(0,0,0,0.5)',
  },
  readMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.6)',
    marginTop: 4,
  },
});
