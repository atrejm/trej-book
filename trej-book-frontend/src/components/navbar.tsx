import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function NavHeader() {

    return(
        <Navbar className="bg-body-tertiary">
            <Container>
                <LinkContainer to={'home'}>
                    <Navbar.Brand>
                        Trej-book
                    </Navbar.Brand>
                </LinkContainer>
                <LinkContainer to={'login'}>
                    <Nav.Link>
                        Login
                    </Nav.Link>
                </LinkContainer>
                
            </Container>
        </Navbar>
    )
}