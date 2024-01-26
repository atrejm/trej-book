import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import formatDate from "../../helpers/formatDate";
import { UserID } from "../../App";
import { Button } from "react-bootstrap";
import { deletePost, getCommentsByPostID } from "../../helpers/request";
import { UserContext } from "../../App";
import CommentForm, { CommentID, IComment } from "../forms/commentForm";
import CommentList from "./commentList";

export type PostID = string

export interface IPost {
  _id: PostID;
  author: UserID;
  title: string;
  content: string;
  dateposted: string;
  published: boolean;
  rating: number;
  comments: Array<CommentID>;
}

export default function Post({
  post,
  posts,
  setPosts,
  areFriends: alreadyFriends,
  owner
}: {
  post: IPost;
  posts: Array<IPost>;
  setPosts: Dispatch<SetStateAction<Array<IPost>>>;
  areFriends: boolean;
  owner: boolean
}) {
  const {currentUser, } = useContext(UserContext);
  const [comments, setComments] = useState<Array<IComment>>();

  useEffect(() => {
    const getComments = async () => {
        const url = sessionStorage.getItem("API_URL") + `comments/${post._id}`
        const comments = await getCommentsByPostID(url, null);
        
        setComments(comments);
    }

      getComments();
  }, [])

  const handleDeletePost: React.MouseEventHandler<HTMLButtonElement> = async () => {
    const url = sessionStorage.getItem("API_URL") + "posts/" + post._id;
    const response = await deletePost(url, {}, currentUser.jwToken);

    const index = posts.findIndex((p) => p._id === post._id);
    posts.splice(index, 1);
    const newPosts = [...posts];
    setPosts(newPosts);
    console.log(response);
  };

  return (
    <>
      <h1>
        {post.title}
        {owner ? (
          <Button
            onClick={handleDeletePost}
            variant="outline-danger mx-3"
            size="sm"
          >
            delete post
          </Button>
        ) : (
          <></>
        )}
      </h1>
      <h5>{post.content}</h5>
      <p>{formatDate(post.dateposted)}</p>
      <div className="container card py-2">
        <h5><u>Comments</u></h5>
          <div className="container">
            {comments?
              <CommentList postID={post._id} comments={comments} setComments={setComments}></CommentList>:<></>
            }
            {(owner || alreadyFriends) && comments ?
              <CommentForm post={post} comments={comments} setComments={setComments} />:<></>
            }
          </div>
        
      </div>
      <hr className="my-3"></hr>
    </>
  );
}
