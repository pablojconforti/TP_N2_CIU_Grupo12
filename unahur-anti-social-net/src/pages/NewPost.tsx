import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { Tag } from '../types';
import { useAuth } from '../context/AuthContext';

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
    <div className="container narrow">
      <h1>Nueva publicación</h1>

      <form onSubmit={submit} className="form">
        <label>
          Descripción
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>

        <fieldset>
          <legend>Imágenes (URLs opcionales)</legend>

          {imageUrls.map((val, idx) => (
            <input
              key={idx}
              placeholder="https://…"
              value={val}
              onChange={(e) => updateImage(idx, e.target.value)}
            />
          ))}

          <button type="button" className="btn secondary" onClick={addImageField}>
            + Agregar otra URL
          </button>
        </fieldset>

        <fieldset>
          <legend>Etiquetas</legend>
          <div className="tags">
            {tags.map((t) => (
              <label
                key={t.id}
                className={selectedTagIds.includes(t.id) ? 'tag selected' : 'tag'}
              >
                <input
                  type="checkbox"
                  checked={selectedTagIds.includes(t.id)}
                  onChange={() => toggleTag(t.id)}
                />{' '}
                #{t.name}
              </label>
            ))}
          </div>
        </fieldset>

        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Publicando…' : 'Publicar'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
