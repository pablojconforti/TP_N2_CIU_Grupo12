import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import type { Post } from '../types';


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
<div className="container">
<header className="profile">
<h1>@{user.nickName}</h1>
<div className="actions">
<Link to="/new" className="btn">Nuevo post</Link>
<button className="btn secondary" onClick={logout}>Cerrar sesión</button>
</div>
</header>


<section>
<h2>Mis publicaciones</h2>
{loading ? (
<p>Cargando…</p>
) : posts.length === 0 ? (
<p>No publicaste nada todavía.</p>
) : (
<ul className="list">
{posts.map((p) => (
<li key={p.id} className="row">
<span className="description">{p.description}</span>
<Link to={`/post/${p.id}`} className="btn">Ver más</Link>
</li>
))}
</ul>
)}
</section>
</div>
);
}