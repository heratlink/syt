import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "@/app/store";
import { reqLogin, reqGetUserInfo, reqLogout } from "@api/user";


export interface LoginParams {
  username: string;
  password: string;
}

// 1. 定义初始化状态
const initialState = {
  // 先从localStorage中读取token数据，有就用，没有空字符串
  token: localStorage.getItem("token") || "", // 用户唯一标识
  name: "", // 用户名
  avatar: "", // 用户头像
};



// 异步action。回调函数的return的值就是action的第二个内容payload，或者叫data是我笔记中的记法
// 登录。
export const loginAsync = createAsyncThunk("user/loginAsync", ({ username, password }: LoginParams) => {
  return reqLogin(username, password);
});

// 获取用户数据
export const getUserInfoAsync = createAsyncThunk("user/getUserInfoAsync", () => {
  return reqGetUserInfo();
});

// 登出
export const logoutAsync = createAsyncThunk("user/logoutAsync", () => {
  return reqLogout();
});


// 2. 创建redux模块
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},

  //异步reducer
  extraReducers: (builder) =>
    builder
      //登录请求的异步action中异步代码执行成功时：
      .addCase(loginAsync.fulfilled, (state, action) => {
        // action.payload就是异步action的回调函数的返回值
        const token = action.payload.token;
        // 将token存储在redux中
        state.token = token;
        // 将token存储在localStorage中
        localStorage.setItem("token", token);
      })

      //查询用户数据请求的异步action中异步代码执行成功时：
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        // action.payload就是异步action的回调函数的返回值
        const { name, avatar } = action.payload;
        //将name、avatar存在redux中
        state.name = name;
        state.avatar = avatar;
      })

      //登出请求的异步action中异步代码执行成功时：
      .addCase(logoutAsync.fulfilled, (state) => {
        //清空redux
        state.token = "";
        state.name = "";
        state.avatar = "";
        //清除本地localStorage存放的token
        localStorage.removeItem("token");
      }),
});

// 暴露用来获取数据。未来作为useSelect函数的参数
export const selectUser = (state: RootState) => state.user;

// 3. 将redux模块的reducer函数暴露出去，汇总
export default userSlice.reducer;
