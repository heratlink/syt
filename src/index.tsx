import React from "react";
import { createRoot } from "react-dom/client";
// 前端路由
import { BrowserRouter } from "react-router-dom";

// redux
import { store } from "./app/store";
import { Provider } from "react-redux";

import App from "./App";
// import reportWebVitals from "./reportWebVitals";

// 国际化
import "./locales/i18n";

// antd的样式
import "antd/dist/antd.less";
// 其他全局样式
import "./styles/index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
// reportWebVitals(console.log); // 会将生成的性能报告打印出来
