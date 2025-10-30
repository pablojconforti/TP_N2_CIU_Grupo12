import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { Post, Tag } from '../types';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import TagFilter from '../components/TagFilter';
//prueba daniel
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [tagsByPost, setTagsByPost] = useState<Record<number, Tag[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<number | 'all'>('all');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const raw = await api.getPosts();
        const normalized = (raw as any[]).map((p) => ({
          ...p,
          tags: p.tags ?? p.Tags ?? [],
        })) as Post[];

        setPosts(normalized);

        const entries = await Promise.all(
          normalized.map(async (post) => {
            const comments = await api.getPostComments(post.id).catch(() => []);
            return [post.id, { commentsCount: comments.length, tags: (post as any).tags ?? [] }] as const;
          })
        );

        const cc: Record<number, number> = {};
        const tt: Record<number, Tag[]> = {};
        for (const [id, data] of entries) {
          cc[id] = data.commentsCount;
          tt[id] = data.tags;
        }
        setCommentsCount(cc);
        setTagsByPost(tt);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 3) Filtrado por etiqueta usando SIEMPRE tags normalizados
  const filtered = useMemo(() => {
    if (selectedTag === 'all') return posts;
    return posts.filter((p: any) => (p.tags ?? []).some((t: Tag) => t.id === selectedTag));
  }, [posts, selectedTag]);

  if (loading) return <p>Cargando feed…</p>;

  return (
    <div className="container">
      <header className="hero">
        <h1>UnaHur Anti-Social Net</h1>
        <p>Vení, hacete amigo que no mordemos.</p>
        <div className="actions">
          <Link to="/new" className="btn">Crear post</Link>
          <Link to="/profile" className="btn secondary">Mi perfil</Link>
        </div>
      </header>

      <section>
        <h2>Etiquetas</h2>
        {/* TagFilter puede traer la lista de /tags internamente; si no, avisame y lo ajusto */}
        <TagFilter selected={selectedTag} onChange={setSelectedTag} />
      </section>

      <section>
        <h2>Publicaciones recientes</h2>
        <div className="grid">
          {filtered.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              tags={post.tags /* ya normalizado */}
              commentsCount={commentsCount[post.id] || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
