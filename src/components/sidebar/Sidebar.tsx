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

import FocusableDiv from "../common/focusableDiv";
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
import TurndownService from "turndown";
import { ICommunity } from "@/utils/types/types";
import Image from "next/image";
import CHead from "../common/chead";

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
  const [recentCommunities, setRecentCommunities] = useState([]);

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
    recentCommunities.length > 0
      ? { key: "recentCommunity", label: "Recent", children: recentCommunities }
      : null,
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

  const extractNextString = (input: string) => {
    const startIndex = input.indexOf("c/");
    if (startIndex !== -1) {
      const endIndex = input.indexOf("/", startIndex + 2);
      if (endIndex !== -1) {
        return input.substring(startIndex, endIndex);
      } else {
        return input.substring(startIndex);
      }
    }
    return input;
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key == "createCommunity") {
      const user = getClientSideCookie("authToken");
      if (user) {
        showModal();
      } else {
      }
    } else if (e.key[0] === "c" && e.key[1] === "/") {
      const path = extractNextString(e.key);
      router.push(`/${path}`);
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
          <>
            {/* <div className='community_item'>
              <img
                loading='lazy'
                src={getImageSource(cm?.img?.pro, "c")}
                alt='profile'
                onError={handleError}
              />
              <span>{cm?.name}</span>
            </div> */}
            <CHead community={cm} />
          </>
        ),
      };
    });

    SetCommunityList(inFormat);
  };

  const handleCallback = () => {
    refetch();
    dispatch(actions.setRefetchCommunity(true));
  };

  const getRecentCommunities = () => {
    const value = localStorage?.getItem("recentCommunity");
    let prevCommunities = [];
    prevCommunities = value ? JSON.parse(value) : [];
    if (prevCommunities?.length > 0) {
      const updateData = prevCommunities?.map(
        (item: ICommunity, index: number) => ({
          key: `c/${item.username}/${index}`,
          label: <CHead community={item} />,
        })
      );
      setRecentCommunities(updateData.reverse());
    } else {
      setRecentCommunities([]);
    }
  };

  useEffect(() => {
    getRecentCommunities();
  }, []);

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
            defaultOpenKeys={["community", "categories", "recentCommunity"]}
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
  img: {
    pro: string;
    cvr: string;
  };
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
  const [imgSrcCover, setImgSrcCover] = useState(getImageSource(null, "cvr"));
  const [form, setForm] = useState<ICommunityForm>({
    img: {
      pro: imgSrc,
      cvr: imgSrcCover,
    },
    name: "",
    username: "",
    metadata: "",
    ticker: "",
  });

  const [usernameError, setUsernameError] = useState({
    type: "",
    msg: "",
  });
  const { isLoading, callFunction, data } = useAsync();
  const fileRefs = {
    cover: useRef<HTMLInputElement>(null),
    avatar: useRef<HTMLInputElement>(null),
  };
  const closeBtn = document.querySelector(".ant-modal-close");

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [content, setContent] = useState<string>("");
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingAvatar(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        setImgSrc(imgURL);
        setForm((prevForm) => ({
          ...prevForm,
          img: { ...prevForm.img, pro: imgURL },
        }));
        setIsUploadingAvatar(false);
        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        NotificationMessage("error", "Avatar uploading failed");
        setIsUploadingAvatar(false);
        //reset value to select same image again
        event.target.value = "";
      }
    }
  };

  // Handle cover image upload
  const onCoverImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingCover(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        setImgSrcCover(imgURL);
        setForm((prevForm) => ({
          ...prevForm,
          img: { ...prevForm.img, cvr: imgURL },
        }));
        setIsUploadingCover(false);
      } catch (error) {
        NotificationMessage("error", "Cover uploading failed");
        setIsUploadingCover(false);
      }
    }
  };

  useEffect(() => {
    closeBtn?.addEventListener("click", () => {
      // Clear states when the modal is closed
      onClose();
      setForm({
        img: {
          pro: imgSrc,
          cvr: imgSrcCover,
        },
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
    if (username === "") {
      console.log("COMMUNITY", username);
      setUsernameError({ type: "", msg: "" });
      return;
    }
    try {
      const community = await fetchCommunityByCname(username);

      if (community) {
        // If a community with the same username is found, show an error
        if (community.username === username) {
          setUsernameError({ type: "error", msg: "Community already exists" });
        } else {
          setUsernameError({ type: "success", msg: "Community is available" });
        }
      } else {
        // If no community is found, the username is available
        setUsernameError({ type: "success", msg: "Community is available" });
      }
    } catch (error) {
      console.log("COMMUNITY error", error);

      if (username && error == "Error: user not available") {
        // If the API error indicates the username is not available in the database
        setUsernameError({ type: "success", msg: "Community is available" });
      } else {
        // Handle any other errors from the API
        setUsernameError({ type: "error", msg: "Error checking availability" });
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

    if (name === "username") {
      // If the user clears the field, ensure the success message is cleared
      if (value === "") {
        setUsernameError({ type: "", msg: "" });
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
      } else {
        debouncedCheckUsername(value);
        if (!checkWhitespace(value)) {
          setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
      }
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const isFormValid = () => {
    const isFilled =
      form.name?.trim() !== "" &&
      form.username?.trim() !== "" &&
      form.ticker?.trim() !== "" &&
      markDownContent?.trim() !== "";

    // Check if the usernameError is not an error and all fields are filled
    const isUsernameValid =
      usernameError.type === "success" || usernameError.msg === "";

    return isFilled && isUsernameValid;
  };

  const handleCreateCommunity = async () => {
    try {
      console.log("Form", form);
      const communityForm = {
        ...form,
        metadata: markDownContent,
      };
      await callFunction(createCommunity, communityForm);
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
        {!imgSrcCover ? (
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
          onClick={() =>
            fileRefs.cover.current?.click && fileRefs.cover.current?.click()
          }
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRefs.cover}
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
          onClick={() =>
            fileRefs.avatar.current?.click && fileRefs.avatar.current?.click()
          }
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRefs.avatar}
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
        {/* <div className='editor'>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={false}
          />
        </div> */}

        <FocusableDiv>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={true}
            maxCharCount={100}
          />
        </FocusableDiv>

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
