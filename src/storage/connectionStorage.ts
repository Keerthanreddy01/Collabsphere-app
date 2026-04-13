import AsyncStorage from '@react-native-async-storage/async-storage';

const CONNECTIONS_KEY = 'collabsphere_connections';

export const connectionStorage = {
  getConnections: async (): Promise<string[]> => {
    const data = await AsyncStorage.getItem(CONNECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  connect: async (userId: string) => {
    const connections = await connectionStorage.getConnections();
    if (!connections.includes(userId)) {
      const updated = [...connections, userId];
      await AsyncStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updated));
      return updated;
    }
    return connections;
  }
};
