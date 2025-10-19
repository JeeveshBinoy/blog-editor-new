import { create } from 'zustand';

const STORAGE_KEY = 'blog_posts_v1';

// In postStore.js - update the demoPosts array
const demoPosts = [
  {
    id: '1',
    title: 'Future Projections',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    featuredImage: '',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'User Feedback Collection',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    featuredImage: '',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Trends & Cost Reduction',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    featuredImage: '',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    title: 'Market Expansion Strategies',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    featuredImage: '',
    createdAt: new Date('2025-02-06').toISOString(),
    updatedAt: new Date('2025-02-06').toISOString(),
  },
  {
    id: '5',
    title: 'Innovative Product Development',
    content: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
    featuredImage: '',
    createdAt: new Date('2025-03-15').toISOString(),
    updatedAt: new Date('2025-03-15').toISOString(),
  },
];

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return demoPosts;
};

const save = (posts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Failed to save posts', e);
  }
};

export const usePostStore = create((set, get) => ({
  posts: load(),

  addPost: (post) => {
    set((state) => {
      const next = [...state.posts, post];
      save(next);
      return { posts: next };
    });
  },

  updatePost: (id, updated) => {
    set((state) => {
      const next = state.posts.map((p) => (p.id === id ? { ...p, ...updated } : p));
      save(next);
      return { posts: next };
    });
  },

  deletePost: (id) => {
    set((state) => {
      const next = state.posts.filter((p) => p.id !== id);
      save(next);
      return { posts: next };
    });
  },
}));
