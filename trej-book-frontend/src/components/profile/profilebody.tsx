import { useContext, useEffect, useState } from "react";
import Post, { IPost } from "./post";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import Header from "./header";
import { IUser, UserID } from "../../App";
import NewPostForm from "../forms/newPostForm";
import { ProfileID } from "../../routes/profile";
import { addFriend, getFullyHydratedUserData } from "../../helpers/request";
import { UserContext } from '../../App';
import { MISSING_PROFILE_PIC_ALTERNATIVE } from "../../config";

export interface IProfile {
    _id: ProfileID
    user: IUser,
    userID: UserID,
    profileID: ProfileID,
    friends: Array<UserID>,
    bio: string,
    profilePicURL: string,
    posts: Array<IPost>
}

export default function ProfileBody({ profileID }: { profileID: ProfileID | undefined }) {
    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [profileData, setProfileData] = useState<IProfile | null>(null);
    const [alreadyFriends, setAlreadyFriends] = useState<boolean>(false);
    const [posts, setPosts] = useState<Array<IPost>>([]);
    const [owner, setOwner] = useState<boolean>(false);

    useEffect(()=> {
        const getProfileData = async () => {
            const url: string | null = sessionStorage.getItem("API_URL") + `profile/${profileID}`;

            if(!url) {
                throw new Error("Invalid API key")
            }

            const res = await fetch(url, {
                method: "GET",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if(!res.ok){
                console.error("Error fetching profile data: ", res.status)
            }
            const resJSON = await res.json();

            let picURL;
            if(!resJSON.profilePicURL)
                picURL = MISSING_PROFILE_PIC_ALTERNATIVE
            else   
                picURL = resJSON.profilePicURL+"?s=200"

            const profile: IProfile = {
                _id: resJSON._id,
                user: resJSON.user,
                userID: resJSON.user._id,
                profileID: resJSON._id,
                bio: resJSON.bio,
                friends: resJSON.friends,
                profilePicURL: picURL,
                posts: resJSON.posts
            }
            setProfileData(profile);
            setPosts(resJSON.posts);
            currentUser?.profile?._id === resJSON._id ? setOwner(true) : setOwner(false);

            if(currentUser?.profile?.friends.includes(profile.userID)) {
                setAlreadyFriends(true);
            } else {
                setAlreadyFriends(false);
            }
        }

        getProfileData();
    }, [profileID, currentUser])

    const handleFriendUpdate = async (requestType: string) => {
        const url = sessionStorage.getItem("API_URL") + `profile/${currentUser.profile?._id}`
        if(!profileData)
            return;
        const reqBody = {
            friend: {
                requestType: `${requestType}`,
                id: profileData?.userID
            }
        }
        await addFriend(url, reqBody, currentUser.jwToken);
        const response = await getFullyHydratedUserData(sessionStorage.getItem("API_URL") + `users/${currentUser._id}`, currentUser.jwToken)
        if(response.error) {
            console.error(response.error)
        } else if (response.user) {
            console.log("Updating current userstate with", response.user)
            response.user.loggedIn = true;
            response.user.jwToken = currentUser.jwToken;
            setCurrentUser(response.user);
            sessionStorage.setItem("user", JSON.stringify(response.user));
        }
        
        switch (requestType) {
            case "add":
                setAlreadyFriends(true);
                break;
            
            case "remove":
                setAlreadyFriends(false);
                break;

            default:
                break;
        }
    }

    return (
        <>
            { profileData ?
            <>
                <Row>
                    <Col  xs={2}>
                        <Header profilePicURL={profileData?.profilePicURL}
                            firstName={profileData?.user.firstname}
                            lastName={profileData?.user.lastname}
                            bio={profileData?.bio} />
                        <div className="text-center my-4">
                        {!owner?
                            !alreadyFriends? 
                                <Button variant="light" type="button" onClick={() => {handleFriendUpdate("add")}}>Add Friend</Button>
                                :<Button variant="light" type="button" onClick={() => {handleFriendUpdate("remove")}}>Remove Friend</Button>
                            :<></>}
                        </div>
                    </Col>
                    <Col className="bg-secondary" style={{border:"solid black 1px", height:"100vh", width:"100%"}}>
                        {owner ? 
                            <div>
                                <h1 className="display">Your Profile</h1>
                                <Accordion>
                                    <Accordion.Header>
                                        Create New Post
                                    </Accordion.Header>
                                    <Accordion.Body className="bg-dark">
                                        <NewPostForm posts={posts} setPosts={setPosts} />
                                    </Accordion.Body>
                                </Accordion>
                            </div>
                        :
                        <></>
                        }
                        <h1>Posts</h1>
                        <hr className="mb-4"></hr>
                        <Container fluid className="bg-dark" >
                            {posts.map((post) => <Post
                                            key={post._id} 
                                            post={post} 
                                            posts={posts} 
                                            setPosts={setPosts} 
                                            areFriends={alreadyFriends}
                                            owner={owner} />)}
                        </Container>
                    </Col>
                </Row>
            </>
            :
            <></>}
        </>
    );
}
