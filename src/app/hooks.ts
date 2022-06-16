import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// dispatch用来更新数据的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
// 用来获取数据的hooks
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
