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
  sortBy?: string;
  order?: string;
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
  sortBy = "ccount", // TODO: update filter
  order = "DESC",
}: {
  search: string;
  page: number;
  limit: number;
  sortBy?: string;
  order?: string;
}) => {
  try {
    const { data } = await api.get(
      `/search/posts?keyword=${search}&limit=${limit}&page=${page}&sortBy=${sortBy}&order=${order}`
    );
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
}: // sortBy = "ccount", // TODO: update filter
// order = "DESC",
{
  search: string;
  page: number;
  limit: number;
  // sortBy?: string;
  // order?: string;
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
}: // sortBy = "ccount", // TODO: update filter
// order = "DESC",
{
  search: string;
  page: number;
  limit: number;
  // sortBy?: string;
  // order?: string;
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
}: // sortBy = "ccount", // TODO: update filter
// order = "DESC",
{
  search: string;
  page: number;
  limit: number;
  // sortBy?: string;
  // order?: string;
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
}: {
  search: string;
  page: number;
  limit: number;
  cname: string;
  // sortBy?: string;
  // order?: string;
}) => {
  try {
    const { data } = await api.get(
      `/search/inCommunity?keyword=${search}&limit=${limit}&page=${page}&cname=${cname}`
    );
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
}: {
  search: string;
  page: number;
  limit: number;
  uname: string;
  // sortBy?: string;
  // order?: string;
}) => {
  try {
    const { data } = await api.get(
      `/search/inUsers?keyword=${search}&limit=${limit}&page=${page}&uname=${uname}`
    );
    return data;
  } catch (error) {
    console.log("Search_Result_Error", error);
    throw error;
  }
};
