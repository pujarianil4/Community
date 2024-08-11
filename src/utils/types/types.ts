export interface User {
  username: string;
  name: string;
  img: string;
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
