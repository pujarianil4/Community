"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { useRouter } from "next/navigation";
import { IPost, IVotePayload } from "@/utils/types/types";
import SwipeCarousel from "../common/carousel";
import PostPageLoader from "../common/loaders/postPage";
import { sendVote } from "@/services/api/userApi";
import { useIntersectionObserver } from "@/hooks/useIntersection";
import UHead from "../common/uhead";
import Actions from "../common/actions";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import CreatePost from "../createPost/CreatePost";
import { Modal } from "antd";
import { deletePost, viewPost } from "@/services/api/postApi";
import useRedux from "@/hooks/useRedux";

const MarkdownRenderer = dynamic(() => import("../common/MarkDownRender"), {
  ssr: false,
});

interface IProps {
  post: IPost;
  overlayClassName?: string;
  repost?: boolean;
  hide?: boolean;
}

interface Vote {
  value: number;
  type: "up" | "down" | "";
}

const imgLink = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
export default function FeedPost({
  post,
  overlayClassName,
  repost,
  hide,
}: IProps) {
  const { text, up, down, cta, media, user, community, id, ccount, sts } = post;
  const postRef = useRef<HTMLDivElement | null>(null);
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isViewed = useIntersectionObserver(postRef);
  const router = useRouter();
  const [vote, setVote] = useState<Vote>({
    value: Number(up) + Number(down),
    type: "",
  });
  const [{ dispatch, actions }] = useRedux();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user?.profile);
  // const self = user.id == userInfo.uid;
  const self = user?.id == userInfo?.id;
  const handleRedirectPost = () => {
    router.push(`/post/${id}`);
  };

  const moreActionCall = async (data: any) => {
    if (sts != "archived") {
      if (data == "edit") {
        console.log("edit", post);
        setIsEditModalOpen(true);
      } else if (data == "delete" && id) {
        await deletePost(id);
        dispatch(actions.setRefetchPost(true));
      }
    }
  };

  // useEffect(() => {
  //   if (isViewed) {
  //     stayTimerRef.current = setTimeout(() => {
  //       //call view count api

  //       console.log("viewed", id);
  //     }, 3000);
  //   } else {
  //     if (stayTimerRef.current) {
  //       clearTimeout(stayTimerRef.current);
  //       stayTimerRef.current = null;
  //     }
  //   }
  // }, [isViewed]);

  useEffect(() => {
    if (isViewed && !self && userInfo?.id) {
      stayTimerRef.current = setTimeout(async () => {
        try {
          // Call view count API
          await viewPost(id);
        } catch (error) {
          console.error("Failed to update view count:", error);
        }
      }, 3000);
    } else {
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
        stayTimerRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
      }
    };
  }, [id, isViewed]);

  if (!post) {
    return <PostPageLoader />;
  }

  return (
    <>
      <div
        ref={postRef}
        style={hide ? { border: "1px solid #353535" } : {}}
        className={`postcard_container ${overlayClassName} ${
          sts === "archived" ? "archived_post" : ""
        }`}
      >
        {/* <div className='user_head'>
        <Link
          href={`u/${post?.user.username}`}
          as={`/u/${post?.user.username}`}
          className='user_avatar'
        >
          <Image
            src={getImageSource(post?.user.img?.pro, "u")}
            alt={post?.user.username || "user"}
            width={52}
            height={52}
          />
        </Link>
        <div className='names'>
          <Link
            href={`u/${post?.user.username}`}
            as={`/u/${post?.user.username}`}
            className='user_name'
          >
            {post?.user.username}
          </Link>
          <Link
            href={`c/${post?.community.username}`}
            as={`/c/${post?.community.username}`}
            className='community_name'
          >
            {post?.community.username}
          </Link>
        </div>
        <p className='post_time'>&bull; {timeAgo(post?.time)}</p>
        <div className='more'>
          <IoIosMore />
        </div>
      </div> */}

        {post && (
          <UHead post={post} showMore self={self} callBack={moreActionCall} />
        )}

        <div
          className='content'
          onClick={(event) => {
            handleRedirectPost();
            event.stopPropagation();
          }}
        >
          {repost ? (
            <FeedPost post={post} repost={false} hide={true} />
          ) : (
            <>
              <MarkdownRenderer
                markdownContent={text}
                limit={5}
                showViewMore={true}
              />
              {media && media?.length > 0 && <SwipeCarousel assets={media} />}
            </>
          )}
        </div>
        <Actions type='p' post={post} showSave showShare disable={hide} />
      </div>
      <Modal
        footer={<></>}
        centered
        className='create_post_modal'
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <CreatePost
          isPostModalOpen={isEditModalOpen}
          setIsPostModalOpen={setIsEditModalOpen}
          editPost={post}
        />
      </Modal>
    </>
  );
}
