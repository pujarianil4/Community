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
import {
  createCommunity,
  fetchCommunities,
  fetchCommunityByCname,
} from "@/services/api/api";
import { RxHamburgerMenu } from "react-icons/rx";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../common/Notification";
import { debounce, getRandomImageLink } from "@/utils/helpers";
import CommunityList from "../common/loaders/communityList";

type MenuItem = Required<MenuProps>["items"][number];

const LodingCommunities = [
  {
    key: "loading1",
    label: (
      <div className='community_item'>
        <div className='skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading2",
    label: (
      <div className='community_item'>
        <div className='skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading3",
    label: (
      <div className='community_item'>
        <div className='skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading4",
    label: (
      <div className='community_item'>
        <div className='skeleton'></div>
      </div>
    ),
  },
];

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityList, SetCommunityList] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, callFunction, data, refetch } = useAsync(fetchCommunities);

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
      ].concat(isLoading ? LodingCommunities : communityList),
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
    e.currentTarget.src = getRandomImageLink();
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
      {" "}
      <RxHamburgerMenu
        className='hamburger'
        size={30}
        onClick={() => setIsOpen(!isOpen)}
      />
      <div className={`sidebar_container ${isOpen && "open"}`}>
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["community"]}
          mode='inline'
          theme='dark'
          onClick={onClick}
          items={items}
        />
      </div>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <CreateCommunityModal
          onClose={handleCancel}
          refetchCommunities={refetch}
        />
      </Modal>
    </>
  );
};

interface ICommunityForm {
  name?: string;
  username?: string;
  ticker?: string;
  metadata?: string;
  logo?: string;
}
interface ICreateCommunityModal {
  onClose: () => void;
  refetchCommunities: () => void;
}

const CreateCommunityModal = ({
  onClose,
  refetchCommunities,
}: ICreateCommunityModal) => {
  const [imgSrc, setImgSrc] = useState("https://picsum.photos/200/300");
  const [form, setForm] = useState<ICommunityForm>({
    logo: imgSrc,
    name: "",
    username: "",
    metadata: "",
    ticker: "",
  });

  const [usernameError, setUsernameError] = useState<string>("");
  const { isLoading, callFunction, data } = useAsync();
  const fileRef = useRef<HTMLInputElement>(null);

  const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImgSrc(URL.createObjectURL(event.target.files[0]));
    }
  };

  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      if (username == "") {
        setUsernameError("");
        return;
      }
      const community = await fetchCommunityByCname(username);
      console.log("COMMUNITY", community);
      const isAvailable = community?.username === username;
      if (isAvailable) {
        setUsernameError("Community already exists");
      } else {
        setUsernameError("Community is available");
      }
    } catch (error) {
      setUsernameError("Error checking community availability");
    }
  }, 500);

  function checkWhitespace(str: string) {
    return /\s/.test(str);
  }

  const handleForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name == "username" && !checkWhitespace(value)) {
      console.log("form", name, value, !checkWhitespace(value));
      debouncedCheckUsername(value);
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    } else if (name !== "username") {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const isFormValid = () => {
    const bool =
      form.name?.trim() !== "" &&
      form.username?.trim() !== "" &&
      form.ticker?.trim() !== "" &&
      form.metadata?.trim() !== "";
    console.log("isFormValid", bool);

    return bool;
  };

  const handleCreateCommunity = async () => {
    try {
      await callFunction(createCommunity, form);
      NotificationMessage("success", "Community Created");
      refetchCommunities();
      onClose();
    } catch (error: any) {
      let errorMessage;
      if (
        Array.isArray(error.response.data.message) &&
        error.response.data.message.length > 0
      ) {
        errorMessage = error.response.data.message[0]; // Get the first element of the array
      } else {
        errorMessage = "Please Enter valid values";
      }

      console.log("error", errorMessage);

      NotificationMessage("error", errorMessage);

      // Handle error appropriately
      console.error("Failed to create community:", error);
    }
  };

  return (
    <div className='create_community_container'>
      <div className='avatar'>
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
        <input
          type='text'
          name='name'
          value={form.name}
          onChange={handleForm}
        />
      </div>
      <div className='info'>
        <span className='label'>UserName</span>
        <input
          type='text'
          name='username'
          value={form.username}
          onChange={handleForm}
        />
      </div>
      <div className='info'>
        <span className='label'>Ticker</span>
        <input
          type='text'
          name='ticker'
          value={form.ticker}
          onChange={handleForm}
        />
      </div>
      <div className='info'>
        <span className='label'>Description</span>
        <textarea
          name='metadata'
          value={form.metadata}
          rows={5}
          cols={10}
          onChange={handleForm}
        />
      </div>
      <div className='btns'>
        <CButton
          disabled={!isFormValid()}
          onClick={handleCreateCommunity}
          loading={isLoading}
        >
          {/* <p
            className={`${
              usernameError == "Community is available" ? "success" : "error"
            }`}
          >
            {usernameError}
          </p> */}
          Create Community
        </CButton>
      </div>
    </div>
  );
};

export default SideBar;
