import { request } from "@/utils/http";
import { LoginResponse, GetUserInfoResponse } from "./model/userTypes";

// 登录api：post
export const reqLogin = (username: string, password: string) => {
  return request.post<any, LoginResponse>(`/admin/auth/index/login`, {
    username,
    password,
  });
};

// 获取用户信息api：get
export const reqGetUserInfo = () => {
  // return request.get<any, GetUserInfoResponse>(`/admin/auth/index/info`);
  return {
    name: '123',
    avatar: ''
  }
};

// 登出api：post
export const reqLogout = () => {
  return request.post<any, null>(`/admin/auth/index/logout`);
};
