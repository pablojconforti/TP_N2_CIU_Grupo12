import { useEffect, useState, useMemo } from "react";
import { Container, Card, Stack, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import type { Post, Tag } from "../types";
import PostCard from "../components/PostCard";
import TagFilter from "../components/TagFilter";
import HeroBanner from "../components/HeroBanner";

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | "all">("all");
  const [featuredPosts, setFeaturedPosts] = useState<number[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
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
      } catch {
        setError("No se pudieron cargar las publicaciones 😢");
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  useEffect(() => {
    const allKeys = Object.keys(localStorage).filter((k) =>
      k.startsWith("featuredPosts_")
    );

    const allFeatured: number[] = [];
    for (const key of allKeys) {
      try {
        const ids = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(ids)) allFeatured.push(...ids);
      } catch {
      }
    }

    setFeaturedPosts(allFeatured);
  }, []);

  const filtered = useMemo(() => {
    if (selectedTag === "all") return posts;
    return posts.filter((p) =>
      (p.tags ?? []).some((t: Tag) => t.id === selectedTag)
    );
  }, [posts, selectedTag]);

  const featured = posts.filter((p) => featuredPosts.includes(p.id));
  const regular = filtered.filter((p) => !featuredPosts.includes(p.id));

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3 fw-semibold">Cargando publicaciones...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center text-danger fw-semibold">
        {error}
      </Container>
    );
  }

  if (!user) {
    return (
      <Container
        className="py-5 text-center d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <h2 className="fw-bold mb-3">Logeate para ver qué está pasando 👀</h2>
        <p className="text-muted mb-4">
          Iniciá sesión para explorar las publicaciones y ver lo que comparte la comunidad.
        </p>
        <div className="d-flex gap-3">
          <Button as={Link} to="/login" variant="primary" size="lg">
            Iniciar sesión
          </Button>
          <Button as={Link} to="/register" variant="outline-secondary" size="lg">
            Registrarse
          </Button>
        </div>
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

        {featured.length > 0 && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h5 m-0">⭐ Publicaciones destacadas</h2>
              <span className="text-muted small">
                {featured.length} {featured.length === 1 ? "post" : "posts"}
              </span>
            </div>

            <div className="posts-grid mb-5">
              {featured.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <PostCard
                    post={post}
                    tags={post.tags}
                    commentsCount={commentsCount[post.id] || 0}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 m-0">📰 Publicaciones recientes</h2>
          <span className="text-muted small">
            {regular.length} {regular.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        <div className="posts-grid">
          {regular.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard
                post={post}
                tags={post.tags}
                commentsCount={commentsCount[post.id] || 0}
              />
            </motion.div>
          ))}
        </div>

        {regular.length === 0 && (
          <Card className="card-glass mt-4">
            <Card.Body className="text-center text-muted">
              No hay publicaciones disponibles.
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
}
