import { Card } from "react-bootstrap";

interface props {
    profilePicURL: string;
    firstName: string;
    lastName: string;
    bio: string;
}

export default function Header({profilePicURL, firstName, lastName, bio} : props) {

    return (
        <Card style={{width: '100%'}}>
            <Card.Img variant="top" src={profilePicURL} />
            <Card.Body>
                <Card.Title>
                    {firstName} {lastName}
                </Card.Title>
                <Card.Text>
                    Bio: {bio}
                </Card.Text>
            </Card.Body>
        </Card>
    );
}