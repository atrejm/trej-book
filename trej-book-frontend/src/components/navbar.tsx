import { MouseEventHandler, useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function NavHeader() {
    //const userContext = useContext(UserContext);
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout: MouseEventHandler<HTMLElement> = () => {
        sessionStorage.removeItem("user");
        setCurrentUser({
            _id: null,
            jwToken: null,
            loggedIn: false,
        });
        navigate('../login')
    } 


    return(
        <Navbar className="bg-body-tertiary">
            <Container>
                <LinkContainer to={'../home'}>
                    <Navbar.Brand>
                        Trej-book {currentUser?.loggedIn? <small style={{color:"gray"}}>logged in as: {currentUser?.username}</small>: <></>}
                    </Navbar.Brand>
                </LinkContainer>
                {currentUser?.loggedIn
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