import { createContext, useContext, useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IUser } from "../../App";
import { UserContext } from '../../App';
import { getFriendsList } from "../../helpers/request";
import { LinkContainer } from "react-router-bootstrap";

export const FriendsListContext = createContext<Array<IUser>>([])

export default function Friends() {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [friends, setFriends] = useState<Array<IUser>>([]);

    useEffect(() => {
            console.log("getting friend data")
            async function fetchData() {
            const url = sessionStorage.getItem("API_URL") + `profile/${currentUser.profile._id}/friends`
            const friendList = await getFriendsList(url, currentUser.jwToken);
            
            console.log("friends list: ", friendList);
            friendList.forEach((friend) => {
                // if (!userContext.friends || !friend.userId)
                //     return;

                console.log("adding friend");
                //@ts-expect-error pls shutp
                currentUser.profile.friends.push(friend._id);
            }) 

            setFriends(friendList);
        }

        fetchData()
    }, [currentUser, setCurrentUser])

    return(
        <>
            <hr className=""></hr>
            <div className="d-flex flex-column flex-shrink-0 mb-5">
            <h5 className="text-center bg-secondary">Friends</h5>
            <ListGroup variant="flush" className="bg-primary">
                {friends?.map((friend) => (
                    <LinkContainer key={friend.profile} to={"profile"} state={{ profileID: friend.profile}}>
                        <a className="list-group-item list-group-item-action">{friend.firstname} {friend.lastname}</a>
                    </LinkContainer>
                    
                ))}
            </ListGroup>
            <Link to={"usersList"} className="text-center link-tertiary mb-2">Find Friends</Link>
            </div>
        </>
        
    )
}