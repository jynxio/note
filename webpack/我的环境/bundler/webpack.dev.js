const { merge } = require( "webpack-merge" );

const common = require( "./webpack.common.js" );

module.exports = merge( common, {
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
        static: "./",         // 指定资源的起寻地址。
        compress: true,       // 激活后，将在打包前使用gzip来压缩static目录下的资源。// TODO
        server: "http",       //
        port: 8080,           //
        open: true,           // 激活后，WDS会在服务器启动后使用默认浏览器来打开output目录下的inde.html。如果需要打开一个或多个指定的其他页面，或者更换浏览器，则需要额外设置。
    },
} );
