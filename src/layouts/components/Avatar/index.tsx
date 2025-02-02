import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Dropdown, Button } from "antd";

import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { selectUser, logoutAsync } from "@/pages/login/slice";

import "./index.less";

function AvatarComponent() {
  const navigator = useNavigate();

  const { avatar } = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigator("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/syt/dashboard">返回首页</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <div onClick={handleLogout}>退出登录</div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Button className="layout-dropdown-link" type="link">
        <img className="layout-avatar" src={avatar} alt="avatar" />
      </Button>
    </Dropdown>
  );
}

export default AvatarComponent;
