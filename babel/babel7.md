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



# 最佳实践（TODO）



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

> TODO：下文这段表述出现在这里还是不太恰当。

对于 `Generator Function` 和 `Async Function` ，光引入 polyfill 文件是不够的，还需要转译脚本中出现的相关语法，这是因为 `Generator Function` 和 `Async Function` 是使用了新语法的 API ，比如 `async` 、 `await` 、 `function*` 、 `yield` 等，因此哪怕补齐了 API ，但是旧运行时会因为无法识别这些新语法而抛出错误。

因此在实践中，仅仅通过 webpack 将脚本与 polyfill 打包在一起是不够的，应该在打包之前增加 Babel 转译语法的环节。

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

---

从这里开始

从这里开始

从这里开始

从这里开始

从这里开始

从这里开始

从这里开始

从这里开始

从这里开始

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

> 注：
>
> Babel 只需要根据 `targets` 和 `corejs` 就可以判断出目标环境缺失哪些 API ，以及又该从哪个目录中引入 polyfill 脚本，因此哪怕不下载 `core-js` 和 `regenerator-runtime` 也能正常完成 API 的填补工作，不过要注意 `import "core-js/stable";` 和 `import "regenerator-runtime/runtime";` 这两条语句是一定要写的，否则就不会做任何填补工作。
>
> 整个项目只能导入一次 `core-js` 和 `regenerator-runtime` ，否则会引发错误。
>
> 当然，在 webpack 之前还是要把 `core-js` 和 `regenerator-runtime` 这两个依赖下载下来的。
>
> 更多细节请见《@babel/preset-env》的《参数 - corejs 》部分。

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

> 注：
>
> Babel 只需要根据 `targets` 和 `corejs` 和脚本的内容就可以判断出应该引入哪些 API ，以及又该从哪个目录中引入 polyfill 脚本。因此哪怕不下载 `core-js` 和 `regenerator-runtime` 也能正常完成 API 的填补工作。
>
> 不过和 `useBuiltIns` 值为 `"entry"` 时不同，当值为 `"usage"` 时，你的脚本中不能写 `import "core-js/stable";` 和 `import "regenerator-runtime/runtime";` ，因为如果写了这两条语句，它们会被直接复制到 Babel 后的脚本中去。不写它们就好了， Babel 可以正常工作的，别担心。
>
> 当然，在 webpack 之前还是要把 `core-js` 和 `regenerator-runtime` 这两个依赖下载下来的。
>
> 更多细节请见《@babel/preset-env》的《参数 - corejs 》部分。

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



# 配置文件

可以使用下述任意一种文件来配置转译行为：

-  `babel.config.json` （还支持其它扩展名 `.js` `.cjs` `.mjs` ）
-  `xxxx.babelrc.json` （还支持其它扩展名 `.babelrc` `.js` `.cjs` `.mjs` ）
-  `package.json` 中使用 `"babel"` 



# 详解 Babel 包

## @babel/core

Babel 的核心包，无论是转译语法还是填补 API ，都需要使用该包。

```
npm install --save-dev @babel/core
```

## @babel/cli

如果想要通过命令行来使用 Babel ，就需要安装它。

```
npm install --save-dev @babel/cli
```

下面介绍一些可能有用的技巧：

1. 将转译后的代码输出到 Node.js 的标准输出流

   ```
   npx babel a.js
   ```

2. 将转译后的代码写入到文件中

   ```
   npx babel a.js -o b.js
   ```

   或

   ```
   npx babel a.js --out-file b.js
   ```

   `-o` 是 `--out-file` 的简写。

3. 转译整个文件夹下的 JS 脚本，并将结果输出至目标文件夹

   ```
   npx babel input_file -d output_file
   ```

   或

   ```
   npx babel input_file --out-dir output_file
   ```

   `-o` 是 `--out-dir` 的简写。

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

`targets` 的一种等效用法是：在 `package.json` 种设置 `browserslist` 。当同时使用了 `targets` 和 `browserslist` 时， Babel 会采用 `targets` 。

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

用于指示 Babel 应当根据哪个版本的 `core-js` 来执行按需填补 API ，因此只有当 `useBuiltIns` 值为 `"entry"` 或 `"usage"` 时 `corejs` 参数才有作用，因为 `useBuiltIns` 值为 `false` 时就不会做按需填补 API 这事

最佳实践是将项目所使用的 `corejs` 版本作为 `corejs` 字段的值，比如 `package.json` 中 `core-js` 的版本号为 `"^3.19.3"` ，则 `corejs` 的值就是 `"3.19.3"` 。

> 更多细节：
>
> 当执行「按需填补 API 」任务时， Babel 会将一条 `import "core-js/stabel";` 语句，拆分成零至多条 `require("...");` 语句（取决于 `targets` 和 `useBuiltIns` ）。由于不同版本的 core-js 包的目录结构有可能不同（比如子模块的数量、命名、路径、功能等），因此基于不同版本的 core-js 包来执行任务所得到的结果是有可能不同的，所以 Babel 需要明确的知道自己应当根据哪个版本的 core-js 来执行「按需填补 API 」任务，这就是 `corejs` 参数的意义。
>
> 因为 `corejs` 是服务于「按需引入」任务的参数，所以 `corejs` 只有在 `useBuiltIns` 为 `"entry"` 或 `"usage"` 时才需要设置/才有作用。
>
> 总之，Babel 只需要知道： ① 目标环境的情况（ `targets` ）、 ② 按需填补的类型（ `useBuiltIns` ）、 ③ `core-js` 包的版本（ `corejs` ）就可以正常执行「按需填补 API 」任务了，执行过程中 Babel 不会访问实际下载的 `core-js` 和 `regenerator-runtime` 文件，这就是为什么没有下载 `core-js` 和 `regenerator-runtime` 时， Babel 也能正常工作。不过要注意， `useBuiltIns` 为 `"entry"` 时，待处理的脚本必须书写 `import "core-js/stable";` 和 `import "regenerator-runtime/runtime";` ，当 `useBuiltIns` 为 `"usage"` 时则不能写。详见《按需填补 - entry 》和《按需填补 - usage 》。
>
> 最后， webpack 时实际下载的 `core-js` 包的版本必须和 `corejs` 参数的值一致。

数据类型：

 `string | {version: string, proposals: boolean}`

如果想要引入提案阶段的 ES 特性，就需要将 `corejs` 参数设定为特殊值，这时才会用到 `{version: string, proposals: boolean}` 。如果只是想引入稳定的 ES 特性，只使用 `string` 格式就够了。

默认值： `"2.0"`

### 参数 - modules

定义：该参数决定使用什么类型的模块语法。

取值： `"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false` ，当取值为 `false` 时将使用 ES 模块语法（ `import`  和 `export` ）。

默认值： `"auto"` （这时经常会用 commonjs 模块语法，即 `require` 和 `module.exports` ）。

## @babel/runtime

> 安装 `@babel/preset-env` 时会自动安装 `@babel/runtime` ，但我还是建议再手动安装一遍 `@babel/runtime` 。

该包存储了所有的语法辅助函数模块，每个模块都封装了一个语法辅助函数。

转译某些语法时会产生「语法辅助函数」，语法辅助函数用于辅助转译后的语法的运行。默认情况下， Babel 会在转译结果文件中写入语法辅助函数，比如转译 `class` 时， Babel 会在转译结果文件中写入 3 个函数： `_defineProperties` 、 `_createClass` 、 `_classCallCheck` 。示例代码是《如何使用@babel_runtime》。

步骤如下：

1. 下载相关包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "@babel/runtime": "^7.16.5"
       }
   }
   ```

2. 创建待转译文件 `a.js` ，内容如下：

   ```js
   class A {
       constructor( value ) {
           console.log( value );
       }
   }
   
   const a = new A( 1 );
   ```

3. 配置转译文件， `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"]
   }
   ```

4. 对 `a.js` 进行语法转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译完成，获得转译结果文件 `b.js` ，它的内容如下：

   ```js
   "use strict";
   
   function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }
   
   function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
   
   function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
   
   var A = /*#__PURE__*/_createClass(function A() {
     _classCallCheck(this, A);
   });
   ```

   假设一个项目由 10 个模块组成，每个模块都使用了 `class` 语法，经过语法转译后，得到的 10 个转译结果文件都将被写入相同的语法辅助函数，再打包得到 1 个 `bound.js` 文件， `bound.js` 内便存在 27 个冗余的语法辅助函数，因为理论上只需要使用 1 个 `_defineProperties` 、 1 个 `_createClass` 、 1 个 `_classCallCheck` 便足够了。

   为了解决冗余问题， Babel 官方将每个语法辅助函数都封装成一个独立的模块，再把所有的语法辅助函数模块都存储在 `@babel/runtime` 中，比如 `_defineProperties` 被封装为 `defineProperty.js` ， `_createClass` 被封装为 `createClass.js` ， `_classCallCheck` 被封装为 `classCallCheck.js` ，我们把它们称为「语法辅助函数模块」。

   如果转译后的 10 个转译结果文件都使用 `defineProperty.js` 、 `createCalss.js` 、 `classCallCheck.js` 就可以解决冗余问题，因为 `bound.js` 中只会引入 1 个 `defineProperty.js` 、 1 个 `createCalss.js` 和 1 个 `classCallCheck.js` 。

6. 如何使用 `@babel/runtime` 呢？比如对于 `b.js` ，手动将语法辅助函数替换为语法辅助函数模块，替换后得到 `c.js` ，它的内容如下：

   ```js
   "use strict";
   
   var _defineProperties = require("@babel/runtime/helpers/defineProperty");
   
   var _createClass = require("@babel/runtime/helpers/createClass");
   
   var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");
   
   var A = /*#__PURE__*/_createClass(function A(value) {
       _classCallCheck(this, A);
   
       console.log(value);
   });
   
   var a = new A(1);
   ```

   > 注：手动导入语法函数模块时，要用 `require` ，不要用 `import` 。

7. `c.js` 还无法使用，它要经过打包才能使用， npm 命令如下：

   ```
   npx webpack ./c.js -o ./c
   ```

8. 获得 `./c/main.js` 文件，创建 `c.html` 并引用 `main.js` ，在 FF27 中运行该 HTML 文件，控制台将会输出 `1` 。

这就是 `@babel/runtime` 的使用方法。此外， `@babel/plugin-transform-runtime` 插件可以自动化这个替换工序。

## @babel/runtime-corejs2

它是 `@babel/runtime` 的加强版，它包含 `@babel/runtime` 、 `regenerator-runtime` 、 `core-js` （ 2 号版本）， 2 号版本的 `core-js` 仅支持全局变量（例如 `Promise` ）和静态属性（例如 `Array.from` ）。

## @babel/runtime-corejs3

它是 `@babel/runtime` 的加强版，它包含 `@babel/runtime` 、 `regenerator-runtime` 、 `core-js` （ 3 号版本）， 3 号版本 `core-js` 不仅支持全局变量和静态属性，还支持实例属性（例如 `Array.prototype.includes` ）。

## @babel/plugin-transform-runtime

！！后两个作用原来叫 API 转换！！！



该插件具有 3 个作用：

1. 通过导入外部的语法辅助函数模块来替换脚本中内联的语法辅助函数，以此来减小打包后的体积，该功能默认激活。
2. 导入外部的 API 辅助函数模块，使用 API 辅助函数模块来替换脚本中出现的 ES6+ API ，以此来填补 API ，又避免污染全局环境，该功能默认禁用。
3. 导入外部的 API 辅助函数模块，使用 API 辅助函数模块来替换脚本中出现的 Generator Function API 和 Async Function API ，以此来填补 API ，又避免污染全局环境，该功能默认禁用。

> 如果我们使用 `@babel/plugin-transform-runtime` 来补齐 API ，就不要再使用 `core-js` 和 `regenertor-runtime` （或类似的）的 polyfill 文件了，自然而然也不要使用 `@babel/preset-env` 的 `useBuiltIns` 特性了（ `targets` 属性能用）。
>
> 如果使用了 `@babel/plugin-transform-runtime` 后，还 `import "core-js/stable"` 或 `import "regenerator-runtime/runtime"` ，那么这两条语句会被直接保留下来。

### 参数

#### helpers

描述：是否使用语法辅助函数模块来替代内联语法辅助函数。

默认值： `true`

取值：

1.  `true` ：使用语法辅助函数模块来替代内联语法辅助函数。
2.  `false` ：不使用语法辅助函数模块来替代内联语法辅助函数。

#### corejs

描述：是否做 API 转换（指除了 Generator Function API 和 Async Function API 之外的所有 API ）。

默认值： `false`

取值：可取以下其一

1.  `false` ：不做 API 转换。
2.  `2` ：做 API 转换， API 转换辅助函数取自 `@babel/runtime-corejs3` 。
3.  `3` ：做 API 转换， API 转换辅助函数取自 `@babel/runtime-corejs2` 。

#### regenerator

描述：是否做 API 转换（指 Generator Function API 和 Async Function API ）。

默认值： `true`

取值：

1. `true` ：做。
2. `false` ：不做。

#### absoluteRuntime

描述：是否自定义 `@babel/plugin-transform-runtime` 引入 `@babel/runtime` 模块的路径规则。几乎用不到该参数，取默认值就行，因为只要正常的将包安装至 `node_modules` 文件夹中，就不需要自定义包的路径。

默认值： `false`

取值：

1.  `false` ：不需要自定义包的路径。
2. 表示路径的字符串。

#### version

描述：设置 `@babel/plugin-transform-runtime` 应该基于哪个版本的 `@babel/runtime` 或 `@babel/runtime-corejs2` 或 `@babel/runtime-corejs3` 来运行， `@babel/plugin-transform-runtime` 将会根据版本号来决定使用哪些特性。

默认值： `7.0.0`

取值： `@babel/runtime` 或 `@babel/runtime-corejs2` 或 `@babel/runtime-corejs3` 的版本号的字符串。

例子：如果项目依赖的 `@babel/runtime-corejs3` 的版本是 `"^7.16.5"` ，则 `version` 取 `"^7.16.5"` 。

最佳实践： `version` 的值照抄 `@babel/runtime` 或 `@babel/runtime-corejs2` 或 `@babel/runtime-corejs3` 的版本号的字符串，这样可以让打包后的体积更小。

### 作用 1

关于为什么导入外部的语法辅助函数模块可以减小打包后的模型，详见《@ba be l/runtime》。下文纯粹演示 `@babel/plugin-transform-runtime` 是如何使用外部的语法辅助函数模块来替换脚本中内联的语法辅助函数，示例代码是《作用1》。

步骤如下：

1. 下载包， `packagr.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/plugin-transform-runtime": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "@babel/runtime": "^7.16.5"
       }
   }
   ```

2. 创建待转译文件 `a.js` ，内容如下：

   ```js
   class A {
       constructor( value ) {
           console.log( value );
       }
   }
   const a = new A( 1 );
   ```

3. 配置转译文件， `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"],
       "plugins": ["@babel/plugin-transform-runtime"]
   }
   ```

4. 对 `a.js` 进行语法转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译完成，获得转译结果文件 `b.js` ，它内部的语法辅助函数已经被自动替换为对语法辅助函数模块的引用。它引用的模块是 `interopRequireDefault.js` 、 `createClass.js` 和 `classCallCheck.js` ，然而在《@babel/runtime》中，我们手动替换引用后，引用的模块是 `defineProperty.js` 、 `createCalss.js` 和 `classCallCheck.js` 。

   `b.js` 的内容如下：

   ```js
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
   
   var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
   
   var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
   
   var A = /*#__PURE__*/(0, _createClass2["default"])(function A(value) {
     (0, _classCallCheck2["default"])(this, A);
     console.log(value);
   });
   var a = new A(1);
   ```

6. `b.js` 还无法使用，它要经过打包才能使用， npm 命令如下：

   ```
   npx webpack ./b.js -o ./b
   ```

7. 获得 `./b/main.js` 文件，创建 `b.html` 并引用 `main.js` ，在 FF27 中运行该 HTML 文件，控制台将会输出 `1` 。

这就是 `@babel/plugin-transform-runtime` 如何自动化的将语法辅助函数替换成语法辅助函数模块的教程了。

### 作用 2

过去通过将脚本与 `core-js` 和 `regenerator-runtime` 打包在一起来实现 API 的填补，其中有「完全填补」和「按需填补」两种模式，前者只需要使用 webpack 将 `core-js` 和 `regenerator-runtime` 和你的脚本打包在一起就可以实现了，后者还额外需要配置 `@babel/preset-env` 的 `targets` 和 `useBuiltIns` 字段，才能实现。

无论是哪种模式，它们都是通过修改 `window` 和某些原型链来实现的，这会污染全局环境。对于普通的项目而言，通过修改全局环境来填补 API 是可以的，但是对于库而言，则是不可以的。如果库已经修改过一次全局环境了（为了填补 API ），而依赖该库的项目为了填补 API 又再次修改全局的话，后一次修改就会覆盖前一次修改，如果这两次修改是不同的，就有可能导致库故障，因为库有可能无法在更新后的全局环境中运行。由于填补 API 时，对全局环境的修改取决于 `core-js` 和 `regenerator-runtime` ，所以如果库和项目所依赖的 `core-js` 和 `regenerator-runtime` 的版本号是不同的，就有可能导致上述故障。

因此库需要使用一种不污染全局变量的方式来填补 API ，相应的解决办法就是：导入外部的 API 辅助函数模块，再将 ES6+ API 替换为 API 辅助函数模块。

打个比方，假如脚本中使用了 `Promise` ， Babel 会导入相应的 API 辅助函数模块 `promise.js` ，然后将 `Promise` 修改为 `_Promise` ：

```js
const p = Promise;
```

会被转译为：

```js
var _promise = require("@babel/runtime-corejs3/core-js-stable/promise");

var p = _promise;
```

这样就既填补了 Promise API ，又避免了污染全局环境。

下文纯粹演示如何使用 `@babel/plugin-transform-runtime` 来实现该功能，示例代码是《作用2》。

步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/plugin-transform-runtime": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "@babel/runtime-corejs3": "^7.16.5"
       }
   }
   ```

2. 配置 `babel.config.json` ，内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"],
       "plugins": [[
           "@babel/plugin-transform-runtime",
           {
               "helpers": true,
               "corejs": 3,
               "regenerator": true,
               "absoluteRuntime": false,
               "version": "^7.16.5"
           }
       ]]
   }
   ```

   `helpers` 、 `corejs` 、 `regenerator` 、 `absoluteRuntime` 、 `version` 将在下文介绍。

   其实不使用 `@babel/preset-env` 也能正常填补 API ，并最后顺利打出一个可以执行的包，但是如果不使用 `@babel/preset-env` 的话，会少引入一个 `interopRequireDefault` 和严格模式，虽然我不知道这究竟会带来什么影响，但是为了安全起见，还是应该使用 `@babel/preset-env` 。

3. 创建 `a.js` ，其内的 `Promise` 正是期待被填补的 API ，内容如下：

   ```js
   const promise = Promise.resolve( 1 );
   console.log( promise );
   ```

4. 执行 Babel ， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 获得 `b.js` ，内容如下：

   ```js
   "use strict";
   
   var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault")["default"];
   
   var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
   
   var promise = _promise["default"].resolve(1);
   
   console.log(promise);
   ```

   可见，脚本引入了 `promise` 模块并赋值给 `_promise` ，并将 `Promise.resolve(1)` 修改成了 `_promise["default"].resolve(1)` 。

6. 打包， npm 命令如下：

   ```
   npx webpack ./b.js -o ./b
   ```

7. 获得 `./b/main.js` ，将其放入 HTML 文件中，然后执行该 HTML 文件，可以看见控制台输出 `"[object Object]"` 。如果你在控制台键入 `window.Promise` ，将会输出 `undefined` ，而在《如何填补API》的《完全填补》的示例代码中，键入 `window.Promise` 的结果是 `"[object Function]"` 。可见该示例以无污染的方式填补了 Promise API 。

### 作用 3

过去通过将脚本与 `regenerator-runtime` 打包在一起来实现填补 `Generator Function API` 和 `Async Function API` ，但是这会污染全局环境。

激活 `regenerator` 属性可以既不污染全局环境，又可以补齐这两个 API ，注意必须使用 `@babel/preset-env` 来转译这两个 API ，因为旧环境不支持它们的语法。示例代码是《作用3》。

步骤如下：

1. 下载相关的包， `babel.config.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/plugin-transform-runtime": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
       "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "@babel/runtime-corejs3": "^7.16.5"
       }
   }
   ```

2. 创建 `a.js` ，内容如下：

   ```js
   async function f() { console.log( 1 ) }
   f();
   ```

3. 配置转译参数， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [["@babel/preset-env"]],
       "plugins": [[
           "@babel/plugin-transform-runtime",
           {
               "helpers": true,
               "corejs": 3,
               "regenerator": true,
               "absoluteRuntime": false,
               "version": "^7.16.5"
           }
       ]]
   }
   ```

   由于 `Generator Function API` 和 `Async Function API` 使用了特殊的语法，比如 `async` ，而旧环境不支持这些语法，因为需要对它们进行语法的转译。

   由于 `Async Function API` 的返回值是 `Promise` 实例，所以也需要激活 `corejs` 属性来补齐 Promise API ，否则旧环境会抛出 `ReferenceError: Promise is not defined` 。

   激活 `helpers` 是因为可以减少 Babel 之后的脚本的代码量（语法辅助函数模块替代了内联的语法辅助函数），可以让示例更精简。

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 执行打包， npm 命令如下：

   ```
   npx webpack ./b.js -o ./b --mode production
   ```

6. 打包后获得 `./b/main.js` 文件，将该文件放入 HTML 文件中执行，控制台将会输出 `1` 。

## regenerator-runtime

它不是官方的包，它用于填补 `Generator Function` 和 `Async Function` 。

该包只有 2 个 JS 文件， `path.js` 用于获取 `runtime.js` 的绝对路径， `runtime.js` 用于填补 `Generator Function` 和 `Async Function` 。

由于它使用 1 个脚本来填补 2 个 API ，所以只要缺失 `Generator Function` 和 `Async Function` 的任意一者， Babel 都会导入整个 `regenerator-runtime` 。



# FF27

使用旧版本的浏览器来检验转译是否成功。

1. [Firefox 27 的下载地址](https://ftp.mozilla.org/pub/firefox/releases/27.0.1/)
2. 安装完成后，禁用浏览器自动更新 `选项（左上角）-> 高级 -> 更新`