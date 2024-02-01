import { ExpressValidationErrorResponse, IUser } from "../App";
import { IComment } from "../components/forms/commentForm";
import { IPost, PostID } from "../components/profile/post";
import { IProfile } from "../components/profile/profilebody";
import { UserCreationError } from "../routes/register";

type PayloadRequest = Record<string, string | object>
type IRequest = Record<string, string | undefined> | null | string;
type IResponse = Record<string, string | object>

interface CreatePostResponse {
  error?: Array<ExpressValidationErrorResponse>;
  created?: IPost;
}

interface DeletePostResponse {
  deleted: IPost | null;
}

interface StatusResponse {
    success?: IResponse;
    error?: IResponse;
}

interface FriendUpdateResponse {
    friendStatus: object
    updatedProfile: {
        user: IUser
    }
}

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

async function request(
  requestType: RequestMethod,
  url: string,
  body: IRequest | PayloadRequest,
  jwt: JsonWebKey | null
) {
  let res;
  if(requestType === RequestMethod.GET) {
    res = await fetch(url, {
        method: requestType,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        }
      });
  } else {
    res = await fetch(url, {
        method: requestType,
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(body),
      });
  }

  if (!res.ok) {
    console.error(res);
    throw new Error("Error fetching POST");
  }

  const resJSON = await res.json();
  return resJSON;
}

export async function createPost(
  url: string,
  body: IRequest,
  jwt: JsonWebKey | null
): Promise<CreatePostResponse> {
  const response = await request(RequestMethod.POST, url, body, jwt);
  if (response.error) {
    return { error: response.error };
  } else {
    return response;
  }
}

export async function deletePost(
  url: string,
  body: IRequest,
  jwt: JsonWebKey | null
): Promise<DeletePostResponse> {
  const response: DeletePostResponse = await request(RequestMethod.DELETE, url, body, jwt);

  return response;
}

type GetUsersResponse = {
    users?: Array<IUser>,
    error?: string
}

export async function getUsers(
    url: string,
): Promise<GetUsersResponse> {
    
    const users = await request(RequestMethod.GET, url, {}, null);
    return users;
}

type CreateUserResponse = {
  errors?: UserCreationError[],
  success?: {user: IUser, profile: IProfile}
}

export async function createUser(
    url: string,
    body: IRequest
): Promise<CreateUserResponse> {
    const response = await request(RequestMethod.POST, url, body, null);

    return response;
}

export async function getProfile(
    url: string,
): Promise<IProfile> {
    console.log(url);
    const profile = await request(RequestMethod.GET, url, {}, null);
    return profile;
}

export async function updateProfile(
    url: string,
    body: IRequest,
    jwt: JsonWebKey | null
) : Promise<StatusResponse > {

    const response: IResponse = await request(RequestMethod.PUT, url, body, jwt);

    return response;
}

export async function addFriend(
    url: string,
    body: PayloadRequest,
    jwt: JsonWebKey | null
) : Promise< FriendUpdateResponse> {

    const response: FriendUpdateResponse = await request(RequestMethod.PUT, url, body, jwt);

    return response;
}

export async function getFriendsList(
    url: string,
    jwt: JsonWebKey | null
) : Promise<Array<IUser>> {

    const friends = await request(RequestMethod.GET, url, {}, jwt);
    return friends;
}

type GetUserResponse = {
    user?: IUser,
    error?: string
}

export async function getFullyHydratedUserData(
    url: string,
    jwt: JsonWebKey | null
) : Promise<GetUserResponse> {
    const user = await request(RequestMethod.GET, url, {}, jwt);
    return user;
}

type loginPayload = {
    username: string,
    password: string
}

type LoginResponse = {
    token?: JsonWebKey
    user?: IUser
    error?: string
}

export async function login(
    url: string,
    jwt: JsonWebKey | null,
    login: loginPayload
) : Promise< LoginResponse> {
    const user = await request(RequestMethod.POST, url, login, jwt);

    return user;
}

interface CommentResponse {
  postID: PostID,
  comment: IComment,
  updatedComments: Array<IComment>
  errors?: string[]
}

export async function leaveComment(
  url: string,
  jwt: JsonWebKey | null,
  body: PayloadRequest
) : Promise <CommentResponse> {
  const response = await request(RequestMethod.POST, url, body, jwt);
  
  return response;
}

export async function getCommentsByPostID(
  url: string,
  jwt: JsonWebKey | null,
) : Promise<Array<IComment>> {
  
  const response = await request(RequestMethod.GET, url, {}, jwt);

  return response;
}

export async function deleteCommentByID(
  url: string,
  jwt: JsonWebKey | null,
) : Promise<IComment> {
  const commentDeleted: IComment = await request(RequestMethod.DELETE, url, {}, jwt)

  return commentDeleted;
}

export async function getFeed(
  url: string,
  jwt: JsonWebKey | null
) : Promise<IPost[]> {
  
  const posts: IPost[] = await request(RequestMethod.GET, url, {}, jwt)

  return posts;
}