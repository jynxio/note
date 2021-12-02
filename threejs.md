# 03 - Basic Scene

## Renderer

setSize：该方法调整canvas元素的宽高

```
renderer.setSize(width, height);
```



# 04 - Webpack



# 05 - Transform objects

## scale

避免使用负值，因为这会在未来造成bug，“because axes won't be oriented in the logical direction”（不明白是什么意思）。

```
mesh.scale.set(-1, -1, -1);
```

## rotation

欧拉角：当你绕X轴旋转物体后，其它轴的方向也被改变了，这种特性会导致在复杂的旋转下会产生万向锁问题。

四元数：可以解决万向锁。

可以使用欧拉角和四元数的任意一个来旋转物体，使用其中任意一个，都会改变另一个的值，比如使用欧拉角旋转后，物体的四元数属性也会变化。

## group

对group实例使用缩放、平移、旋转等等等等（所有变化），group内部的子孙都会被影响。

比如先缩放了group，再把子孙添加进group，子孙也同样会会缩放。



# 06-Animations

## requestAnimationFrame

执行 `requestAnimationFrame(f)` ，它会在下一帧执行 `f` 。

## 三角函数实现周期运动

Math.cos、Math.sin是实现周期运动的好方法，比如：

```js
const clock = new three.Clock();

loop();

function loop() {
    
    requestAnimationFrame(loop);
    
    const elapsed_time = clock.getElapsedTime();
	
    mesh.position.x = Math.cos(elapsed_time)
    mesh.position.y = Math.sin(elapsed_time);
    
    renderer.render(scene, camera);
    
}
```

## lookAt

`camera.lookAt(0, 0, 0)` lookAt方法根据camera的位置和目标点，来计算出一个方向，然后让camera看向这个方向，比如让camera看向自己的左下方。

但是如果平移或旋转camera后，camera还是看向自己的左下方，注意camera是永远看向某个当初算出来的方向，而不是永远看向当初入参的那个点。

## GSAP！！！著名的动画库！！！

https://greensock.com/gsap/

https://www.npmjs.com/package/gsap

```js
import gsap from "gsap";

gsap.to(mesh.position, {durationL 1, delay: 1, x: 2}); // 它内部使用requestAnimationFrame来实现动画
```

# 07-Cameras

## PerspectiveCamera

### Fov(Field of view)

使用度来描述相机视锥体在垂直方向上的角度。如果使用一个小角度，内容会看起来很大。如果使用一个大角度（广角），你会获得一个鱼眼效果，这会使内容变形，因为相机看到的内容必须通过拉伸或挤压来适应画布。

西蒙使用的fov通常在[45, 75]。

> 相机视锥体的形状是四棱锥，四棱锥的底面是正方形，所以垂直方向上的张角和水平方向上的张角是一样的。

### Aspect ratio

指相机视锥体的长宽比，通常使用画布的宽度除以高度。

如果没有把相机添加进Scene，一切也会正常工作，但是这会在随后导致bug。

### Near and far

BUG：如果你使用一个极小值和极大值来作为 `near` 和 `far` ，比如 `0.0001` 和 `9999999` ，你可能会遇到一个名为 `z-fighting` 的BUG，它表现为2个面在竞争谁在上面。

> z-fighting：当2个face的位置一样或非常接近的时候，GPU不知道哪个在前哪个在后，然后你就会看到非常怪异的像素冲突现象。

> 为什么这么设置near和far会引发z-fighting？我猜测是因为near和far之间的分段数量是固定的，当near和far的差值越大，一段的跨度就越大，一段之内的物体会被认为是同一个位置的物体。

请使用合理的值，只在需要时才减小near和增大far。

## OrthographicCamera

它和PerspectiveCamera的区别是，它没有近大远小的效果（这种效果被称为透视），这意味着无论物体离相机多远，物体的大小都是恒定的。

该相机没有fov和aspect ratio参数，取而代之的是left、right、top、bottom，这4个参数的含义是：以相机为几何中心，建立一个矩形，从几何中心到矩形上边界的距离为top，到右边界的距离为right，到下边界的距离为bottom，到左边界的距离为left，整个矩形就是该相机的视野范围，该相机的视线就像 RectAreaLight 一样向目标方向发射。

top、right、bottom、left 4个参数接收“有向距离”，例如：

```js
new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
```

该相机也具有near和far参数。

上例意味着我们要渲染一个正方形区域，正方形区域会被拉伸来适应画布尺寸，如果画布是矩形，那就会因为拉伸而产生变形。为了避免这种情况， 我们需要给left top right bottom使用aspect ratio，如下例：

```js
new THREE.OrthographicCamera(- 1 * aspectRatio, 1 * aspectRatio, 1, - 1, 0.1, 100)
```

## Controls

DeviceOrientationControls - 陀螺仪控制器（在r134版本中被正式移除，因为该API无法在所有设备上获得稳定一致的表现）。

FirstPersonControls - 第一人称浏览

PointerLockControls - 隐藏指针（ [pointer lock JavaScript API](https://developer.mozilla.org/docs/Web/API/Pointer_Lock_API) ），用于制作第一人称FPS游戏。

OrbitControls - 左键旋转，滚轮缩放，右键平移

TrackballControls - 和 OribitControls一样，不过它可以在垂直方向上无限制旋转

TransformControls - 拖动物体（三轴方向上）

DragControls - 拖动物体（仅限于在垂直于摄像机视线方向的平面上）



# 08 - fullscreen and resizing

## aspect ratio

如果改变了camera的某些属性，比如 `aspect` ，就需要更新投影矩阵，使用 `camera.updateProjectionMatrix()` 。

## pixel ratio

像素比是指：软件上的一个像素对应屏幕上的多少个物理像素，比如像素比2是指软件上一个像素对应物理上2×2个像素。

以前的屏幕的像素比都是1，但是它限制了显示高清图像和超薄字体，于是Apple开始制造像素比为2的屏幕（称为视网膜屏幕），后来大多数的屏幕制造商都如此跟进了。

你可以使用 `window.devicePixelRatio` 来获取屏幕的像素比，并用 `renderer.setPixelRatio` 方法来更改 renderer 的pixel ratio。但是我们不能简单的让 renderer 的 pixel ratio 等于屏幕的像素比，因为越高的像素比会带来更多的性能负荷，但是像素比2和3对人眼没有区别（相比像素比1，像素比2需要渲染4倍的像素，像素比3需要渲染9倍的像素），大于2的像素比不过是噱头或市场营销。所以我们应该将renderer 的像素比上限设置为2。

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```



# 09 - Geometries

# 10 - Debug UI

## Dat.GUI

它是最受欢迎的 three.js debug 工具，可是已经很久没更新了（latest 2017.05.15），lil-gui 是 dat.gui的替代品，lil-gui可以像使用dat.gui一样来使用。

```js
const gui = new dat.GUI();

gui.add(mesh.position, "y");                           // 数值控制
gui.add(mesh.position, "x", -3, 3, 0.01);              // 滑动条控制
gui.add(mesh.position, "z").min(-3).max(3).step(0.01); //
gui.add(mesh, "visible").name("可见性");                // 重命名
gui.addColor(parameters, "color").onChange(_ => material.color.set(parameters.color));
gui.add(parameters, "spin");                           // 调用方法的按钮
```

> lil-gui 会根据visiible来判断是它是一个boolean，这真是太棒了。

控制颜色需要使用 addColor 方法，因为 lil-dat 不知道你想要设定一个text、number还是color。它还需要使用中间变量parameters（其中，在一开始material就是用parameters.color作为入参），这是因为lil-dat无法从Color实例中读取到颜色值。最后使用onChange，是因为单纯的改变parameters.color无法改变material，需要一个listener来主动改变material的color。



# 11 - Textures

## 使用 Texture

需要手动创建 `<image>` 元素，并监控图片的加载事件。在图片加载完成之前，texture 都是透明的。

```js
const image = new Image();
const texture = new three.Texture(image);

image.addEventListener("load", _ => texture.needsUpdate = true);
image.src = "/door.jpg";

const material = new three.MeshBasicMaterial({map: texture});
```

## 使用 TextureLoader

`TextureLoader` 类的内部实现了上文的过程，包括图片加载与加载后更新纹理，它比上文的方式更简单。

```js
const loader = new three.TextureLoader();
const texture = loader.load("door.jpg");
const material = new three.MeshBasicMaterial({map: texture});
```

```js
loader.load(
	"url",
    function onLoad() {},
    function onProgress() {},
    function onError() {}
);
```

## 使用 LoadingManager

如上文， `TextureLoader` 实例的 `load` 方法可以接收 `onLoad` 、`onProgress`  、 `onError` 来监控资源的加载，但是如果要同时加载许多的资源，又同时监控所有资源的加载，那么就需要为每一个 `load` 方法都绑定3个事件，这太麻烦了。 `LoadingManager` 可以解决这个问题。

```js
const manager = new three.LoadingManager();

manager.onStart = _ => {};
manager.onLaod = _ => {};
manager.onProgress = _ => {};
manager.onError = _ => {};

const loader = new three.TextureLoader(manager);

loader.load("1.jpg");
loader.load("2.jpg");
loader.load("2.jpg");
...
```

这样，每个资源的加载就都自动绑定了4个事件。

## Transforming the texture

### Repeat

```js
texture.repeat.x = 2;
texture.repeat.y = 3;
texture.wrapS = three.RepeatWrapping; // x axis
texture.WrapT = three.RepeatWrapping; // y axis
```

### Offset

```js
texture.offset.x = 0.5;
texture.offset.y = 0.5;
```

偏移是这么计算的，假设x轴方向重复2次，则x轴方向的长度为2个单位，偏移0.5个单位，意味着整个纹理向左移动0.5个单位。对于y轴，偏移的正方向是下。

### Rotation

```js
texture.rotation = Math.PI / 4;
```

对于Cube，默认情况下，每个面都会绕左下角（UV坐标原点）逆时针旋转45°。可以改变旋转中心：

```js
texture.center.x = 0.5;
texture.center.y = 0.5;
```

UV坐标系的U轴正方向向右，V轴正方向向下，无论repeat多少次，(0.5, 0.5)都代表一个正方形的UV平面的几何中心。

### Filtering and Mipmapping

没有正对视线的平面的纹理会看起来很模糊，比如在正视一个正方体时，正方体的顶面的纹理会看起来很模糊，这种模糊的成因就是 filtering and the mipmapping。

Mipmapping具体是指：three.js会基于图片的原始分辨率，创建出分辨率小一倍的新纹理，再创建出分辨率再小一倍的纹理，直至获得一个1×1的纹理，然后所有纹理都会被发送给GPU，GPU会挑选最合适的版本来作为最终纹理。比如对于1024×1024的图片，three.js会创建出1024×1024、512×512、256×256、128×128、64×64、32×32、16×16、8×8、4×4、2×2、1×1的多个纹理，所有纹理都会被发送给GPU，GPU会挑选最适合的版本来作为最终纹理。

three.js和GPU内部处理了上述过程，我们只需要挑选滤波算法就好了，有2种算法：minification filter（缩小滤波） 和 magnification filter（放大滤波）。

#### Minification filter

应用场景：当纹理大于平面时，该如何缩小纹理以使其完全覆盖平面（缩小后，一个纹素小于一个像素）。

可以通过texture的minFilter属性来修改缩小滤波。比如：

```js
texture.minFilter = three.NearestFilter;
```

> 使用分辨率很高的棋盘格纹理，可以清楚看出缩小滤波的作用：checkerboard-1024x1024.png

#### Magnification filter

应用场景：当纹理小于平面时，该如何放大纹理以使其完全覆盖平面（放大后，一个纹素大于一个像素）。

可以通过texture的magFilter属性来修改放大滤波。比如：

> 使用分辨率非常低的棋盘格纹理，可以清楚看出放大滤波的作用：checkerboard-8x8.png

只有2种算法：

- NearestFilter
- LinearFilter（默认）

使用LinearFilter时，棋盘格的边缘会非常模糊，使用NearestFilter，棋盘格的边缘非常锐利，所以NearestFilter对于像素风的纹理非常有利（比如我的世界）。比如，使用一张我的世界的纹理图片 （minecraft.png） 试试！。

#### 性能

所有滤波种，NearestFilter 算法的耗能最低！

Mipmapping是针对minFilter的技术，如果minFilter使用了NearestFilter算法，则它可以不使用mipmapping，这时候请这么做，这会稍微减轻GPU的负荷。

```js
texture.generateMipmaps = false;
texture.minFilter = three.NearestFilter;
```

## Texture format and optimisation

### The weight

- jpg：有损压缩，更轻量
- png：无损压缩，更重量

可以使用 [TinyPNG](https://tinypng.com/) 来压缩图片，尝试把图片压缩成 ”显示效果无明显变差但体积更小“ 的状态之后再使用。

### The resolution

- 降低分辨率：图像的每个像素都会存入GPU，而且Mipmapping技术倍增了像素的数量，然而GPU是由存储限制的，因此要尽可能降低图像的分辨率。
- 宽高是2的幂：由于Mipmapping技术，three.js强制要求纹理的宽度和高度必须是2的幂，如果不是2的幂，three.js会把它们拉甚至最接近的2的幂，这会导致纹理视觉效果变差，控制台也会发出警告。



# 12 - Materials

## MeshBasicMaterial

### alphaMap

一种使用纹理来控制透明度的技术，使用该技术的前提是令 `transparent: true` 。

```js
material.transparent = true;
material.alphaMap = texture_alpha;
```

texture_alpha是一张灰度图（只有黑色、白色、灰色），将该纹理作为几何体的alphaMap属性后，纹理中黑色的部分将完全透明，白色的部分将完全不透明，灰色的部分将部分透明。

### side

避免使用 three.DoubleSide，因为渲染双面意味着需要渲染两倍数量的三角形。

## MeshNormalMaterial

法线信息被编码在每个顶点中，每块区域显示什么颜色取决于该区域的法线朝向相对于camera的关系，而每块区域的法线是由顶点的法线插值来得到的。比如对于一个球，球上的每个平面不会只显示一种颜色，而是显示多种颜色，因为每个平面被划分成更小的区域，每块区域都通过插值得到了不同的法线，所以颜色不同，但是“一块区域”的粒度是多大，我不知道。

`flatShading: true` 可以禁用这种插值，使每个平面只显示一种颜色。

## MeshMatcapMaterial

它是一种非常好看又非常节能的材质。使用它的前提是为其提供一个matcap图片：

```js
material.matcap = texture_matcap;
```

这个材质会根据每个区域的法线朝向相对于camera的关系来决定拾取matcap图上的哪个像素的颜色，每个区域的法线朝向通常插值自附近的顶点的法线朝向（原理和MeshNormalMaterial的一样），所以它也有 `flatShading` 属性。

由于matcap图上的颜色有亮有暗，所以最后该材质会呈现出一种具有光照的效果，但这只是一种错觉，实际上光照无法影响该材质，所以无法通过调整光线来改变材质的效果。

## MeshDepthMaterial

这种材质会根据每块区域距离camera的远近来着色，近白远黑。

## Adding a few lights

下面的材质需要光照才能看见。

## MeshLambertMaterial

它是光照材质中性能最佳的材质，缺点是如果仔细观察球状的几何体，就会看到奇怪的图案。

## MeshPhongMaterial

该材质的显示效果非常类似MeshLambertMaterial，不过奇怪图案不太可见了。

- 属性 `shininess`： 值越大，反射越亮
- 属性 `specular` ：反射的颜色

## MeshToonMaterial

卡通风格的材质，默认情况下这种材质只展示2种颜色（一种表示阴影，一种表示光亮），你可以使用 `gradientMap` 属性来控制颜色的阶数。

`gradientMap` 属性接收 texture，这种texture是渐变贴图，用来控制颜色渐变的阶数，这种材质的 `minFilter` 和 `magFilter` 必须被设置为 `three.NearestFilter` （否则会失去卡通效果）。

```js
texture_gradient.minFilter = three.NearestFilter;
texture_gradient.magFilter = three.NearestFilter;
texture_gradient.generateMipmaps = false; // minFilter选用了NearestFilter，就可以省去Mipmapping了！
material.gradientMap = texture_gradient;
```

texture_gradient 是一张灰度图，比如这张图只有5个像素（1行5列），这5个像素从左向右灰度值逐级递增。

## MeshStandardMaterial

这种材质是PBR的，PBR是指 physically based rendering（基于物理的渲染），这种材质更接近真实效果，并且拥有 `roughness` 和 `metalness` 来控制粗糙度和金属相似度。

它被称为 standard 是因为 PBR 正在成为各种软件和库用来制作仿真材质的标准。

- `roughness` ：粗糙度，[0, 1] ，0表示镜面反射，1表示完全漫反射。如果有roughnessMap，则每个像素上的粗糙度是roughness和roughnessMap（映射到该像素上的值）的乘积。

- `metalness` ：金属相似度，[0, 1] ，0表示非金属材质比如木材石材，1表示金属，之间之表示生锈金属。如果有metalnessMap，则每个像素上的金属相似度是metalness和metalnessMap（映射到该像素上的值）的乘积。

- `roughnessMap` ：粗糙度贴图，使用该贴图的绿色通道

- `metalnessMap` ：金属相似度贴图，使用该贴图的蓝色通道。

- `aoMap` ：环境遮挡贴图（ambient occlusion map），使用该贴图的红色通道。该贴图用于控制细节处的阴影，比如有一张图，描述一个门，门缝隙部分的红色通道值低，将该贴图作为 aoMap 后，门缝位置的像素的颜色更深，这加深了门缝像素与周边像素的对比度，就可以勾勒出一种不平坦的效果，显得门缝更真实。

  使用 aoMap 之前，必须提供 `uv2` 坐标，uv2坐标用来辅助几何体标定（放准确）该贴图。一种偷懒的创建uv2的方式是：把uv赋值给uv2：

  ```js
  geometry.setAttribute("uv2", new three.BufferAttribute(geometry.attributes.uv.array, 2));
  ```

- `aoMapIntensity` ：控制 aoMap 的强度，默认1，0代表不遮挡。

- `displacementMap` ：位移贴图。通过移动顶点来创建浮雕，被移动的顶点也可以投射阴影，遮挡其它对象。

  ```js
  material.displacementMap = texture_height;
  ```

  它的运作原理是，mesh 的所有顶点会被映射为位移贴图中的像素，根据该像素的值来决定位移的程度（白色位移最多，黑色无位移）。如果 mesh 的顶点数量很少，哪怕使用了位移贴图也无法制造浮雕效果，因为缺少创建浮雕的顶点，比如：

  ```js
  new three.PlaneGeometry(1, 1, 1, 1);     // 只有4个顶点，使用位移贴图也无法创造浮雕
  new three.PlaneGeometry(1, 1, 100, 100); // 顶点丰富，使用位移贴图可以创造较精细的浮雕
  ```

- `displacementScale` ：位移贴图的位移程度，默认为1（使用displacementMap后才有效）

- `displacementBias` ：位移贴图的初始偏移量，默认为0（使用displacementMap后才有效）

- `normalMap` ：法线贴图。使用RGB通道。它不会改变形状，而是改变表面的法线方向，进而改变光照效果。比如对于一扇门，改变门缝处的法线，使门缝反射光线的方向不一样，可以让门缝更加真实，否则如果门缝和门板反射光线的方向一致，门缝就会很假。而且使用了 `displacementMap` 后，隆起部分的法线方向和隆起之前是一样的，这会导致隆起部分的反光和非隆起部分的反光是一样的，这就很假，所以更需要使用normalMap来改变隆起部分的反光。

- `normalScale` ：法线贴图的影响程度，范围是[0, 1]，默认值是 new Vector2(1, 1)

- `alphaMap` ：略

## MeshPhysicalMaterial

和 MeshStandardMaterial 差不多，不过它额外支持一个透明图层效果，类似于表面再覆盖一层透明玻璃。

示例：https://threejs.org/examples/#webgl_materials_physical_clearcoat

## PointsMaterial

## ShaderMaterial and RawShaderMaterial

可以创建专属material

## Environment map

`envMap` ：环境贴图，是多种材质都有的一种属性。环境纹理是场景周围事物的图像，使用环境纹理作为贴图可以让物体表面反射出周围场景的图像。

```js
const material = new three.MeshStandardMaterial();

material.metalness = 1; // 金属相似度拉满
material.roughness = 0; // 镜面反射
```

环境纹理不是普通的图像，而是立体环境图像（cube environment map），立体环境图像由6张普通图像组成，每张图像对应环境的一个侧面，6张图像组成一个方体cube。

只能使用 CubeTextureLoader 来创建立体环境纹理：

```js
const loader = new three.CubeTextureLoader();
const texture = loader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png"
]);

material.envMap = texture;
```

此外，scene也可以使用立体环境纹理来创建包围盒：

```js
scene.background = texture_env;
```

## Where to find environment maps

① 可从该站下载 HDRI ：https://polyhaven.com/ （Free\HDRI\Model\Texture）

② 分割 HDRI ：https://matheowis.github.io/HDRI-to-CubeMap/ ，可将 .hdr 格式的 HDRI 分割成 cubemap

③ 分割 cubemap：自己使用图像编辑工具将 cubemap分割成6张图像

④ 使用：使用 CubeTextureLoader 与 6 张图像来创建 envMap 所需的纹理



HDRI：高动态范围图像（High Dynamic Range Imaging），它相比普通图像包含更多的数据与更大的亮度范围，它能呈现更真实的结果，但它不是 cubemap，也不一定是全景图。由该站下载的 HDRI 是.hdr或.exr文件。



# 13 - 3D Text

## 字体文件

需要提供 JSON 格式的字体文件，你可以通过[它](http://gero3.github.io/facetype.js/)来将普通的字体转换为 JSON 字体文件。three.js 包内也提供了 JSON 字体文件，见 `three/examples/fonts/...` 文件夹。

## Demo

```js
import { FontLoader } from "FontLoader.js";
import { TextGeometry } from "TextGeometry.js";

const loader_font = new FontLoader();

loader_font.load(
	"helvetiker_regular.typeface.json",
    font => {
        
        const text_geometry = new TextGeometry(
        	"Hello Three.js",
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03, // 会影响居中
                bevelSize: 0.02,      // 会影响居中
                bevelOffset: 0,
                bevelSegments: 5,
            }
        );
        const text_material = new three.MeshBasicMaterial();
        const text = new three.Mesh(text_geometry, text_material);
        
    },
);
```

## Bounding

bounding 用于记录 geometry 占据了多大的空间，有 box 和 sphere。three.js 使用 bounding 来判断物体是否位于视野范围内，如果不在视野范围内，就不会渲染它们，这被称为 “视锥体剔除”。

three.js 默认使用 sphere bounding。

geometry的 boundingBox 和 boundingSphere 的默认值都是 null，如果要用，就要先调用 compute... 方法去计算。

## 居中

我们使用 box bounding 来居中 text，使用之前必须先计算出它：

```js
text_geometry.computeBoundingBox();
```

然后使其居中（移动geometry比移动mesh好的多）：

```js
text_geometry.translate(
	-(text_geometry.boundingBox.max.x - 0.02) * 0.5, // 需要减去 bevelSize 的值
    -(text_geometry.boundingBox.max.y - 0.02) * 0.5, // 需要兼续 bevelSize 的值
    -(text_geometry.boundingBox.max.z - 0.03) * 0.5, // 需要减去 bevelThickness 的值
);
```

另一种快捷的居中方法：

```js
text_geometry.center();
```



# 14 - Go live



# 15 - Lights

## AmbientLight

如果只使用 AmbientLight ，则会得到和使用 MeshBasicMaterial 一样的效果，因为几何体的每个面都受到了同样的光照。

现实中，背光面不完全是黑的，因为光线的反射最终照射到了背光面。但是 three.js 不支持光线反射（因为性能原因），所以通常用 AmbientLight 来模拟环境中的漫反射。

## DirectionalLight

## HemisphereLight

半球光

```js
new three.HemisphereLight(sky_color, ground_color, intensity);
```

场景中所有面向 sky 的面将被 sky_color 颜色的光照射，面向 ground 的面将被 ground_color 颜色的光照射。

半球光的照射距离是无限的，半球光是不能旋转的，Y 轴永远是垂直于 sky 面和 ground 面，不过可以设置 sky 在上（+Y）还是在下（-Y）。默认情况下，半球光的 position 是 (0, 1, 0)，它的 sky 在 +Y， ground 在 -Y。

## PointLight

点光源，它的体积无限小，向所有方向均匀的照射。

默认位置在 （0,0,0)，默认情况下它的照射距离是无限远且强度永不衰减，可以用 `distance` 和 `decay` 来控制。

> 我不知道衰减是如何计算的。

## RectAreaLight

该光源就像方向光和漫反射光的混合物，就像拍摄场地的曝光灯，比如：

```js
new three.RectAreaLight(0xff0000, 1, 1, 1);
```

这是一个 1×1 的正方形灯，它的几何中心默认是 （0,0,0)，它面朝 -Z 方向，只有在它前方的物体会被照射到，后方的物体不会被照射到。

它的照射方向不只是 -Z，位于 (0, 1, -1) 也会被照到，所以它就像曝光灯。

它的光照会衰减，沿着方向衰减，比如(0, 1, -1) 接收到的光比 (0, 2, -1) 的更多。还有沿着距离衰减，比如(0, 1, -1)接收到的光比 (0, 1, -2)的更多，但是没有接口可以设置衰减。

它支对 MeshStandardMaterial 和 MeshPhysicalMaterial 有效。

## SpotLight

聚光灯，形似圆锥体，参数列表如下：

- color：颜色
- intensity：强度
- distance：距离
- angle：圆锥体的张角，最大值是 Math.PI / 2
- penumbra：光影边缘的模糊程度，默认值是0（边缘锐利）
- decay：衰减

聚光灯的方向是从它的位置朝向 `target` 的位置， `target` 的默认位置是 (0, 0, 0) 。target 是一个 Object3D，不过它还没有被添加进场景，所以如果想要改变聚光灯的朝向，就必须将 target 添加进场景，然后改变target 的 position。

```js
spot_light.target.position.set(0, 0, 1);
scene.add(spot_light.target);
```

## Performance

light 会带来很多性能负荷，因为它会使 GPU 进行很多额外的计算，比如面到光的距离，面朝向光的程度，面是否在聚光灯内......

尽可能少使用光源，尽可能使用能耗低的光源，光源能耗排行：

- 低消耗：AmbientLight、HemisphereLight
- 一般消耗：DirectionalLight、PointLight
- 高消耗：SpotLight、RectAreaLight

## Baking

Baking 是指将光源对物体的core shadow效果集成进纹理中，让纹理自带core shadow效果，这样就可以减少使用光源，Three.js journey 首页的模型采用了 baked light。这样做的缺点是core shadow效果是固定死的。

需要借助 3D 软件来实现 Baking。

## Helpers



# 16 - Shadows

## Core shadow and Drop shadow

- `core shadow` ：发生在物体自己表面上的阴影。
- `drop shadow` ：投射到另一个物体表面上的阴影。

## How it works

We won't detail how shadows are working internally, but we will try to understand the basics.

When you do one render, Three.js will first do a render for each light supposed to cast shadows. Those renders will simulate what the light sees as if it was a camera. During these lights renders, [MeshDepthMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshDepthMaterial) replaces all meshes materials.

The results are stored as textures and named shadow maps.

You won't see those shadow maps directly, but they are used on every material supposed to receive shadows and projected on the geometry.

Here's an excellent example of what the directional light and the spotlight see: https://threejs.org/examples/webgl_shadowmap_viewer.html

## How to activate shadows

第一步：

```js
renderer.shadowMap.enabled = true;
```

第二步：如果物体可以对他人制造drop shadow，则激活它的 `castShadow` 属性。如果物体可以接收drop shadow，则激活它的 `receiveShadow`。

```js
sphere.castShadow = true;
plane.receiveShadow = true;
```

最后一步：激活光源的 `castShadow` 属性，目前只有3种光源可以投射出 drop shadow 

- `PointLight`
- `DirectionalLight`
- `SpotLight`

```js
directional_light.castShadow = true;
```

## Shadow map optimizations

### Render size

在《How it works》中讲述了three.js为每个光源都制造了 shadow maps，你可以通过 Light 的 `shadow`属性来控制它。

默认情况下，shadow map的尺寸是512*512（性能考虑），增大这个尺寸可以让drop shadow更细腻，但是要确保宽高是2的幂，比如：

```js
directional_light.shadow.mapSize.width = 1024;
directional_light.shadow.mapSize.height = 1024;
```

### The camera of the shadow

`DirectionalLight`的阴影相机是1个`OrthographicCamera`

`SpotLight`的阴影相机是1个`PerspectiveCamera`

`PointLight`的阴影相机是1个 `PerspectiveCamera` ，其它两个光源的阴影相机只会计算一次shadow maps，但是点光源的阴影相机会计算6次shadow maps，因为点光源可以向所有方向制造drop shadow。three.js让阴影相机看向6个方向，来实现覆盖全方向，这6个方向是上下左右前后，阴影相机的垂直和水平张角都是45°（视锥体是四棱锥），这样子6次阴影相机刚好组成一个cube，覆盖了所有方向。查看PointLight的camera时会发现camera的朝向是向下的，因为6次观看中最后一次是看向下方。

显然，使用PointLight来制造drop shadow是最耗费性能的，因此尽可能减少使用开启了`castShaodw`的PointLight。

### Near and far

three.js使用camera来模拟光的照射，camera看得见的部分是向光面，看不见的部分就是背光面。既然光源内部使用了camera，那自然可以修改camera的属性，比如 `near` 和 `far` 。

> 光源的光的照射范围 和 光源可以cast shadow的范围是不一样的，使用LightHelper和CameraHelper来看看就知道了。有些地方光线照射到了，但是不会计算drop shadow。

使用 `near` 和 `far` 不能改善drop shadow的质量，只能debug，比如为什么这个地方光明明照到了却没有drop shadow，又比如为什么这个物体的drop shadow忽然被截断了？

### Amplitude

是指相机的视野范围。缩小视野范围可以让阴影更细腻，因为`mapSize`的分辨率不变，而纹理尺寸变小了，则纹素密度就增大了。

对于`DirectionalLight`，因为相机是`OrthographicCamera`，所以要通过`top`、`right`、`bottom`、`left`来调整范围。

```js
directional_light.shadow.camera.top = 2;
directional_light.sahdow.camera.right = 2;
directional_light.shadow.camera.bottom = -2;
directional_light.shadow.camera.left = -2;
```

### Blur

```js
directional_light.shadow.radius = 10;
```

`three.PCFSoftShadowMap`不支持`radius` 

> 我猜：它好像是通过滤波来实现模糊效果的，比如对shadow map做一个10*10的均值滤波，那么锐利的边缘就会变模糊了。

### Shadow map algorithm

- `three.BasicShadowMap` ：性能最好，质量最差
- `three.PCFShadowMap`：性能稍差，边缘平滑（默认算法）
- `three.PCFSoftShadowMap`：性能稍差，边缘柔和（指浅浅的blur效果）
- `three.VSMShadowMap`：性能稍差，more constraints, can have unexpected results

```js
renderer.shadowMap.type = three.PCFSoftShadowMap;
```

## 重叠的阴影

three.js中，如果有2个阴影重叠在一起，那么重叠区域的阴影的颜色是2个阴影颜色之和。但是在真实世界里，重叠区域的阴影的颜色是2个阴影中较深的颜色。

这是一个缺陷，目前无法解决。

## 阴影相机范围小于光照范围

drop shadow是借助阴影相机来制造的，阴影相机所覆盖的范围小于光照所能覆盖的范围。

## Baking shadows

这里的Baking shadows和《15-Lights》中的Baking是同一种技术，只不过这个Baking是将drop shadow集成进开启了`receiveShadow`的物体的纹理中，《15-Lights》的Baking是将core shadow集成进物体自己的纹理中。

Baking的好处当然是节省性能，坏处是Baking shadows不能自动跟随物体运动，如果要它跟随物体运动，我们就要手动控制这个Baking shadows。

# 17 - Haunted house

添加一个雾：

```js
// 第一步
const fog = new three.Fog(0x262837, 1, 15);
scene.fog = fog;

// 第二步
scene.background = new three.Color(0x262837);
```

可以通过 `renderer.setClearColor(0x262837);` 来替代 `scene.background = new three.Color(0x262837)`，他俩是一样的。

如果只做第一步，那么就只能看见物体变模糊，但是看不见雾本身，只有加了第二步才能看见飘在空中的雾。

> Issuse: [WebGLRenderer: Difference between Scene.background and setClearColor() #22340](https://github.com/mrdoob/three.js/issues/22340)



# 18 - Particles

