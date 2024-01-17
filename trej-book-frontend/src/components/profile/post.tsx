import formatDate from "../../helpers/formatDate";

type UserID = number;

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


export default function Post({post} : {post: IPost}) {
    
    return (
        <>
            <h1>{post.title}</h1>
            <h5>{post.content}</h5>
            <p>{formatDate(post.dateposted)}</p>
            <hr className="my-3"></hr>
        </>
    )
}