"use client";
import CButton from "@/components/common/Button";
import { FiUpload } from "react-icons/fi";

import React, { useEffect, useState } from "react";
import "./index.scss";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchUser, fetchUserById, updateUser } from "@/services/api/api";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import { IUser } from "@/utils/types/types";
import { getImageSource } from "@/utils/helpers";
import NotificationMessage from "@/components/common/Notification";

export default function Profile() {
  const [{}, [userData]] = useRedux([(state: RootState) => state.user]);
  const [isLoadingUpadte, setIsLoadingUpdate] = useState(false);
  const { isLoading, data, refetch, callFunction } = useAsync();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
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
        img: getImageSource(user?.img),
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
        .then((user) => {
          console.log("user", user);
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

  return (
    <div className='profile_container'>
      <div className='avatar'>
        {/* <span className='label'>Avatar</span> */}

        <img onError={setFallbackURL} src={user.img} alt='Avatar' />
        <div className='upload'>
          <FiUpload size={20} />
        </div>
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
        <CButton onClick={handleSave}> Save </CButton>
      </div>
    </div>
  );
}
