import { Builder } from '../types';

export const MOCK_BUILDERS: Builder[] = [
  {
    id: 'b1',
    name: 'Louis Bloom',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?u=louis',
    stack: ['Figma', 'React', 'Framer'],
    compatibility: 94,
    isOpenToCollab: true,
    githubStats: { commits: 450, repos: 12, streak: 8 }
  },
  {
    id: 'b2',
    name: 'Jade Smith',
    role: 'Solidity Dev',
    avatar: 'https://i.pravatar.cc/150?u=jade',
    stack: ['Solidity', 'Rust', 'Go'],
    compatibility: 82,
    isOpenToCollab: true,
    githubStats: { commits: 890, repos: 22, streak: 15 }
  },
  {
    id: 'b3',
    name: 'Erik Chen',
    role: 'Backend Architect',
    avatar: 'https://i.pravatar.cc/150?u=erik',
    stack: ['Node.js', 'PostgreSQL', 'Docker'],
    compatibility: 89,
    isOpenToCollab: false,
    githubStats: { commits: 1200, repos: 18, streak: 4 }
  },
  {
    id: 'b4',
    name: 'Maya Patel',
    role: 'Frontend Engineer',
    avatar: 'https://i.pravatar.cc/150?u=maya',
    stack: ['React Native', 'TypeScript', 'GraphQL'],
    compatibility: 91,
    isOpenToCollab: true,
    githubStats: { commits: 730, repos: 15, streak: 22 }
  },
  {
    id: 'b5',
    name: 'Samira Ali',
    role: 'UX Researcher',
    avatar: 'https://i.pravatar.cc/150?u=samira',
    stack: ['Figma', 'Miro', 'Notion'],
    compatibility: 78,
    isOpenToCollab: true,
    githubStats: { commits: 120, repos: 3, streak: 2 }
  },
  {
    id: 'b6',
    name: 'David Kim',
    role: 'DevOps Engineer',
    avatar: 'https://i.pravatar.cc/150?u=david',
    stack: ['AWS', 'Terraform', 'Kubernetes'],
    compatibility: 85,
    isOpenToCollab: false,
    githubStats: { commits: 2100, repos: 34, streak: 45 }
  },
  {
    id: 'b7',
    name: 'Sarah Connor',
    role: 'AI Researcher',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    stack: ['PyTorch', 'Python', 'CUDA'],
    compatibility: 96,
    isOpenToCollab: true,
    githubStats: { commits: 540, repos: 8, streak: 12 }
  }
];
