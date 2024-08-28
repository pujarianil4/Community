export interface IUser {
  id?: number;
  username: string;
  name?: string;
  img: string;
  sts?: number;
  cta?: string;
  uta?: string;
  desc?: string;
}

export interface ICommunity {
  id?: number;
  username: string;
  name: string;
  ticker: string;
  logo: string;
  metadata: string;
  pCount: number;
  followers: number;
  totalSupply: number;
  sts: number;
  cta: string;
  uta: string;
}

export interface IPost {
  id?: number;
  uid: number;
  cid: number;
  text: string;
  up: number;
  down: number;
  ccount: number;
  time: string;
  user: IUser;
  img?: string[];
  // img?: string;
  community: ICommunity;
}

export interface IComment {
  id: number;
  uid: number;
  pid: number;
  pcid: number | null;
  content: string;
  up: number;
  down: number;
  rCount: number | null;
  cta: string;
  uta: string;
  user: IUser;
  img?: string;
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
