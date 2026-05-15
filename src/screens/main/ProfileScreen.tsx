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
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, Search, LayoutGrid, Copy, Check, Info, EyeOff, Sparkles } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { Profile, RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

export const ProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
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
        {isPassword && <EyeOff size={16} color="#000" style={{ marginLeft: 8 }} />}
        {showCopy && <Copy size={16} color="#000" style={{ marginLeft: 8 }} />}
        {showCheck && <Check size={16} color="#000" style={{ marginLeft: 8 }} />}
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
          <Plus size={28} color="#FFF" strokeWidth={2} />
          <Search size={26} color="#FFF" strokeWidth={2} style={{ marginLeft: 24 }} />
        </View>
        <LayoutGrid size={28} color="#FFF" strokeWidth={2} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)}>
          <Typography style={[styles.mainTitle, { marginBottom: 30 }]}>
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
              <InfoRow label="Email" value={profile?.email || 'keerthan101011@gmail.com'} />
              <InfoRow label="Password" value="••••••••" isPassword />
              <InfoRow label="Phone" value="+91 9876543210" />
              
              <View style={[styles.infoRow, { borderBottomWidth: 0, marginTop: 10 }]}>
                <Typography style={styles.infoLabel}>Account Status</Typography>
                <View style={styles.activePill}>
                  <Typography style={styles.activeText}>Active</Typography>
                </View>
              </View>
            </View>

            <View style={styles.cardActions}>
              <Pressable style={styles.darkButton}>
                <Typography style={styles.darkButtonText}>Save Changes</Typography>
              </Pressable>
              <Pressable style={styles.lightButton}>
                <Typography style={styles.lightButtonText}>Deactivate</Typography>
              </Pressable>
            </View>

            <Typography style={styles.footerText}>
              SECURELY ENCRYPTED VIA COLLABSPHERE
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
    opacity: 0.1,
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
    paddingHorizontal: 28,
    zIndex: 10,
  },
  leftIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 140,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 60,
    fontWeight: '900',
    lineHeight: 58,
    letterSpacing: -2,
    paddingLeft: 4,
  },
  recapTriggerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  recapBadge: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  recapBadgeText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 45,
    padding: 28,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 30 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 25,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  cardAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
  },
  cardHeaderTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -2,
  },
  cardBody: {
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: '#999',
    fontWeight: '700',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
    paddingLeft: 20,
  },
  infoValue: {
    fontSize: 15,
    color: '#000',
    fontWeight: '800',
    textAlign: 'right',
  },
  activePill: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#2E7D32',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  darkButton: {
    flex: 1,
    height: 64,
    backgroundColor: '#111',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  lightButton: {
    flex: 1,
    height: 64,
    backgroundColor: '#F5F5F5',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  lightButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#BBB',
    fontWeight: '900',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
