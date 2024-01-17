import { UserID } from "../App"

export interface Comment {
    author: UserID,
    content: string,
    datePosted: Date,
    rating: number
}

export default function Comment(){
    return(
        <>
        </>
    )
}