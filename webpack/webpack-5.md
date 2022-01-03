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

