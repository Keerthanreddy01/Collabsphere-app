import AsyncStorage from '@react-native-async-storage/async-storage';

import { CollabProject } from '../types';
import { mockProjects } from '../data/mockBuilders';

const PROJECTS_KEY = 'collabsphere_projects_v2';

export const projectStorage = {
  getProjects: async (): Promise<CollabProject[]> => {
    const data = await AsyncStorage.getItem(PROJECTS_KEY);
    if (!data) {
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(mockProjects));
      return mockProjects;
    }
    return JSON.parse(data) as CollabProject[];
  },
  saveProject: async (project: CollabProject) => {
    const projects = await projectStorage.getProjects();
    const updated = [project, ...projects];
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated;
  },
};
