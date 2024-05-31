//这俩类型都是根据接口文档写的

//登录请求返回的promise对象的值的类型
export interface LoginResponse {
  token: string;
}

//查询用户信息请求返回的promise对象的值的类型
export interface GetUserInfoResponse {
  name: string;
  avatar: string;
}

