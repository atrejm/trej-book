import { FormEventHandler, useContext, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [fieldErrors, setFieldErrors] = useState<string | null>(null)

    const navigate = useNavigate();
    const userContext = useContext(UserContext);

    const handleLogin: FormEventHandler = async (e) => {
        e.preventDefault();
        const url: string | null = sessionStorage.getItem("API_URL") + "users/login";

        if(!url) {
            throw new Error("Invalid API key")
        }

        const res = await fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username:username, 
                password:password
            })
        });
        console.log(res);
        const resJSON = await res.json();
        
        if (resJSON.error) {
            setFieldErrors(resJSON.error);
        } else {
            // User authenticated
            console.log("logging in and writing: ", resJSON)
            userContext.jwToken = resJSON.token;
            userContext.userId = resJSON.user._id;
            userContext.profile = resJSON.user.profile._id;
            userContext.friends = resJSON.user.profile.friends;
            userContext.loggedIn = true;
            userContext.firstname = resJSON.user.firstname;
            userContext.lastname = resJSON.user.lastname;
            userContext.username = resJSON.user.username;
            sessionStorage.setItem("user", JSON.stringify(userContext));
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
                <Button variant="info" size="sm">Log in as sample account</Button>
            </LinkContainer>
        </Container>
    )
}