import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import { getFeed } from "../helpers/request";
import Post, { IPost } from "../components/profile/post";

export default function Feed() {
    const { currentUser } = useContext(UserContext);
    const [posts, setPosts] = useState<IPost[]>([]);

    useEffect(() => {
        const getData = async () => {
            const getFeedURL = sessionStorage.getItem("API_URL") + `feed/${currentUser._id}`
            const response = await getFeed(getFeedURL, currentUser.jwToken);

            setPosts(response);
        }

        getData();
    }, [])

    return(
        <div>
            <h1 className="text-center">Feed</h1>
            <hr className="my-4"></hr>
            {posts?
                posts.map((post) => (
                    <Post 
                        post={post} 
                        posts={posts}
                        setPosts={setPosts} 
                        areFriends={true}
                        owner={false}/>
                ))
                :<></>
            }
        </div>
    )
}