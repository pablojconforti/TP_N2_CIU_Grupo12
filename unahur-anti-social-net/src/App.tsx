import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewPost from './pages/NewPost';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles.css';


function NavBar() {
const { user } = useAuth();
return (
<nav className="nav">
<Link to="/" className="brand">UASN</Link>
<div className="spacer" />
{user ? (
<>
<Link to="/new">Nuevo</Link>
<Link to="/profile">@{user.nickName}</Link>
</>
) : (
<>
<Link to="/login">Login</Link>
<Link to="/register">Registro</Link>
</>
)}
</nav>
);
}


export default function App() {
return (
<AuthProvider>
<BrowserRouter>
<NavBar />
<Routes>
<Route path="/" element={<Home />} />
<Route path="/post/:id" element={<PostDetail />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/new" element={<ProtectedRoute><NewPost /></ProtectedRoute>} />
</Routes>
</BrowserRouter>
</AuthProvider>
);
}