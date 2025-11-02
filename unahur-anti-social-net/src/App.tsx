import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import NewPost from './pages/NewPost';
import ProtectedRoute from './components/ProtectedRoute';
import NavbarApp from './components/NavbarApp';
import FooterApp from './components/FooterApp';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

export default function App() {
    return (
        <AuthProvider>
                <NavbarApp />

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/post/:id" element={<PostDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/new"
                            element={
                                <ProtectedRoute>
                                    <NewPost />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </main>

                <FooterApp />
        </AuthProvider>
    );
}
