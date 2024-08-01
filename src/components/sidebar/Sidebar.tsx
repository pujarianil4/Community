"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MenuProps, Modal } from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { GoHome } from "react-icons/go";
import { PiMegaphone } from "react-icons/pi";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { Button, Menu } from "antd";
import { FiUpload } from "react-icons/fi";
import "./index.scss";
import CButton from "../common/Button";

type MenuItem = Required<MenuProps>["items"][number];

const communities = [
  {
    key: "5",
    label: (
      <div className='community_item'>
        <img src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "6",
    label: (
      <div className='community_item'>
        <img src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "7",
    label: (
      <div className='community_item'>
        <img src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "8",
    label: (
      <div className='community_item'>
        <img src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
];

const items: MenuItem[] = [
  { key: "", icon: <GoHome size={20} />, label: "Home" },
  { key: "popular", icon: <PiMegaphone size={20} />, label: "Popular" },
  {
    type: "divider",
  },
  {
    key: "community",
    label: "Community",
    icon: <HiOutlineUserGroup size={20} />,
    children: [
      {
        key: "createCommunity",
        label: (
          <div className='community_item'>
            <AiOutlinePlus size={20} />
            <span>Create Community</span>
          </div>
        ),
      },
    ].concat(communities),
  },
];

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key == "createCommunity") {
      showModal();
    } else {
      router.push(`/${e.key}`);
    }
  };

  return (
    <>
      <div style={{ width: 256 }}>
        {/* <Button
        type='primary'
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button> */}
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          mode='inline'
          theme='dark'
          onClick={onClick}
          items={items}
        />
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <CreateCommunityModal />
      </Modal>
    </>
  );
};

const CreateCommunityModal = () => {
  const [imgSrc, setImgSrc] = useState(
    "https://static.vecteezy.com/system/resources/previews/018/765/757/original/user-profile-icon-in-flat-style-member-avatar-illustration-on-isolated-background-human-permission-sign-business-concept-vector.jpg"
  );
  return (
    <div className='create_community_container'>
      <div className='avatar'>
        {/* <span className='label'>Avatar</span> */}

        <img src={imgSrc} alt='Avatar' />
        <div className='upload'>
          <FiUpload size={20} />
        </div>
      </div>
      <div className='info'>
        <span className='label'>Community Name</span>
        <input type='text' name='name' />
      </div>
      <div className='info'>
        <span className='label'>UserName</span>
        <input type='text' name='username' />
      </div>
      <div className='info'>
        <span className='label'>Ticker</span>
        <input type='text' name='username' />
      </div>

      <div className='info'>
        <span className='label'>Description</span>
        <textarea
          rows={5}
          cols={10}
          defaultValue=' Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum quo nisi repudiandae laboriosam dolor. Incidunt amet laudantium asperiores illo officiis! Voluptate aperiam error omnis explicabo voluptates, nostrum repellat fugit accusamus!'
        />
      </div>
      <div className='btns'>
        <CButton> Save </CButton>
      </div>
    </div>
  );
};

export default SideBar;
