import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { Plus, Search, LayoutGrid, Copy, Check, Info, EyeOff } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { Profile } from '../../types';

const { width, height } = Dimensions.get('window');

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      const userId = sessionData.session?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!mounted) return;

      if (!profileError) {
        setProfile(data as Profile);
      }
      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const InfoRow = ({ label, value, showCopy = false, showCheck = false, showInfo = false, isPassword = false }: any) => (
    <View style={styles.infoRow}>
      <View style={styles.labelContainer}>
        <Typography style={styles.infoLabel}>{label}</Typography>
        {showInfo && <Info size={12} color="#AAA" style={{ marginLeft: 4 }} />}
      </View>
      <View style={styles.valueContainer}>
        <Typography style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">
          {value}
        </Typography>
        {isPassword && <EyeOff size={14} color="#000" style={{ marginLeft: 6 }} />}
        {showCopy && <Copy size={14} color="#000" style={{ marginLeft: 6 }} />}
        {showCheck && <Check size={14} color="#000" style={{ marginLeft: 6 }} />}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Grid Background Simulation */}
      <View style={styles.gridBg}>
        {[...Array(10)].map((_, i) => (
          <View key={`h-${i}`} style={[styles.gridLineH, { top: (height / 10) * i }]} />
        ))}
        {[...Array(6)].map((_, i) => (
          <View key={`v-${i}`} style={[styles.gridLineV, { left: (width / 6) * i }]} />
        ))}
      </View>

      <View style={styles.navHeader}>
        <View style={styles.leftIcons}>
          <Plus size={26} color="#FFF" strokeWidth={2.5} />
          <Search size={24} color="#FFF" strokeWidth={2.5} style={{ marginLeft: 20 }} />
        </View>
        <LayoutGrid size={26} color="#FFF" strokeWidth={2.5} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)}>
          <Typography style={styles.mainTitle}>
            Edit{"\n"}Account
          </Typography>

          <Animated.View entering={FadeInUp.delay(200).duration(800)} style={styles.profileCard}>
            <View style={styles.cardTop}>
              <Image 
                source={{ uri: profile?.avatar_url || 'https://i.pravatar.cc/150?u=me' }} 
                style={styles.cardAvatar} 
              />
              <Typography style={styles.cardHeaderTitle}>Keerthan</Typography>
            </View>

            <View style={styles.cardBody}>
              <InfoRow label="Username" value={`@${profile?.username || 'keerthan_reddy'}`} />
              <InfoRow label="Email" value={profile?.email || 'keerthan@mail.com'} />
              <InfoRow label="Password" value="••••••••" isPassword />
              <InfoRow label="Phone" value="+91 9876543210" />
            </View>

            <View style={styles.cardActions}>
              <Pressable style={styles.darkButton}>
                <Typography style={styles.darkButtonText}>Save</Typography>
              </Pressable>
              <Pressable style={styles.lightButton}>
                <Typography style={styles.lightButtonText}>Deactivate</Typography>
              </Pressable>
            </View>

            <Typography style={styles.footerText}>
              SECURE ACCOUNT
            </Typography>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gridBg: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#FFF',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#FFF',
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 32, // Reduced side space for a slightly narrower card
    paddingTop: 20,
    paddingBottom: 120,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 56,
    fontWeight: '900',
    lineHeight: 52,
    letterSpacing: -2,
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 36,
    padding: 24, // Reduced internal padding
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // Reduced from 32
  },
  cardAvatar: {
    width: 56, // Reduced from 64
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    backgroundColor: '#F5F5F5',
  },
  cardHeaderTitle: {
    fontSize: 36, // Reduced from 42
    fontWeight: '900',
    color: '#000',
    letterSpacing: -1.5,
  },
  cardBody: {
    marginBottom: 24, // Reduced from 32
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12, // Reduced from 14
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14, // Reduced from 15
    color: '#999',
    fontWeight: '700',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 16,
  },
  infoValue: {
    fontSize: 14, // Reduced from 15
    color: '#000',
    fontWeight: '800',
    textAlign: 'right',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  darkButton: {
    flex: 1.2, // "Save" button slightly wider
    height: 52, // Reduced from 64
    backgroundColor: '#111',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  lightButton: {
    flex: 1,
    height: 52, // Reduced from 64
    backgroundColor: '#F5F5F5',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  lightButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 9,
    color: '#BBB',
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
