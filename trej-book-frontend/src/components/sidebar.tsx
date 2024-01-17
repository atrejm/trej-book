import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Sidebar() {
    return (
        <div className="d-flex flex-column flex-shrink-0">
            <ListGroup className="bg-primary">
                <LinkContainer to={'profile'}>
                    <ListGroup.Item variant="secondary" action>Profile</ListGroup.Item>
                </LinkContainer>
                <LinkContainer to={'feed'}>
                    <ListGroup.Item variant="secondary" action>Feed</ListGroup.Item>
                </LinkContainer>

                
            </ListGroup>
        </div>
    )
}