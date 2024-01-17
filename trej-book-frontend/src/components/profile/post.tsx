import { Dispatch, SetStateAction, useContext } from "react";
import formatDate from "../../helpers/formatDate";
import { UserContext, UserID } from "../../App";
import { Button } from "react-bootstrap";
import { deletePost } from "../../helpers/request";

export interface IPost{
    _id: string
    author: UserID,
    title: string,
    content: string,
    dateposted: string,
    published: boolean,
    rating: number,
    comments: Array<Comment>
}


export default function Post({post, posts, setPosts} : {post: IPost, posts: Array<IPost>, setPosts: Dispatch<SetStateAction<Array<IPost>>>}) {
    const userContext = useContext(UserContext);

    const handleDeletePost: React.MouseEventHandler<HTMLButtonElement> = async () => {
        const url = sessionStorage.getItem("API_URL") + "posts/" + post._id;
        const response = await deletePost(url, {}, userContext.jwToken);

        const index = posts.findIndex((p) => p._id === post._id);
        posts.splice(index, 1);
        const newPosts = [...posts]
        setPosts(newPosts);
        console.log(response);
    }

    return (
        <>
            <h1>
                {post.title}
                {userContext.userId === post.author 
                ?
                <Button onClick={handleDeletePost} variant="outline-danger mx-3" size="sm"><img src="\src\assets\x.svg"></img></Button> 
                :<></>}
                </h1>
            <h5>{post.content}</h5>
            <p>{formatDate(post.dateposted)}</p>
            <hr className="my-3"></hr>
        </>
    )
}