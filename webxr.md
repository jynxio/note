# TODO

- 学习如何使用各个 WebXR-AR API：2021.08.03 ， immersive-web 主席的演讲，她代码演示了如何使用各个 API ！ https://www.youtube.com/watch?v=t-uk8InHte4&list=PLW2iP2Rz9wsKTPwDEW1KhxcWkuwur_E9t （点进下面兼容性表的「Explainer」，里面好像有教程代码！）
- Babylon.js 官网中有 WebXR API 的示例代码，可惜是基于 Babylon.js 的：https://doc.babylonjs.com/divingDeeper/webXR/introToWebXR



# WebXR emulator

WebXR emulator 是由 mozilla 开发的浏览器插件，用于在浏览器中模拟 AR/VR 设备，安装与介绍请见 [官方 Blog](https://blog.mozvr.com/webxr-emulator-extension/)。

## 如何模拟 VR

1. 在控制台中选择 WebXR 扩展；
2. 选择正确的 VR 设备；
3. 打开 VR 页面（请确保在开启 VR 页面之前，已经选择了正确的 VR 设备）；
4. 使用；

![webxr-emulator-vr](picture/webxr/webxr-emulator-vr.gif)

## 如何模拟 AR

1. 在控制台中选择 WebXR 扩展；
2. 选择正确的 AR 设备（目前只有 Samsung Galaxy S8+(AR) 可用）；
3. 打开 AR 页面（请确保在开启 AR 页面之前，已经选择了正确的 AR 设备）；
4. 使用；

用 WebXR emulator 来模拟使用 AR 并不怎么好用。

![webxr-emulator-ar](picture/webxr/webxr-emulator-ar.gif)



# WebXR API

##  API 实现进度

- API 将在何时完成：https://www.w3.org/2020/05/immersive-Web-wg-charter.html
- 现在支持哪些 API ：https://immersiveweb.dev/

## API 介绍

截至 2021 年 8 月 3 日，浏览器支持的 API 如下：

1. WebXR Core
2. AR Module
3. Gamepads
4. Hit Test
5. DOM Overlays
6. Layers
7. Hand Input
8. Light Estimation

> 参考资料：
>
> - （2020.09.04） immersive-web 的主席介绍了 WebXR 在未来将会新增哪些特性： https://www.youtube.com/watch?v=ypSkIYpJjE8
> - （2020.10.21） 用视频演示了 WebXR 的特性： https://www.youtube.com/watch?v=dssQSeTrqPI
> - （2021.08.03） immersive-web 的主席用代码演示了如何使用各个 API ： https://www.youtube.com/watch?v=t-uk8InHte4&list=PLW2iP2Rz9wsKTPwDEW1KhxcWkuwur_E9t

### WebXR Core

Where it all began!
The core part of WebXR covers many Virtual Reality features. It is also designed to provide an extensible base the other WebXR modules can build on as more features get added.
This important because WebXR technology is still in its infancy and changing rapidy.(By Web Standards)

一切开始的地方！

WebXR 的核心部分涵盖了许多虚拟现实的功能。它

WebXR 的核心部分涵盖了许多虚拟现实功能。它还旨在提供一个可扩展的基础，随着更多功能的添加，其他 WebXR 模块可以在其上构建。
这很重要，因为 WebXR 技术仍处于起步阶段并且变化很快。（根据 Web 标准）

### Hittest

命中测试。

仅仅拥有惯性导航的能力是不够的，因为用户无法与虚拟物体交互， Hittest 提供了这种交互能力。 Hittest 会识别环境中的平面，并在每一帧中返回位置信息。

### DOM Overlay

> 更多参考资料：
>
> [W3C Web 中文兴趣组·沉浸式 Web 线上研讨会 (2021.07.24)](https://www.w3.org/2021/07/chinese-ig-xr/minutes.html#open)

DOM 覆盖。

WebXR 是基于 WebGL 的 API ，这意味着你不能使用 HTML 和 CSS ，如果你想为页面添加 UI 或超链接标签，这将会变得非常棘手，比如你需要将内容渲染到图像上，然后将图像作为纹理贴在虚拟物体的表面。

DOM Overlay 特性允许你在 WebXR 应用中使用 HTML 和 CSS ，它的使用方式是：你指定一个 HTML 元素，然后用户代理会将该元素全屏放置到场景中，然后你就可以使用 HTML 、 CSS 、 JS 来控制这个元素。它的工作原理是：启动会话时，你需要请求调用 DOM Overlay 特性，并将 DOM 元素传递进来，之后增强现实程序将具有 3 个视图层。顶层的是 HTML 视图层，中间是 WebGL 视图层（由 WebGL 渲染并发送至 WebXR Device API），底层是摄像机视图层。

该特性的另一个好处是：如果你将内容制成位图并作为纹理应用在虚拟场景中时，它的延迟比你使用 DOM Overlay 要大，而且你还可能要考虑光照对纹理的影响。

> 该特性仅适用于手持设备（智能手机）的增强现实。

### Lighting Estimation

照明估计。

通过计算机视觉来粗略估计真实环境中的光照情况，诸如光的方向、颜色，然后在三维场景中模拟出真实世界的光照，虚拟物体接收并反射近似真实世界的光照，将会让它们更加逼真。

![照明估计对比图](picture/webxr/%E5%85%89%E7%85%A7%E4%BC%B0%E8%AE%A1%E5%AF%B9%E6%AF%94%E5%9B%BE.png)

### Anchors

锚点。

它是一个微妙却又强大的特性。增强现实的底层在运行期间会不断的扫描环境以更好的了解坐标系中的物体们彼此之间的位置关系，有时底层会更新某些东西，如果你将物体放在距离原点较远的地方，当场景发生稍微发生变化后，这些物体的位置就有可能会漂移。

锚点的工作方式是：当场景更新时，锚点也会相应的移动，最后锚点会看起来始终留在原位，因此你相对于锚点放置的任务物体就可以一直保持原位。

这个特性可以极大的增强真实感。

### Layers

层。

我不明白这个 API 的用户，它好像是可以将视频/图像渲染任务交给用户代理来干，然后用户代理再把结果交给三维场景内的某个虚拟平面，这样子比给虚拟物体贴视频纹理要延迟低的多（因为你需要抽出视频帧，绘制到纹理上，再粘贴到几何体上，再在每一帧更新纹理，再重新应用）。而且听说，用 Layers 做出的视频/图像画面延迟更低更高清，对于创建影院或与视频相关的 AR 程序会很有帮助。

这样子看来， Layers 也可以作为 DOM Overlay 的 Polyfill 来用。



# 其它资料

- WebXR 主页：https://immersiveweb.dev/
- WebXR Github：https://github.com/immersive-web