import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/HeroBanner.css";

export default function HeroBanner() {
    return (
        <div className="hero-banner">
            <div className="overlay"></div>

            <Container className="text-center text-light position-relative z-1">
                <h1 className="fw-bold display-5 mb-2">UnaHur Anti-Social Net</h1>
                <p className="fs-5 mb-4">Vení, hacete amigo que no mordemos.</p>

                <Button as={Link} to="/new" variant="light" className="btn-pill me-2">
                    Crear Post
                </Button>
                <Button as={Link} to="/profile" variant="outline-light" className="btn-pill">
                    Ver Perfil
                </Button>
            </Container>
        </div>
    );
}
