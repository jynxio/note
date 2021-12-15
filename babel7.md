# 简介

Babel 是一个 JS 编译器 ，它可以将 ES6+ 的 JS 代码转译为 ES5（甚至更早） 的 JS 代码，这能显著缓解旧浏览器不支持新语言特性的兼容性问题，且意味着 JS 开发者可以使用最新的语言特性来进行开发而无需再顾虑兼容性问题。

本文只介绍 Babel 7 的转译功能。

转译包括：

- 转译语法：如 `箭头函数` 、 `解构赋值` 、 `async` 、 `calss` 等。
- 填补 API ：如 `Promise` 、 `Object.assign` 、 `Array.prototype.find` 等 `JS API` 。

> 注：
>
> 1. 本文将 ES6 及未来所有的年度版本的 ES 统称为 ES6+ 。
> 2.  Babel 只能填补 JS API ，不能填补 Web API 。



# 版本

Babel 是一个以 @babel/core 为核心的工具集，每当 @babel/core 发布新版本时，整个工具集的所有包都会跟随升级至相同的版本号，即使它们的代码可能一行都没有改变。因此 Babel 的版本号即是 @babel/core 的版本号。

从 Babel 7 开始，所有的包都被放置在一个名为 `babel` 的域下，比如 @babel/cli 、 @babel/core 。而之前的每个包都在 npm 全局注册表中占用一个名称，比如 babel-cli 、 babel-core 。

本文只介绍 Babel 7 ，该小节的作用在于厘清，因为许多网络文章将 Babel 6 和 7 混为一谈。



# 最佳实践



# 如何转译语法

学习如何使用 `@babel/preset-env` 来转译语法，既可以「完全转译」，也可以「按需转译」。完全转译会将所有 ES6+ 语法转译为 ES5 语法，按需转译会将脚本中目标环境不支持的语法转译为目标环境支持的语法，转译的结果不一定是 ES5 语法。

## 完全转译

将脚本中所有 ES6+ 语法转换为 ES5 语法，示例代码是《完全转译》。

步骤如下：

1. 创建 `a.js` ，期望将它的箭头函数转译为普通函数，因为箭头函数是 ES6+ 语法。 `a.js` 内容如下：

   ```js
   const f = _ => {};
   ```

2. 创建 `babel.config.json` ，配置转译规则，它会将所有 ES6+ 语法转译为 ES5 语法，不涉及填充 API 。 `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"]
   }
   ```

3. 下载转译所需的包。 `package.json` 内容如下：

   ```
   npm install --save-dev @babel/core
   npm install --save-dev @babel/cli
   npm install --save-dev @babel/preset-env
   ```

4. 执行转译命令。命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译完成，箭头函数被转译为普通函数，脚本全局开启严格模式。转译结果文件 `b.js`  内容如下：

   ```js
   "use strict";
   var f = function f(_) {};
   ```

## 按需转译

将脚本中目标环境不支持的语法转译为目标环境支持的语法，转译的结果不一定是 ES5 语法。比如如果目标环境是 chrome 58 ，箭头函数不会被转译，因为 chrome 58 已经支持箭头函数语法，如果目标环境是 chrome 38 ，箭头函数会被转译成普通函数，因为 chrome 38 还不支持箭头函数语法。示例代码是《按需转译》。

步骤如下：

1. 创建 `a.js` ，内容如下：

   ```js
   const f = _ => {};
   ```

2. 创建 `babel-chrome-58.config.json` 和 `babel-chrome-38.config.json` 文件。 `targets` 参数用于指定目标环境，然后 Babel 会自动判断目标环境是否支持脚本中用到的语法，支持的语法不会被转译，不支持的语法就会被转译为目标环境支持的语法，所有是按需转译。

   `babel-chrome-58.config.json` 代表目标环境是 chrome 58 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {"targets": "chrome 58"}
       ]]
   }
   ```

   `babel-chrome-38.config.json` 代表目标环境是 chrome 38 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {"targets": "chrome 38"}
       ]]
   }
   ```

3. 下载转译所需的包。 `package.json` 内容如下：

   ```
   npm install --save-dev @babel/core
   npm install --save-dev @babel/cli
   npm install --save-dev @babel/preset-env
   ```

4. 执行转译命令，命令如下：

   ```
   npx babel a.js -o chrome58.js --config-file ./babel-chrome-58.config.json
   npx babel a.js -o chrome38.js --config-file ./babel-chrome-38.config.json
   ```

5. 转译完成，在 `chrome58.js` 中，箭头函数没有被转译，在 `chrome38.js` 中箭头函数被转译为普通函数。

   `chrome58.js` 内容如下：

   ```js
   "use strict";
   const f = _ => {};
   ```

   `chrome38.js` 内容如下：

   ```js
   "use strict";
   var f = function f(_) {};
   ```



# 如何填补 API（TODO：完善定义）

学习如何使用 `@babel/preset-env` 、 `core-js` 、 `regenerator-runtime` 来填补 API 。既可以「完全填补」，也可以「按需填补」。

// TODO 从这里开始





学习如何填补 ES6+ 的 API ，这样使用了 ES6+ API 的代码也可以在 ES5 环境中运行。

方法 1 ：通过修改 `window` 对象与相关的原型链来补齐 API ，这会污染全局变量。

方法 2 ：通过引入外部模块来填补 API ，这会适当修改原来的脚本，比如原本使用了 ES6+ API 的代码会被改写为使用外部模块。这种方式不会污染全局变量， 开发库时应当采用此种方式。

> 因为如果库采用了方法 1 ，使用了该库的项目又再次采用了方法 1 ，那么便对 `window` 进行了 2 次修改，如果 2 次修改不一致（取决于转译时所用的 babel 包的版本），第 2 次修改就会覆盖第 1 次修改，库代码就可能无法正常运行。
>
> 开发库还应该采用「按需填补 API 」来减小代码体积。



## 方法 1-1 （淘汰）

在 HTML 文件中引入 `polyfill.js` 文件是最简单的方法，该方法属于方法 1 的一种。示例代码是《1-1》。

> 如何获取 `polyfill.js` ：
>
> 通过 npm 下载 `@babel/polyfill` 后，在 `node_modules/@babel/polyfill/dist` 文件夹内就有 `polyfill.js` 和 `polyfill.min.js` 。

使用 FF27 执行下述 HTML 文件，将会输出 `[object Object]` 。如果未引用 `polyfill.js` ， FF27 将抛出异常： `ReferenceError: Promise is not defined` 。

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script src="./node_modules/@babel/polyfill/dist/polyfill.min.js"></script>
    <script>
        const promise = new Promise(_ => {});
        console.log(promise); // [object Object]
    </script>
</body>
</html>
```

## 方法 1-2 （淘汰）

通过 webpack ，将你的脚本与 `polyfill.js` 或 `@babel/polyfill` 打包在一起，该方法属于方法 1 的一种。示例代码是《1-2》。

Ⅰ 安装相关包， `package.json` 内容如下：

```json
{
    "dependencies": {
        "@babel/polyfill": "^7.12.1"
    },
    "devDependencies": {
        "webpack": "^5.65.0",
        "webpack-cli": "4.9.1"
    }
}
```

Ⅱ 创建待打包文件 `a.js` ，内容如下：

```js
import "@babel/polyfill";                                     // 二选一
import "./node_modules/@babel/polyfill/dist/polyfill.min.js"; // 二选一

const promise = new Promise(_ => { });
console.log(promise);
```

Ⅲ 执行打包， npm 命令如下：

```
npx webpack ./a.js -o ./dist
node_modules/.bin/webpack ./a.js -o ./dist
```

Ⅳ 打包成功， `./dist/main.js` 即是打包结果，在 HTML 文件中引入它后，执行 HTML 文件，控制台将输出 `"[object Object]"` 。

## 方法 1-3

通过 webpack ，将你的脚本与 `core-js` 和 `regenerator-runtime` 打包在一起，该方法属于方法 1 的一种。示例代码是《1-3》。

> 从 Babel 7.4.0 （2019.05.19）开始， `polyfill.js` 和 `@babel/polyfill` 已被官方弃用。官方推荐使用 `core-js/stable` 和 `regenerator-runtime/runtime` 。
>
> `@babel/polyfill` 和 `polyfill.js` 的区别在于后者被构建成 js 文件，它们都是通过修改 `window` 对象和相关原型链来填补 API 的。
>
> `core-js` 和 `regenerator-runtime` 是组成 `@babel/polyfill` 的唯二 2 个子包，组合使用前两者和单独使用后一者的效果是差不多的，区别在于 `@babel/polyfill` 内部依赖的 `core-js` 被锁死在了 `2.x.x` 版本，而 `3.0.0` 版本的 `core-js` 早在 2018 年就发布了， 3 号大版本新增了许多 polyfill ，比如 `Array.prototype.includes` 。这意味着 `@babel/polyfill` 无法填补这些新的 API ，所以不应再使用 `@babel/polyfill` ，而是使用 `core-js` 和 `regenerator-runtime` 。
>
> 如果安装了 `core-js` 和 `regenerator-runtime` 后再安装 `@babel/polyfill` ， `@babel/polyfill` 内部的 `core-js` 和 `regeneragor-runtime` 就会覆盖前面下载的 `core-js` 和 `regenerator-runtime` ，这就意味着旧版本覆盖了新版本。不仅如此，这还会引发「引用错误」异常，原因是在单独使用 `core-js` 时，我们的脚本需要这么引用它 `import "core-js/stable";` ，但是 `stable` 文件是自 3 号大版本起才有的。

Ⅰ 安装相关包， `package.json` 内容如下：

```json
{
    "dependencies": {
        "core-js": "^3.19.3",
        "regenerator-runtime": "^0.13.9"
    },
    "devDependencies": {
        "webpack": "^5.65.0",
        "webpack-cli": "^4.9.1"
    }
}
```

Ⅱ 创建待打包文件 `a.js` ，内容如下：

```js
import "core-js/stable";
import "regenerator-runtime/runtime";

const promise = new Promise(_ => { });
console.log(promise);
```

Ⅲ 执行打包， npm 命令如下：

```
npx webpack ./a.js -o ./dist
node_modules/.bin/webpack ./a.js -o ./dist
```

Ⅳ 打包成功， `./dist/main.js` 即是打包结果，在 HTML 文件中引入它后，执行 HTML 文件，控制台将输出 `"[object Object]"` 。

> 注：`core-js` 和 `regenerator-runtime` 的 `import` 是没有先后顺序的。

## 方法 1-4





# 插件预设

插件是控制 Babel 的转译行为的 JS 程序，比如插件 `@babel/plugin-transform-arrow-functions` 可以将箭头函数转换为函数表达式。使用插件可以在细粒度上控制转译行为。最常用的官方插件有 1 个： `@babel/plugin-transform-runtime` 。

预设是一套预先设定好的插件组合，比如预设 `@babel/preset-env` 可以将所有 ES6+ 语法转译为 ES5 语法。最常用的官方预设有 4 个： `@babel/preset-env` 、 `@babel/preset-flow` 、 `@babel/preset-react` 、 `@babel/preset-typescript` 。

当同时使用了插件与预设时，它们的执行顺序如下：

1. 插件比预设先执行；
2. 插件的执行顺序是沿着插件数组从前向后；
3. 预设的执行顺序是沿着预设数组从后向前；



# 转译配置文件

可以使用下述任意一种文件来配置转译行为：

-  `babel.config.json` （还支持其它扩展名 `.js` `.cjs` `.mjs` ）
-  `xxxx.babelrc.json` （还支持其它扩展名 `.babelrc` `.js` `.cjs` `.mjs` ）
-  `package.json` 中使用 `"babel"` 



# 详解 Babel 包

## @babel/cli

如果想要通过命令行来使用 Babel ，就需要安装它。

```
npm install --save-dev @babel/cli
```

## @babel/core

Babel 的核心包。

```
npm install --save-dev @babel/core
```

## @babel/preset-env

它包含了将 ES6+ 语法转换为 ES5 语法的所有转换规则。

```
npm install --save-dev @babel/preset-env
```

通过配置参数，还可以实现「按需转译语法」和「按需填补 API 」，默认情况下它会转译所有语法且不引入任何 API Polyfill 。 对于「按需填补 API 」， `@babel/preset-env` 会在你的脚本中创建“导入外部 API Polyfill 模块的导入语句”，如果你想要脚本运行起来，当然需要在 `node_modules` 中添加 `core-js` 和 `regenerator-runtime` 的生产依赖，否则会抛出引用异常。

> 历史：
>
> 在 Babel 6 时代，常见的预设主要有： `babel-preset-es2015` 、 `babel-preset-es2016` 、 `babel-preset-es2017` 、 `babel-preset-state-0` 、 `babel-preset-state-1`、 `babel-preset-state-2`  、 `babel-preset-state-3` 、 `babel-preset-latest` 。
>
> 其中 `babel-preset-state-x` 是指草案阶段的 ES 语法的转译预设，目前不再更新； `babel-preset-es201x` 是指 `201x` 年新发布的 ES 语法的转译预设，目前不再更新； `babel-preset-latest` 是指 `2015-至今` 的所有 ES 语法的转译预设，目前持续更新；
>
> `@babel/-preset-env` 正是 `babel-preset-latest` 的延续与增强，它不仅仅包含所有语法的转译规则，甚至还可以按需转译语法和按需填补 API 。它在 Babel 6 时代的旧名是 `babel-preset-env` 。

它有十几个参数，本文只介绍其中最重要的 4 个。

| `targets` |                                                              |
| --------- | ------------------------------------------------------------ |
| 定义      | 描述目标环境的状态，该字段是「按需转译」和「按需填补」的必填字段。 |
| 数据类型  | `string |Array<string> |{[string]: string}`                  |
| 默认值    | `{}` （此时将会完全转译与完全填补）                          |

示例：

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": "> 0.25%, not dead"
            }
        ]
    ]
}
```

```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {"chrome": "58"}
            }
        ]
    ]
}
```

除了在 `babel.config.json` 中设置 `targets` 外，在 `package.json` 文件中设置 `browserslist` 可以得到一样的效果。当同时设置了它们两者时， Babel 会采用 `browserslist` 。

```json
{
    "dependencies": {
        "core-js": "^3.19.3",
        "regenerator-runtime": "^0.13.9"
    },
    "devDependencies": {
        "webpack": "^5.65.0",
        "webpack-cli": "^4.9.1"
    },
    "browserslist": [
        "chrome 60"
    ]
}
```



| `useBuiltIns` |                                                |
| ------------- | ---------------------------------------------- |
| 定义          | 设置填补多少 API ，需要结合 `targets` 来使用。 |
| 取值          | `"usage" |"entry" |false`                      |
| 默认值        | `false`                                        |

- `usage` ：填补目标环境缺失的 API 。
- `entry` ：填补目标环境缺失的 API 中被用到的 API 。
- `false` ：填补所有 API 。



Ⅲ `corejs` ：

Ⅳ `modules` ：



# FF27

使用旧版本的浏览器来检验转译是否成功。

Ⅰ [Firefox 27 的下载地址](https://ftp.mozilla.org/pub/firefox/releases/27.0.1/)

Ⅱ 安装完成后，禁用浏览器自动更新 `选项（左上角）-> 高级 -> 更新`