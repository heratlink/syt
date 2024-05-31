import { FC } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Spin } from "antd";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { getUserInfoAsync, selectUser } from "@/pages/login/slice";
/*
  高阶组件HOC
    本质上是一个函数，接受组件作为参数，返回一个新组件

  WrappedComponent 组件是哪个？
    看路由路径（地址）
      /login --> EmptyLayout/Login
      /syt/dashboard --> Layout/Dashboard
*/
function withAuthorization(WrappedComponent: FC) {
  return () => {
    /*
      当用户登陆过（token）
        访问首页，没问题
          判断是否有用户数据
            有，没问题
            没有数据，请求数据，在展示
        访问登录页面，请跳转到首页
      当用户没有登录过
        访问首页，跳转到登录页面重新登录
        访问登录页面，没问题
    */
   
    //先从管理登录信息的slice的state里解构出token和name
    const { token, name } = useAppSelector(selectUser);

    // 获取当前路由地址
    const { pathname } = useLocation();

    if (true) {
      // 说明登录过
      if (pathname === "/login" || pathname === "/") {
        return <Navigate to="/syt/dashboard" />;
      }
      // console.log('aaaaaaaaaaaaaaaaaa')
      console.log('name',name)
      // debugger
      // 说明访问不是登录页面或/
      // 判断是否有用户数据
      if (true) {
        return <WrappedComponent />;
      }

      // 说明没有用户数据
      // const dispatch = useAppDispatch();
      // 那就去请求用户数据
      // dispatch(getUserInfoAsync());
      //返回一个antd提供的加载动画组件，
      return <Spin size="large" />;

    } else {
      // 说明没有登录过
      // 如果访问登录页面那就去登录
      if (pathname === "/login") {
        return <WrappedComponent />;
      }

      // 访问不是登录页面也去登录
      return <Navigate to="/login" />;
    }
  };
}

export default withAuthorization;
