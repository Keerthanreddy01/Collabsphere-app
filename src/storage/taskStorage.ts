import AsyncStorage from '@react-native-async-storage/async-storage';

type TaskItem = {
  id: string;
  title: string;
  done: boolean;
};

const TASKS_KEY = 'collabsphere_tasks_v2';

export const taskStorage = {
  getTasks: async (): Promise<TaskItem[]> => {
    const data = await AsyncStorage.getItem(TASKS_KEY);
    return data ? (JSON.parse(data) as TaskItem[]) : [];
  },
  saveTask: async (task: TaskItem) => {
    const tasks = await taskStorage.getTasks();
    const updated = [task, ...tasks];
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  },
  toggleTask: async (id: string) => {
    const tasks = await taskStorage.getTasks();
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  },
  deleteTask: async (id: string) => {
    const tasks = await taskStorage.getTasks();
    const updated = tasks.filter((task) => task.id !== id);
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(updated));
    return updated;
  },
};
