# 简介

Babel 是一个 JS 编译器，它可以将使用了 ES6+ 特性的代码转译为可以在 ES5 环境中运行的代码。

> 注：本文将 ES6 及 ES6 之后的所有年度 ES 版本统称为 ES6+ 。

本文只介绍 Babel7 的转译功能，转译功能包括 2 部分：

- 转译语法：比如将 `箭头函数` 、 `class` 、 `async` 等新语法转译为 ES5 支持的旧语法。
- 转译接口：比如将 `Promise` 、 `Array.prototype.find` 等新接口转译为 ES5 支持的旧接口。



# 版本

Babel 是一个以 @babel/core 为核心的工具集，每当 @babel/core 发布新版本时，整个工具集的所有包都会跟随升级至相同的版本号，即使它们的代码可能一行都没有改变。因此 Babel 的版本号即是 @babel/core 的版本号。

从 Babel 7 开始，所有的包都被放置在一个名为 `babel` 的域下，比如 @babel/cli 、 @babel/core 。而之前的每个包都在 npm 全局注册表中占用一个名称，比如 babel-cli 、 babel-core 。

本节在于厘清，因为许多文章将 Babel 6 和 7 混为一谈了。



# 最佳实践



# 如何转译语法

是指将 ES5 不支持的语法转译为 ES5 支持的语法，分为 2 种情况：

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