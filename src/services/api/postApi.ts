import { IPostCommentAPI } from "@/utils/types/types";
import { api } from "./api";
import { getUserID } from "@/utils/helpers";

// Create Post
export const createPost = async (data: any) => {
  try {
    const response = await api.post("/posts", data);
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

// fetch posts
export const getPosts = async ({
  sortby = "time",
  order = "DESC",
  page = 1,
  limit = 20,
}: {
  sortby: string;
  order: string;
  page: number;
  limit: number;
}) => {
  try {
    const uid = await getUserID();
    const response = await api.get(
      `/posts?sortBy=${sortby}&order=${order}&page=${page}&limit=${limit}&uid=${uid}&sts=published`
    );
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

// fetch posts by community name
export const getPostsBycName = async ({
  nameId,
  page = 1,
  limit = 20,
  sts = "",
}: {
  nameId: string;
  page: number;
  limit: number;
  sts: string;
}) => {
  try {
    const uid = await getUserID();
    const response = await api.get(
      `/posts/community/cname/${nameId}?page=${page}&limit=${limit}&uid=${uid}` +
        (sts ? `&sts=${sts}` : "")
    );
    console.log("=========Fetched all posts By Cname=========", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

// fetch posts by user name
export const getPostsByuName = async ({
  nameId,
  page = 1,
  limit = 20,
  sts = "",
}: {
  nameId: string;
  page: number;
  limit: number;
  sts: "draft" | "published" | "archived" | "";
}) => {
  try {
    const uid = await getUserID();
    const response = await api.get(
      `/posts/username/${nameId}?page=${page}&limit=${limit}&uid=${uid}` +
        (sts ? `&sts=${sts}` : "")
    );
    console.log("=========Fetched all posts By Uname==========", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

// fetch post by postid
export const getPostsByPostId = async (postId: string) => {
  try {
    const uid = await getUserID();
    const response = await api.get(`/posts/${postId}?uid=${uid}`);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
  }
};

// fetch post for meta data
export const getPostsForMeta = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    const { text, media } = response.data;
    return { text, media };
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    return null;
  }
};

// update post
export const patchPost = async (postId: number, data: any) => {
  try {
    const response = await api.patch(`/posts/${postId}`, data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

// update post
export const deletePost = async (postId: string | number) => {
  try {
    const response = await api.patch(`/posts/delete/${postId}`);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};
// fetch post comments
export const fetchComments = async (postId: string) => {
  try {
    const uid = await getUserID();
    const response = await api.get(
      `/comments/post/${postId}?page=1&limit=100&uid=${uid}`
    );
    return response.data;
  } catch (error) {
    console.error("COMMENTS_ERROR: ", error);
  }
};

// post comments
export const postComments = async (data: IPostCommentAPI) => {
  try {
    const response = await api.post("/comments", data);
    return response.data;
  } catch (error) {
    console.error("POST_COMMENT_ERROR: ", error);
  }
};

// view post
export const viewPost = async (postId: number | undefined) => {
  try {
    const response = await api.patch(`/posts/vc/${postId}`);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};
