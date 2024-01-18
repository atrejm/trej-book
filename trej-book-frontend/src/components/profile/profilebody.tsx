import { useContext, useEffect, useState } from "react";
import Post, { IPost } from "./post";
import { Accordion, Col, Row } from "react-bootstrap";
import Header from "./header";
import { IUser, UserContext, UserID } from "../../App";
import NewPostForm from "../forms/newPostForm";
import { ProfileID } from "../../routes/profile";

export interface IProfile {
    user: IUser,
    userID: UserID
    profile: ProfileID,
    fname: string,
    lname: string,
    friends: Array<UserID>,
    bio: string,
    profilePicURL: string,
    posts: Array<IPost>
}

export default function ProfileBody({ profileID }: { profileID: ProfileID | undefined }) {
    const userContext = useContext(UserContext);
    const [profileData, setProfileData] = useState<IProfile | null>(null);
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

            console.log(resJSON.posts);

            const profile: IProfile = {
                user: resJSON.user,
                userID: resJSON.user._id,
                profile: resJSON._id,
                fname: resJSON.user.firstname,
                lname: resJSON.user.lastname,
                bio: resJSON.bio,
                friends: resJSON.friends,
                profilePicURL: resJSON.profilePicURL+"?s=200",
                posts: resJSON.posts
            }
            setProfileData(profile);
            setPosts(resJSON.posts);
            if(userContext.profile === resJSON._id) {
                setOwner(true);
            }
        }

        getProfileData();
    }, [profileID, userContext.profile])

    return (
        <>
            { profileData ?
            <>
                <Row>
                    <Col xs={2}>
                        <Header profilePicURL={profileData?.profilePicURL}
                            firstName={profileData?.fname}
                            lastName={profileData?.lname}
                            bio={profileData?.bio} />
                    </Col>
                    <Col >
                        {owner? 
                            <Accordion style={{width:"80%"}}>
                                <Accordion.Header>
                                    <span 
                                        style={{color:"lightcyan", textDecoration: "underline", textShadow: "lightcyan 1px 0 2px"}}>
                                            Create new post
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body className="bg-secondary">
                                    <NewPostForm posts={posts} setPosts={setPosts} />
                                </Accordion.Body>
                            </Accordion>
                        :
                        <></>
                        }
                        {posts.map((post) => <Post key={post._id} post={post} posts={posts} setPosts={setPosts} />)}
                    </Col>
                </Row>
            </>
            :
            <></>}
        </>
    );
}
