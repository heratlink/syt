const CracoLessPlugin = require("craco-less");
const CracoAlias = require("craco-alias");

module.exports = {
  plugins: [
    // 自定义主题
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { "@primary-color": "#1DA57A" },
            javascriptEnabled: true,
          },
        },
      },
    },
    // 路径别名
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./",
        tsConfigPath: "./tsconfig.extend.json",
      },
    },
  ],
  // 开发服务器配置
  devServer: {
    // 激活代理服务器
    //登录请求的代理
    proxy: {
      // 将来以/dev-api开头的请求，就会被开发（代理）服务器转发到目标服务器去。
      //登录请求的代理
      "/dev-api": {
        target: "http://syt-api.atguigu.cn", // 目标服务器地址
        // target: "http://139.198.34.216:8201", // 目标服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          // 路径重写
          "^/dev-api": "",
        },
      },

      //医院设置中分页展示请求数据的代理
      "/hospital": {
        target: "http://139.198.34.216:8201", // 目标服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {
          // 路径重写
          "^/hospital": "",
        },
      },
    },

    
  },
};
