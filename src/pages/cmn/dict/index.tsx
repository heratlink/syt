import { useEffect, useState } from "react";
import { Card, Table } from "antd";
import type { ColumnsType } from "antd/lib/table";

import { RightOutlined, DownOutlined } from "@ant-design/icons";

import { reqGetCityList } from "@api/hospital/hospitalList";
import { CityList, CityItem } from "@api/hospital/model/hospitalListTypes";

const columns: ColumnsType<CityItem> = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "编码",
    dataIndex: "dictCode",
  },
  {
    title: "值",
    dataIndex: "value",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
];

export default function Dict() {
  const [dictList, setDictList] = useState<CityList>([]);

  const getCityList = async (id: number) => {
    const dictList = await reqGetCityList(id);

    setDictList(
      dictList.map((item) => {
        return {
          ...item,
          // 给item添加children属性，就会在table显示可展开图标
          children: [],
        };
      })
    );
  };

  useEffect(() => {
    getCityList(1);
  }, []);

  // 获取更新后的dictList
  // const getUpdatedDictList = (dictList: CityList, id: number, list: CityList) => {
  //   /*
  //     dictList 要处理原数据数组
  //     id 当前操作行的id
  //     list 请求回来的新数据，需要添加到 当前行.children ,这样就是它的子分类了
  //   */
  //   const newDictList = dictList.map((dict) => {
  //     // 第一层
  //     if (dict.id === id) {
  //       return {
  //         ...dict,
  //         children: list,
  //       };
  //     }

  //     // 第二层之后都会来到这
  //     if (dict.children?.length) {
  //       const dictChildren = getUpdatedDictList(dict.children, id, list);
  //       dict.children = dictChildren;
  //     }

  //     return dict;
  //   });

  //   return newDictList;
  // };

  // const onExpand = async (expanded: boolean, record: CityItem) => {
  //   /*
  //     expanded: 是否展开布尔值
  //     record：点击的当前行数据
  //   */
  //   // expanded为false，代表折叠，不发送请求
  //   //  record.children.length有值，代表已经请求过了数据，不需要请求了
  //   if (!expanded || record.children.length) return;
  //   // console.log(expanded, record);
  //   // 发送请求，请求当前行下面子菜单
  //   let list = await reqGetCityList(record.id);
  //   // console.log(list);
  //   // 如何展示子菜单数据？
  //   // 将请求回来的list添加到父菜单的children上，就会作为其子菜单展示了
  //   // record.children = list;
  //   list = list.map((item) => {
  //     return item.hasChildren
  //       ? {
  //           ...item,
  //           children: [],
  //         }
  //       : item;
  //   });

  //   const newDictList = getUpdatedDictList(dictList, record.id, list);

  //   // const newDictList = dictList.map((dict) => {
  //   //   if (dict.id === record.id) {
  //   //     return {
  //   //       ...dict,
  //   //       children: list,
  //   //     };
  //   //   }
  //   //   return dict;
  //   // });

  //   // 更新状态，组件才会重新渲染
  //   setDictList(newDictList);
  // };

  type TriggerEventHandler<T> = (record: T, event: React.MouseEvent<HTMLElement>) => void;
  // 处理图标点击事件
  const handleIconExpand = (record: CityItem, onExpand: TriggerEventHandler<CityItem>) => {
    // onClick={(e) => onExpand(record, e)}
    return async (e: React.MouseEvent<HTMLElement>) => {
      // 如果子菜单有值就不重新请求了
      if (!record.children.length) {
        // 请求子菜单数据
        let list = await reqGetCityList(record.id);

        list = list.map((item) => {
          return item.hasChildren
            ? {
                ...item,
                children: [],
              }
            : item;
        });

        // 将子菜单数据添加到父级生效
        record.children = list;
      }
      // 菜单就会展开
      onExpand(record, e);
    };
  };

  return (
    <Card>
      <Table
        columns={columns}
        dataSource={dictList}
        bordered
        rowKey="id"
        pagination={false}
        expandable={{
          // 展开的事件
          // onExpand,
          // 展开的图标
          expandIcon: ({ expanded, record, onExpand }) => {
            /*
              expanded 是否展开
              record 当前行数据
              onExpand 触发onExpand事件
                onExpand(record, e)
            */
            // console.log(record);
            // 没有子菜单，就不渲染图标
            if (!record.hasChildren) {
              return <div style={{ display: "inline-block", width: 24, height: 10 }}></div>;
            }

            return expanded ? (
              // 向下箭头，点击折叠即可
              <DownOutlined style={{ marginRight: 10 }} onClick={(e) => onExpand(record, e)} />
            ) : (
              // 向右箭头，点击需要请求子菜单数据展示
              // <RightOutlined style={{ marginRight: 10 }} onClick={(e) => onExpand(record, e)} />
              <RightOutlined style={{ marginRight: 10 }} onClick={handleIconExpand(record, onExpand)} />
            );
          },
        }}
      />
    </Card>
  );
}
