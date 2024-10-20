import { PublicKey } from "@solana/web3.js";

import { api } from "./api";

export const handleLogIn = async (payload: {
  sig: `0x${string}` | string | undefined;
  msg: string;
  typ: string
  pubKey?: PublicKey | string | null;
}) => {
  const response = await api.post("/auth/login", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
  return response.data;
};

export const handleLogOut = async () => {
  try {
    const response = await api.patch("/auth/logout");

    // removeFromLocalStorage("userSession");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleSignup = async (
  username: string | undefined,
  name: string | undefined,
  sig: string | undefined,
  msg: string,
  typ: string,
  pubKey?: PublicKey | string | null
) => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      name,
      sig,
      msg,
      pubKey,
      typ,
    });
    console.log("==============userSignUp=================", response);
    return response.data;
  } catch (error) {
    console.error("SIGNUP_ERROR ", error);
    throw error;
  }
};

export const linkAddress = async (payload: {
  sig: `0x${string}` | string | undefined;
  msg: string;
  typ: string
  pubKey?: PublicKey | string;
}) => {
  const response = await api.post("/users/address", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
  return response.data;
};