import { ExpressValidationErrorResponse } from "../App";
import { IPost } from "../components/profile/post";

type IRequest = Record<string, string>;

interface CreatePostResponse {
  error?: Array<ExpressValidationErrorResponse>;
  created?: IPost;
}

interface DeletePostResponse {
  deleted: IPost | null;
}

enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

async function request(
  requestType: RequestMethod,
  url: string,
  body: IRequest = {},
  jwt: JsonWebKey | null
) {
  console.log(JSON.stringify(body));
  const res = await fetch(url, {
    method: requestType,
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(body),
  });

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
