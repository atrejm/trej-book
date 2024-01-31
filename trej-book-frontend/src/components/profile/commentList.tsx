import { Dispatch, SetStateAction, useContext } from "react";
import { CommentID, IComment } from "../forms/commentForm";
import { UserContext } from "../../App";
import { Button } from "react-bootstrap";
import formatDate from "../../helpers/formatDate";
import { deleteCommentByID } from "../../helpers/request";
import { PostID } from "./post";
import { LinkContainer } from "react-router-bootstrap";

interface IProps {
    postID: PostID
    comments: Array<IComment>;
    setComments: Dispatch<SetStateAction<IComment[] | undefined>>
}

export default function CommentList({postID, comments, setComments} : IProps)  { 
    const { currentUser } = useContext(UserContext);

    const handleDeleteComment = (commentID: CommentID) => {
        // delete comment within react dom
        const commentIndex = comments.findIndex((comment) => comment._id === commentID);
        comments.splice(commentIndex, 1);
        setComments([...comments]);

        // send delete request to server
        // ....api/comments/:postid/:commentid
        const url = sessionStorage.getItem("API_URL") + `comments/${postID}/${commentID}`;
        deleteCommentByID(url, currentUser.jwToken);
    }

    return (
        <>
            {comments?.map((comment) => (
                <div key={comment._id}>
                    <h6>{comment.content}</h6>
                    <small>
                        by: <span>
                            <LinkContainer to={'../profile'} state={{ profileID: comment.author.profile }}>
                                <a>{comment.author.firstname}</a>
                            </LinkContainer>
                        </span> at {formatDate(comment.dateposted)}
                        <span>
                            {currentUser._id === comment.author._id ?
                                <Button
                                    onClick={() => handleDeleteComment(comment._id)}
                                    variant="outline-danger mx-3"
                                    size="sm"
                                    >
                                        remove
                                </Button>
                                :<></>
                            }
                        </span>
                    </small>
                    <hr></hr>
                </div>
            ))}
        </>
    )
}