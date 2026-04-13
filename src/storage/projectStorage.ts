import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../types';

const PROJECTS_KEY = 'collabsphere_projects';

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'NeuralDiff',
    description: 'AI-powered code review tool that understands intent, not just syntax.',
    founderId: 'builder1',
    stack: ['Python', 'PyTorch', 'TypeScript'],
    rolesNeeded: ['Backend', 'Security'],
    priority: 'High',
    recruiting: true,
    applications: 12
  },
  {
    id: 'p2',
    name: 'OpenDefi',
    description: 'Decentralized identity protocol for institutional finance.',
    founderId: 'builder2',
    stack: ['Solidity', 'Go', 'React'],
    rolesNeeded: ['UI/UX', 'Smart Contract Dev'],
    priority: 'Medium',
    recruiting: true,
    applications: 5
  }
];

export const projectStorage = {
  getProjects: async (): Promise<Project[]> => {
    const data = await AsyncStorage.getItem(PROJECTS_KEY);
    if (!data) {
      await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(MOCK_PROJECTS));
      return MOCK_PROJECTS;
    }
    return JSON.parse(data);
  },
  saveProject: async (project: Project) => {
    const projects = await projectStorage.getProjects();
    const updated = [project, ...projects];
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
    return updated;
  },
  applyForProject: async (projectId: string, applicant: any) => {
    const projects = await projectStorage.getProjects();
    const updated = projects.map(p => 
      p.id === projectId ? { ...p, applications: p.applications + 1 } : p
    );
    await AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(updated));
  }
};
