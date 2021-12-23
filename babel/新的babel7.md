# 简介

Babel 是一个 JS 编译器，它可以将使用了 ES6+ 特性的代码转译为可以在 ES5 环境中运行的代码。

> 注：本文将 ES6 及 ES6 之后的所有年度 ES 版本统称为 ES6+ 。

本文只介绍 Babel7 的转译功能，转译功能包括 3 部分：

- 转译语法：比如将 `箭头函数` 、 `class` 、 `async` 等新语法转译为 ES5 支持的旧语法。
- 转译接口：比如如果目标运行时不支持 `Promise` ，就将脚本中的 `Promise` 转译成目标运行时支持的语法和 API 。
- 填补接口：比如如果目标运行时不支持 `Promise` ，就像目标运行时补充 `Promise` ，这将会改变目标运行时的全局环境（比如 `window` 对象和原型链 ）。



# 版本

Babel 是一个以 @babel/core 为核心的工具集，每当 @babel/core 发布新版本时，整个工具集的所有包都会跟随升级至相同的版本号，即使它们的代码可能一行都没有改变。因此 Babel 的版本号即是 @babel/core 的版本号。

从 Babel 7 开始，所有的包都被放置在一个名为 `babel` 的域下，比如 @babel/cli 、 @babel/core 。而之前的每个包都在 npm 全局注册表中占用一个名称，比如 babel-cli 、 babel-core 。

本节在于厘清，因为许多文章将 Babel 6 和 7 混为一谈了。



# 最佳实践



# 如何转译语法

是指将脚本中的所有语法都转译成目标运行时所支持的语法，分为 2 种情况：

- 完全转译：将脚本中出现的所有 ES6+ 语法都转译为 ES5 语法。
- 按需转译：根据目标运行时的情况，将脚本中不受支持的语法转译为受支持的语法，目标运行时不一定是 ES5 环境。

## 完全转译

将脚本中出现的所有 ES6+ 语法都转译为 ES5 语法。

`@babel/preset-env` 存储了将所有的 ES6+ 语法转译为 ES5 语法的转换规则，我们将借助它来实现完全转译，示例代码是《完全转译》。步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [["@babel/preset-env"]]
   }
   ```

3. 创建待转译的文件 `a.js` ，它使用了箭头函数，我们希望将箭头函数转译为普通函数， `a.js` 的内容如下：

   ```js
   const f = _ => console.log( 1 );
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译成功， `b.js` 是转译的结果，它的内容如下：

   ```js
   "use strict";
   
   var f = function f(_) {
     return console.log(1);
   };
   ```

## 按需转译

根据目标运行时的情况，将脚本中不受支持的语法转译为受支持的语法，目标运行时不一定是 ES5 环境。

`@babel/preset-env` 的 `targets` 参数用于描述目标运行时的情况，Babel 就会自动识别出脚本中的哪些语法是不受目标运行时支持的，然后将这些语法转译为目标运行时所支持的语法。

比如，如果脚本使用了箭头函数和数值分隔符这 2 种语法，且目标环境是 chrome 60 的话， Babel 就只会转译数值分隔符语法，而不会转译箭头函数语法，因为 chrome 从 45 版本开始就支持了箭头函数语法，从 75 版本开始才支持数值分隔符语法。示例代码是《按需转译》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5"
       }
   }
   ```

2. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": [[
           "@babel/preset-env",
           {
               "targets": "chrome 60"
           }
       ]]
   }
   ```

3. 创建待转译的文件 `a.js` ，它使用了箭头函数语法和数值分隔符语法， `a.js` 的内容如下：

   ```js
   const f = _ => console.log( 1_000_000 );
   ```

4. 执行转译， npm 命令如下：

   ```
   npx babel a.js -o b.js
   ```

5. 转译成功， `b.js` 是转译的结果，它的内容如下：

   ```js
   "use strict";
   
   const f = _ => console.log(1000000);
   ```

   果然，数值分隔符语法被转译了，而箭头函数语法被保留了。



# 如何填补接口

如果目标运行时不支持某些 API ，就像目标运行时补充这些 API ，这将会改变目标运行时的全局环境和原型链，这分为 2 种情况：

- 完全填补：帮目标运行时补齐所有的 ES6+ API ，哪怕目标运行时已经支持了部分的 ES6+ API 。
- 按需填补：补齐目标运行时缺失的 API ，或者补齐目标运行时缺失的且被脚本使用到了的 API 。

> 如果目标运行时已经支持了 `Promise`   ，再进行「完全填补」的话，人造的 `Promise` 会不会替换掉天生的 `Promise` 呢？

> 如果目标运行时缺失了 ES5 的 API ， Babel 能填补吗？换言之 Babel 到底能填补多低级的 API 呢？

## 完全填补

帮目标运行时补齐所有的 ES6+ API ，哪怕目标运行时已经支持了部分的 ES6+ API 。

如果想帮目标运行时补齐所有 ES6+ API ，只需要将 ES6+ API 的 polyfill 文件和你的脚本打包在一起就可以了，注意这会改变目标运行时的全局环境和原型链。

ES6+ 的 polyfill 文件共有 3 种：

- `polyfill.js` 文件
- `@babel/polyfill`
- `core-js` & `regenerator-runtime`

本小节的底部阐述了它们的异同，简而言之如果你想做「完全填补」，只推荐使用 `core-js` & `regenerator-runtime` 。

使用 `polyfill.js` 来做完全填补的示例代码是《polyfilljs》。

使用 `@babel/polyfill` 来做完全填补的示例代码是《@babelpolyfill》。

使用 `core-js` `regenerator-runtime` 来做完全填补的示例代码是《core-js&regenerator-runtime》。本小节只演示此示例，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```json
   {
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       },
       "devDependencies": {
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       }
   }
   ```

2. 创建 `a.js` ，它使用了 `Promise` 和 `Promise.resolve` API ，但是 Firefox 27 并不支持它们，我们期望可以补齐 Firefox 27 所缺失的所有 ES6+ API ，以使它可以正常运行 `a.js` ， `a.js` 内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   Promise.resolve( 1 ).then( v => console.log( v ) );
   ```

   > 注：core-js和regeneratpr-runtime的引入没有先后顺序要求

3. 执行打包，将 `a.js` 和它所依赖的 `core-js` 还有 `regenerator-runtime` 打包在一起， npm 命令如下：

   ```
   npx webpack ./a.js -o ./b --mode production
   ```

4. 打包成功，获得 `b/main.js` 文件，该文件包含了所有的 ES6+ polyfill 代码以及你的脚本。

5. 创建 `b.html` ，它会引用 `main.js` 文件，在 Firefox 27 中运行 `b.html` ，控制台将会输出 `1` ， polyfill 成功了！

可惜，这样子还不算是真正的「完全填补」，因为如果你的脚本中使用了 `Generator Functio` 或 `Async Function` ，它们还是没法在 Firefox 27 中正常运行。详见下下一节《特别的 Generator Function 和 Async Function》。

> `polyfill.js` 文件包含了所有的 ES6+ API 的 polyfill ，只要像下面这样将它挂载在你的 html 文件中，就会自动补齐目标运行时的 ES6+ API ：
>
> ```html
> <body>
>     <script src="polyfill.js"></script>
>     <script src="你的脚本"></script>
> </body>
> ```
>
> 哪里下载 `polyfill.js` 文件呢？下载了 `@babel/polyfill` 后，在 `node_modules/@babel/polyfill/dist` 文件夹中就可以找到 `polyfill.js` 和 `polyfill.min.js` 了。
>
> ---
>
> `@babel/polyfill` 和 `polyfill.js` 的功能是一模一样的，只是形态不同，前者是 npm 模块，后者则是独立的 JS 脚本。
>
> 从 Babel 7.4.0 （ 2019.05.19 ）开始，官方就宣布了放弃 `polyfill.js` 和 `@babel/polyfill` ，并推荐使用 `core-js` 和 `regenerator-runtime` 来作为替代。
>
> 不过 Babel 官方还在继续更新 `@babel/polyfill` 。
>
> ---
>
> `core-js` 和 `regenerator-runtime` 组合在一起就是 `@babel/polyfill` ，不过区别是 `@babel/polyfill` 使用的 `core-js` 的主版本号被锁死在了 `2` ，而目前最新的 `core-js` 的主版本号是 `3` 。 
>
> 主版本号为 2 的 `core-js` 只支持全局变量和静态属性，比如 `Promise` 和 `Array.from` ，主版本号为 3 的 `core-js` 额外支持实例属性，比如 `Array.prototype.includes` 。这就是 Babel 官方推荐使用 `core-js` 和 `regenerator-runtime` 来替代 `@babel/polyfill` 和 `polyfill.js` 的原因。
>
> `regenerator-runtime` 用于填补 `Generator Function API` 和 `Async Function API` ， `core-js` 用于填补除了它们之外的其他 ES6+ API ，所以它们要组合在一起使用才能构建出完整的 ES6+ API 环境。
>
> 如果在安装了 `core-js` 和 `regenerator-runtime` 之后再安装 `@babel/polyfill` ，那么 `@babel/polyfill` 内部的 `core-js` 和 `regenerator-runtime` 就会覆盖前者。而且主版本号为 3 的 `core-js` 文件有 `stable` 文件夹，主版本号为 2 的 `core-js` 则没有，如果不小心发生了覆盖安装，就会引发「引用错误」，因为你会在「完全填补」的示例代码中看到，我们需要通过 `import "core-js/stable"` 来使用主版本号为 3 的 `core-js` 。



## 按需填补



## 特别的 Generator Function 和 Async Function

相比其他的 ES6+ API ， `Generator Function` 和 `Async Function` 使用了新的语法，比如 `function*` 、 `async` 等等，这些语法是无法在不支持 `Generator Function` 和 `Async Function` 的旧运行时中运行的，因此哪怕你的脚本引入了 `regenerator-runtime` ，最后也会因为旧运行时不支持这些语法而导致脚本抛出异常。

> 建议如果使用了 `regenerator-runtime` ，也要使用 `core-js` 。原因见本小节末。

解决办法是为脚本补充语法转译，本节的示例代码是《generator和async》，步骤如下：

1. 下载相关的包， `package.json` 内容如下：

   ```js
   {
       "devDependencies": {
           "@babel/cli": "^7.16.0",
           "@babel/core": "^7.16.5",
           "@babel/preset-env": "^7.16.5",
           "webpack": "^5.65.0",
           "webpack-cli": "^4.9.1"
       },
       "dependencies": {
           "core-js": "^3.20.1",
           "regenerator-runtime": "^0.13.9"
       }
   }
   ```

2. 创建 `a.js` 和 `b.js` ，它们的内容是一致的，并使用了 `Async Function` ，而 Firefox 27 不支持该 API 。 `a.js` 和 `b.js` 都会引入 `core-js` 和 `regenerator-runtime` ，但是只转译 `b.js` 的语法。 `a.js` 和 `b.js` 的内容如下：

   ```js
   import "core-js/stable";
   import "regenerator-runtime/runtime";
   
   async function f() { return 1 }
   f().then( v => console.log( v ) );
   ```

3. 配置语法转译的规则， `babel.config.json` 内容如下：

   ```json
   {
       "presets": ["@babel/preset-env"]
   }
   ```

4. 对 `b.js` 执行语法转译， npm 命令如下：

   ```
   npx babel b.js -o bb.js
   ```

5. 执行打包，将 `a.js` 和 `b.js` 与它们所依赖的 `core-js` 还有 `regenerator-runtime` 打包在一起， npm 命令如下：

   ```
   npx webpack ./a.js  -o ./aa --mode production
   npx webpack ./bb.js -o ./bb --mode production
   ```

6. 打包成功，获得 `aa/main.js` 和 `bb/main.js` 文件，虽然它们都补齐了 `Async Function` 和相关的 API ，但是只有 `bb/main.js` 可以正常运行。

7. 创建 `aa.html` 和 `bb.html` ，用于检验 `aa/main.js` 和 `bb/main.js` ，在 Firefox 27 中运行，结果如下：

   `aa.html` ：抛出异常 `SyntaxError: missing ; before statement` 。

   `bb.html` ：正常运行，控制台输出 `1` 。

果然， 未经语法转译的 `aa/main.js` 无法正常运行并抛出了 `SyntaxError` ，该语法错误的成因是由于 Firefox 27 不支持 `async` 语法， 它将脚本中的 `async` 判定为独立的语句，然后 Firefox 认为脚本中的 `async function` 是错误的，正确的写法应当是 `async; function` 。

> 本节明明是在填补 `Async Function` ，可为什么需要引入 `core-js` 呢？这是因为 `Async Function` 的返回值是一个 `Promise` ，如果不引入 `core-js` ，执行时会抛出 `ReferenceError: Promise is not defined` 异常。
>
> 建议如果使用了 `regenerator-runtime` ，也要使用 `core-js` 。