# 概念

## entry

`entry` 属性用于指定入口文件，默认值是 `./src/index.js` 。

```js
module.exports = {
    entry: "./src/index.js"
}
```

## output

`output` 属性用于指定 bundle 的输出地址及命名，默认值是 `./dist/main.js` ，其他生成文件默认放置在 `./dist` 文件夹中。

```js
const path = require("path");

module.exports = {
    output: {
      	path: path.resolve(__dirname, "dist"),
      	filename: "bundle.js"
    }
};
```

## loader

webpack 自身只能识别 JS 和 JSON 文件，如果想让 webpack 识别其他文件，就需要使用 `loader` 。

```js
const path = require("path");

module.exports = {
		module: {
      	rules: [ {test: /\.txt$/, use: "raw-loader"} ]
    }
};
```

`loader` 有 2 个属性： `test` 和 `use` 。前者用于指定那些文件需要被处理，后者用于指定处理时应使用哪个 loader 。

上例的意思是：当 webpack 碰到 .txt 文件时，在打包它之前，先使用 `raw-loader` 处理一下。

## plugin

`loader` 用于处理某些类型的文件， `plugin` 用于执行更宽泛的任务，比如打包优化、资源管理、注入环境变量。

```js
const html_webpack_plugin = require("html-webpack-plugin");

module.exports = {
    plugins: [ new html_webpack_plugin() ]
};
```

## mode

`mode` 用于指定打包的行为，有 3 种值可选： `"development"` 、 `"production"` 、 `"none"` ，默认值时 `"production"` 。

```js
module.exports = {
    mode: "production"
};
```

## 浏览器兼容性

webpack 支持所有符合 ES5 标准的浏览器（不支持 IE8 及以下版本）。 webpack 的 `import()` 和 `require.ensure()` 需要 `Promise` ，如果目标环境不支持 `Promise` ，那么在使用 `import()` 和 `require.ensure()` 之前需要提前进行 polyfill 。

## 环境

webpack5 要求 Node.js v10.13.0+ 。



# 开发环境

`package.json`

```json

```

`webpack-dev.config.js`

```js

```



# 动态导入

学习 webpack 的 [动态导入](https://webpack.docschina.org/guides/code-splitting/) ，《现代JavaScript教程》中的 [动态导入](https://zh.javascript.info/modules-dynamic-imports) 对你会有额外帮助，也建议学完它的 3 节《模块》的内容。



# 预获取/预加载模块

🔗 https://webpack.docschina.org/guides/code-splitting/



# 缓存

浏览器会使用缓存技术来加快网站的加载速度，这带来的一个问题是，如果我们在部署新版本时不更改资源的名称，浏览器就可能会认为它没有被更新，然后继续使用它的缓存版本，这就会带来一些棘手的问题。

webpack 似乎有一套专业的 [办法](https://webpack.docschina.org/guides/caching/) 来解决它，不过为了省事我暂时先使用浏览器的 「停用缓存」功能。



# 创建 library

从这里开始学。