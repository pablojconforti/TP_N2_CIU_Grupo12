import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


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
<div className="container narrow">
<h1>Iniciar sesión</h1>
<form onSubmit={submit} className="form">
<label>NickName
<input value={nickName} onChange={(e) => setNickName(e.target.value)} required />
</label>
<label>Contraseña
<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
</label>
<button className="btn" disabled={loading} type="submit">{loading ? 'Ingresando…' : 'Ingresar'}</button>
{error && <p className="error">{error}</p>}
</form>
<p>¿No tenés cuenta? <Link to="/register">Registrate</Link></p>
</div>
);
}