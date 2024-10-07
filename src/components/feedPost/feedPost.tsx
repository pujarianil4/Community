"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { GoComment } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageSource, numberWithCommas, timeAgo } from "@/utils/helpers";
import { IPost, IVotePayload } from "@/utils/types/types";
import SwipeCarousel from "../common/carousel";
import { IoIosMore } from "react-icons/io";
import {
  DropdownLowIcon,
  DropdownUpIcon,
  SaveIcon,
  ShareIcon,
} from "@/assets/icons";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import PostPageLoader from "../common/loaders/postPage";
import { sendVote } from "@/services/api/api";
import { useIntersectionObserver } from "@/hooks/useIntersection";
import UHead from "../common/uhead";
import Actions from "../common/actions";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import CreatePost from "../createPost/CreatePost";
import { Modal } from "antd";

const MarkdownRenderer = dynamic(() => import("../common/MarkDownRender"), {
  ssr: false,
});

interface IProps {
  post: IPost;
  overlayClassName?: string;
}

interface Vote {
  value: number;
  type: "up" | "down" | "";
}

const imgLink = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
export default function FeedPost({ post, overlayClassName }: IProps) {
  const { text, up, down, cta, media, user, community, id, ccount } = post;
  const postRef = useRef<HTMLDivElement | null>(null);
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isViewed = useIntersectionObserver(postRef);
  const router = useRouter();
  const [vote, setVote] = useState<Vote>({
    value: Number(up) + Number(down),
    type: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userInfo = useSelector((state: RootState) => state.user);

  console.log("user", user, userInfo);
  const self = user.id == userInfo.uid;

  const handleRedirectPost = () => {
    router.push(`/post/${id}`);
  };

  const handleVote = async (action: string) => {
    const previousVote = { ...vote };

    let newVote: Vote = { ...vote };

    if (action === "up") {
      if (vote.type === "down") {
        newVote = { value: vote.value + 2, type: "up" };
      } else if (vote.type === "up") {
        newVote = { value: vote.value - 1, type: "" };
      } else {
        newVote = { value: vote.value + 1, type: "up" };
      }
    } else if (action === "down") {
      if (vote.type === "up") {
        newVote = { value: vote.value - 2, type: "down" };
      } else if (vote.type === "down") {
        newVote = { value: vote.value + 1, type: "" };
      } else {
        newVote = { value: vote.value - 1, type: "down" };
      }
    }

    setVote(newVote);

    try {
      if (id) {
        const payload: IVotePayload = {
          typ: "p",
          cntId: id,
          voteTyp: newVote.type,
        };
        const afterVote = await sendVote(payload);
        console.log("updated", afterVote, payload);

        // setVote({ value: updatedPost.voteCount, type: newVote.type });
      }
    } catch (error) {
      console.error("Vote failed:", error);
      setVote(previousVote);
    }
  };

  const moreActionCall = (data: any) => {
    if (data == "edit") {
      console.log("edit", post);
      setIsEditModalOpen(true);
    }
  };

  useEffect(() => {
    if (isViewed) {
      stayTimerRef.current = setTimeout(() => {
        //call view count api
        console.log("viewed", id);
      }, 3000);
    } else {
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
        stayTimerRef.current = null;
      }
    }
  }, [isViewed]);

  if (!post) {
    return <PostPageLoader />;
  }

  return (
    <>
      <div ref={postRef} className={`postcard_container ${overlayClassName}`}>
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
          <UHead
            user={post.user}
            community={post.community}
            time={post.cta}
            showMore
            self={self}
            callBack={moreActionCall}
          />
        )}

        <div
          className='content'
          onClick={(event) => {
            handleRedirectPost();
            event.stopPropagation();
          }}
        >
          <MarkdownRenderer markdownContent={text} />
          {media && media?.length > 0 && <SwipeCarousel assets={media} />}
        </div>
        <Actions type='p' post={post} showSave showShare />
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
