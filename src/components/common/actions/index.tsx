import React, { useState } from "react";
import "./index.scss";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { GoComment } from "react-icons/go";
import { numberWithCommas } from "@/utils/helpers";
import { SaveIcon, ShareIcon } from "@/assets/icons";
import { IPost, IVotePayload } from "@/utils/types/types";
import { sendVote } from "@/services/api/api";

interface IProps {
  post: IPost;
  showShare?: boolean;
  showSave?: boolean;
  type: "c" | "p";
}

interface Vote {
  value: number;
  type: "up" | "down" | "";
}

// TODO: add actions share, save
export default function Actions({
  post,
  type,
  showShare = false,
  showSave = false,
}: IProps) {
  const { up, down, id, ccount } = post;

  const [vote, setVote] = useState<Vote>({
    value: Number(up) + Number(down),
    type: "",
  });

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
          typ: type,
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
  return (
    <div className='actions'>
      <div className='up_down'>
        <PiArrowFatUpDuotone
          className={vote.type == "up" ? "active" : ""}
          onClick={() => handleVote("up")}
          size={18}
        />
        <span>{vote.value}</span>
        <PiArrowFatDownDuotone
          className={vote.type == "down" ? "active" : ""}
          onClick={() => handleVote("down")}
          size={18}
        />
      </div>
      <div className='comments'>
        <Link href={`post/${id}`} as={`/post/${id}`}>
          <GoComment size={18} />
          <span>{numberWithCommas(ccount) || "comments"}</span>
        </Link>
      </div>

      {showShare && (
        <div className='share'>
          <ShareIcon width={18} />
          <span>Share</span>
        </div>
      )}
      {showSave && (
        <div className='save'>
          <SaveIcon width={16} height={16} />
          <span>Save</span>
        </div>
      )}
    </div>
  );
}
