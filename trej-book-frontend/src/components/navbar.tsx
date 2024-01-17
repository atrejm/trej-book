import { MouseEventHandler, useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function NavHeader() {
    const userContext = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout: MouseEventHandler<HTMLElement> = () => {
        userContext.loggedIn = false
        sessionStorage.removeItem("user");
        navigate('..')
    } 


    return(
        <Navbar className="bg-body-tertiary">
            <Container>
                <LinkContainer to={'../home'}>
                    <Navbar.Brand>
                        Trej-book
                    </Navbar.Brand>
                </LinkContainer>
                {userContext.loggedIn
                ?
                <Nav.Link onClick={handleLogout}>
                    Logout
                </Nav.Link>
                :
                <LinkContainer to={'../login'}>
                    <Nav.Link>
                        Login
                    </Nav.Link>
                </LinkContainer>
                }
                
            </Container>
        </Navbar>
    )
}