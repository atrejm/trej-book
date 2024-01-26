import { Card } from "react-bootstrap";

interface props {
    profilePicURL: string;
    firstName: string | undefined;
    lastName: string | undefined;
    bio: string | undefined;
}

export default function Header({profilePicURL, firstName, lastName, bio} : props) {

    return (
        <Card style={{width: '100%'}}>
            <Card.Img variant="top" src={profilePicURL} />
            <Card.Body className="">
                <Card.Title>
                    <u><strong>{firstName} {lastName}</strong></u>
                </Card.Title>
                <Card.Text>
                    Bio: {bio}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}