"use client";
import React, { useState } from "react";
import "./tpostcard.scss";
import UHead from "@/components/common/uhead";
import { IPost } from "@/utils/types/types";
import Actions from "@/components/common/actions";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import Image from "next/image";
import { identifyMediaType } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import { Button, Modal } from "antd";
import CFilter from "@/components/common/Filter";

interface IProps {
  post: IPost;
}

export default function TPostCard({ post }: IProps) {
  const router = useRouter();
  const [rejectModal, setRejectModal] = useState(false);
  const { id, user, community, cta, text, media } = post;
  const firstMediaIsImage =
    media && media.length > 0 && identifyMediaType(media[0]) === "image";

  const handleRedirectPost = () => {
    // router.push(`/post/${id}`);
    console.log("redirect");
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }
    handleRedirectPost();
  };

  const handleApproval = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("approve");
  };

  const handleRejectModal = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setRejectModal(true);
  };

  const handleModalClose = () => {
    setRejectModal(false);
  };

  return (
    <article onClick={handleClick} className='search_post_item'>
      <div className='content'>
        <UHead post={post} />
        <MarkdownRenderer markdownContent={text} limit={2} />
        <div className='post_actions'>
          <p onClick={handleApproval} className='approve'>
            Approve
          </p>
          <p onClick={handleRejectModal} className='reject'>
            Reject
          </p>
        </div>
      </div>
      {firstMediaIsImage && (
        <Image
          className='post_img'
          src={media[0]}
          alt=''
          width={160}
          height={128}
        />
      )}
      <Modal open={rejectModal} onCancel={handleModalClose} footer={<></>}>
        <div className='rejection_modal'>
          <h2>Give a removal reason</h2>
          <div className='select'>
            <h3>Select Reason</h3>
            <CFilter
              list={[{ value: "something", title: "somthing" }]}
              callBack={() => {}}
              defaultListIndex={0}
            />
          </div>

          <div className='btns'>
            <Button className='CButton_reverse' onClick={handleModalClose}>
              Cancel
            </Button>
            <Button className='CButton'>Confirm</Button>
          </div>
        </div>
      </Modal>
    </article>
  );
}
