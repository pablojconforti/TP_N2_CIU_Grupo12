import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';

export default function Register() {
  const nav = useNavigate();
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nickName.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('El correo electrónico no es válido');
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await api.createUser({
        nickName: nickName.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      nav('/login');
    } catch (e: any) {
      setError(e.message || 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="py-5"
      style={{
        background:
          'linear-gradient(135deg, rgba(139,92,246,.15), rgba(34,211,238,.12))',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <Container className="d-flex justify-content-center align-items-center">
        <Card
          className="card-glass p-4 shadow-sm"
          style={{ width: '100%', maxWidth: 480 }}
        >
          <Card.Body>
            <h2 className="text-center mb-4 fw-bold">Crear cuenta</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={submit}>
              <Form.Group className="mb-3">
                <Form.Label>NickName</Form.Label>
                <Form.Control
                  className="input-soft"
                  value={nickName}
                  onChange={(e) => setNickName(e.target.value)}
                  required
                  placeholder="tu_nick"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  className="input-soft"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  className="input-soft"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="mínimo 6 caracteres"
                />
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  className="btn-gradient btn-pill"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Creando…
                    </>
                  ) : (
                    'Crear cuenta'
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <span className="text-muted">¿Ya tenés cuenta? </span>
              <Link to="/login">Iniciá sesión</Link>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
