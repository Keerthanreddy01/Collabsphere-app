import AsyncStorage from '@react-native-async-storage/async-storage';

const CONNECTIONS_KEY = 'collabsphere_connections_v2';

export const connectionStorage = {
  getConnections: async (): Promise<string[]> => {
    const data = await AsyncStorage.getItem(CONNECTIONS_KEY);
    return data ? (JSON.parse(data) as string[]) : [];
  },
  toggleConnection: async (userId: string) => {
    const connections = await connectionStorage.getConnections();
    const exists = connections.includes(userId);
    const updated = exists
      ? connections.filter((id) => id !== userId)
      : [...connections, userId];
    await AsyncStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updated));
    return updated;
  },
};
