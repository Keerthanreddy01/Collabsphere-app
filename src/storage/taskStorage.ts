import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types';

const TASKS_KEY = 'collabsphere_tasks';

export const taskStorage = {
  getTasks: async (): Promise<Task[]> => {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTask: async (task: Task) => {
    const tasks = await taskStorage.getTasks();
    const updated = [task, ...tasks];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  },
  toggleTask: async (id: string) => {
    const tasks = await taskStorage.getTasks();
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  },
  deleteTask: async (id: string) => {
    const tasks = await taskStorage.getTasks();
    const updated = tasks.filter(t => t.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  }
};
