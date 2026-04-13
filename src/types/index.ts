export type Priority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  completed: boolean;
  dueDate: string;
  createdAt: string;
}

export type PostTag = 'SNIPPET' | 'SHIPPING' | 'HELP NEEDED' | 'TERMINAL';

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface Post {
  id: string;
  author: string;
  avatar: string;
  timeAgo: string;
  tech: string;
  tag: PostTag;
  title: string;
  body: string;
  boosts: number;
  comments: Comment[];
  repoLink?: string;
}

export interface Builder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  stack: string[];
  compatibility: number;
  isOpenToCollab: boolean;
  githubStats: {
    commits: number;
    repos: number;
    streak: number;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  founderId: string;
  stack: string[];
  rolesNeeded: string[];
  priority: Priority;
  recruiting: boolean;
  applications: number;
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  techStack: string[];
  xp: number;
  level: number;
  streakDays: number;
  isOpenToCollab: boolean;
  connections: string[];
}
