import { FormEventHandler, SetStateAction, useState } from "react";
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap";

export default function Login() {
    const [username, setUsername] = useState<SetStateAction<string>>("");
    const [password, setPassword] = useState<SetStateAction<string>>("");

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

        const resJSON = await res.json();
        console.log(resJSON);
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