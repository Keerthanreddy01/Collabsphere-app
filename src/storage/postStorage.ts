import AsyncStorage from '@react-native-async-storage/async-storage';

import { FeedPost } from '../types';
import { mockFeedPosts } from '../data/mockBuilders';

const POSTS_KEY = 'collabsphere_posts_v2';

export const postStorage = {
  getPosts: async (): Promise<FeedPost[]> => {
    const data = await AsyncStorage.getItem(POSTS_KEY);
    if (!data) {
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(mockFeedPosts));
      return mockFeedPosts;
    }
    return JSON.parse(data) as FeedPost[];
  },
  toggleLike: async (id: string) => {
    const posts = await postStorage.getPosts();
    const updated = posts.map((post) =>
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    return updated;
  },
};
