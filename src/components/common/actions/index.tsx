import React, { useState, useEffect } from "react";
import "./index.scss";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import { AiOutlineRetweet } from "react-icons/ai";
import Link from "next/link";
import { GoComment } from "react-icons/go";
import { numberWithCommas } from "@/utils/helpers";
import { IPost, IVotePayload } from "@/utils/types/types";
import { sendVote } from "@/services/api/userApi";
import ShareButton from "../shareButton";
import { PiBookmarkSimpleDuotone } from "react-icons/pi";
import CPopup from "../popup";
import NotificationMessage from "../Notification";
import { Tooltip, Modal } from "antd";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

import RePost from "@/components/createPost/RePost";

// save post Api
// import { savePost } from "@/services/api/userApi";

interface IProps {
  post: IPost;
  showShare?: boolean;
  showSave?: boolean;
  type: "c" | "p";
  disable?: boolean;
}

interface Vote {
  value: number;
  type: 1 | -1 | 0;
}

// TODO: add actions share, save
export default function Actions({
  post,
  type,
  showShare = false,
  showSave = false,
  disable = false,
}: IProps) {
  const { up, down, id, voteStatus, ccount, text, media, sts } = post;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const [isRepostModalOpen, setIsRePostModalOpen] = useState(false);

  const noUser = user?.profile?.id;

  useEffect(() => {
    console.log("userData", noUser);
  }, [user]);

  const isArchived = sts === "archived";
  const isDisabled = disable || isArchived || !noUser;
  const [vote, setVote] = useState<Vote>({
    value: Number(up) - Number(down),
    type: voteStatus || 0,
  });

  // Dynamic URL creation
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentDomain = window.location.origin;
      setPostUrl(`${currentDomain}/post/${id}`);
    }
  }, [id]);

  const handleSelectRepost = (label: string) => {
    if (label == "Repost with Description") {
      setIsRePostModalOpen(true);
    } else if (label === "Repost") {
      NotificationMessage("success", "Reposted successfully");
    }
  };

  const handleVote = async (action: number) => {
    if (isDisabled) return; // no action if post deleted
    const previousVote = { ...vote };
    let newVote: Vote = { ...vote };

    if (action === 1) {
      if (vote.type === -1) {
        newVote = { value: vote.value + 2, type: 1 };
      } else if (vote.type === 1) {
        newVote = { value: vote.value - 1, type: 0 };
      } else {
        newVote = { value: vote.value + 1, type: 1 };
      }
    } else if (action === -1) {
      if (vote.type === 1) {
        newVote = { value: vote.value - 2, type: -1 };
      } else if (vote.type === -1) {
        newVote = { value: vote.value + 1, type: 0 };
      } else {
        newVote = { value: vote.value - 1, type: -1 };
      }
    }
    setVote(newVote);

    try {
      if (id) {
        const payload: IVotePayload = {
          typ: type,
          cntId: id,
          voteTyp: newVote.type == 1 ? "up" : "down",
        };
        const afterVote = await sendVote(payload);

        // setVote({ value: updatedPost.voteCount, type: newVote.type });
      }
    } catch (error) {
      console.error("Vote failed:", error);
      setVote(previousVote);
    }
  };

  //handle save post
  const handleSave = async () => {
    if (isDisabled) return;
    try {
      if (id) {
        // const response = await savePost(id, true);
        // console.log("Post saved successfully", response);
        NotificationMessage("success", "Post saved successfully");
      }
    } catch (error) {
      NotificationMessage("error", "Error saving post");
      console.error("Failed to save the post:", error);
    }
  };

  return (
    <div style={isDisabled ? { opacity: "0.3" } : {}}>
      <Tooltip title={isArchived ? "No action, this post is Deleted" : ""}>
        <div className={`actions ${isArchived ? "" : ""}`}>
          <div className='up_down'>
            <span>
              <PiArrowFatUpDuotone
                className={vote.type == 1 ? "active" : ""}
                onClick={() => handleVote(1)}
                size={18}
              />
              <span>{vote.value}</span>{" "}
            </span>
            <span>
              <PiArrowFatDownDuotone
                className={vote.type == -1 ? "active" : ""}
                onClick={() => handleVote(-1)}
                size={18}
              />
              {/* <span> {vote.value}</span> */}
            </span>
          </div>
          <Link href={`post/${id}`} as={`/post/${id}`}>
            <div className='comments'>
              <GoComment size={18} />
              <span>{numberWithCommas(ccount) || "comments"}</span>
            </div>
          </Link>
          {/* {showSave && !isArchived && (
            <CPopup
              onSelect={handleSelectRepost}
              onAction='hover'
              position='top'
              list={[{ label: "Repost with Description" }, { label: "Repost" }]}
            >
              <div className='other'>
                <AiOutlineRetweet size={16} />
                <span>RePost</span>
              </div>
            </CPopup>
          )} */}
          {showSave &&
            (isDisabled ? (
              <div className='other disabled'>
                <AiOutlineRetweet size={16} />
                <span>RePost</span>
              </div>
            ) : (
              <CPopup
                onSelect={handleSelectRepost}
                onAction='hover'
                position='top'
                list={[
                  { label: "Repost with Description" },
                  { label: "Repost" },
                ]}
              >
                <div className='other'>
                  <AiOutlineRetweet size={16} />
                  <span>RePost</span>
                </div>
              </CPopup>
            ))}
          {showShare && (
            <ShareButton
              postTitle={text}
              postUrl={postUrl}
              postImage={media?.[0] || ""}
            />
          )}
          {showSave && (
            <div className='other' onClick={handleSave}>
              <PiBookmarkSimpleDuotone size={16} />
              <span>Save</span>
            </div>
          )}
        </div>
      </Tooltip>
      <Modal
        footer={<></>}
        centered
        className='create_post_modal'
        open={isRepostModalOpen}
        onClose={() => setIsRePostModalOpen(false)}
        onCancel={() => setIsRePostModalOpen(false)}
      >
        <RePost
          isPostModalOpen={isRepostModalOpen}
          setIsPostModalOpen={setIsRePostModalOpen}
          editPost={post}
        />
      </Modal>
    </div>
  );
}
