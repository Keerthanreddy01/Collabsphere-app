import AsyncStorage from '@react-native-async-storage/async-storage';

import { Profile } from '../types';

const PROFILE_KEY = 'collabsphere_profile_v2';

const DEFAULT_PROFILE: Profile = {
  id: 'local',
  full_name: 'CollabSphere Builder',
  username: 'builder',
  bio: 'Building with squads and shipping fast.',
  skills: ['React Native', 'Supabase', 'Design'],
  github_url: 'github.com/your-handle',
  avatar_url: null,
};

export const profileStorage = {
  getProfile: async (): Promise<Profile> => {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    if (!data) {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(data) as Profile;
  },
  updateProfile: async (updates: Partial<Profile>) => {
    const current = await profileStorage.getProfile();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },
};
