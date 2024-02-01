import { FormEventHandler, MouseEventHandler, useContext, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { login } from "../helpers/request";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fieldErrors, setFieldErrors] = useState<string | null>(null)

    const navigate = useNavigate();
    // const currentUser = useContext(UserContext);
    const {currentUser, setCurrentUser} = useContext(UserContext);
    

    const handleLogin: FormEventHandler = async (e) => {
        e.preventDefault();
        const url: string | null = sessionStorage.getItem("API_URL") + "users/login";


        const response = await login(url, currentUser?.jwToken, {username, password})
        
        console.log(response);

        if (response.error) {
            setFieldErrors(response.error);
        } else if (response.user && response.token) {
            // User authenticated
            console.log("logging in and writing: ", response)
            const user = response.user;
            
            user.jwToken = response.token;
            user.loggedIn = true;
            setCurrentUser(user);
            sessionStorage.setItem("token", JSON.stringify(user.jwToken));
            sessionStorage.setItem("user", JSON.stringify(user));
            navigate('../home');
        }
    }
    
    const handleSampleLogin: MouseEventHandler<HTMLButtonElement> = async () => {
        const url: string | null = sessionStorage.getItem("API_URL") + "users/login";


        const response = await login(url, currentUser?.jwToken, {username: "sampleuser", password: "sample"})
        
        console.log(response);

        if (response.error) {
            setFieldErrors(response.error);
        } else if (response.user && response.token) {
            // User authenticated
            console.log("logging in and writing: ", response)
            const user = response.user;
            
            user.jwToken = response.token;
            user.loggedIn = true;
            setCurrentUser(user);
            sessionStorage.setItem("token", JSON.stringify(user.jwToken));
            sessionStorage.setItem("user", JSON.stringify(user));
            navigate('../home');
        }
    }

    return (
        <Container className="text-center" style={{maxWidth: '30vw'}}>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                {fieldErrors ?
                <ul>
                    <li className="text-danger" style={{textAlign:"left"}}><small>{fieldErrors}</small></li>
                </ul>
                :<></>}
                <Button variant="success" as="input" type="submit" value="login" size="sm"></Button>
            </Form>
            <hr className="my-5"></hr>
            <h6>First time User?</h6>
            <LinkContainer to={'../register'}>
                <Button variant="success" size="sm">Register</Button>
            </LinkContainer>
            <small> or </small>
            <LinkContainer to={'../home'}>
                <Button variant="info" size="sm" onClick={handleSampleLogin}>Log in as sample account</Button>
            </LinkContainer>
        </Container>
    )
}