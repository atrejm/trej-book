import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { ExpressValidationErrorResponse, IUser, UserContext } from "../../App";
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
    const [comment, setComment] = useState<string>("");
    const [errors, setErrors] = useState<ExpressValidationErrorResponse[]>([]);
    
    const handleFormInput = async () => {
        if(!setComments)
            return;
        if(comment === "")
            return;

        const commentPayload = {
            content: comment ? comment : "",
            author: currentUser,
        }
        console.log(commentPayload);
        const url = sessionStorage.getItem("API_URL") + `comments/${post._id}`;
        const response = await leaveComment(url, currentUser.jwToken, commentPayload);
        if(response.errors) {
            console.error("Error leaving comment: ", response.errors)
            setErrors(response.errors);
            return;
        }
        console.log(response.comment)
        setComments([...comments, response.comment]);
        setComment("");
        setErrors([]);
        console.log(response);
    }  

    return (
        <Form onSubmit={(e) => {e.preventDefault()}}>
            <Form.Group className="mb-3">
                <Form.Label>Leave a Comment</Form.Label>
                <Form.Control type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
            </Form.Group>
            {errors.map((error) => (<p
                key={error.path}
                className="text-danger">{error.msg}</p>))}
            <Container>
                <Button 
                    variant="light" 
                    type="button" 
                    size="sm" 
                    onClick={handleFormInput}
                    >Comment</Button>
            </Container>
        </Form>
    )
}