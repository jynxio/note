const path = require("path");
const html_wepack_plugin = require("html-webpack-plugin");

module.exports = {
    entry: "./source/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "./build"),
        clean: true,
    },
    plugins: [
        new html_wepack_plugin({
            title: ""
        }),
    ],
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        static: "./",         // 指定资源的起寻地址。
        compress: true,       // 激活后，将在打包前使用gzip来压缩static目录下的资源。
        server: "http",       //
        port: 8080,           //
        // host: "local-ip",  // 激活后，服务器将只会发布在数字地址下，否则服务器将会发布在数字地址和localhost地址下，建议不激活。
        open: true,           // 激活后，WDS会在服务器启动后使用默认浏览器来打开output目录下的inde.html。如果需要打开一个或多个指定的其他页面，或者更换浏览器，则需要额外设置。
        hot: true,            // 激活后（默认激活），将只会更新页面中发生变化的模块，且不改变页面的状态，比如复选框的状态。
        liveReload: true,     // 激活后（默认激活），将监听文件的变化，当文件发生变化后WDS会重新加载或刷新页面。
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ["csv-loader"],
            },
            {
                test: /\.xml$/i,
                use: ["xml-loader"],
            },
        ],
    },
};