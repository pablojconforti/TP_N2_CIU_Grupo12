import type { User, Post, Comment, Tag, PostImage, ID } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/**
 * Helper genérico con manejo detallado de errores y mensajes del backend.
 */
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
  // ========== USERS ==========
  getUsers: () => http<User[]>(`/users`),
  getUser: (id: ID) => http<User>(`/users/${id}`),

  // 👇 ahora se envían nickName, email y password
  createUser: (payload: {
    nickName: string;
    email: string;
    password: string;
  }) =>
    http<User>(`/users`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ========== POSTS ==========
  getPosts: () => http<Post[]>(`/posts`),
  getPost: (id: ID) => http<Post>(`/posts/${id}`),
  getPostsByUser: (userId: ID) => http<Post[]>(`/posts?userId=${userId}`),
  createPost: (payload: { description: string; userId: ID; tags: ID[] }) =>
    http<Post>(`/posts`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // ========== TAGS ==========
  getTags: () => http<Tag[]>(`/tags`),

  // ========== COMMENTS ==========
 getPostComments: async (postId: number) => {
  try {
    return await http<Comment[]>(`/comments/post/${postId}`);
  } catch (e: any) {
    // Por si el backend devuelve 404 cuando no hay comentarios
    if (String(e.message).includes('404')) return [];
    throw e;
  }
},

// 2) Crear comentario: mismos campos del enunciado (postId, userId, content)
createComment: (payload: { postId: number; userId: number; content: string }) =>
  http<Comment>(`/comments`, {
    method: 'POST',
    body: JSON.stringify({
      postId: payload.postId,
      userId: payload.userId,
      content: payload.content,
      // visible: true, // descomentá si tu backend lo requiere
    }),
  }),

  // ========== IMAGES ==========
  getPostImages: (postId: ID) => http<PostImage[]>(`/postimages/post/${postId}`),
  createPostImage: (payload: { url: string; postId: ID }) =>
    http<PostImage>(`/postimages`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
