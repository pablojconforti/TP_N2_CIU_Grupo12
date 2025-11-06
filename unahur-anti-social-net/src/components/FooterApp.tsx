import { Container, Row, Col } from 'react-bootstrap';


export default function FooterApp() {
    return (
        <footer className="py-4 mt-5" style={{ backgroundColor: 'var(--bg)', borderTop: '1px solid #182235', color: 'var(--muted)' }}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                        <small>© {new Date().getFullYear()} <strong>UnaHur Anti-Social Net</strong> — Proyecto académico con React.</small>
                    </Col>
                    <Col md={6} className="text-center text-md-end">
                        <a
                            href="https://unahur.edu.ar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "var(--acc)",
                                textDecoration: "none",
                                marginRight: "12px",
                            }}
                        >
                            UNAHUR
                        </a>

                        <a
                            href="https://github.com/pablojconforti/TP_N2_CIU_Grupo12"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "var(--fg)",
                                textDecoration: "none",
                                marginRight: "12px",
                            }}
                        >
                            GitHub
                        </a>

                        <a
                            href="https://x.com/unahurlingham?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: "var(--fg)",
                                textDecoration: "none",
                            }}
                        >
                            Twitter
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}