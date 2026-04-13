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
  }
];
