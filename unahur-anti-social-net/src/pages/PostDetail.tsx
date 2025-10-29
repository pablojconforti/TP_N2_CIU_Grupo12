import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import type { Comment, Post, PostImage, Tag } from '../types';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);

  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  // 🔹 Cargar post, imágenes y comentarios
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const p = await api.getPost(postId);
        setPost(p);

        const [imgs, comms] = await Promise.all([
          api.getPostImages(postId).catch(() => []),
          api.getPostComments(postId).catch(() => []),
        ]);

        setImages(imgs);
        setComments(comms);
        setTags((p as any).tags ?? []);
      } catch (e: any) {
        setError(e.message || 'Error al cargar el post');
      } finally {
        setLoading(false);
      }
    })();
  }, [postId]);

  // 🔹 Enviar comentario
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return setError('Debes iniciar sesión para comentar');
    if (!content.trim()) return setError('El comentario es obligatorio');

    try {
      setError(null);
      await api.createComment({
        postId,
        userId: user.id,
        content: content.trim(),
      });

      setContent('');
      const refreshed = await api.getPostComments(postId).catch(() => []);
      setComments(refreshed);
    } catch (e: any) {
      setError(e.message || 'No se pudo crear el comentario');
    }
  };

  if (loading) return <p>Cargando publicación…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!post) return <p>No encontrada</p>;

  return (
    <div className="container">
      <article className="card">
        <h1>Post #{post.id}</h1>
        <p className="description">{post.description}</p>

        {tags.length > 0 && (
          <div className="tags">
            {tags.map((t) => (
              <span key={t.id} className="tag">
                #{t.name}
              </span>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="images">
            {images.map((img) => (
              <img key={img.id} src={img.url} alt="post" />
            ))}
          </div>
        )}
      </article>

      {/* 🔹 Sección de comentarios */}
      <section className="card">
        <h2>Comentarios ({comments.length})</h2>

        <form onSubmit={submit} className="form">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí tu comentario…"
            required
          />
          <button className="btn" type="submit">
            Publicar comentario
          </button>
        </form>

        <ul className="comments">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <strong>
                {c.User?.nickName
                  ? c.User.nickName
                  : `Usuario #${c.UserId ?? '-'}`}
              </strong>
              : {c.content}
            </li>
          ))}
        </ul>

        {error && <p className="error mt">{error}</p>}
      </section>
    </div>
  );
}
