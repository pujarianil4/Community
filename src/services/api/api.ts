// import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
// import { store } from "@contexts/store";
// import Cookies from "js-cookie";
// import CryptoJS from "crypto-js";
// import { setUserData, setUserError, setUserLoading } from '@/contexts/reducers';
// import { IUser } from '@/utils/types/types';

// const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
//  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://community-slr7.onrender.com";

// interface TokenResponse {
//   token: string;
//   refreshToken: string;
//   id: string;
// }

// // Encrypt token before saving to cookies
// const encryptToken = (token: string): string => {
//   return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
// };

// // Decrypt token from cookies
// const decryptToken = (encryptedToken: string): string => {
//   const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
//   return bytes.toString(CryptoJS.enc.Utf8);
// };

// // Function to save tokens in cookies after encrypting
// const saveTokens = (id: string, token: string): void => {

//   console.log("saveTokens", id, token);

//   Cookies.set("id", id, {   path:"/" });
//   Cookies.set("token", token, {    path:"/"  });
// };

// // get token details from cookies
//  const getTokens = (): {
//   id: string | null;
//   token: string | null;
// } => {
//   const id = Cookies.get("id");
//   const token = Cookies.get("token");

//   // Decrypt only if the token exists
//   return {
//     id: id ? id : null,
//     token: token ? token : null,
//   };
// };

// // Function to clear tokens
// const clearTokens = (): void => {
//   Cookies.remove("id");
//   Cookies.remove("token");
// };

//  const api: AxiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
// // TODO create seperate file for each catogery
// // UI for notification

// // const updateAuthorizationHeader = () => {
// //   const token = store.getState().user?.token;

// //   if (token) {
// //     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
// //   }
// // };

// api.interceptors.request.use(
//   (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
//     const encryptedToken = Cookies.get("token");
//     if (encryptedToken) {
//        const token = encryptedToken;
//       // Ensure config.headers is defined as AxiosRequestHeaders
//       config.headers = config.headers ?? ({} as AxiosRequestHeaders);
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: any) => {
//     return Promise.reject(error);
//   }
// );

// //Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response: AxiosResponse) => {

//     console.log("response",response);
//     if(response.config.url=="/auth/login" || response.config.url=="/auth/signup"){
//       const token = response.data.token;

//       saveTokens(response.data.uid, response.data.token);

//       (async ()=> {
//         store.dispatch(setUserLoading())
//         try {
//           const user = await axios.get<IUser>(
//             `${BASE_URL}/users/me`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//               },
//             }
//           )
//           store.dispatch(setUserData(user.data))
//         } catch (error) {
//           store.dispatch(setUserError("Failed to get User"))
//         }

//       })()

//     }

//    return response

//   },

//   (error : any) => {

//     if(error&& error.response.data){
//       return Promise.reject(error.response.data);
//     }
//     return Promise.reject(error);
//   }

// );

// export { api, saveTokens, clearTokens, getTokens };
// // updateAuthorizationHeader();
// // store.subscribe(updateAuthorizationHeader);

// new code

import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";
import { store } from "@contexts/store";
import Cookies from "js-cookie";
import CryptoJS, { AES } from "crypto-js";
import { setUserData, setUserError, setUserLoading } from "@/contexts/reducers";
import { IUser } from "@/utils/types/types";

const SECRET_KEY = process.env.TOKEN_SECRET_KEY || "secret_key";
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://community-slr7.onrender.com";

interface TokenResponse {
  token: string;
  refreshToken: string;
  id: string;
}

// Encrypt token before saving to cookies
export const encryptToken = (token: string): string => {
  return AES.encrypt(token, SECRET_KEY.trim()).toString();
};

// Decrypt token function
export const decryptToken = (encryptedToken: string): string | null => {
  try {
    const bytes = AES.decrypt(encryptedToken, SECRET_KEY.trim());
    return bytes.toString(CryptoJS.enc.Utf8) || null;
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
};
// Save encrypted tokens in cookies
const saveTokens = (id: string, token: string): void => {
  Cookies.set("id", id, { path: "/" });
  Cookies.set("token", encryptToken(token), { path: "/" });
};

// Retrieve and decrypt token details from cookies
const getTokens = (): { id: string | null; token: string | null } => {
  const id = Cookies.get("id");
  const encryptedToken = Cookies.get("token");
  const token = encryptedToken ? decryptToken(encryptedToken) : null;
  return { id: id || null, token };
};

// Clear tokens from cookies
const clearTokens = (): void => {
  Cookies.remove("id");
  Cookies.remove("token");
  Cookies.remove("sid");
  localStorage.removeItem("recentCommunity");
};

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
// TODO create seperate file for each catogery
// UI for notification

// const updateAuthorizationHeader = () => {
//   const token = store.getState().user?.token;

//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   }
// };
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { token } = getTokens();
    if (token) {
      config.headers = config.headers ?? ({} as AxiosRequestHeaders);
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (
      response.config.url === "/auth/login" ||
      response.config.url === "/auth/signup"
    ) {
      const { token, uid } = response.data;
      saveTokens(uid, token);

      (async () => {
        store.dispatch(setUserLoading());
        try {
          const user = await api.get<IUser>("/users/me");
          // const user = await api.get<IUser>(`${BASE_URL}/users/me`, {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //   },
          // });
          store.dispatch(setUserData(user.data));
        } catch (error) {
          store.dispatch(setUserError("Failed to get User"));
        }
      })();
    }
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      console.error("401 Unauthorized - Clearing tokens");
      clearTokens();
      store.dispatch(setUserError("Session expired. Please log in again."));
    }
    return Promise.reject(error.response?.data || error);
  }
);

// Initial token validation on page load
(async () => {
  const { token } = getTokens();
  if (token) {
    try {
      await api.get("/users/me");
    } catch {
      clearTokens();
      store.dispatch(setUserError("Session expired. Please log in again."));
    }
  }
})();

export { api, saveTokens, clearTokens, getTokens };
