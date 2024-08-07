import { getPosts } from "@/services/api/api";
import React from "react";
import FeedPost from "../feedPost/feedPost";

export default async function FeedPosts() {
  // const posts = await getPosts();
  const posts = [
    {
      id: 1,
      uid: 5,
      cid: 1,
      text: "Hello there",
      up: 0,
      down: 0,
      comments: 0,
      time: "2024-07-30T10:42:32.047Z",
      user: {
        id: 5,
        username: "t",
        name: null,
        img: null,
        sts: 1,
        cta: "2024-08-02T10:09:15.193Z",
        uta: "2024-08-02T10:09:15.193Z",
      },
      community: {
        id: 1,
        username: "anil community",
        name: "unilend Finance Community",
        ticker: "string",
        logo: "string",
        metadata: "string",
        pCount: 0,
        followers: 0,
        totalSupply: 0,
        sts: 0,
        cta: "2024-08-02T10:09:15.193Z",
        uta: "2024-08-05T06:38:15.128Z",
      },
    },
    {
      id: 2,
      uid: 6,
      cid: 1,
      text: "Hey Rathod check it",
      up: 0,
      down: 0,
      comments: 0,
      time: "2024-07-31T06:03:03.813Z",
      user: {
        id: 6,
        username: "test40",
        name: null,
        img: null,
        sts: 1,
        cta: "2024-08-02T10:09:15.193Z",
        uta: "2024-08-02T10:09:15.193Z",
      },
      community: {
        id: 1,
        username: "anil community",
        name: "unilend Finance Community",
        ticker: "string",
        logo: "string",
        metadata: "string",
        pCount: 0,
        followers: 0,
        totalSupply: 0,
        sts: 0,
        cta: "2024-08-02T10:09:15.193Z",
        uta: "2024-08-05T06:38:15.128Z",
      },
    },
  ];
  return (
    <>
      {posts?.map((post: any) => (
        <FeedPost key={post.id} post={post} />
      ))}
    </>
  );
}
