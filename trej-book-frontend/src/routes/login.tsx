import { FormEventHandler } from "react";
import { Button, Container } from "react-bootstrap";
import Form from 'react-bootstrap/Form'
import { LinkContainer } from "react-router-bootstrap";

export default function Login() {
    const handleLogin: FormEventHandler = (e) => {
        e.preventDefault();
    }
    
    return (
        <Container className="text-center" style={{maxWidth: '30vw'}}>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="email" placeholder="Enter username" />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" />
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