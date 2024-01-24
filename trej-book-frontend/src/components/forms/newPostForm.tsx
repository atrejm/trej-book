import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { createPost } from "../../helpers/request";
import { UserContext } from "../../App";
import { IPost } from "../profile/post";

type FieldErrors = Record<string, string>

export default function NewPostForm({posts, setPosts}:{posts:Array<IPost>, setPosts: Dispatch<SetStateAction<Array<IPost>>>}) {

    const {currentUser, setCurrentUser} = useContext(UserContext);
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [errors, setErrors] = useState<FieldErrors>({});

    const handleFormInput = async () => {
        const url = sessionStorage.getItem("API_URL") + "posts/" + currentUser.profile._id;
        const response = await createPost(
            url, 
            {title: title, content: content},
            currentUser.jwToken);
        
        if(response.created) {
            const newPosts = [...posts, response.created];
            setPosts(newPosts);
            setTitle("");
            console.log(response);
        } else if (response.error) {
            const errors: FieldErrors = {};
            response.error.forEach(err => {
                errors[err.path] = err.msg});
            setErrors(errors);
            console.error(errors);
        }
    }

    return(
        <Form>
            <Form.Group className="mb-3" controlId="postForm.ControlInput1">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" placeholder="title" onChange={(e) => setTitle(e.target.value)}/>
                {errors.title? <p className="text-danger">{errors.title}</p>:<></>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="postForm.ControlTextarea1">
                <Form.Label>Content</Form.Label>
                <Form.Control as="textarea" name="content" rows={3} onChange={(e) => setContent(e.target.value)}/>
                {errors.content? <p className="text-danger">{errors.content}</p>:<></>}
            </Form.Group>
            <Container>
                <Button variant="light" type="button" onClick={handleFormInput}>Create Post</Button>
            </Container>
        </Form>
    )
}