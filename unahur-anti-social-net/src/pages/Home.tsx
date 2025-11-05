import { useEffect, useMemo, useState, useRef } from "react";
import { Container, Card, Stack, Spinner, Alert } from "react-bootstrap";
import { api } from "../api";
import type { Post, Tag } from "../types";
import PostCard from "../components/PostCard";
import TagFilter from "../components/TagFilter";
import HeroBanner from "../components/HeroBanner";
import { motion } from "framer-motion";

export default function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [commentsCount, setCommentsCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<number | "all">("all");
  const [page, setPage] = useState(1);
  const [featuredIds, setFeaturedIds] = useState<number[]>([]);
  const postsPerPage = 6;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // === 🧠 Cargar IDs de publicaciones destacadas desde localStorage ===
  useEffect(() => {
    const saved = localStorage.getItem("featuredPosts");
    if (saved) setFeaturedIds(JSON.parse(saved));
  }, []);

  // === 📥 Cargar todas las publicaciones una sola vez ===
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await api.getPosts();
        const normalized = (raw as any[]).map((p) => ({
          ...p,
          tags: p.tags ?? p.Tags ?? [],
        })) as Post[];

        setAllPosts(normalized);
        setVisiblePosts(normalized.slice(0, postsPerPage));

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

  // === ♾️ Scroll infinito simulado (sin repetir posts) ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => {
            const nextPage = p + 1;
            const nextSlice = allPosts.slice(0, nextPage * postsPerPage);
            setVisiblePosts(nextSlice);
            return nextPage;
          });
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [allPosts]);

  // === 🧩 Filtrado por etiqueta ===
  const filtered = useMemo(() => {
    if (selectedTag === "all") return visiblePosts;
    return visiblePosts.filter((p) =>
      (p.tags ?? []).some((t: Tag) => t.id === selectedTag)
    );
  }, [visiblePosts, selectedTag]);

  // === 🌟 Publicaciones destacadas (solo las elegidas en Profile) ===
  const featured = useMemo(() => {
    return allPosts.filter((post) => featuredIds.includes(post.id));
  }, [allPosts, featuredIds]);

  return (
    <>
      <HeroBanner />

      <Container className="py-4">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            {error}
          </Alert>
        )}

        {/* 🌟 Publicaciones destacadas */}
        {featured.length > 0 && (
          <Card className="card-glass p-3 mb-4">
            <h2 className="h5 mb-3">🌟 Publicaciones destacadas</h2>
            <div className="d-flex flex-wrap gap-3">
              {featured.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex-grow-1"
                  style={{ minWidth: "250px" }}
                >
                  <PostCard
                    post={post}
                    tags={post.tags}
                    commentsCount={commentsCount[post.id] || 0}
                  />
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Filtro de etiquetas */}
        <Card className="card-glass p-3 mb-4">
          <Stack
            direction="horizontal"
            className="justify-content-between flex-wrap gap-3"
          >
            <h2 className="h5 m-0">Etiquetas</h2>
            <TagFilter selected={selectedTag} onChange={setSelectedTag} />
          </Stack>
        </Card>

        {/* Lista de publicaciones */}
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h5 m-0">Publicaciones recientes</h2>
          <span className="text-muted small">
            {filtered.length}{" "}
            {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        <div className="posts-grid">
          {filtered.map((post) => (
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

        {/* Loader infinito */}
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" />
          </div>
        )}
        <div ref={loaderRef} />
      </Container>
    </>
  );
}
