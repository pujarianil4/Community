"use client";
import React, { useEffect, useRef, useState } from "react";
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
import { createCommunity, fetchCommunities } from "@/services/api/api";
import useAsync from "@/hooks/useAsync";

type MenuItem = Required<MenuProps>["items"][number];

const communities = [
  {
    key: "5",
    label: (
      <div className='community_item'>
        <img loading='lazy' src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "6",
    label: (
      <div className='community_item'>
        <img loading='lazy' src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "7",
    label: (
      <div className='community_item'>
        <img loading='lazy' src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
  {
    key: "8",
    label: (
      <div className='community_item'>
        <img loading='lazy' src='https://picsum.photos/200/300' alt='profile' />
        <span>Community Name</span>
      </div>
    ),
  },
];

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityList, SetCommunityList] = useState<Array<any>>([]);

  const { isLoading, callFunction, data } = useAsync(fetchCommunities);

  const router = useRouter();

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
      ].concat(communityList),
    },
  ];

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

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://picsum.photos/200/300";
  };

  const getCommunities = async (cmnties: Array<any>) => {
    const inFormat = cmnties.map((cm: any) => {
      return {
        key: "c/" + cm.username,
        label: (
          <div className='community_item'>
            <img
              loading='lazy'
              src={cm?.logo}
              alt='profile'
              onError={handleError}
            />
            <span>{cm?.name}</span>
          </div>
        ),
      };
    });

    SetCommunityList(inFormat);
  };

  useEffect(() => {
    if (data) getCommunities(data);
  }, [data]);
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
        <CreateCommunityModal onClose={handleCancel} />
      </Modal>
    </>
  );
};

interface ICommunityForm {
  name?: string;
  username?: string;
  ticket?: string;
  metadata?: string;
  logo?: string;
}
interface ICreateCommunityModal {
  onClose: () => void;
}

const CreateCommunityModal = ({ onClose }: ICreateCommunityModal) => {
  const [imgSrc, setImgSrc] = useState("https://picsum.photos/200/300");

  const [form, setForm] = useState<ICommunityForm>({ logo: imgSrc });
  const { isLoading, callFunction, data } = useAsync();
  const fileRef = useRef<HTMLInputElement>(null);
  const onPickFile = (event: any) => {
    setImgSrc(URL.createObjectURL(event.target.files[0]));
  };

  const handleForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCreateCommunity = async () => {
    try {
      await callFunction(createCommunity, form);
      onClose();
    } catch (error) {}
  };

  return (
    <div className='create_community_container'>
      <div className='avatar'>
        {/* <span className='label'>Select Logo</span> */}

        <img src={imgSrc} alt='logo' />
        <div
          onClick={() => fileRef?.current?.click && fileRef?.current?.click()}
          className='upload'
        >
          <FiUpload size={20} />
          <input
            ref={fileRef}
            onChange={onPickFile}
            type='file'
            name='file'
            style={{ visibility: "hidden" }}
          />
        </div>
      </div>
      <div className='info'>
        <span className='label'>Community Name</span>
        <input type='text' name='name' onChange={handleForm} />
      </div>
      <div className='info'>
        <span className='label'>UserName</span>
        <input type='text' name='username' onChange={handleForm} />
      </div>
      <div className='info'>
        <span className='label'>Ticker</span>
        <input type='text' name='ticker' onChange={handleForm} />
      </div>

      <div className='info'>
        <span className='label'>Description</span>
        <textarea name='metadata' rows={5} cols={10} onChange={handleForm} />
      </div>
      <div className='btns'>
        <CButton onClick={handleCreateCommunity} loading={isLoading}>
          {" "}
          Create Community{" "}
        </CButton>
      </div>
    </div>
  );
};

export default SideBar;
