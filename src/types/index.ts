export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Feed: undefined;
  Discovery: undefined;
  Chat: undefined;
  CollabBoard: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ChatDetail: { chatId: string; title: string };
  Recap: undefined;
};

export type FeedPost = {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  title: string;
  update: string;
  stack: string[];
  likes: number;
  comments: number;
};

export type BuilderProfile = {
  id: string;
  name: string;
  role: string;
  skills: string[];
  match: number;
};

export type ConversationPreview = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
};

export type CollabProject = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  teamSize: string;
  status: 'Open' | 'Recruiting' | 'Paused';
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  email?: string | null;
  phone?: string | null;
  bio: string | null;
  skills: string[] | null;
  github_url: string | null;
  avatar_url: string | null;
};
