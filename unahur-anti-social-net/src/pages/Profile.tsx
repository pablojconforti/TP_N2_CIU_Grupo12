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
import avatarDefault from "../Imagenes/avatarDefault.png";

export default function Profile() {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [featured, setFeatured] = useState<number[]>([]);
    const [profileImage, setProfileImage] = useState(
        user?.avatar || avatarDefault
    );

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        api
            .getPostsByUser(user.id)
            .then(setPosts)
            .finally(() => setLoading(false));
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const key = `featuredPosts_${user.id}`;
        const saved = localStorage.getItem(key);

        try {
            setFeatured(saved ? JSON.parse(saved) : []);
        } catch {
            setFeatured([]);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            const key = `featuredPosts_${user.id}`;
            localStorage.setItem(key, JSON.stringify(featured));
        }
    }, [featured, user]);

    if (!user)
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning" className="shadow-sm">
                    ⚠️ <strong>Iniciá sesión</strong> para ver tu perfil y publicaciones.
                </Alert>
            </Container>
        );

    const handleEditProfile = () => {
        const newUrl = prompt("📸 Pegá la URL de tu nueva foto de perfil:");
        if (newUrl && newUrl.trim() !== "") {
            setProfileImage(newUrl.trim());
        }
    };

    const toggleFeatured = (postId: number) => {
        setFeatured((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
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
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = avatarDefault;
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
                            <Alert variant="info">
                                Todavía no tenés publicaciones.
                            </Alert>
                        ) : (
                            <div className="posts-grid">
                                {posts.map((p) => {
                                    const isFeatured = featured.includes(p.id);
                                    return (
                                        <div
                                            key={p.id}
                                            className={`position-relative ${isFeatured ? "featured-border" : ""
                                                }`}
                                        >
                                            <PostCard post={p} />
                                            <Button
                                                variant={
                                                    isFeatured
                                                        ? "warning"
                                                        : "outline-warning"
                                                }
                                                size="sm"
                                                className="position-absolute top-0 end-0 m-2"
                                                onClick={() => toggleFeatured(p.id)}
                                            >
                                                {isFeatured
                                                    ? "★ Quitar"
                                                    : "☆ Destacar"}
                                            </Button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
