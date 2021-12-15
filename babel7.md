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

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
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

## 完全填补 - HTML 文件引入 polyfill.js

> 注：该方法已淘汰。

在 HTML 文件中引入 `polyfill.js` 是最简单的填补 API 的方法，该方法通过修改 `window` 对象和部分原型链来实现在全局环境中填补所有缺失的 API 。示例是《完全填补- HTML 文件引入polyfill.js》。

> 疑问：Babel 最低可以支持多旧的运行时？

步骤如下：

通过 npm 下载 `@babel/polyfill` 后，在 `node_modules/@babel/polyfill/dist` 目录下有 `polyfill.js` 和 `polyfill.min.js` 文件，在 HTML 文件中直接引入其中一个即可，如：

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

## 完全填补 - webpack 打包引入

该方法使用 webpack 工具将你的脚本与 polyfill 文件打包成为一个脚本， polyfill 文件有 3 种形式，因此一共有 3 种打包组合：

- 你的脚本 + `polyfill.js`
- 你的脚本 + `@babel/polyfill`
- 你的脚本 + `core-js` + `regenerator-runtime`

该方法会修改 `window` 和部分原型链来实现在全局环境中填补所有缺失的 API 。

### 组合 1

> 注：该方法已淘汰。

示例代码是《webpack打包引入polyfill.js》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "@babel/polyfill": "^7.12.1"
       },
       "devDependencies": {
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   import "./node_modules/@babel/polyfill/dist/polyfill.min.js";
   
   const promise = new Promise( _ => {} );
   console.log(promise);
   ```

3. 执行打包， npm 命令如下：

   ```
   npx webpack ./a.js -o ./output
   ```

4. 打包完成，获得 `main.js` 文件，该文件是你的脚本与 `polyfill.min.js` 打包的结果， `main.js` 会在全局环境填补所有缺失的 API ，然后再执行你的脚本。

### 组合 2

> 注：该方法已淘汰。

示例代码是《webpack打包引入@babel_polyfill》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "@babel/polyfill": "^7.12.1"
       },
       "devDependencies": {
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   import "@babel/plofill";
   
   const promise = new Promise( _ => {} );
   console.log(promise);
   ```

3. 执行打包， npm 命令如下：

   ```
   npx webpack ./a.js -o ./output
   ```

4. 打包完成，获得 `main.js` 文件，该文件是你的脚本与 `polyfill.min.js` 打包的结果， `main.js` 会在全局环境填补所有缺失的 API ，然后再执行你的脚本。

### 组合 3

示例代码是《webpack打包引入core-js和regenerator-runtime》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```js
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

2. 创建 `a.js` ，注意 `core-js` 和 `regenerator-runtime` 的引用没有固定的先后顺序。内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   const promise = new Promise( _ => {} );
   console.log(promise);
   ```

3. 执行打包， npm 命令如下：

   ```
   npx webpack ./a.js -o ./output
   ```

4. 打包完成，获得 `main.js` 文件，该文件是你的脚本与 `polyfill.min.js` 打包的结果， `main.js` 会在全局环境填补所有缺失的 API ，然后再执行你的脚本。

3 种打包的原理是完全一样的，只是 polyfill 文件不同。其中不应该再使用 `polyfill.js` 或 `@babel/polyfill` 来打包，因为 `@babel/polyfill` 已经被官方主动放弃，它已经无法填补所有缺失的 API 了，因为 `polyfill.js` 是 JS 文件形式的 `@babel/polyfill`，所以 `polyfill.js` 也随 `@babel/polyfill` 一起过时了。如果想要在全局环境中填补所有的 API ，就应当使用 `core-js` 和 `regenerator-runtime` 来作为 polyfill 文件，下文仔细阐述了原因。

> 详情：
>
> 从 Babel 7.4.0 （2019.05.19）开始， `polyfill.js` 和 `@babel/polyfill` 已被官方弃用。官方推荐使用 `core-js/stable` 和 `regenerator-runtime/runtime` 。
>
> `@babel/polyfill` 和 `polyfill.js` 的区别在于后者被构建成 js 文件，它们都是通过修改 `window` 对象和相关原型链来填补 API 的。
>
> `core-js` 和 `regenerator-runtime` 是组成 `@babel/polyfill` 的唯二 2 个子包，组合使用前两者和单独使用后一者的效果是差不多的，区别在于 `@babel/polyfill` 内部依赖的 `core-js` 被锁死在了 `2.x.x` 版本，而 `3.0.0` 版本的 `core-js` 早在 2018 年就发布了， 3 号大版本新增了许多 polyfill ，比如 `Array.prototype.includes` 。这意味着 `@babel/polyfill` 无法填补这些新的 API ，所以不应再使用 `@babel/polyfill` ，而是使用 `core-js` 和 `regenerator-runtime` 。
>
> 如果安装了 `core-js` 和 `regenerator-runtime` 后再安装 `@babel/polyfill` ， `@babel/polyfill` 内部的 `core-js` 和 `regeneragor-runtime` 就会覆盖前面下载的 `core-js` 和 `regenerator-runtime` ，这就意味着旧版本覆盖了新版本。不仅如此，这还会引发「引用错误」异常，原因是在单独使用 `core-js` 时，我们的脚本需要这么引用它 `import "core-js/stable";` ，但是 `stable` 文件是自 3 号大版本起才有的。

## 按需填补 - entry

该方法会填补目标环境/运行时中缺失的 API ，该方法是通过修改 `window` 对象和部分原型链来实现的。示例代码是《entry》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.19.3",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   console.log("It work!");
   ```

3. 创建 `babel-chrome-80.config.json` 和 `babel-chrome-90.config.json` 文件， Babel 会自动判断目标环境缺少什么 API ，然后再引入缺失的 API 。

   `babel-chrome-80.config.json` 代表目标环境是 chrome 80 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": {"chrome": "80"},
               "useBuiltIns": "entry",
               "corejs": "3.19.3",
               "modules": false
           }
       ]]
   }
   ```

   `babel-chrome-90.config.json` 代表目标环境是 chrome 90 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": {"chrome": "90"},
               "useBuiltIns": "entry",
               "corejs": "3.19.3",
               "modules": false
           }
       ]]
   }
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o chrome80.js --config-file ./babel-chrome-80.config.json
   npx babel a.js -o chrome90.js --config-file ./babel-chrome-90.config.json
   ```

5. 转译完成，获得 `chrome80.js` 和 `chrome90.js` ，原来的 `import` 语句被替换成了新的 `import` 语句，这表示导入当前环境所缺失的所有 API 。由于 chrome 80 环境相比 chrome 90 环境缺失更多的 API ，所以 `chrome80.js` 的导入语句更多。

   `chrome80.js` 的内容如下：

   ```js
   import "core-js/modules/es.aggregate-error.js";
   import "core-js/modules/es.array.at.js";
   import "core-js/modules/es.array.reduce.js";
   import "core-js/modules/es.array.reduce-right.js";
   import "core-js/modules/es.object.has-own.js";
   import "core-js/modules/es.promise.any.js";
   import "core-js/modules/es.reflect.to-string-tag.js";
   import "core-js/modules/es.string.at-alternative.js";
   import "core-js/modules/es.string.replace-all.js";
   import "core-js/modules/es.typed-array.at.js";
   import "core-js/modules/web.immediate.js";
   console.log("It work!");
   ```

   `chrome90.js` 的内容如下：

   ```js
   import "core-js/modules/es.array.at.js";
   import "core-js/modules/es.object.has-own.js";
   import "core-js/modules/es.string.at-alternative.js";
   import "core-js/modules/es.typed-array.at.js";
   import "core-js/modules/web.immediate.js";
   console.log("It work!");
   ```

6. 现在 `chrome80.js` 和 `chrome90.js` 还都不使用，只要用 webpack 把脚本和脚本的依赖打包在一起后，就可以使用了。 npm 命令如下：

   ```
   npx webpack ./chrome80.js -o ./chrome-80
   npx webpack ./chrome90.js -o ./chrome-90
   ```

7. 打包完成，获得 `./chrome-80/main.js` 和 `./chrome-90/main.js` 文件，将它们引入 HTML 内执行，就可以看见控制台输出 `"It worl!"` 了。

## 按需填补 - usage

该方法会填补目标环境/运行时中缺失的 API 和你的脚本用到的 API 的交集，该方法是通过修改 `window` 对象和部分原型链来实现的。示例代码是《usage》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.19.3",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，注意不能在该脚本中引入 `core-js` 和 `regenerator-runtime` 。内容如下：

   ```js
   const promise = Promise.any([1]);
   console.log(promise);
   ```

3. 创建 `babel-chrome-84.config.json` 和 `babel-chrome-85.config.json` 文件， Babel 会自动判断你的脚本是否用到了目标环境中缺失的 API ，然后引入它们。

   `babel-chrome-84.config.json` 代表目标环境是 chrome 84 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": {"chrome": "84"},
               "useBuiltIns": "usage",
               "corejs": "3.19.3",
               "modules": false
           }
       ]]
   }
   ```

   `babel-chrome-85.config.json` 代表目标环境是 chrome 85 ，其内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": {"chrome": "85"},
               "useBuiltIns": "usage",
               "corejs": "3.19.3",
               "modules": false
           }
       ]]
   }
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o chrome84.js --config-file ./babel-chrome-84.config.json
   npx babel a.js -o chrome85.js --config-file ./babel-chrome-94.config.json
   ```

5. 转译完成，获得 `chrome84.js` 和 `chrome85.js` ，由于 chrome 85 支持 `Promise.any` API ，所以 `chrome84.js` 文件导入了该 API 的 polyfill 脚本，而 `chrome85.js` 则没有。由于 `chrome85.js` 中使用到的唯一一个 API （ `Promise.any` ） 已经在目标环境中实现了，所以 `chrome85.js` 无需导入任何 API 的 polyfill 脚本。

   `chrome84.js` 的内容如下：

   ```js
   import "core-js/modules/es.aggregate-error.js";
   import "core-js/modules/es.promise.any.js";
   const promise = Promise.any([1]);
   console.log(promise);
   ```

   `chrome85.js` 的内容如下：

   ```
   const promise = Promise.any([1]);
   console.log(promise);
   ```

6. 现在 `chrome84.js` 和 `chrome85.js` 还都不能使用，只要用 webpack 把脚本和脚本的依赖打包在一起后，就可以使用了。 npm 命令如下：

   ```
   npx webpack ./chrome84.js -o ./chrome-84
   npx webpack ./chrome85.js -o ./chrome-85
   ```

7. 打包完成，获得 `./chrome-84/main.js` 和 `./chrome-85/main.js` 文件，将它们引入 HTML 中使用，就可以看见控制台输出 fulfilled 的 Promise 对象了（值为 1 ）。

## 如何对库的填补 API（TODO：未编辑）

方法 1 ：通过修改 `window` 对象与相关的原型链来补齐 API ，这会污染全局变量。

方法 2 ：通过引入外部模块来填补 API ，这会适当修改原来的脚本，比如原本使用了 ES6+ API 的代码会被改写为使用外部模块。这种方式不会污染全局变量， 开发库时应当采用此种方式。

> 因为如果库采用了方法 1 ，使用了该库的项目又再次采用了方法 1 ，那么便对 `window` 进行了 2 次修改，如果 2 次修改不一致（取决于转译时所用的 babel 包的版本），第 2 次修改就会覆盖第 1 次修改，库代码就可能无法正常运行。
>
> 开发库还应该采用「按需填补 API 」来减小代码体积。



# 什么是插件

插件是控制 Babel 的转译行为的 JS 程序，比如插件 `@babel/plugin-transform-arrow-functions` 可以将箭头函数转换为函数表达式。使用插件可以在细粒度上控制转译行为。最常用的官方插件有 1 个： `@babel/plugin-transform-runtime` 。



# 什么是预设

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

通过配置参数，可以实现「按需转译语法」和「按需填补 API 」，默认情况下它会转译所有语法且不干涉填充 API 的行为 。 

> `@babel/preset-env` 的历史：
>
> 在 Babel 6 时代，常见的预设主要有： `babel-preset-es2015` 、 `babel-preset-es2016` 、 `babel-preset-es2017` 、 `babel-preset-state-0` 、 `babel-preset-state-1`、 `babel-preset-state-2`  、 `babel-preset-state-3` 、 `babel-preset-latest` 。
>
> 其中 `babel-preset-state-x` 是指草案阶段的 ES 语法的转译预设，目前不再更新； `babel-preset-es201x` 是指 `201x` 年新发布的 ES 语法的转译预设，目前不再更新； `babel-preset-latest` 是指 `2015-至今` 的所有 ES 语法的转译预设，目前持续更新；
>
> `@babel/-preset-env` 正是 `babel-preset-latest` 的延续与增强，它不仅仅包含所有语法的转译规则，甚至还可以按需转译语法和按需填补 API 。它在 Babel 6 时代的旧名是 `babel-preset-env` 。

`@babel/preset-env` 有十几个参数，本文只介绍其中最重要的 4 个：

### 参数 - targets

定义：它描述目标环境/运行时的状态，如果需要按需转译和按需填补，就必须使用该字段。

数据类型：`string |Array<string> |{[string]: string}`

默认值：`{}` （此时将会完全转译所有语法，并且不会干涉填补 API 的行为）

参数示例：

```json
{
    "presets": [[
        "@babel/preset-env",
        {"targets": "> 0.25%, not dead"}
    ]]
}
```

```json
{
    "presets": [[
        "@babel/preset-env",
        {"targets": {"chrome": "58"}}
    ]]
}
```

`targets` 的一种等效用法是：在 `package.json` 种设置 `browserslist` 。当同时使用了 `targets` 和 `browserslist` 时， Babel 会采用 `browserslist` 。

`browserslist` 示例：

```json
{
    "dependencies": {},
    "devDependencies": {},
    "browserslist": ["chrome 58"]
}
```

### 参数 - useBuiltIns

定义：设置填补 API 的规则。

取值： `"usage"` 或 `"entry"` 或 `false`

默认值： `false`

- `false` ：不干涉 API 的填补行为。
- `"entry"` ：导入目标环境缺失的 API ，需要主动导入 `core-js` 和 `regenerator-runtime` 文件。
- `"usage"` ：导入目标环境所缺失的 API 和你的脚本所用到的 API 的交集，不能主动导入 `core-js` 和 `regenerator-runtime` 文件。

### 参数 - corejs

定义：

用于指示 Babel 应当根据哪个版本的 `core-js` 来执行按需填补 API ，因此只有当 `useBuiltIns` 值为 `"entry"` 或 `"usage"` 时 `corejs` 参数才有作用，因为 `useBuiltIns` 值为 `false` 时就不会干按需填补 API 这事

最佳实践是将项目所使用的 `corejs` 版本作为 `corejs` 字段的值，比如 `package.json` 中 `core-js` 的版本号为 `"^3.19.3"` ，则 `corejs` 的值就是 `"3.19.3"` 。



### 参数 - modules

Ⅲ `corejs` ：

Ⅳ `modules` ：



# FF27

使用旧版本的浏览器来检验转译是否成功。

Ⅰ [Firefox 27 的下载地址](https://ftp.mozilla.org/pub/firefox/releases/27.0.1/)

Ⅱ 安装完成后，禁用浏览器自动更新 `选项（左上角）-> 高级 -> 更新`