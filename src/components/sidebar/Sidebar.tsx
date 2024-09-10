"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuProps, Modal } from "antd";
import { AiOutlinePlus } from "react-icons/ai";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { Button, Menu } from "antd";
import { FiUpload, FiBookmark, FiGlobe } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { FcAbout } from "react-icons/fc";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { PiGlobeStand } from "react-icons/pi";
import { MdOutlineTopic, MdContentPaste } from "react-icons/md";
import TiptapEditor from "../common/tiptapEditor";
import "./index.scss";
import CButton from "../common/Button";
import {
  createCommunity,
  fetchCommunities,
  fetchCommunityByCname,
  uploadSingleFile,
} from "@/services/api/api";
import { RxHamburgerMenu } from "react-icons/rx";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../common/Notification";
import { GoStack } from "react-icons/go";
import {
  debounce,
  getClientSideCookie,
  getImageSource,
  getRandomImageLink,
} from "@/utils/helpers";
import CommunityList from "../common/loaders/communityList";

import {
  AddIcon,
  HomeIcon,
  NotificationIcon,
  SettingIcon,
  StatIcon,
  UploadIcon,
} from "@/assets/icons";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";

type MenuItem = Required<MenuProps>["items"][number];

const LodingCommunities = [
  {
    key: "loading1",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading2",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading3",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading4",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
];

const categories = [
  {
    key: "about",
    label: "About",
    icon: <FcAbout size={20} />,
  },
  {
    key: "help",
    label: "Help",
    icon: <IoIosHelpCircleOutline size={20} />,
  },
  {
    key: "best_of_numa",
    label: "Best of Numa",
    icon: <PiGlobeStand size={20} />,
  },
  {
    key: "topics",
    label: "Topics",
    icon: <MdOutlineTopic size={20} />,
  },
  {
    key: "content_policy",
    label: "Content Policy",
    icon: <MdContentPaste size={20} />,
  },
];

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityList, SetCommunityList] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const refetchCommunitySelector = (state: RootState) =>
    state.common.refetch.community;
  const [{ dispatch, actions }, [comminityRefetch]] = useRedux([
    refetchCommunitySelector,
  ]);
  const { isLoading, callFunction, data, refetch } = useAsync(fetchCommunities);

  const router = useRouter();

  const items: MenuItem[] = [
    { key: "", icon: <HomeIcon />, label: "Home" },
    { key: "popular", icon: <StatIcon />, label: "Popular" },
    {
      key: "communities",
      icon: <FiGlobe size={20} />,
      label: "Explore Communities",
    },
    {
      key: "save",
      icon: <FiBookmark size={20} />,
      label: "Saved",
    },

    {
      type: "divider",
    },
    {
      key: "community",
      label: "My Community",

      children: [
        {
          key: "createCommunity",
          label: (
            <div className='community_item'>
              <CButton icon={<AddIcon />} className='createText'>
                Create Community
              </CButton>
            </div>
          ),
        },
      ].concat(isLoading ? LodingCommunities : communityList),
    },

    {
      key: "categories",
      label: "Categories",
      children: categories,
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
      const user = getClientSideCookie("authToken");
      if (user) {
        showModal();
      } else {
      }
    } else if (!["popular"].includes(e.key)) {
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

  const handleCallback = () => {
    refetch();
    dispatch(actions.setRefetchCommunity(true));
  };

  useEffect(() => {
    if (comminityRefetch) {
      dispatch(actions.setRefetchCommunity(false));
    }
  }, [comminityRefetch]);

  useEffect(() => {
    if (data) getCommunities(data);
  }, [data]);
  return (
    <>
      <RxHamburgerMenu
        className='hamburger'
        size={30}
        onClick={() => setIsOpen(!isOpen)}
      />
      <div className={`sidebar_container ${isOpen && "open"}`}>
        <div className='custom-menu'>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["community", "categories"]}
            mode='inline'
            theme='dark'
            onClick={onClick}
            items={items}
          />
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        className='community-model'
        footer={<></>}
      >
        <CreateCommunityModal
          onClose={handleCancel}
          refetchCommunities={handleCallback}
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
  const [imgSrc, setImgSrc] = useState(getImageSource(null, "c"));
  const [imgSrcCover, setImgSrcCover] = useState(getImageSource(null, "cov"));
  const [form, setForm] = useState<ICommunityForm>({
    logo: imgSrc,
    name: "",
    username: "",
    metadata: "",
    ticker: "",
  });

  const [usernameError, setUsernameError] = useState({
    type: "error",
    msg: "",
  });
  const { isLoading, callFunction, data } = useAsync();
  const fileRef = useRef<HTMLInputElement>(null);
  const closeBtn = document.querySelector(".ant-modal-close");

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [content, setContent] = useState<string>("");

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingAvatar(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        console.log("IMGURL", imgURL);

        setImgSrc(imgURL);
        setForm({ ...form, logo: imgURL });
        setIsUploadingAvatar(false);
      } catch (error) {
        NotificationMessage("error", "Uploading failed");
        setIsUploadingAvatar(false);
      }
    }
  };

  const onCoverImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingCover(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        console.log("IMGURL", imgURL);
        setImgSrcCover(imgURL);
        setForm({ ...form, logo: imgURL });
        setIsUploadingCover(false);
      } catch (error) {
        NotificationMessage("error", "Uploading failed");
        setIsUploadingCover(false);
      }
    }
  };

  useEffect(() => {
    closeBtn?.addEventListener("click", () => {
      // Clear states when the modal is closed
      onClose();
      setForm({
        logo: imgSrc,
        name: "",
        username: "",
        metadata: "",
        ticker: "",
      });
    });
  }, [closeBtn]);

  //fallback img
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getRandomImageLink();
  };

  const debouncedCheckUsername = debounce(async (username: string) => {
    // try {
    //   if (username === "") {
    //     setUsernameError("");
    //     return;
    //   }
    //   const user = await fetchCommunityByCname(username);
    //   if (user?.username) {
    //     const isAvailable = user?.username === username;

    //     if (isAvailable) {
    //       setUsernameError("Username already exists");
    //     } else {
    //       setUsernameError("Username is available");
    //     }
    //   }
    // } catch (error: any) {
    //   if (username && error == "Error: user not available") {
    //     setUsernameError("Username is available");
    //   } else {
    //     setUsernameError("");
    //   }
    try {
      if (username == "") {
        setUsernameError({ type: "error", msg: "" });
        return;
      }
      const community = await fetchCommunityByCname(username);
      console.log("COMMUNITY", community);
      if (community) {
        const isAvailable = community?.username === username;
        if (isAvailable) {
          setUsernameError({ type: "error", msg: "Community already exists" });
        } else {
          setUsernameError({ type: "success", msg: "Community is available" });
        }
      }
    } catch (error) {
      if (username && error == "Error: user not available") {
        setUsernameError({ type: "success", msg: "Community is available" });
      } else {
        setUsernameError({ type: "error", msg: "" });
      }
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
    if (usernameError.type == "error") {
      return false;
    }
    return bool;
  };

  const handleCreateCommunity = async () => {
    try {
      console.log("Form", form);

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
      <div className='cover_bx'>
        {!imgSrc ? (
          <span>Loading...</span>
        ) : (
          <img
            loading='lazy'
            onError={setFallbackURL}
            src={imgSrcCover}
            alt='Avatar'
          />
        )}

        <div
          onClick={() => fileRef?.current?.click && fileRef?.current?.click()}
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRef}
            onChange={onCoverImg}
            type='file'
            name='file'
            accept='image/*'
            style={{ visibility: "hidden" }}
          />
        </div>
        {isUploadingCover && <span className='cvrmsg'>uploading...</span>}
      </div>
      <div className='avatar'>
        {!imgSrc ? (
          <span>Loading...</span>
        ) : (
          <img
            loading='lazy'
            onError={setFallbackURL}
            src={imgSrc}
            alt='Avatar'
          />
        )}

        <div
          onClick={() => fileRef?.current?.click && fileRef?.current?.click()}
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRef}
            onChange={onPickFile}
            type='file'
            name='file'
            accept='image/*'
            style={{ visibility: "hidden" }}
          />
        </div>
        {isUploadingAvatar && <span className='msg'>uploading...</span>}
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
        <span className='label'>Username</span>
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
        {/* <textarea
          name='metadata'
          value={form.metadata}
          rows={5}
          cols={10}
          onChange={handleForm}
        > */}
        <div className='editor'>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={false}
          />
        </div>

        {/* </textarea> */}
      </div>
      <div className='btns'>
        {usernameError.type == "success" && (
          <span className='user_msg'>{usernameError.msg}</span>
        )}
        {usernameError.type == "error" && (
          <span className='user_msg_error'>{usernameError.msg}</span>
        )}
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
