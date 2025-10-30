import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Tag } from '../types';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';

export default function NewPost() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>(['']);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getTags().then(setTags);
  }, []);

  const addImageField = () => setImageUrls((prev) => [...prev, '']);
  const updateImage = (idx: number, val: string) =>
    setImageUrls((prev) => prev.map((v, i) => (i === idx ? val : v)));
  const toggleTag = (id: number) =>
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError('Debes iniciar sesión');
    if (!description.trim()) return setError('La descripción es obligatoria');

    setLoading(true);
    setError(null);
    try {
      const post = await api.createPost({
        description: description.trim(),
        userId: user.id,
        tags: selectedTagIds,
      });

      const urls = imageUrls.map((u) => u.trim()).filter(Boolean);
      if (urls.length) {
        await Promise.all(urls.map((url) => api.createPostImage({ url, postId: post.id })));
      }

      nav(`/post/${post.id}`);
    } catch (e: any) {
      setError(e.message || 'No se pudo crear la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="p-4 shadow-sm">
        <h2 className="fw-bold mb-3">Nueva publicación</h2>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={submit}>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Imágenes (URLs opcionales)</Form.Label>
            {imageUrls.map((val, idx) => (
              <Form.Control
                key={idx}
                className="mb-2"
                placeholder="https://…"
                value={val}
                onChange={(e) => updateImage(idx, e.target.value)}
              />
            ))}
            <Button variant="outline-secondary" onClick={addImageField}>
              + Agregar otra URL
            </Button>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Etiquetas</Form.Label>
            <Row>
              {tags.map((t) => (
                <Col xs={6} sm={4} md={3} key={t.id}>
                  <Form.Check
                    type="checkbox"
                    id={`tag-${t.id}`}
                    label={`#${t.name}`}
                    checked={selectedTagIds.includes(t.id)}
                    onChange={() => toggleTag(t.id)}
                  />
                </Col>
              ))}
            </Row>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Publicar'}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}
