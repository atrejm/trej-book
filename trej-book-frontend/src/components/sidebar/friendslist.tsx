import { Container, ListGroup } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link } from "react-router-dom";

export default function Friends() {

    return(
        <>
            <hr className=""></hr>
            <h5 className="text-center">Friends</h5>
            <Link to={"usersList"} className="text-center link-tertiary mb-2">Find Friends</Link>
            <ListGroup variant="flush" className="bg-primary">
                <ListGroup.Item>Friend1</ListGroup.Item>
                <ListGroup.Item>Friend2</ListGroup.Item>
                <ListGroup.Item>Friend3</ListGroup.Item>
            </ListGroup>
        </>
        
    )
}