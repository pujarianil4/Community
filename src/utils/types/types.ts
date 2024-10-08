interface IImsg {
  pro?: any;
  cvr?: any;
}
export interface IUser {
  id?: number;
  uid?: number | string;
  username: string;
  name: string;
  img: IImsg;
  isFollowed?: boolean; // TODO: remove option after api update
  sts?: number;
  cta?: string;
  uta?: string;
  desc?: string;
  sid?: string;
  netWrth?: number;
  effectiveNetWrth?: number;
  telegram?: { id: string; username: string } | string | null;
  discord?: { id: string; username: string } | string | null;
  x?: { id: string; username: string } | string | null;
  token?: string;
}

export interface ICommunity {
  id?: number;
  username: string;
  name: string;
  ticker: string;
  isFollowed?: boolean; // TODO: remove option after api update
  img: IImsg;
  metadata: string;
  pCount: number;
  followers: number;
  tSupply: number;
  sts: number;
  cta: string;
  uta: string;
}

export interface IPost {
  id?: number;
  uid: number;
  cid: number;
  text: string;
  isVoted?: boolean;
  up: number;
  down: number;
  ccount: number;
  cta: string;
  user: IUser;
  media?: string[];
  // img?: string;
  community: ICommunity;
}

export interface IComment {
  id: number;
  uid: number;
  pid: number;
  pcid: number | null;
  content: string;
  isVoted?: boolean;
  up: number;
  down: number;
  rCount: number | null;
  cta: string;
  uta: string;
  user: IUser;
  img: string;
  parentComment?: IComment | null;
  comments?: IComment[];
}

export interface IFollowAPI {
  uid: number;
  typ: string;
  fwid: number;
}

export interface IFollowersAPI {
  userId: string;
  type: string;
}

export interface IPostCommentAPI {
  uid: number;
  content: string;
  img?: string | null;
  pid: number;
  pcid: number | null;
}

export type ErrorType = {
  error: string;
  message: string;
  statusCode: number;
};

export interface IIConProps {
  fill?: string;
  width?: string | number;
  height?: string | number;
}
//types for telegram auth
export interface TelegramAuthData {
  id: number;
  first_name: string;
  auth_date: number;
  hash: string;
  last_name?: string;
  photo_url?: string;
  username?: string;
}

export interface LoginButtonProps {
  /**
   * The URL where the auth data from Telegram will be sent.
   */
  authCallbackUrl?: string;
  botUsername: string;
  buttonSize?: "large" | "medium" | "small";
  cornerRadius?: number;
  lang?: string;

  onAuthCallback?: (data: TelegramAuthData) => void;
  requestAccess?: "write";
  showAvatar?: boolean;
  widgetVersion?: number | string;
}

export type TTelegramAuthLogin = Pick<LoginButtonProps, "onAuthCallback">;
declare global {
  interface Window {
    TelegramAuthLogin: TTelegramAuthLogin;
  }
}

export interface IVotePayload {
  typ: string;
  cntId: number;
  voteTyp: "up" | "down" | "";
}

export interface IVoteProposalPayload {
  pid: number;
  typ: string;
}

export interface IProposalForm {
  title: string;
  desc: string;
  cid: number;
  // validity: string;
  validity: {
    start: string;
    end: string;
  };
}

export interface IProposal {
  id: number;
  sts: number;
  title: string;
  cid: number;
  uid: number;
  desc: string;
  validity: string;
  up: number;
  down: number;
  cta: string;
  uta: string;
  isVoted: true;
  user: IUser;
  community: ICommunity;
}
