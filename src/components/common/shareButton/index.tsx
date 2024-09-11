import React, { useState } from "react";
import Head from "next/head";
import { Modal, Button, message } from "antd";
import { ShareIcon } from "@/assets/icons";
import "./index.scss";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  TelegramIcon,
  FacebookIcon,
  TwitterIcon,
  RedditShareButton,
  RedditIcon,
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
    navigator.clipboard
      .writeText(postUrl)
      .then(() => {
        message.success("Link copied to clipboard!");
      })
      .catch(() => {
        message.error("Failed to copy link");
      });
  };

  return (
    <>
      <Head>
        {/* Open Graph meta tags */}
        <title> Social media platform for post</title>
        <meta name='description' content='Hi tis is my Title ' />
        <link rel='icon'> href="#" </link>
        <meta property='og:image' content={postImage || ""} />
        <meta property='og:url' content={postUrl} />
        <meta property='og:title' content={postTitle} />
        <meta property='og:description' content={postTitle} />

        {/* Twitter Card meta tags */}
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={postTitle} />
        <meta name='twitter:description' content={postTitle} />
        <meta name='twitter:image' content={postImage} />
        <meta name='twitter:url' content={postUrl} />
      </Head>

      <div className='share' onClick={showModal}>
        <ShareIcon width={18} />
        <span>Share</span>
      </div>

      <Modal
        title='Share this post'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        {/* Post Data */}
        <div className='post-data'>
          <img
            src={postImage}
            alt={postTitle}
            style={{ width: "100%", marginBottom: "20px" }}
          />
          <h2>{postTitle}</h2>
        </div>

        <div
          className='share-buttons'
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {/* Facebook */}
          <FacebookShareButton url={postUrl} quote={"hi this is my first post"}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          {/* Twitter */}
          <TwitterShareButton url={postUrl} title={"hi this is my first post"}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          <TelegramShareButton url={postUrl} title={"hi this is my first post"}>
            <TelegramIcon size={32} round />
          </TelegramShareButton>

          <RedditShareButton url={postUrl} title={"hi this is my first post"}>
            <RedditIcon size={32} round />
          </RedditShareButton>
        </div>

        {/* Copy Link Button */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <Button onClick={handleCopyLink} type='default'>
            Copy Link
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ShareButton;