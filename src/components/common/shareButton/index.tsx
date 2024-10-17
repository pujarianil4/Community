import React, { useState } from "react";
import Head from "next/head";
import { Modal, Button, message } from "antd";
import { FiShare } from "react-icons/fi";
import { ShareIcon } from "@/assets/icons";
import NotificationMessage from "../Notification";
// icons
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaMediumM } from "react-icons/fa";
import { IoLogoReddit } from "react-icons/io5";
import { FaLinkedinIn } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
<FaLinkedinIn />;

import "./index.scss";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  RedditShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  EmailShareButton,
} from "next-share";

interface ShareModalProps {
  postTitle: string;
  postUrl: string;
  postImage: string;
}

const ShareButton: React.FC<ShareModalProps> = ({
  postTitle,
  postUrl,
  postImage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Copy link function
  const handleCopyLink = () => {
    window?.navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        NotificationMessage("success", "Link copied to clipboard!");
      })
      .catch(() => {
        NotificationMessage("error", "Failed to copy link");
      });
  };

  return (
    <>
      <div className='share' onClick={showModal}>
        <FiShare size={16} />
        <span>Share</span>
      </div>

      <Modal
        className='share_model'
        title=''
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <h3>Share with Others</h3>
        <div className='share_bx'>
          {/* Facebook */}
          <FacebookShareButton url={postUrl} quote={postTitle}>
            <FaFacebookF />
            <div>Facebook</div>
          </FacebookShareButton>

          {/* Twitter */}
          <TwitterShareButton url={postUrl} title={postTitle}>
            <FaXTwitter />
            <div>X</div>
          </TwitterShareButton>

          <TelegramShareButton url={postUrl} title={postTitle}>
            {/* <TelegramIcon size={32} round /> */}
            <FaTelegramPlane />
            <div> Telegram</div>
          </TelegramShareButton>

          <RedditShareButton url={postUrl} title={postTitle}>
            {/* <RedditIcon size={32} round /> */}
            <IoLogoReddit />
            <div> Reddit</div>
          </RedditShareButton>

          <LinkedinShareButton url={postUrl} title={postTitle}>
            {/* <RedditIcon size={32} round /> */}
            <FaLinkedinIn />
            <div> Linkedin</div>
          </LinkedinShareButton>
          <WhatsappShareButton url={postUrl} title={postTitle}>
            {/* <RedditIcon size={32} round /> */}
            <FaWhatsapp />
            <div> Whatsapp</div>
          </WhatsappShareButton>
        </div>

        <h3>Copy Link</h3>
        <div className='share_bx'>
          <EmailShareButton
            url={postUrl}
            title={postTitle}
            onClick={handleCopyLink}
          >
            <FiCopy />
          </EmailShareButton>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;
