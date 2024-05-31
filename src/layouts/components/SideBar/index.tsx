import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { useTranslation } from "react-i18next";

import { findSideBarRoutes } from "@/routes";
import { XRoutes } from "@/routes/types";
import type { MenuProps } from "antd";

import "./index.less";
import logo from "./images/logo.png";

// https://ant.design/components/menu-cn/
type MenuItem = Required<MenuProps>["items"][number];

//getItem函数，传入五个参数，返回一个对象，包含这五个参数
//前两个必要参数，后三个可选参数
//最后的as什么意思，没懂？？？
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

//从Layout组件中解构出Sider组件
const { Sider } = Layout;

//声明接口MenuInfo
interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

function SideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;

  useEffect(() => {
    const openKeys = pathname.split("/").slice(0, 3).join("/");
    setOpenKeys([openKeys]);
    const selectedKeys = pathname.split("/").slice(0).join("/");
    setSelectedKeys([selectedKeys]);
  }, [pathname]);

  const routes = findSideBarRoutes() as XRoutes;

  //menuItems这个对象数组，将来要作为Menu组件的items属性的属性值
  //.filter(Boolean)实现的效果就是把null项全删掉，原理没说
  const menuItems: MenuItem[] = routes.map((route) => {
    return getItem(
      route.meta?.title,
      route.path as string,
      route.meta?.icon,
      route.children
        ?.map((item) => {
          //如果children里的某一个对象里有hidden属性，那这一个对象对应到map返回的新数组里就是null。如果没有hidden属性，才会正常返回getItem函数生成的对象
          if (item.hidden) return null;
          return getItem(item.meta?.title, item.path as string, item.meta?.icon);
        })
        .filter(Boolean)
    );
  });

  const handleMenuClick = ({ key }: MenuInfo) => {
    navigate(key);
  };

  const handleOpenChange = (openKeys: string[]) => {
    setOpenKeys(openKeys);
  };

  const { t } = useTranslation();

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse} breakpoint="lg">
      <h1 className="layout-title">
        <img className="layout-logo" src={logo} alt="logo" />
        <span style={{ display: collapsed ? "none" : "inline-block" }}>{t("app:title")}</span>
      </h1>
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        items={menuItems}
        onClick={handleMenuClick}
        onOpenChange={handleOpenChange}
      ></Menu>
    </Sider>
  );
}

export default SideBar;
