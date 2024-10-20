"use client";
import CButton from "@/components/common/Button";
import { FiUpload } from "react-icons/fi";

import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { uploadSingleFile } from "@/services/api/commonApi";
import { fetchUserById, updateUser } from "@services/api/userApi";

import { fetchUserByUserName } from "@/services/api/userApi";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import { IUser } from "@/utils/types/types";
import {
  debounce,
  getImageSource,
  getRandomImageLink,
  setClientSideCookie,
} from "@/utils/helpers";
import NotificationMessage from "@/components/common/Notification";
import { LinkIcon, UploadIcon } from "@/assets/icons";
import Avatar from "@/components/common/loaders/userAvatar";
import ProfileAvatar from "@/components/common/loaders/profileAvatar";
import TiptapEditor from "@components/common/tiptapEditor";
import TurndownService from "turndown";
import FocusableDiv from "@/components/common/focusableDiv";

export default function Profile() {
  const [{ dispatch, actions }, [userData]] = useRedux([
    (state: RootState) => state.user.profile,
  ]);
  const [isLoadingUpadte, setIsLoadingUpdate] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const { isLoading, data, refetch, callFunction } = useAsync();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [imageError, setImageError] = useState(false);
  const fileRefs = {
    cover: useRef<HTMLInputElement>(null),
    avatar: useRef<HTMLInputElement>(null),
  };
  const [content, setContent] = useState<string>("");
  const turndownService = new TurndownService();
  if (content) {
    var markDownDesc = turndownService.turndown(content);
  } else {
    var markDownDesc = "";
  }

  const [user, setUser] = useState<any>({
    username: "",
    name: "",
    img: {
      pro: "",
      cvr: "",
    },
    desc: "",
  });
  const [originalUser, setOriginalUser] = useState<any>({
    username: "",
    name: "",
    img: {
      pro: "",
      cvr: "",
    },
  });

  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      if (username === "" || data?.username === username) {
        setUsernameError("");
        return;
      }
      const user = await fetchUserByUserName(username);
      if (user?.username) {
        const isAvailable = user?.username === username;

        if (isAvailable) {
          setUsernameError("Username already exists");
        } else {
          setUsernameError("Username is available");
        }
      }
    } catch (error: any) {
      if (
        data?.username !== username &&
        username &&
        error == "Error: user not available"
      ) {
        setUsernameError("Username is available");
      } else {
        setUsernameError("");
      }
    }
  }, 500);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "username") {
      debouncedCheckUsername(value);
    }
    setUser((prevUser: any) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  useEffect(() => {
    callFunction(fetchUserById, userData.uid);
  }, [userData]);

  useEffect(() => {
    console.log("data", data);
    if (data) {
      const userData = {
        username: data.username,
        name: data.name,
        img: {
          pro: getImageSource(data?.img?.pro, "u"),
          cvr: getImageSource(data?.img?.cvr, "cvr"),
        },

        desc: data?.desc,
      };
      setUser(userData);
      setOriginalUser(userData);
      setContent(data?.desc);
    }
  }, [data]);

  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getRandomImageLink();
  };

  const handleSave = () => {
    const updates: Partial<IUser> = {
      img: {
        pro: user.img.pro,
        cvr: user.img.cvr,
      },
    };
    if (user.username !== originalUser.username)
      updates.username = user.username;
    if (user.name !== originalUser.name) updates.name = user.name;
    if (markDownDesc !== originalUser.desc) updates.desc = markDownDesc;
    if (user.img.pro !== originalUser.img.pro) {
      if (updates.img) {
        updates.img.pro = user.img.pro;
      }
    }
    if (user.img.cvr !== originalUser.img.cvr) {
      if (updates.img) {
        updates.img.cvr = user.img.cvr;
      }
    }

    console.log("UpdateObject", updates);

    if (Object.keys(updates).length > 0) {
      setIsLoadingUpdate(true);
      updateUser(updates)
        .then((response) => {
          dispatch(actions.setRefetchUser(true));
          const updatedUser: any = {
            username: response?.username,
            name: response?.name,
            uid: response?.id,
            token: userData?.token,
            img: response?.img?.pro,
            sid: response?.id || "",
            netWrth: response?.netWrth,
            effectiveNetWrth: response?.effectiveNetWrth,
          };

          console.log("updatedUser", updatedUser, userData);

          setClientSideCookie("authToken", JSON.stringify(updatedUser), true);

          dispatch(actions.setUserData(updatedUser));
          setIsLoadingUpdate(false);
          NotificationMessage("success", "Profile updated !");
          setUser(user);
          setOriginalUser(user);
          // Optionally show success message
        })
        .catch((error) => {
          console.error("Error updating user:", error);
          NotificationMessage("error", error?.message);
          // Optionally show error message
        });
    }
  };

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingAvatar(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        console.log("IMGURL", imgURL);
        setUser({ ...user, img: { ...user.img, pro: imgURL } });
        setIsUploadingAvatar(false);
        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        setIsUploadingAvatar(false);
        NotificationMessage("error", "Uploading failed");
        //reset value to select same image again
        event.target.value = "";
      }

      //setImgSrc(imgURL);
    }
  };
  const onCoverImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingCover(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        console.log("IMGURL", imgURL);
        setUser({ ...user, img: { ...user.img, cvr: imgURL } });
        setIsUploadingCover(false);
        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        setIsUploadingCover(false);
        NotificationMessage("error", "Uploading failed");
        //reset value to select same image again
        event.target.value = "";
      }

      //setImgSrc(imgURL);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className='profile_container'>
      <div className='cover_bx'>
        {isUploadingCover || !user?.img?.cvr ? (
          <ProfileAvatar />
        ) : (
          <img
            loading='lazy'
            onLoad={handleImageLoad}
            onError={setFallbackURL}
            src={user?.img?.cvr}
            alt='Cover Img'
          />
        )}

        <div onClick={() => fileRefs.cover.current?.click()} className='upload'>
          <UploadIcon />
          <input
            ref={fileRefs.cover}
            onChange={onCoverImg}
            type='file'
            accept='image/*'
            name='img'
            style={{ visibility: "hidden" }}
          />
        </div>
        {/* {isUploadingCover && <span className='cvrmsg'>uploading...</span>} */}
      </div>
      <div className='avatar'>
        {isUploadingAvatar || !user?.img?.pro ? (
          <Avatar />
        ) : (
          <img
            loading='lazy'
            onLoad={handleImageLoad}
            onError={setFallbackURL}
            src={user?.img?.pro}
            alt='Avatar Image'
          />
        )}

        <div
          onClick={() => fileRefs.avatar.current?.click()}
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRefs.avatar}
            onChange={onPickFile}
            type='file'
            accept='image/*'
            name='img'
            style={{ visibility: "hidden" }}
          />
        </div>
        {/* {isUploadingAvatar && <span className='msg'>Uploading...</span>} */}
      </div>

      <div className='info'>
        <span className='label'>Name</span>
        <input
          type='text'
          onChange={handleChange}
          defaultValue={user.name}
          name='name'
        />
      </div>
      <div className='info'>
        <span className='label'>Username</span>
        <input
          type='text'
          onChange={handleChange}
          defaultValue={user.username}
          name='username'
        />
      </div>

      <div className='info'>
        <span className='label'>Bio</span>
        {/* <textarea
          rows={5}
          cols={10}
          onChange={handleChange}
          name='desc'
          defaultValue={user.desc}
        /> */}

        <FocusableDiv>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={true}
            maxCharCount={200}
          />
        </FocusableDiv>
      </div>
      <div className='btns'>
        <p
          className={`${
            usernameError == "Username is available" ? "success" : "error"
          }`}
        >
          {usernameError}
        </p>
        <CButton className='save_btn ' onClick={handleSave}>
          Save
        </CButton>
      </div>
    </div>
  );
}
