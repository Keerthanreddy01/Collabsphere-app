import {
  BuilderProfile,
  CollabProject,
  ConversationPreview,
  FeedPost,
} from '../types';

export const mockBuilders: BuilderProfile[] = [
  {
    id: 'builder-1',
    name: 'Ari Chen',
    role: 'Full Stack Engineer',
    skills: ['React Native', 'Supabase', 'Expo'],
    match: 92,
  },
  {
    id: 'builder-2',
    name: 'Nova Patel',
    role: 'Product Designer',
    skills: ['Figma', 'Design Systems', 'Research'],
    match: 88,
  },
  {
    id: 'builder-3',
    name: 'Leo Nguyen',
    role: 'Backend Engineer',
    skills: ['Postgres', 'API Design', 'Edge'],
    match: 84,
  },
  {
    id: 'builder-4',
    name: 'Maya Stone',
    role: 'Frontend Engineer',
    skills: ['TypeScript', 'Motion', 'UX'],
    match: 90,
  },
  {
    id: 'builder-5',
    name: 'Samir Noor',
    role: 'AI Engineer',
    skills: ['LLMs', 'Python', 'RAG'],
    match: 86,
  },
  {
    id: 'builder-6',
    name: 'Tessa Wright',
    role: 'Growth Engineer',
    skills: ['Product', 'Analytics', 'Activation'],
    match: 81,
  },
];

export const mockFeedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: 'Ari Chen',
    avatar: 'https://i.pravatar.cc/150?u=ari',
    timeAgo: '2h ago',
    title: 'Realtime squad matching is live',
    update:
      'We wired Supabase Realtime to the new CollabBoard. Response times dropped by 40 percent.',
    stack: ['Supabase', 'Realtime', 'Expo'],
    likes: 32,
    comments: 8,
  },
  {
    id: 'post-2',
    author: 'Nova Patel',
    avatar: 'https://i.pravatar.cc/150?u=nova',
    timeAgo: '5h ago',
    title: 'Design pass on profile cards',
    update:
      'Glass cards now use a soft OLED outline and sharper typography for better contrast.',
    stack: ['Design', 'UI', 'System'],
    likes: 21,
    comments: 6,
  },
  {
    id: 'post-3',
    author: 'Leo Nguyen',
    avatar: 'https://i.pravatar.cc/150?u=leo',
    timeAgo: '1d ago',
    title: 'Match pipeline refactor',
    update:
      'New ranking query is pushing 12x faster insights for squad discovery.',
    stack: ['Postgres', 'SQL', 'Search'],
    likes: 48,
    comments: 12,
  },
];

export const mockProjects: CollabProject[] = [
  {
    id: 'project-1',
    name: 'Orbit Studio',
    description:
      'A creator marketplace for shipping MVPs together in a weekend sprint.',
    stack: ['React Native', 'Supabase', 'Stripe'],
    teamSize: '3 of 6',
    status: 'Open',
  },
  {
    id: 'project-2',
    name: 'Signalboard',
    description:
      'Realtime roadmap for cross-functional teams with live comments.',
    stack: ['Expo', 'Edge Functions', 'Realtime'],
    teamSize: '4 of 5',
    status: 'Recruiting',
  },
  {
    id: 'project-3',
    name: 'CollabCare',
    description:
      'Wellness tracker for distributed teams with async check-ins.',
    stack: ['Mobile', 'Design', 'Analytics'],
    teamSize: '2 of 4',
    status: 'Open',
  },
];

export const mockConversations: ConversationPreview[] = [
  {
    id: 'chat-1',
    name: 'Nova Patel',
    avatar: 'https://i.pravatar.cc/150?u=nova',
    lastMessage: 'Can you review the new onboarding copy?',
    time: '09:20',
  },
  {
    id: 'chat-2',
    name: 'Orbit Studio',
    avatar: 'https://i.pravatar.cc/150?u=orbit',
    lastMessage: 'Sprint kickoff at 11:00. Bring your scope.',
    time: '08:50',
  },
  {
    id: 'chat-3',
    name: 'Product Guild',
    avatar: 'https://i.pravatar.cc/150?u=guild',
    lastMessage: 'We should run a discovery swarm for new builders.',
    time: 'Yesterday',
  },
];
