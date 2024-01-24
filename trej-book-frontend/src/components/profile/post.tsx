import { Dispatch, SetStateAction, useContext } from "react";
import formatDate from "../../helpers/formatDate";
import { UserID } from "../../App";
import { Button } from "react-bootstrap";
import { deletePost } from "../../helpers/request";
import { UserContext } from "../../App";
import CommentForm from "./commentForm";

export interface IPost {
  _id: string;
  author: UserID;
  title: string;
  content: string;
  dateposted: string;
  published: boolean;
  rating: number;
  comments: Array<Comment>;
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
  const userContext = useContext(UserContext);

  const handleDeletePost: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    const url = sessionStorage.getItem("API_URL") + "posts/" + post._id;
    const response = await deletePost(url, {}, userContext.jwToken);

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
            <img src="\src\assets\x.svg"></img>
          </Button>
        ) : (
          <></>
        )}
      </h1>
      <h5>{post.content}</h5>
      <p>{formatDate(post.dateposted)}</p>
      {owner || alreadyFriends?
        <CommentForm />
        :
        <></>
        }
      <hr className="my-3"></hr>
    </>
  );
}
