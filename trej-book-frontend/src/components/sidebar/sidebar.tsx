import { useContext } from "react";
import { ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { UserContext } from '../../App';
import Friends from "./friendslist";

export default function Sidebar() {
    const {currentUser,} = useContext(UserContext);
    

    return (
        <div className="bg-tertiary">
            <div className="d-flex flex-column flex-shrink-0 mb-5">
                <h5 className="text-center bg-tertiary">Navigation</h5>
                <ListGroup variant="flush" className="bg-tertiary">
                    <LinkContainer to={'profile'} state={{ profileID: currentUser?.profile?._id}}>
                        <a className="list-group-item list-group-item-action">My Profile</a>
                    </LinkContainer>
                    <LinkContainer to={'feed'}>
                        <a className="list-group-item list-group-item-action">Feed</a>
                    </LinkContainer>
                </ListGroup>
            </div>
            <div className="d-flex flex-column flex-shrink-0 mb-5">
                <Friends />
            </div>
        </div>
    )
}