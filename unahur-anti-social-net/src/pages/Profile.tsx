import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";
import type { Post } from "../types";
import {
    Container,
    Card,
    Button,
    Spinner,
    Alert,
    Image,
    Row,
    Col,
} from "react-bootstrap";
import PostCard from "../components/PostCard";

export default function Profile() {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(
        user?.avatar || "/src/Imagenes/default-avatar.png"
    );

    useEffect(() => {
        if (!user) return;
        api
            .getPostsByUser(user.id)
            .then(setPosts)
            .finally(() => setLoading(false));
    }, [user]);

    if (!user) return null;

    const handleEditProfile = () => {
        const newUrl = prompt("📸 Pegá la URL de tu nueva foto de perfil:");
        if (newUrl && newUrl.trim() !== "") {
            setProfileImage(newUrl.trim());
        }
    };

    return (
        <Container className="py-4">
            <Row className="g-4">
                <Col xs={12} md={4} lg={3}>
                    <Card className="p-4 shadow-sm text-center card-glass">
                        <div className="d-flex justify-content-center mb-3">
                            <Image
                                src={profileImage}
                                roundedCircle
                                style={{
                                    width: "140px",
                                    height: "140px",
                                    objectFit: "cover",
                                    border: "3px solid var(--acc)",
                                }}
                            />
                        </div>

                        <h3 className="fw-bold mb-2">{user.nickName}</h3>
                        <p className="text-muted mb-3">{user.email}</p>

                        <div className="d-grid gap-2">
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleEditProfile}
                            >
                                Editar perfil
                            </Button>
                            <Button
                                as={Link}
                                to="/new"
                                variant="primary"
                                className="btn-pill"
                                size="sm"
                            >
                                Nuevo post
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={logout}
                                className="btn-pill"
                            >
                                Cerrar sesión
                            </Button>
                        </div>
                    </Card>
                </Col>

                <Col xs={12} md={8} lg={9}>
                    <Card className="card-glass p-3 mb-4">
                        <h4 className="fw-semibold mb-3">Mis publicaciones</h4>

                        {loading ? (
                            <div className="text-center py-3">
                                <Spinner animation="border" />
                            </div>
                        ) : posts.length === 0 ? (
                            <Alert variant="info">No publicaste nada todavía.</Alert>
                        ) : (
                            <div className="posts-grid">
                                {posts.map((p) => (
                                    <PostCard key={p.id} post={p} />
                                ))}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
