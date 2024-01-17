import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../App";

export default function Sidebar() {
    const userContext = useContext(UserContext);

    return (
        <div className="d-flex flex-column flex-shrink-0">
            <ListGroup className="bg-primary">
                <LinkContainer to={'profile'} state={{ profileID: userContext.profileId}}>
                    <ListGroup.Item variant="secondary" action>Profile</ListGroup.Item>
                </LinkContainer>
                <LinkContainer to={'feed'}>
                    <ListGroup.Item variant="secondary" action>Feed</ListGroup.Item>
                </LinkContainer>

                
            </ListGroup>
        </div>
    )
}