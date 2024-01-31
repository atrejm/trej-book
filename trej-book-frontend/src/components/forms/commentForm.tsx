import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { IUser, UserContext } from "../../App";
import { IPost } from "../profile/post";
import { leaveComment } from "../../helpers/request";

export type CommentID = string;

export interface IComment {
    _id: CommentID;
    author: IUser;
    post: IPost;
    content: string;
    dateposted: string;
    rating: number;
}

interface IProps {
    post: IPost;
    comments: Array<IComment>;
    setComments?: Dispatch<SetStateAction<IComment[] | undefined>>
}

export default function CommentForm({post, comments, setComments}:IProps) {

    const { currentUser } = useContext(UserContext);
    const [comment, setComment] = useState<string>();
    
    const handleFormInput = async () => {
        if(!setComments)
            return;
        if(!comment)
            return;

        const commentPayload = {
            content: comment ? comment : "",
            author: currentUser,
        }
        console.log(commentPayload);
        const url = sessionStorage.getItem("API_URL") + `comments/${post._id}`;
        const response = await leaveComment(url, currentUser.jwToken, commentPayload);
        if(response.error)
            console.error(response.error)
        setComments([...comments, response.comment]);
        setComment("");
        console.log(response);
    }  

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Leave a Comment</Form.Label>
                <Form.Control type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
            </Form.Group>
            <Container>
                <Button variant="light" type="button" size="sm" onClick={handleFormInput}>Comment</Button>
            </Container>
        </Form>
    )
}