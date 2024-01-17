import { createContext, useContext, useEffect, useState } from "react"
import { Post } from "../../components/post";
import { IUser, UserContext } from "../../App";

export type UserID = number;
export type ProfileID = number;

interface IProfile {
    userID: UserID | null,
    profileID: ProfileID | null,
    friends: Array<UserID>,
    bio: string,
    profilePictureURL: string,
    posts: Array<Post>
}

const ProfileContext = createContext<IProfile>({
    userID: null,
    profileID: null,
    friends: [],
    bio: "[empty]",
    profilePictureURL: "#",
    posts: []
});

export default function Profile({user}
        :{user: IUser}) {
    const [profileInfo, setProfileInfo] = useState<IProfile>();
    const profileContext = useContext(ProfileContext);
    const testContext = useContext(ProfileContext);
    const userContext = useContext(UserContext);

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
            const profile = await res.json();

            console.log(profile);
            profileContext.userID = profile.user;
            profileContext.profileID = profile._id;
            profileContext.bio = profile.bio;
            profileContext.friends = profile.friends;
            profileContext.profilePictureURL = profile.profilePicURL;
            profileContext.posts = profile.posts;
        }

        getProfileData();
    }, [])

    return(
        <h1>Profile</h1>
    )
}