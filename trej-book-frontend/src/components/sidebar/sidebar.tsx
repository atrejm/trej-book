import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from "../../App";
import Friends from "./friendslist";

export default function Sidebar() {
    const userContext = useContext(UserContext);

    return (
        <>
            <div className="d-flex flex-column flex-shrink-0 mb-5">
                <h5 className="text-center bg-secondary">Navigation</h5>
                <ListGroup variant="flush" className="bg-primary">
                    <LinkContainer to={'profile'} state={{ profileID: userContext.profile}}>
                        <ListGroup.Item variant="secondary" action>Profile</ListGroup.Item>
                    </LinkContainer>
                    <LinkContainer to={'feed'}>
                        <ListGroup.Item variant="secondary" action>Feed</ListGroup.Item>
                    </LinkContainer>
                </ListGroup>
            </div>
            <div className="d-flex flex-column flex-shrink-0 mb-5">
                <Friends />
            </div>
        </>
    )
}