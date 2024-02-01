import { createContext, useContext, useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUser } from "../../App";
import { UserContext } from '../../App';
import { getFriendsList } from "../../helpers/request";
import { LinkContainer } from "react-router-bootstrap";

export const FriendsListContext = createContext<Array<IUser>>([])

export default function Friends() {
    const {currentUser,} = useContext(UserContext);
    const [friends, setFriends] = useState<Array<IUser>>([]);

    useEffect(() => {
            console.log("CurrentUserFriends", currentUser.profile?.friends)
            console.log("getting friend data")
            async function fetchData() {
            const url = sessionStorage.getItem("API_URL") + `profile/${currentUser.profile?._id}/friends`
            const friendList = await getFriendsList(url, currentUser.jwToken);
            
            console.log("friends list: ", friendList);

            setFriends(friendList);
        }

        fetchData()
    }, [currentUser])

    return(
        <>
            <hr className=""></hr>
            <div className="d-flex flex-column flex-shrink-0 mb-5">
            <h5 className="text-center bg-secondary">Friends</h5>
            <ListGroup variant="flush" className="bg-primary">
                {friends.map((friend) => (
                    <LinkContainer key={friend._id} to={"profile"} state={{ profileID: friend.profile}}>
                            <a className="list-group-item list-group-item-action">{friend.firstname} {friend.lastname}</a>
                    </LinkContainer>
                ))}
            </ListGroup>
            <Link to={"usersList"} className="text-center link-tertiary my-3">
                <Button className="btn-dark">Find Friends</Button>
            </Link>
            </div>
        </>
        
    )
}