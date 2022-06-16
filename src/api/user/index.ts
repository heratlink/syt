import { request } from "@/utils/http";
import { LoginResponse, GetUserInfoResponse } from "./model/userTypes";

// 登录
export const reqLogin = (username: string, password: string) => {
  return request.post<any, LoginResponse>(`/admin/auth/index/login`, {
    username,
    password,
  });
};

// 获取用户信息
export const reqGetUserInfo = () => {
  return request.get<any, GetUserInfoResponse>(`/admin/auth/index/info`);
};

// 登出
export const reqLogout = () => {
  return request.post<any, null>(`/admin/auth/index/logout`);
};
