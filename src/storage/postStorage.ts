import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../types';

const POSTS_KEY = 'collabsphere_posts';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: 'Alex River',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    timeAgo: '2h',
    tech: 'Rust',
    tag: 'SHIPPING',
    title: 'New Memory-Safe Engine',
    body: 'Just finished the core scheduler for our new real-time processing engine in Rust. The performance gains over our previous Go implementation are insane (approx 40% reduction in latency).',
    boosts: 42,
    comments: [],
    repoLink: 'https://github.com/alex/engine'
  },
  {
    id: '2',
    author: 'Sarah Chen',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    timeAgo: '5h',
    tech: 'React Native',
    tag: 'HELP NEEDED',
    title: 'Skia Performance Gotcha?',
    body: 'Anyone seeing frame drops on Android when using Canvas with multiple paths in Reanimated? Tried offloading to a worklet but still jittery.',
    boosts: 12,
    comments: [],
    repoLink: 'https://github.com/sarah/skia-issue'
  }
];

export const postStorage = {
  getPosts: async (): Promise<Post[]> => {
    const data = await AsyncStorage.getItem(POSTS_KEY);
    if (!data) {
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(MOCK_POSTS));
      return MOCK_POSTS;
    }
    return JSON.parse(data);
  },
  createPost: async (post: Post) => {
    const posts = await postStorage.getPosts();
    const updated = [post, ...posts];
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    return updated;
  },
  boostPost: async (id: string) => {
    const posts = await postStorage.getPosts();
    let newCount = 0;
    const updated = posts.map(p => {
      if (p.id === id) {
        newCount = p.boosts + 1;
        return { ...p, boosts: newCount };
      }
      return p;
    });
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(updated));
    return newCount;
  }
};
