import { useContext, useEffect, useState } from "react"
import { Post } from "../components/post";
import { UserContext } from "../App";

export type UserID = number;

interface IProfile{
    userID: UserID,
    friends: Array<UserID>,
    bio: string,
    profilePictureURL: string,
    posts: Array<Post>
}

export default function Profile() {
    const [profileInfo, setProfileInfo] = useState<IProfile>();
    const userContext = useContext(UserContext);

    useEffect(()=> {
        const getProfileData = async () => {
            const url: string | null = sessionStorage.getItem("API_URL") + `profile/${userContext.profileId}`;

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
            const resJSON = await res.json();

            console.log(resJSON);
        }

        getProfileData();
    }, [])

    return(
        <h1>Profile</h1>
    )
}