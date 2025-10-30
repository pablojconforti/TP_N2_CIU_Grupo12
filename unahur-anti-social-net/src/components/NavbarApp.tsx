import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react'; // opcional, íconos bonitos

export default function NavbarApp() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar
            expand="md"
            variant="dark"
            sticky="top"
            className="py-3"
            style={{
                backgroundColor: 'var(--bg)',
                borderBottom: '1px solid #182235',
                transition: 'background 0.3s ease',
            }}
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold" style={{ color: 'var(--acc)' }}>
                    UnaHur Net
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" style={{ color: 'var(--fg)' }}>
                            Inicio
                        </Nav.Link>
                        <Nav.Link as={Link} to="/new" style={{ color: 'var(--fg)' }}>
                            Nuevo Post
                        </Nav.Link>
                        <Nav.Link as={Link} to="/profile" style={{ color: 'var(--fg)' }}>
                            Perfil
                        </Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={toggleTheme}
                            style={{ borderColor: '#24304b', color: 'var(--fg)' }}
                        >
                            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                        </Button>

                        {user ? (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleLogout}
                                style={{ color: 'var(--fg)', borderColor: '#24304b' }}
                            >
                                Cerrar sesión
                            </Button>
                        ) : (
                            <>
                                <Button as={Link} to="/login" variant="primary" size="sm" className="me-2">
                                    Iniciar sesión
                                </Button>
                                <Button as={Link} to="/register" variant="outline-secondary" size="sm">
                                    Registrarse
                                </Button>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
