import { UserID } from "../routes/profile/profile"

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