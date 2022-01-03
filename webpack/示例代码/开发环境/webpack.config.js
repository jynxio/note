const path = require("path");

const html_wepack_plugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "devBundle.js",
        path: path.resolve(__dirname, "./dist"),
        clean: true,
    },
    plugins: [
        new html_wepack_plugin({
            title: "Development"
        }),
    ],
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: "./dist",
        compress: true,   // 激活后，将在打包前使用gzip来压缩static目录下的资源。
        server: "http",   //
        port: 8034,       //
        host: "local-ip", // 激活后，浏览器打开的页面将会是127.0.0.0的，而不是localhost的。
        open: true,       // 激活后，WDS会在服务器启动后使用默认浏览器来打开output目录下的inde.html。如果需要打开一个或多个指定的其他页面，或者更换浏览器，则需要额外设置。
        hot: true,        // 激活后（默认激活），将只会更新页面中发生变化的模块，且不改变页面的状态，比如复选框的状态。
        liveReload: true, // 激活后（默认激活），将监听文件的变化，当文件发生变化后WDS会重新加载或刷新页面。
    },
};
