"use client";
import CButton from "@/components/common/Button";
import { FiUpload } from "react-icons/fi";

import React, { useEffect, useRef, useState } from "react";
import "./index.scss";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  fetchUser,
  fetchUserById,
  fetchUserByUserName,
  updateUser,
  uploadSingleFile,
} from "@/services/api/api";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import { IUser } from "@/utils/types/types";
import { debounce, getImageSource, setClientSideCookie } from "@/utils/helpers";
import NotificationMessage from "@/components/common/Notification";

export default function Profile() {
  const [{ dispatch, actions }, [userData]] = useRedux([
    (state: RootState) => state.user,
  ]);
  const [isLoadingUpadte, setIsLoadingUpdate] = useState(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const { isLoading, data, refetch, callFunction } = useAsync();
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<IUser>({
    username: "",
    name: "",
    img: "",
    desc: "",
  });
  const [originalUser, setOriginalUser] = useState<IUser>({
    username: "",
    name: "",
    img: "",
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
    setUser((prevUser) => ({
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
        img: getImageSource(data.img, "u"),
        desc: data?.desc,
      };
      setUser(userData);
      setOriginalUser(userData);
    }
  }, [data]);

  const setFallbackURL = () => {
    //'https://picsum.photos/200/300'
  };

  const handleSave = () => {
    const updates: Partial<IUser> = {};
    if (user.username !== originalUser.username)
      updates.username = user.username;
    if (user.name !== originalUser.name) updates.name = user.name;
    if (user.desc !== originalUser.desc) updates.desc = user.desc;
    updates.img = user.img;

    if (Object.keys(updates).length > 0) {
      setIsLoadingUpdate(true);
      updateUser(updates)
        .then((response) => {
          dispatch(actions.setRefetchUser(true));
          const updatedUser = {
            username: response?.username,
            name: response?.name,
            uid: response?.id,
            token: userData?.token,
            img: response?.img,
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
        setIsUploading(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        console.log("IMGURL", imgURL);
        setUser({ ...user, img: imgURL });
        setIsUploading(false);
      } catch (error) {
        setIsUploading(false);
        NotificationMessage("error", "Uploading failed");
      }

      //setImgSrc(imgURL);
    }
  };

  return (
    <div className='profile_container'>
      <div className='avatar'>
        {/* <span className='label'>Avatar</span> */}

        <img
          loading='lazy'
          onError={setFallbackURL}
          src={user?.img}
          alt='Avatar'
        />
        <div
          onClick={() => fileRef?.current?.click && fileRef?.current?.click()}
          className='upload'
        >
          <FiUpload size={20} />
          <input
            ref={fileRef}
            onChange={onPickFile}
            type='file'
            accept='image/*'
            name='img'
            style={{ visibility: "hidden" }}
          />
        </div>
        {isUploading && <span className='msg'>uploading...</span>}
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
        <span className='label'>UserName</span>
        <input
          type='text'
          onChange={handleChange}
          defaultValue={user.username}
          name='username'
        />
      </div>

      <div className='info'>
        <span className='label'>Description</span>
        <textarea
          rows={5}
          cols={10}
          onChange={handleChange}
          name='desc'
          defaultValue={user.desc}
        />
      </div>
      <div className='btns'>
        <p
          className={`${
            usernameError == "Username is available" ? "success" : "error"
          }`}
        >
          {usernameError}
        </p>
        <CButton onClick={handleSave}> Save </CButton>
      </div>
    </div>
  );
}
