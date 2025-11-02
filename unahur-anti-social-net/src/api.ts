import type { User, Post, Comment, Tag, PostImage, ID } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


async function http<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });

  const raw = await res.text();
  const asJson = (() => {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  })();

  if (!res.ok) {
    const msg =
      (asJson && (asJson.message || asJson.error)) ||
      raw ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return (asJson ?? (raw as unknown)) as T;
}


export const api = {
  getUsers: () => http<User[]>(`/users`),
  getUser: (id: ID) => http<User>(`/users/${id}`),

  createUser: (payload: {
    nickName: string;
    email: string;
    password: string;
  }) =>
    http<User>(`/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getPosts: () => http<Post[]>(`/posts`),
  getPost: (id: ID) => http<Post>(`/posts/${id}`),
  getPostsByUser: (userId: ID) => http<Post[]>(`/posts?userId=${userId}`),
  createPost: (payload: { description: string; userId: ID; tags: ID[] }) =>
    http<Post>(`/posts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getTags: () => http<Tag[]>(`/tags`),

  getPostComments: async (postId: number) => {
    try {
      return await http<Comment[]>(`/comments/post/${postId}`);
    } catch (e: any) {
      if (String(e.message).includes('404')) return [];
      throw e;
    }
  },

  createComment: (payload: { postId: number; userId: number; content: string }) =>
    http<Comment>(`/comments`, {
      method: 'POST',
      body: JSON.stringify({
        postId: payload.postId,
        userId: payload.userId,
        content: payload.content,
      }),
    }),

  getPostImages: (postId: ID) => http<PostImage[]>(`/postimages/post/${postId}`),
  createPostImage: (payload: { url: string; postId: ID }) =>
    http<PostImage>(`/postimages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
