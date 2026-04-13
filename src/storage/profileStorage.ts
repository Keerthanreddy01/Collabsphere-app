import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

const PROFILE_KEY = 'collabsphere_profile';

const INITIAL_PROFILE: UserProfile = {
  id: 'me',
  name: 'Keerthan Reddy',
  role: 'Full Stack Architect',
  avatar: 'https://i.pravatar.cc/150?u=antigravity',
  bio: 'Building the future of developer networking at Collabsphere.',
  techStack: ['React Native', 'TypeScript', 'Node.js'],
  xp: 1250,
  level: 4,
  streakDays: 12,
  isOpenToCollab: true,
  connections: []
};

export const profileStorage = {
  getProfile: async (): Promise<UserProfile> => {
    const data = await AsyncStorage.getItem(PROFILE_KEY);
    if (!data) {
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(INITIAL_PROFILE));
      return INITIAL_PROFILE;
    }
    return JSON.parse(data);
  },
  updateProfile: async (updates: Partial<UserProfile>) => {
    const current = await profileStorage.getProfile();
    const updated = { ...current, ...updates };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },
  addXP: async (amount: number) => {
    const current = await profileStorage.getProfile();
    let newXP = current.xp + amount;
    let newLevel = current.level;
    
    // Simple level logic (level up every 500 XP)
    if (Math.floor(newXP / 500) > current.level) {
      newLevel = Math.floor(newXP / 500);
    }
    
    return await profileStorage.updateProfile({ xp: newXP, level: newLevel });
  }
};
