import { useEffect, useMemo, useState } from "react";
import { Container, Card, Stack, Spinner } from "react-bootstrap";
import { api } from "../api";
import type { Post, Tag } from "../types";
import PostCard from "../components/PostCard";
import TagFilter from "../components/TagFilter";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<number | "all">("all");

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
    if (selectedTag === "all") return posts;
    return posts.filter((p: any) =>
      (p.tags ?? []).some((t: Tag) => t.id === selectedTag)
    );
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
    <>
      <HeroBanner />

      <Container className="py-4">
        <Card className="card-glass p-3 mb-4">
          <Stack
            direction="horizontal"
            className="justify-content-between flex-wrap gap-3"
          >
            <h2 className="h5 m-0">Etiquetas</h2>
            <TagFilter selected={selectedTag} onChange={setSelectedTag} />
          </Stack>
        </Card>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 m-0">Publicaciones recientes</h2>
          <span className="text-muted small">
            {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        <div className="posts-grid">
          {filtered.map((post: any) => (
            <PostCard
              key={post.id}
              post={post}
              tags={post.tags}
              commentsCount={commentsCount[post.id] || 0}
            />
          ))}
        </div>
        {filtered.length === 0 && (
          <Card className="card-glass mt-3">
            <Card.Body className="text-center text-muted">
              No hay publicaciones para la etiqueta seleccionada.
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
