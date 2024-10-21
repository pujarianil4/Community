import { store } from "@contexts/store";
import { api } from "./api";

export const fetchSearchData = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  if (search?.length < 3) return null;
  try {
    const { data } = await api.get(
      `/search?keyword=${search}&limit=${limit}&page=${page}`
    );
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchSearchByPostData = async ({
  search,
  page = 1,
  limit = 10,
  sortBy = "time", // TODO: update filter
  order = "DESC",
  period = "", // TODO: add all time default filter
}: {
  search: string;
  page: number;
  limit: number;
  sortBy?: "ccount" | "time" | "up";
  order?: "DESC" | "ASC";
  period?: "hourly" | "daily" | "monthly" | "yearly" | "";
}) => {
  let url = `/search/posts?keyword=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&order=${order}`;
  if (period) {
    url += `&period=${period}`;
  }
  try {
    const { data } = await api.get(url);
    console.log("DATA", data);
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchSearchByCommunityData = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(
      `/search/communities?keyword=${search}&limit=${limit}&page=${page}`
    );
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchSearchByUserData = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(
      `/search/users?keyword=${search}&limit=${limit}&page=${page}`
    );
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchSearchByCommentData = async ({
  search,
  page = 1,
  limit = 10,
}: {
  search: string;
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(
      `/search/comments?keyword=${search}&limit=${limit}&page=${page}`
    );
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchCommunitySearchByPostData = async ({
  search,
  page = 1,
  limit = 10,
  cname,
  sortBy = "time", // TODO: update filter
  order = "DESC",
  period = "", // TODO: add all time default filter
}: {
  search: string;
  page: number;
  limit: number;
  cname: string;
  sortBy?: "ccount" | "time" | "up";
  order?: "DESC" | "ASC";
  period?: "hourly" | "daily" | "monthly" | "yearly" | "";
}) => {
  let url = `/search/inUsers?keyword=${search}&limit=${limit}&page=${page}&cname=${cname}&sortBy=${sortBy}&order=${order}`;

  if (period) {
    url += `&period=${period}`;
  }
  try {
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};

export const fetchUserSearchByPostData = async ({
  search,
  page = 1,
  limit = 10,
  uname,
  sortBy = "time", // TODO: update filter
  order = "DESC",
  period = "", // TODO: add all time default filter
}: {
  search: string;
  page: number;
  limit: number;
  uname: string;
  sortBy?: "ccount" | "time" | "up";
  order?: "DESC" | "ASC";
  period?: "hourly" | "daily" | "monthly" | "yearly" | "";
}) => {
  let url = `/search/inUsers?keyword=${search}&limit=${limit}&page=${page}&uname=${uname}&sortBy=${sortBy}&order=${order}`;

  if (period) {
    url += `&period=${period}`;
  }
  try {
    const { data } = await api.get(url);
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};
