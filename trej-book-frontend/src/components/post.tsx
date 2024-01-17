import { UserID } from "../routes/profile"

export interface Post{
    author: UserID,
    title: string,
    content: string,
    datePosted: Date,
    published: boolean,
    rating: number,
    comments: Array<Comment>
}


export default function Post() {
    return (
        <>
        </>
    )
}