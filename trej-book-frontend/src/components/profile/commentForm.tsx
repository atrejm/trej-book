import { useState } from "react";
import { Form } from "react-bootstrap";

export default function CommentForm() {
    const [comment, setComment] = useState<string>();

    return (
        <Form>
            <Form.Group className="mb-3">
                    <Form.Label>Leave a Comment</Form.Label>
                    <Form.Control type="text" placeholder="Comment" onChange={(e) => setComment(e.target.value)} />
                </Form.Group>
        </Form>
    )
}