import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';


export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [nickName, setNickName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(nickName, password);
            nav('/');
        } catch (e: any) {
            setError(e.message || 'No se pudo iniciar sesión');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="py-5" style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,.15), rgba(34,211,238,.12))',
            minHeight: 'calc(100vh - 120px)'
        }}>
            <Container className="d-flex justify-content-center align-items-center">
                <Card className="card-glass p-4 shadow-sm" style={{ width: '100%', maxWidth: 480 }}>
                    <Card.Body>
                        <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={submit}>
                            <Form.Group className="mb-3">
                                <Form.Label>NickName</Form.Label>
                                <Form.Control className="input-soft" value={nickName} onChange={(e) => setNickName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-4">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control className="input-soft" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </Form.Group>
                            <div className="d-grid">
                                <Button type="submit" disabled={loading} className="btn-gradient btn-pill">
                                    {loading ? (<><Spinner animation="border" size="sm" /> Ingresando…</>) : 'Ingresar'}
                                </Button>
                            </div>
                        </Form>
                        <div className="text-center mt-3">
                            <span className="text-muted">¿No tenés cuenta? </span>
                            <Link to="/register">Registrate</Link>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}