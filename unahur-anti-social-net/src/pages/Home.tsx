// src/pages/Home.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Card, Stack } from 'react-bootstrap';
import { api } from '../api';
import type { Post, Tag } from '../types';
import PostCard from '../components/PostCard';
import TagFilter from '../components/TagFilter';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
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
            return [post.id, comments.length] as const;
          })
        );

        const cc: Record<number, number> = {};
        for (const [id, count] of entries) cc[id] = count;
        setCommentsCount(cc);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (selectedTag === 'all') return posts;
    return posts.filter((p: any) => (p.tags ?? []).some((t: Tag) => t.id === selectedTag));
  }, [posts, selectedTag]);

  if (loading) {
    return (
      <Container className="py-5 d-flex justify-content-center">
        <Stack direction="horizontal" gap={3} className="align-items-center">
          <Spinner animation="border" role="status" />
          <span className="fw-semibold">Cargando feed…</span>
        </Stack>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Hero */}
      <Card className="bg-light border-0 rounded-4 p-4 mb-4">
        <Card.Body className="text-center">
          <h1 className="display-6 fw-bold mb-2">UnaHur Anti-Social Net</h1>
          <p className="text-muted mb-4">Vení, hacete amigo que no mordemos.</p>
          <Stack direction="horizontal" gap={2} className="justify-content-center">
            <Button as={Link} to="/new" variant="primary">
              Crear post
            </Button>
            <Button as={Link} to="/profile" variant="outline-secondary">
              Mi perfil
            </Button>
          </Stack>
        </Card.Body>
      </Card>

      {/* Tag filter */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <Stack direction="horizontal" className="justify-content-between flex-wrap gap-3">
            <h2 className="h5 m-0">Etiquetas</h2>
            {/* TagFilter trae /tags internamente; si no, lo ajustamos */}
            <TagFilter selected={selectedTag} onChange={setSelectedTag} />
          </Stack>
        </Card.Body>
      </Card>

      {/* Posts grid */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="h5 m-0">Publicaciones recientes</h2>
        <span className="text-muted small">
          {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
        </span>
      </div>

      <Row xs={1} sm={2} lg={3} className="g-3">
        {filtered.map((post: any) => (
          <Col key={post.id}>
            {/* Si tu PostCard ya renderiza su propia card, perfecto.
                Si no, podrías envolverlo con <Card> acá. */}
            <PostCard
              post={post}
              tags={post.tags}
              commentsCount={commentsCount[post.id] || 0}
            />
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <Card className="border-0 shadow-sm rounded-4 mt-3">
          <Card.Body className="text-center text-muted">
            No hay publicaciones para la etiqueta seleccionada.
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
