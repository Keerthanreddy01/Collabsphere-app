import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LogOut, Pencil, Link } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { colors, radius, spacing, typography } from '../../theme/colors';
import { Typography } from '../../components/Typography';
import { Profile } from '../../types';

export const ProfileScreen = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const projects = ['Orbit Studio', 'Signalboard', 'CollabCare'];

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

      if (profileError) {
        // If row is missing or table is missing, don't show a red error, just leave profile as null
        // so the user sees the 'Complete your profile' state
        if (profileError.code !== 'PGRST116' && profileError.code !== '42P01') {
          setError(profileError.message);
        }
      } else {
        setProfile(data as Profile);
      }

      setLoading(false);
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Animated.View entering={FadeIn.duration(300)}>
        <Typography style={styles.headerTitle}>Profile</Typography>
        <Typography style={styles.headerSubtitle}>
          Your CollabSphere identity
        </Typography>

        {loading ? (
          <View style={styles.loadingArea}>
            <ActivityIndicator color={colors.terracotta} />
          </View>
        ) : !profile && !error ? (
          <View style={styles.card}>
            <View style={[styles.avatarImage, { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }]}>
              <Typography style={styles.avatarInitials}>
                ??
              </Typography>
            </View>
            <Typography style={styles.name}>New Builder</Typography>
            <Typography style={styles.bio}>
              Welcome to CollabSphere! Please set up your profile to connect with others.
            </Typography>
            <Pressable style={[styles.secondaryButton, { marginTop: spacing.lg }]}>
              <Pencil size={16} color={colors.textPrimary} />
              <Typography style={styles.secondaryText}>Complete your profile</Typography>
            </Pressable>
            <Pressable style={[styles.logoutButton, { marginTop: spacing.md }]} onPress={handleLogout}>
              <LogOut size={16} color={colors.white} />
              <Typography style={styles.logoutText}>Log out</Typography>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarImage, { backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }]}>
                <Typography style={styles.avatarInitials}>
                  {profile?.full_name ? profile.full_name.substring(0, 2).toUpperCase() : '??'}
                </Typography>
              </View>
            )}
            <Typography style={styles.name}>
              {profile?.full_name || 'New Builder'}
            </Typography>
            <Typography style={styles.username}>
              @{profile?.username || 'username'}
            </Typography>
            <Typography style={styles.bio}>
              {profile?.bio || 'Add a bio to introduce your focus.'}
            </Typography>

            <View style={styles.tagsRow}>
              {(profile?.skills || ['React Native', 'Supabase', 'Design']).map(
                (skill) => (
                  <View key={skill} style={styles.tag}>
                    <Typography style={styles.tagText}>{skill}</Typography>
                  </View>
                )
              )}
            </View>

            <Pressable style={styles.linkRow}>
              <Link size={16} color={colors.textSecondary} />
              <Typography style={styles.linkText}>
                {profile?.github_url || 'github.com/your-handle'}
              </Typography>
            </Pressable>

            <View style={styles.projectsSection}>
              <Typography style={styles.projectsTitle}>Projects</Typography>
              {projects.map((project) => (
                <Typography key={project} style={styles.projectItem}>
                  {project}
                </Typography>
              ))}
            </View>

            <View style={styles.buttonRow}>
              <Pressable style={styles.secondaryButton}>
                <Pencil size={16} color={colors.textPrimary} />
                <Typography style={styles.secondaryText}>Edit profile</Typography>
              </Pressable>
              <Pressable style={styles.logoutButton} onPress={handleLogout}>
                <LogOut size={16} color={colors.black} />
                <Typography style={styles.logoutText}>Log out</Typography>
              </Pressable>
            </View>
          </View>
        )}

        {error ? <Typography style={styles.error}>{error}</Typography> : null}
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  headerTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: spacing.md,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    ...typography.subtitle,
    color: colors.textCard,
  },
  username: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  bio: {
    ...typography.body,
    color: colors.textCard,
    marginTop: spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  tag: {
    backgroundColor: colors.panel,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  tagText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  linkText: {
    ...typography.caption,
    color: colors.textCard,
  },
  projectsSection: {
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  projectsTitle: {
    ...typography.caption,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  projectItem: {
    ...typography.body,
    color: colors.textCard,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.panel,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  secondaryText: {
    ...typography.caption,
    color: colors.textPrimary,
  },
  logoutButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  logoutText: {
    ...typography.caption,
    color: colors.white,
  },
  loadingArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.md,
  },
});
