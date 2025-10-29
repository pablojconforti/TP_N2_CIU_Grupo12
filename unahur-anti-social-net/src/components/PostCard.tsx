import { Link } from 'react-router-dom';
import type { Post, Tag } from '../types';


interface Props {
post: Post;
tags?: Tag[];
commentsCount?: number;
}


export default function PostCard({ post, tags = post.tags, commentsCount = post.commentsCount }: Props) {
return (
<article className="card">
<p className="description">{post.description}</p>
{tags && tags.length > 0 && (
<div className="tags">
{tags.map((t) => (
<span key={t.id} className="tag">#{t.name}</span>
))}
</div>
)}
<div className="meta">
<small>{commentsCount ?? 0} comments</small>
<Link to={`/post/${post.id}`} className="btn">Ver más</Link>
</div>
</article>
);
}