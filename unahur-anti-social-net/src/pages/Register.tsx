import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Register() {
  const nav = useNavigate();

  // Estados de los campos
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Validaciones básicas
    if (!nickName.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validación de formato de email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('El correo electrónico no es válido');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 2️⃣ Crear usuario en el backend
      await api.createUser({
        nickName: nickName.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      // 3️⃣ Redirigir al login después del registro
      nav('/login');
    } catch (e: any) {
      // 4️⃣ Mostrar mensaje de error real del backend
      setError(e.message || 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container narrow">
      <h1>Registro</h1>

      <form onSubmit={submit} className="form" noValidate>
        <label>
          NickName
          <input
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            required
            placeholder="tu_nick"
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@email.com"
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="mínimo 6 caracteres"
          />
        </label>

        <button className="btn" disabled={loading} type="submit">
          {loading ? 'Creando…' : 'Crear cuenta'}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
}
