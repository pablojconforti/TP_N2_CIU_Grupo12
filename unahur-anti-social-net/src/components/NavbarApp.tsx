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

    const isDark = theme === "dark";

    return (
        <Navbar
            expand="md"
            sticky="top"
            className="py-3 shadow-sm"
            style={{
                backgroundColor: "var(--bg)",
                transition: "background 0.3s ease, color 0.3s ease",
                borderBottom: isDark
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "1px solid rgba(0, 0, 0, 0.1)",
            }}
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bold d-flex align-items-center gap-2"
                    style={{
                        color: "white",
                        textDecoration: "none",
                    }}
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
                            className="d-flex align-items-center gap-1"
                            style={{
                                color: "white",
                                fontWeight: 500,
                            }}
                        >
                            <Home size={18} /> Inicio
                        </Nav.Link>

                        <Nav.Link
                            as={Link}
                            to="/profile"
                            className="d-flex align-items-center gap-1"
                            style={{
                                color: "white",
                                fontWeight: 500,
                            }}
                        >
                            <User size={18} /> Perfil
                        </Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center gap-2">
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={toggleTheme}
                            title="Cambiar tema"
                            style={{
                                borderColor: "white",
                                color: "white",
                            }}
                        >
                            {isDark ? <Sun size={16} /> : <Moon size={16} />}
                        </Button>

                        {user ? (
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={handleLogout}
                                style={{ borderColor: "white", color: "white" }}
                            >
                                Cerrar sesión
                            </Button>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="primary"
                                    size="sm"
                                    className="me-2"
                                >
                                    Iniciar sesión
                                </Button>
                                <Button
                                    as={Link}
                                    to="/register"
                                    variant="outline-light"
                                    size="sm"
                                    style={{ borderColor: "white", color: "white" }}
                                >
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
