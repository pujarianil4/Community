import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import { ShareIcon } from "@/assets/icons";
import "./index.scss";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
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
          <FacebookShareButton url={postUrl} quote={postTitle}>
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          {/* Twitter */}
          <TwitterShareButton url={postUrl} title={postTitle}>
            <TwitterIcon size={32} round />
          </TwitterShareButton>

          {/* LinkedIn */}
          <LinkedinShareButton url={postUrl}>
            <LinkedinIcon size={32} round />
          </LinkedinShareButton>

          {/* WhatsApp */}
          <WhatsappShareButton url={postUrl} title={postTitle} separator=':: '>
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>
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
