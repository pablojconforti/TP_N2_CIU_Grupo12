import { Container, Nav, Navbar, Button, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../hooks/useTheme";
import { Moon, Sun, Home, User } from "lucide-react";
import logo from "../Imagenes/Logo.png";

export default function NavbarApp() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Navbar
            expand="md"
            variant="dark"
            sticky="top"
            className="py-3 shadow-sm"
            style={{
                backgroundColor: "var(--bg)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                transition: "background 0.3s ease",
            }}
        >
            <Container>

                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bold d-flex align-items-center gap-2"
                    style={{ color: "var(--acc)", textDecoration: "none" }}
                >
                    <Image
                        src={logo}
                        alt="Logo UnaHur"
                        width={36}
                        height={36}
                        roundedCircle
                        style={{ objectFit: "cover" }}
                    />
                    <span>UnaHur Net</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto d-flex align-items-center gap-3">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className="d-flex align-items-center gap-1 text-light"
                        >
                            <Home size={18} /> Inicio
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/profile"
                            className="d-flex align-items-center gap-1 text-light"
                        >
                            <User size={18} /> Perfil
                        </Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={toggleTheme}
                            style={{ borderColor: "#24304b", color: "var(--fg)" }}
                        >
                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </Button>

                        {user ? (
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleLogout}
                                style={{ color: "var(--fg)", borderColor: "#24304b" }}
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
