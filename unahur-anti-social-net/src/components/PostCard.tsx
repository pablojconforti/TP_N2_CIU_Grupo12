import { Card, Image, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { Post, Tag } from "../types";
import "../styles/PostCard.css";

interface Props {
    post: Post;
    tags?: Tag[];
    commentsCount?: number;
}

export default function PostCard({
    post,
    tags = post.tags,
    commentsCount = post.commentsCount,
}: Props) {
    const firstImage =
        (post as any)?.PostImages?.[0]?.url ||
        (post as any)?.images?.[0]?.url ||
        (post as any)?.imageUrl ||
        (post as any)?.image ||
        null;

    const userName = (post as any)?.User?.nickName || (post as any)?.user?.nickName || "Usuario";

    return (
        <Card className="post-card border-0 rounded-4 shadow-sm">
            {firstImage && (
                <Link to={`/post/${post.id}`} className="post-image-container">
                    <Image src={firstImage} alt="post" className="post-image" />
                    <div className="post-overlay">
                        <div className="overlay-icons">
                            <span>❤️</span>
                            <span>💬 {commentsCount ?? 0}</span>
                        </div>
                    </div>
                </Link>
            )}

            <Card.Body>
                <div className="fw-semibold mb-2 text-secondary">@{userName}</div>

                <Card.Text
                    className="mb-3"
                    style={{ whiteSpace: "pre-wrap", minHeight: "60px" }}
                >
                    {post.description}
                </Card.Text>

                {tags && tags.length > 0 && (
                    <div className="mb-2 d-flex flex-wrap gap-2">
                        {tags.map((t) => (
                            <span
                                key={t.id}
                                className="badge bg-secondary bg-opacity-25 text-secondary"
                            >
                                #{t.name}
                            </span>
                        ))}
                    </div>
                )}

                <Stack direction="horizontal" className="justify-content-between">
                    <small className="text-muted">{commentsCount ?? 0} comentarios</small>
                    <Link
                        to={`/post/${post.id}`}
                        className="text-decoration-none fw-semibold"
                        style={{ color: "var(--acc)" }}
                    >
                        Ver más →
                    </Link>
                </Stack>
            </Card.Body>
        </Card>
    );
}
