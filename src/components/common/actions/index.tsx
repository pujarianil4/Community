import React from "react";
import "./index.scss";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { GoComment } from "react-icons/go";
import { numberWithCommas } from "@/utils/helpers";
import { SaveIcon, ShareIcon } from "@/assets/icons";
import { IPost } from "@/utils/types/types";

interface IProps {
  post: IPost;
  showShare?: boolean;
  showSave?: boolean;
}

// TODO: add actions share, save
export default function Actions({
  post,
  showShare = false,
  showSave = false,
}: IProps) {
  const { up, id, ccount } = post;
  return (
    <div className='actions'>
      <div className='up_down'>
        <PiArrowFatUpDuotone size={18} />
        <span>{up}</span>
        <PiArrowFatDownDuotone size={18} />
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
