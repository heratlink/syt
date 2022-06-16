import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { Key } from "react";
import { HospitalSetList, GetHospitalSetListParams } from "@api/hospital/model/hospitalSetTypes";
import { RootState } from "@/app/store";

import { reqGetHospitalSetList, reqRemoveHospital, reqBatchRemoveHospitals } from "@api/hospital/hospitalSet";

interface HospitalSetState {
  hospitalSetList: HospitalSetList;
  loading: boolean;
  current: number;
  pageSize: number;
  total: number;
  hosname: string;
  hoscode: string;
}

// 初始化数据
const initialState: HospitalSetState = {
  hospitalSetList: [],
  loading: false,
  current: 1,
  pageSize: 5,
  total: 0,
  hosname: "",
  hoscode: "",
};

// 异步action
// 获取列表
export const getHospitalSetListAsync = createAsyncThunk(
  "hospitalSet/getHospitalSetListAsync",
  ({ page, limit, hoscode, hosname }: GetHospitalSetListParams) => {
    return reqGetHospitalSetList({
      page,
      limit,
      hoscode,
      hosname,
    });
  }
);

// 删除操作返回值是null，我们后面会重新请求数据展示，就没必要定义addCase了
// 删除单个
export const removeHospitalAsync = createAsyncThunk("hospitalSet/removeHospitalAsync", (id: number) => {
  return reqRemoveHospital(id);
});
// 批量删除
export const batchRemoveHospitalsAsync = createAsyncThunk("hospitalSet/batchRemoveHospitalsAsync", (idList: Key[]) => {
  return reqBatchRemoveHospitals(idList);
});

const hospitalSetSlice = createSlice({
  name: "hospitalSet",
  initialState,
  reducers: {
    setSearchParams(state, action) {
      const { hosname, hoscode } = action.payload;
      state.hosname = hosname;
      state.hoscode = hoscode;
    },
    resetParams(state) {
      state.hosname = "";
      state.hoscode = "";
      // 下面不做也行，因为会发送请求，重新获取数据，此时就会设置下面的内容
      // state.current = 1
      // state.pageSize = 5
      // state.total = 0
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getHospitalSetListAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getHospitalSetListAsync.fulfilled, (state, action) => {
        state.loading = false;
        const { records, total, current, size } = action.payload; // 需要重新定义类型，增加current, size

        state.hospitalSetList = records;
        state.total = total;
        state.current = current;
        state.pageSize = size;
      }),
});

// 获取数据的方法
export const selectHospitalSet = (state: RootState) => state.hospitalSet;

export const { setSearchParams, resetParams } = hospitalSetSlice.actions;

export default hospitalSetSlice.reducer;
