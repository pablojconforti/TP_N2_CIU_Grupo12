import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import type { Comment, Post, PostImage, Tag } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Card,
  Form,
  Button,
  Spinner,
  Alert,
  ListGroup,
  Image,
  Carousel,
  Stack,
  Badge,
} from 'react-bootstrap';

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

  if (loading)
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  if (error)
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );
  if (!post) return <p>No encontrada</p>;

  return (
    <Container className="py-4">
      <Card className="card-glass mb-4 p-3">
        <h3 className="fw-bold mb-3">Post #{post.id}</h3>
        <Card.Text className="mb-3" style={{ whiteSpace: 'pre-wrap' }}>
          {post.description}
        </Card.Text>

        {tags.length > 0 && (
          <Stack direction="horizontal" gap={2} className="flex-wrap mb-3">
            {tags.map((t) => (
              <Badge key={t.id} bg="" className="badge-soft">
                #{t.name}
              </Badge>
            ))}
          </Stack>
        )}

        {images.length > 0 && (
          <Carousel variant="dark" className="rounded overflow-hidden">
            {images.map((img) => (
              <Carousel.Item key={img.id}>
                <div
                  className="d-flex justify-content-center"
                  style={{ background: 'rgba(0,0,0,.2)' }}
                >
                  <Image
                    src={img.url}
                    alt="post"
                    style={{ maxHeight: 420, objectFit: 'contain' }}
                  />
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </Card>

      <Card className="card-glass p-3">
        <h5 className="mb-3">Comentarios ({comments.length})</h5>
        <Form onSubmit={submit} className="mb-3">
          <Form.Control
            as="textarea"
            className="input-soft"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribí tu comentario…"
            rows={2}
          />
          <div className="d-flex justify-content-end mt-2">
            <Button variant="primary" type="submit" className="btn-gradient btn-pill">
              Publicar
            </Button>
          </div>
        </Form>

        <ListGroup variant="flush">
          {comments.map((c) => (
            <ListGroup.Item
              key={c.id}
              className="bg-transparent text-light"
              style={{ borderColor: 'var(--border)' }}
            >
              <strong>{c.User?.nickName || `Usuario #${c.UserId}`}</strong>: {c.content}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
      </Card>
    </Container>
  );
}
