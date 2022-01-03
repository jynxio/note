const path = require("path");

const html_wepack_plugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
    plugins: [
        new html_wepack_plugin({
            title: "管理输出"
        }),
    ],
};
