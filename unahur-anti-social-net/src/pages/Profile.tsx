import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Post } from '../types';
import { Container, Card, Button, Spinner, Table, Alert, Stack } from 'react-bootstrap';

export default function Profile() {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        api.getPostsByUser(user.id).then(setPosts).finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    return (
        <Container className="py-4">
            <Card className="p-4 shadow-sm mb-4">
                <Stack direction="horizontal" className="justify-content-between">
                    <h2 className="fw-bold">@{user.nickName}</h2>
                    <div>
                        <Button as={Link} to="/new" variant="primary" className="me-2">
                            Nuevo post
                        </Button>
                        <Button variant="outline-secondary" onClick={logout}>
                            Cerrar sesión
                        </Button>
                    </div>
                </Stack>
            </Card>

            <Card className="p-3 shadow-sm">
                <h4 className="fw-semibold mb-3">Mis publicaciones</h4>

                {loading ? (
                    <div className="text-center py-3">
                        <Spinner animation="border" />
                    </div>
                ) : posts.length === 0 ? (
                    <Alert variant="info">No publicaste nada todavía.</Alert>
                ) : (
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Descripción</th>
                                <th style={{ width: '120px' }}>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.description}</td>
                                    <td>
                                        <Button
                                            as={Link}
                                            to={`/post/${p.id}`}
                                            size="sm"
                                            variant="outline-primary"
                                        >
                                            Ver más
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Card>
        </Container>
    );
}
