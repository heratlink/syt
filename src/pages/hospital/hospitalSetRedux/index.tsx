import { useEffect, useState, Key } from "react";
import { Card, Form, Input, Button, Table, Tooltip, Modal, message } from "antd";
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";

import { HospitalSetItem, SearchParams } from "@api/hospital/model/hospitalSetTypes";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectHospitalSet, getHospitalSetListAsync, setSearchParams, resetParams, removeHospitalAsync, batchRemoveHospitalsAsync } from "./slice";

import "./index.less";

export default function HospitalSet() {
  const dispatch = useAppDispatch();
  const { hospitalSetList, total, current, pageSize, loading, hoscode, hosname } = useAppSelector(selectHospitalSet);

  // const { t } = useTranslation(["hospitalSet"]); // 必须指定使用语言包中哪个文件
  const [t] = useTranslation(["hospitalSet"]); // 必须指定使用语言包中哪个文件

  useEffect(() => {
    dispatch(getHospitalSetListAsync({ page: 1, limit: 5 }));
  }, []);

  // 提交表单
  const onFinish = (values: SearchParams) => {
    dispatch(setSearchParams(values)); // 触发同步action，更新搜索条件
    dispatch(getHospitalSetListAsync({ page: current, limit: pageSize, ...values })); // 发送请求获取数据
  };

  const navigate = useNavigate();

  // 跳转到添加医院
  const goAddHospital = () => {
    // 编程式导航
    navigate("/syt/hospital/hospitalSet/add");
  };

  // 跳转到修改医院
  const goUpdateHospital = (id: number) => {
    // 返回新的函数，才是click事件的回调函数
    return () => {
      navigate(`/syt/hospital/hospitalSet/edit/${id}`);
    };
  };

  // 显示删除对话框
  const showModal = (currentHosname: string, id: number) => {
    return () => {
      Modal.confirm({
        title: `您确认要删除 ${currentHosname} 数据吗？`,
        async onOk() {
          // 发送请求，删除当前行数据
          const res = await dispatch(removeHospitalAsync(id));

          if (res.type === "hospitalSet/removeHospitalAsync/rejected") {
            // message.error("删除医院数据失败");
            return;
          }

          message.success("删除医院数据成功");
          // 重新请求最新的数据展示
          dispatch(
            getHospitalSetListAsync({
              page: current,
              limit: pageSize,
              hosname,
              hoscode,
            })
          );
        },
      });
    };
  };
  // ColumnsType<行数据的类型>
  const columns: ColumnsType<HospitalSetItem> = [
    {
      // 列的标题
      title: t("index"),
      // 代表当前列，要渲染dataSource（数据）中的哪个
      // 当前列要渲染哪个数据
      // dataIndex: "name",
      /*
      不写render，只写dataIndex：只渲染纯文本数据
      render代表要渲染的内容

        写了dataIndex和render：渲染不同的内容
          render函数得到的数据，就是dataIndex对应的数据
        不写dataIndex,只写render：渲染不同的内容
          render函数得到的数据，就是整行数据
    */
      // render: (row) => <a>{JSON.stringify(row)}</a>,
      render: (row, record, index) => index + 1,
      width: 70,
      align: "center",
    },
    {
      title: t("hosname"),
      // 给当前列添加类名
      // className: "column-money",
      dataIndex: "hosname",
      // 布局方式：靠右
      // align: "right",
    },
    {
      title: t("hoscode"),
      dataIndex: "hoscode",
    },
    {
      title: t("apiUrl"),
      dataIndex: "apiUrl",
    },
    {
      title: t("signKey"),
      dataIndex: "signKey",
    },
    {
      title: t("contactsName"),
      dataIndex: "contactsName",
    },
    {
      title: t("contactsPhone"),
      dataIndex: "contactsPhone",
    },
    {
      title: t("operator"),
      // dataIndex: "address",
      // 固定在右边
      fixed: "right",
      width: 110,
      render: (row) => {
        // 不写dataIndex,render函数就能接收到整行数据
        // row就是当前行数据
        return (
          <>
            <Tooltip placement="top" title={t("updateBtnText")}>
              <Button type="primary" icon={<EditOutlined />} onClick={goUpdateHospital(row.id)} />
            </Tooltip>
            <Tooltip placement="top" title={t("removeBtnText")}>
              <Button type="primary" danger icon={<DeleteOutlined />} className="ml" onClick={showModal(row.hosname, row.id)} />
            </Tooltip>
          </>
        );
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // 复选框的选项
  const rowSelection = {
    // 复选框发生变化时触发事件
    onChange: (selectedRowKeys: Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // 显示批量删除
  const showBatchRemoveModal = () => {
    Modal.confirm({
      title: `您确认要删除所有选中的数据吗？`,
      async onOk() {
        await dispatch(batchRemoveHospitalsAsync(selectedRowKeys));
        message.success("批量删除成功");
        // 清空选中的数据（这样按钮就会禁用了）
        setSelectedRowKeys([]);
        // 重新请求最新的数据展示
        dispatch(getHospitalSetListAsync({ page: current, limit: pageSize, hosname, hoscode }));
      },
    });
  };

  // 清空
  const reset = () => {
    // 重置搜索条件
    dispatch(resetParams());
    // 重新搜索
    dispatch(getHospitalSetListAsync({ page: 1, limit: 5 }));
    // 清空表单
    form.resetFields(); // 不传参数，清空整个表单，传了参数，清空部分表单
  };

  const [form] = Form.useForm();

  return (
    <Card>
      {/* 
        Form 表单组件 
          layout="inline" 表单组件布局方式（行内布局） 
          onFinish={onFinish} 提交表单的事件
      */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/*  
          Form.Item 单个表单项
            label 提示文字
            name 表单项名称（写了才能收集到数据）
              注意：名称一定要和接口文档的参数命名一致
        */}
        <Form.Item name="hosname">
          <Input placeholder={t("hosname")} />
        </Form.Item>
        <Form.Item name="hoscode">
          <Input placeholder={t("hoscode")} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            {t("searchBtnText")}
          </Button>
          <Button className="ml" onClick={reset}>
            {t("resetBtnText")}
          </Button>
        </Form.Item>
      </Form>

      <Button type="primary" onClick={goAddHospital}>
        {t("addBtnText")}
      </Button>
      <Button type="primary" danger className="ml mt" disabled={!selectedRowKeys.length} onClick={showBatchRemoveModal}>
        {t("batchRemoveBtnText")}
      </Button>

      {/* 
        Table 表格
          columns 列（表格渲染多少列）
          dataSource 行（表格渲染多少行数据）
          bordered 带边框
            bordered 等价于 bordered={true}
          rowKey="id" 表格行 key 的取值
          scroll={{ x: 1300 }} 开启x轴滚动条
          pagination 分页器组件
            current 当前页码
            pageSize 每页条数
            total 总数
            pageSizeOptions 每页条数选项
            showSizeChanger 是否显示每页条数
            showQuickJumper 是否显示快速跳转
            showTotal 显示总数
      */}
      <Table
        columns={columns}
        dataSource={hospitalSetList}
        bordered
        rowKey="id"
        scroll={{ x: 1300 }}
        pagination={{
          current,
          pageSize,
          total,
          pageSizeOptions: [5, 10, 15, 20],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `${t("total")}${total}`,
          onChange: (current, pageSize) => {
            // 发送请求，请求新的数据
            dispatch(
              getHospitalSetListAsync({
                page: current,
                limit: pageSize,
              })
            );
          },
        }}
        loading={loading}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
      />
    </Card>
  );
}
