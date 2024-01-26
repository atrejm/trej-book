import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { createUser } from "../helpers/request";
import { useNavigate } from "react-router-dom";

export type UserCreationError = {
    path: string
    type: string,
    value: string,
    msg: string
}

export default function Register() {
    const [firstname, setFirstname] = useState<string>();
    const [lastname, setLastname] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [errors, setErrors] = useState<UserCreationError[]>();
    const [password, setPassword] = useState<string>();
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>();

    const navigate = useNavigate();
    
    const handleRegister = async () => {
        if(password !== passwordConfirmation)
            return;
        const url = sessionStorage.getItem("API_URL") + "users/"
        const body = {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email,
            password: password
        }
        const response = await createUser(url, body)

        if(response.errors) {
            console.error("Error in creation of user");
            setErrors(response.errors);
        } else {
            console.log("Successfully created: ", response.success?.user, response.success?.profile);
            navigate("../login")
        }
    }

    return(
        <Container className="text-center" style={{maxWidth: "40vw"}}>
            <Form onSubmit={handleRegister} >
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter firstname" onChange={(e) => setFirstname(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Confirm lastname" onChange={(e) => setLastname(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" >
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="username" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" >
                    <Form.Label>email</Form.Label>
                    <Form.Control type="email" placeholder="email@" onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type="password" placeholder="Confirm password" onChange={(e) => setPasswordConfirmation(e.target.value)} />
                            {passwordConfirmation && (password != passwordConfirmation) ?
                                <span className="text-danger">Passwords do not match</span>:<></>}
                        </Form.Group>
                    </Col>
                </Row>
                <hr className="mb-3"></hr>
                {errors?
                    <div>
                        <ul className="text-danger">
                            {errors.map((err) => (
                                <li>{err.msg}</li>
                            ))}
                        </ul>
                    </div>
                    :<></>
                }
                <Button variant="success" onClick={handleRegister}>
                    Register
                </Button>
            </Form>
        </Container>
    )
}