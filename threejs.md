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

像素比是指：软件上的一个像素对应屏幕上的多少个物理像素，即逻辑分辨率与物理分辨率的比率，比如像素比2是指软件上一个像素对应物理上2×2个像素。

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

> 只有当 `magFilter: three.NearestFilter` 时，这种卡通风格才会生效，因为gradient.jpg是一张只有几个像素的图片，将该图像生成纹理并应用至物体上，就属于是“纹理小于平面时，如何放大纹理使其完全覆盖平面”的情况，three.NearestFilter就是放大算法的其中一种，如果选用这种滤波，放大后得到的纹理就会是类似于像素风的纹理，颜色界限分明，但是如果选用其他算法，放大的过程中就会插值出许多中间颜色，最后贴到表面上后就会出现颜色渐变的效果，这就是为什么不使用这种算法就无法得到卡通效果的原因。 
>
> 至于为什么要令 `minFilter: three.NearestFilter`，是因为 minFilter 控制的是当“纹理大于平面时，如何缩小平面使其完全覆盖平面”的情况，这个过程中会使用mapping技术，他会创建很多不同规格的纹理，很显然，卡通风的材质不需要考虑纹理大于平面的情况，所以可以禁用mapping，这可以降低一点点性能负荷，而禁用mapping的方法就是 `minFilter: three.NearestFilter` 。

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

> Diffuse/Albedo/Basecolor 漫反射
>
> Reflection/Specular 反射
>
> Metalness 金属度
>
> Glossiness 光泽度
>
> Roughness 粗糙度
>
> Normal 法线
>
> Displacement/Height 置换
>
> Bump 凹凸
>
> Ambient Occlusion 环境光遮蔽



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

> 这一节有好多都弄不懂，比如depthTest、depthWrite、blending，如果你要写粒子，请还是参照原教程去写吧！

## Introduction

西蒙：The downside is that each particle is composed of a plane (two triangles) always facing the camera.（缺点是每个粒子都由一个始终朝向相机的平面组成，而一个平面由2个三角形组成）。

## Sphere particles

使用Three.js内建的Geometry可以快速的创建几何体的粒子效果，比如使用粒子来显示球体的每个顶点：

```js
const geometry = new three.SphereGeometry(1, 32, 32);
const material = new three.PointsMaterial({size: 0.02});
const particle = new three.Points(geometry, material);
```

以前我查看内建的Geometry的position属性的时候，以为内建的Geometry有很多多余的点，直至看到这个粒子球才发现，没有顶点是多余的。

![image-20211202100055306](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211202100055306.png)

## Custom Particles

创建一个粒子群也非常简单：

```js
// Geometry
const geometry = new three.BufferGeometry();

const count = 5000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < positions.length; i++) positions[i] = (Math.random() - 0.5) * 10;

geometry.setAttribute("position", new three.BufferAttribute(positions, 3));

// Material
const material = new three.PointsMaterial({size: 0.02});

// Particle
const particle = new three.Points(geometry, material);
```

当粒子的数量非常非常多时，比如 `count = 500000` ，就会看到所有粒子描摹出一个正方体的形状。

![image-20211202100714859](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211202100714859.png)

## Color, map and alpha map

对 `PointsMaterial` 应用[粒子纹理](https://www.kenney.nl/assets/particle-pack)可以让粒子做出火、烟、星、心、火花、电、魔法等的效果。

具体见教程。

使用粒子纹理会带来一些遮挡问题，具体见教程的描述，下面是解决这些问题的手段，每种手段都是独立使用的，没有混在一起用：

### using alphaTest

```js
new three.PointsMaterial({alphaTest: 0.001});
```

`alphaTest` 属性可以让 WebGL 根据像素的透明度来选择性的渲染。 `alphaTest` 的属性值属于 `[0, 1]`，比如 `alphaTest = 0.001`，如果某个像素的透明度小于0.001，WebGL就不会渲染这个像素。

`alphaTest` 要结合  `alphaMap` 一起使用，因为后者能控制每个像素的透明度。

### using depthTest

`Material` 实例有一个名为深度测试的属性 `depthTest` ，默认值为 `true` 。

> https://zhuanlan.zhihu.com/p/151649142
>
> 深度：
>
> 我们来了解下 webgl 中的深度到底是怎么回事儿，首先 webgl 中，深度会存储在 depth buffer 中，它和普通的颜色缓冲一样，只是存储的是深度值而已。深度值的精度一般有16位、24位和32位float，比较常用的深度精度为24位。
>
> 深度测试：
>
> 片元在绘制过程中，会将像素的深度值与当前深度缓冲区中的值进行比较，如果大于等于深度缓冲区中值，则丢弃这部分;否则利用这个像素对应的深度值和颜色值，分别更新深度缓冲区和颜色缓冲区。这一过程称之为深度测试(Depth Testing)

禁用材质的深度测试可以很好的解决粒子纹理的遮挡问题，但他也会引发新的问题，比如：

![image-20211204010310782](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211204010310782.png)

### using depthWrite

禁深度写入就可以解决上述问题了，禁用深度写入后该材质就不会再更新深度缓冲区。

### Blending

```js
material.blending = three.AdditiveBlending;
```

如此设置后，在渲染某个像素的颜色时，不只是单纯的擦除原颜色，绘制新颜色，而是将新旧颜色叠加在一起，叠加后的颜色看起来更饱和，饱和的极限是白色。

![image-20211204165545482](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211204165545482.png)

不过，这种效果会增加性能负荷。

而且，它还会带来透明效果！前面方体遮挡了后面的方体，重叠区域的颜色饱和度更高，最终看起来就像是透过前面的方体看见后面的方体。

实际上，非重叠区域的颜色值和禁用 `blending` 时方体的原本的颜色值是一样的，所以这种透视效果是由于颜色叠加得到的。

![image-20211205210137804](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211205210137804.png)![image-20211205210516681](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211205210516681.png)

### vertexColors（顶点着色）

使用顶点着色可以使每一个粒子都呈现不同的颜色，但又可以保持只使用一个材质。

```js
// 顶点的数量
const count = 20000;

// 创建顶点的坐标和颜色（坐标由xyz组成，颜色由rgb组成，所以它们都需要count*3次迭代）
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
    
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random(); // r,g,b的值∈[0, 1]
    
}

// Geometry
const geometry = new three.BufferGeometry();
geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
geometry.setAttribute("color", new three.BufferAttribute(colors, 3));

// Material
const material = new three.PointsMaterial();
material.vertexColors = true; // 激活顶点着色
```

注意，material的color是主颜色，每个顶点最后呈现的颜色是顶点颜色和主颜色相乘的结果，如果把主颜色设置为黑色，则每个顶点就都是黑色了。

### Animate

可以通过改变 position 属性来控制单个粒子的运动，也可以通过对整个粒子的 object3D实例实施运动。

如果要改变position，则一定要用needsUpdate，对attributeBuffer的改变才能生效。

```js
geometry.attributes.position.needsUpdate = true;
```

当然，不断地更新position属性会带来性能负荷，如果粒子的数量非常多，几万？几十万？那这种负荷就会很大，因为每帧都要重新计算每个粒子的位置。

# 19 - Galaxy Generator

星系粒子特效很棒，但是其中的数学不太懂。



# 20 - Raycaster

```js
const ray_origin = new three.Vector3(-3, 0, 0);
const ray_direction = new three.Vector3(1, 0, 0).normalize();

const raycaster = new three.Raycaster();
raycaster.set(ray_origin, ray_direction);

const intersect = raycaster.intersectObject(object3d); // [...]
const intersects = raycaster.intersectObjects([object_1, object_2]); // [...]
```

## 为什么 `intersectObject` 方法可以碰撞出2个结果？

ray可以多次穿过同一个几何体。如下所示，ray两次穿过环面，绿色部分是相交的结果。

在我自己的demo中，测试发现，当ray穿过2个face的交界线时，会产生”ray穿过一次几何体可以获得2个碰撞结果“的现象。

![image-20211206233814574](C:/Users/Lenovo/AppData/Roaming/Typora/typora-user-images/image-20211206233814574.png)

## 返回值

- `distance` ray的origin到碰撞点的距离
- `face` ray与geometry发生相交处的face
- `faceIndex` face的index
- `object` 相交的物体
- `point` 相交点的确切坐标
- `uv` 相交点在geometry上的uv坐标

## 标准化设备坐标系

屏幕设备坐标系的原点是左上角，X轴正方向是水平向右，Y轴正方向是垂直向下，x∈[0, 1920]，y∈[0, 1080]。

标准化设备坐标系的原点是屏幕的几何中心，X轴正方向是水平向右，Y轴正方向是垂直向上，x∈[-1, 1]，y∈[-1, 1]。

> window.clientX∈[0, 1919]，window.clientY∈[0, 1079]。
>
> 这意味着，根据屏幕设备坐标系来换算标准化设备坐标系时，只有这么算才能得到[-1, 1]的x和y，three.js官网的方法是不对的。
>
> ```js
> window.addEventListener("mousemove", event => {
>     x = (event.clientX / (window.innerWidth - 1)) * 2 - 1;
> 	y = - (event.clientY / (window.innerHeight - 1)) * 2 + 1;
> });
> ```
>
> 



# 21 - Scroll based animation

当页面下滑时，三维场景的几何体将会发生某些特定的动作，这就是本章节将要做的内容。

## 小心弹性滚动

为了实现这种效果，需要将three.js的canvas铺满屏幕，但是要小心 `弹性滚动` 特性。在某些浏览器环境中，当页面的滚动超出了极限时，页面会稍稍突破极限然后弹回来，由于canvas的场景通常是黑色的，而弹性滚动时，极限以外的部分会露出页面自己的颜色（就是body元素的颜色），如果页面的颜色是白色，那就会看到穿帮。

为了解决这个问题，要么将body元素的颜色设置的和 `renderer` 的 `clearColor` 属性一样的颜色，要么激活 `renderer` 的 `alpha` ，第二种方案酷多了，第二种方案下canvas的背景是透明的，可以直接看到canvas之下的dom元素的样式。

> `renderer.clearColor()` ：three.js 官方文档描述它是一种清除颜色缓存的方法，它的意思大概是某块像素上没有物体了，那就清除这块像素的颜色，由于canvas不是透明的，所以像素会有一个初始颜色，这个初始颜色默认是黑色。通过`setClearColor`可以设置这个初始色。

```js
const renderer = new three.WebGLRenderer({
    canvas: canvas,
    alpha: true
});
```

实际上，`renderer` 的 `alpha` 的具体含义是“是否激活 `clearAlpha`”。`clearAlpha`是初始色的透明度，由于 `clearAlpha` 的默认值是 `0` ，所以一旦激活它，初始色就会是全透明。你可以通过 `setClearAlpha` 和 `getClearAlpha` 来操控他。

```js
renderer.getClearAlpha();
renderer.setClearAlpha(1); // 入参是一个 [0, 1] 的数
```

## Scroll（滚动）

下拉页面，几何体会从下方开始入场，上拉页面，几何体会从上方入场。这种效果需要根据 `window.scrollY` 和 `camera.position.y` 来实现，也需要为 `window` 绑定 `scroll` 事件。

## Parallax（视差）

视差效果是指：当鼠标左移，几何体将右移（camera左移）；鼠标上移，几何体下移（camera上移），右下同理，这种视差效果可以增加页面的趣味性。

这种效果需要根据`window.clientX` 和 `window.clientY` 和 `camera.psotion`的x和y来实现，也需要为 `window` 绑定 `mousemove` 事件。

```js
const cursor = {x: 0, y: 0};

window.addEventListener("mousemove", event => {
    
    cursor.x = event.clientX / (window.innerWidth - 1) - 0.5;  // ∈[-0.5, 0.5]
    cursor.y = event.clientY / (window.innerHeight - 1) - 0.5; // ∈[-0.5, 0.5]
    
});

window.requestAnimationFrame(function loop(){
    
    window.requestAnimationFrame(loop);
    
    camera.position.x = cursor.x * amplitude;   // amplitude是振幅，用它来控制偏移的剧烈程度
    camera.position.y = - cursor.y * amplitude; // amplitude是振幅，用它来控制偏移的剧烈程度
    
});
```

### Easing

上述实现的视差效果很机械很生硬，因为几何体的移动是瞬时完成的，没有惯性的感觉，而几何体在真实世界中的运动是具有惯性效果的。使用easing可以让视差效果更生动。

一种很巧妙的easing实现方式是：假设camera.position.x要从0移动至10，则第一帧的时候移动相差距离的1/10，第二帧移动剩余的相差距离的1/10，...，以此类推。这种实现的效果是，几何体永远在无限接近目标位置，而且离目标位置越近移动就越慢，它是一种直出缓停的效果，而不是普通的easing（缓出缓停）。

```js
window.requestAnimationFrame(function loop(){
    
    window.requestAnimationFrame(loop);
    
    camera.position.x += (cursor.x - camera.position.x) * 0.1;
    camera.position.y += (- cursor.y - camera.position.y) * 0.1;
    
});
```

> 由于 camera 在 scroll 的实现中，已经需要根据页面滑动的程度来改变camera.position.y了，那么在实现parallax（尤其是加了easing）时就会很麻烦，因此一种做法是：
>
> ```js
> const camera_group = new three.Group();
> const camera = new three.PerspectiveCamera();
> camera_group.add(camera);
> ```
>
> 然后再camera_group上控制scroll，在camera上控制parallax，camera最后的位移是两者位移的累加，这样子可以更好的分别控制2种特效。

### 消除帧率对easing的影响

easing的运动是逐帧完成的，如果每帧的运动量是相同的，在不同刷新率的环境下，几何体的运动速度就会不同，因此需要消除这个bug。

```js
const clock = new three.Clock();
let previous_time = 0;

window.requestAnimationFrame(function loop(){
    
    window.requestAnimationFrame(loop);
    
    const elapsed_time = clock.getElapsedTime();
    const delta_time = elapsed_time - previous_time;
    
    previous_time = elapsed_time;
    
    camera.position.x += (cursor.x - camera.position.x) * 0.1 * (delta_time * 50);
    camera.position.y += (- cursor.y - camera.position.y) * 0.1 * (delta_time * 50);
    
});
```

> elapsed_time的单位是秒，所以delta_time的值很小，60FPS中只有0.016，因此需要乘50，让他变大，否则就会运动的很慢。不过运动的很慢也可以制造一种外空漂浮的感觉。



# 22 - Physics

2D物理库比3D物理库更加高效，如果你想要实现的物理效果可以被抽象成2D运动，那么就使用2D物理库吧！

有哪些2D和3D的物理库呢？去看three.js journey，不过当下最流行的3D物理库是 Ammo.js。

西蒙在本节课中使用了 Cannon.js ，该库需要我们提供一个时间步长，我以为可以使用 `getDelta()` 方法（ 来自 `Clock` ），但是西蒙却说不要使用它，你用它是得不到预期结果的，应该使用 `gteElapsedTime()` ，自己用当前的 `elapsed_time` 减去上一帧的 `elapsed_time` 来手动计算时间步长。

> `getDelta` 到底发生了什么问题呢？

## Broadphase

如果想要测试物体之间的碰撞，最容易想到的办法就是计算每个物体和每个物体的是否碰撞，但是这样的计算很耗费计算资源。

Broadphase 是指在测试所有物体的碰撞之前，现对物体进行粗略的分类，再计算物体的碰撞，这样子计算更高效。Broadphase 可以剔除掉某些浪费的计算，比如如果有两堆距离很远的物体，很显然他们是不会发生碰撞的，所以根本就不需要计算它们的碰撞。

在 cannon.js 中有 3 种 broadphase 算法：

-  `NaiveBroadphase` ：计算每个物体与每个物体之间的情况
-  `GridBrodphase` ：将世界格网化，然后只计算每个格网内的物体与物体之间的情况，以及相邻两个格网之间的物体和物体之间的情况。（PS：我不懂诶！这样不就完全等于 `Naivebroadphase` 了吗？）。
-  `SAPBroadphase` ：（原文） (Sweep and prune broadphase): Tests Bodies onn arbitrary axes during multiples steps.

cannon.js 默认使用 `NaiveBroadphase` ， 西蒙推荐使用 `SPABroadphase` ，这个算法有可能会发生 BUG ，比如明明应该发生碰撞的时候却没有发生，不过这个 bug 很罕见，只在物体快速移动的时候比较容易出现，而且这个算法性能更好。

如何切换算法呢？

```js
world.broadphase = new cannon.SAPBroadphase(world);
```

## Sleep

哪怕使用了更高效的 Boardphase 算法，但是有些本可不用参与碰撞测试的物体还是参加了， Sleep 可以让 cannon.js 在进行碰撞测试时，忽略那些静止或几乎静止的物体，不对他们进行碰撞测试，除非代码对它们施加了力或被别的物体碰撞了，它们才会参与碰撞测试。（我的他妈搞不懂这到底是什么意思？又是怎么办到的？）

如何激活 Sleep 特性呢？

```js
world.allowSleep = true;
```

## Event

我们可以监听发生在物体上的事件，比如 `colide` 、 `sleep` 、 `wakeup` 事件。这通常很有用，比如我们可以通过监听碰撞事件，来在物体碰撞时播放碰撞声。

### 模拟碰撞音

我们通过创建一段音频并播放它来模拟碰撞时发声：

```js
const hit_sound = new Audio("hit.mp3");

function playHitSound() { hit_sound.play() }
```

然后我们为物体绑定碰撞事件，来让他在碰撞时播放碰撞音乐：

```js
body.addEventListener("collide", playHitSound);
```

现在，当这个物体与别的物体发生碰撞的时候，我们就可以听到碰撞的声音了。

### 优化碰撞音的频率

如果我们为所有物体都绑定了碰撞音，这个时候会发生一件很不自然的事情。

如果我们为所有的物体都绑定了同一个 `Audio` 实例，那么当某一瞬间发生大量碰撞的时候，也只会播放一次该 `Audio` 实例的音乐。这会导致，哪怕大量的碰撞在同一时刻发生，但是同一时刻也只能听见一声碰撞。一种稍微有点用的解决方法就是：

```js
function playHitSound() {
  
		hit_sound.currentTime = 0;
  	hit_sound.play();
  
}
```

这样，在每次播放碰撞音之前，就会立即结束上一次碰撞音，开始这一次碰撞音。这样子稍微有了改善，可以听到更密集的碰撞声了，但是碰撞声的播放仍旧是排队着一个一个播放的......如果你给每个物体都单独使用一个 `Audio` 实例，就可以解决了，不过性能更差。

### 优化碰撞音的响度

通过下述 API 可以获取碰撞的强度

```js
function playHitSound(collision) {

		const impact_strength = collision.contact.getImpactVelocityAlongNormal();

  	if（impact_strength < 1.5）return; // 若碰撞强度太低，则不播放碰撞音
  
  	hit_sound.volume = Math.random(); // 随机音量（0静音，1全音）
  	hit_sound.currentTime = 0;        // 终止上一次音乐
  	hit_sound.play();                 // 播放

}
```

`impact_strength` 是碰撞的强度，是一个 `Number` 类型的值。

## Worker

cannon.js 和 three.js 是运行在 JS 主线程上的，那么它们当然就有可能导致阻塞，比如单次任务执行时间过长，导致页面卡顿。

使用 Worker 来分担 cannon.js 和 three.js 的任务是一件很重要的事情。这有一个使用了 Worker 来制作 cannon.js 和 three.js 的[例子](https://schteppe.github.io/cannon.js/examples/worker.html )。

## 删除物体

删除物体的时候，要记得删除 three 世界的物体、物理世界的物体、还有物体上的事件：

```js
// 解绑事件
body.removeEventListener("collide", playHitSound);

// 移除物理世界的物体
world.removeBody(body);

// 移除three世界的物体
scene.remove(mesh);
```

## Cannon.js

cannon.js 自 2015 年开始就停止维护了，有些人分叉了它并继续更新和维护，即 [cannon-es](https://github.com/pmndrs/cannon-es) ，不过它使用 typescript 写的（如果我不使用 babel ，我可以直接用它吗）。

## Ammo.js

Ammo.js比Cannon.js的性能更好，更受欢迎，支持更多功能，有更多的 three.js 配套示例，缺点是更难上手。对了， Ammo.js 具有 We bAssembly 支持。

这里使用 cannon.js 的原因就是因为它更容易实现和理解。

## Physijs

https://github.com/chandlerprall/Physijs

Physijs 是结合了 three.js 和物理引擎的库，缺点是如果你尝试做库不支持的事情，事情就会变得复杂，而且查找错误的来源也可能很麻烦。



# 23 - Imported models

## 模型格式

目前有上百种模型格式，其中最流行的格式是：

-  `OBJ` 
-  `FBX` 
-  `STL` 
-  `PLY` 
-  `COLLADA` 
-  `3DS`
-  `GLTF`

其中 `GLTF` 正在逐渐成为模型格式的标准，它在过去几年开始就变得非常流行，它被各种 3D 软件、游戏引擎、库所支持，这意味着它在不同环境下可以更容易的呈现一致的效果。

 `GLTF` 代表 GL 传输格式（ `GL Transmission Format` ） ，它是由 `Khronos Group` ，这是一个由 OpenGL 、 WebGL 、 Vulkan 、 Collada 、 AMD 、 ATI 、 Nvidia 、 Apple 、 Google 等企业构成的组织。

`GLTF` 格式可以存储非常多的模型数据，比如几何形状、材质、相机、灯光、场景、动画、骨架、形变等等。

 `GLTF` 支持各种数据格式，比如 json 、二进制、嵌入式纹理等。

但是这并不意味着你必须使用 `GLTF` ，相反，如果你的模型仅仅是几何体，你更应该选择 `OBJ` 、 `FBX` 、 `STL` 、 `PLY` 等格式。此外，不同的模型格式不仅仅在体积上有区别，在解压缩的耗时上也有区别，如果可能的话，你可以为你的项目测试同一个模型的不同格式文件，以来确定最合适的格式。

## Find a model

GLTF 团队提供了一些[示例模型](https://github.com/KhronosGroup/glTF-Sample-Models)，有简单或复杂的。

## GLTF formats

虽然 `GLTF` 本身就是一种格式，但是在它之下还有几种不同的文件格式，比如：

-  `glTF`
-  `glTF-Binary`
-  `glTF-Draco`
-  `glTF-Embedded`

除了上述 4 种外，还有更多的 GLTF 文件格式，但是这 4 种是最主要的。如何选择这 4 种格式呢？假如你在导入模型之后，还想要更改模型，那就使用 `glTF` 。假如你不需要更改模型，而且希望模型保持简洁，那就使用 `glTF-Binary` 。其实是可以对 `glTF` 和 `glTF-Binary` 使用 Draco 来压缩数据的。

### glTF

它是默认的 GLTF 模型。示例模型位于 `glTF` 文件夹内，其内含有 3 个文件，分别是：

-  `Duck.gltf` 
-  `Duck0.bin` 
-  `DuckCM.png`

`Duck.gltf` 是 JSON 格式的文件，它包含了各种信息，比如 camera 、 light 、 scene 、 material 、 object transformation 、 geometry 、 texture ......

`Duco0.bin` 是二进制文件，它包含了 geometry 信息，以及和 vertex （顶点）相关的一切信息，比如 UV 坐标、 normal 、 vertex color ......

`DuckCM.png` 是纹理文件。

加载 `glTF` 格式的文件的 时候，只需要加载 `Duck.gltf` 就可以了，因为该文件内部就已经包含了对其他的引用，其他文件会在后续被自动加载进来。

### glTF-Binary

示例模型位于 `glTF-Binary` 文件夹内，其内只有 1 个文件： `Duck.glb` 。

这个文件是二进制文件，它包含了所有所需的数据。这种格式的优点是更简洁，因为只有 1 个文件，缺点是无法轻松改变它的数据，比如你无法调整纹理的大小或压缩纹理，因为纹理数据被写死在了二进制文件中。

### glTF-Draco

[draco](https://github.com/google/draco) 是由 Google 开源的模型压缩算法，它主要压缩与几何相关的数据，它可以处理各种模型格式，并且压缩率很高，比如原本 102kb 的 `Duck.bin` 文件经 draco 压缩后仅有 10kb ！

[glTF Pipeline](https://github.com/CesiumGS/gltf-pipeline) 可以：

1. 将 glTF 转换为 glb ，或者将 glb 转换为 glTF ；
2. 将 buffers 和 textures 保存为单独的文件或嵌入式的文件；
3. 将 glTF 1.0 转换为 glTF 2.0 ；
4. 应用 draco 压缩；

如何加载经过 draco 压缩的 glTF 模型呢？

对于加载普通的 GLTF 模型，使用 GLTFLoader 就行了，对于加载使用了 draco 算法的 GLTF 模型，不光需要使用 GLTFLoader ，还需要为 GLTFLoader 指定 DRACOLoader 。 DRACOLoader 是由 Three.js 提供的 draco 算法的驱动，但是这个驱动本身并不包含解码器（ draco 算法），所以你还需要为 DRACOLoader 加载解码器。 Three.js 提供了这个算法，它就是 `examples/js/libs/draco` 中，具体的加载过程如下：

```js
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders.DRACOLoader.js";

const draco_loader = new DRACOLoader();
draco_loader.setDecoderPath("./node_modules/three/examples/js/libs/draco/");

const gltf_loader = new GLTFLoader();
gltf_loader.setDRACOLoader(draco_loader);
gltf_loader.load(
		"./model/scene.gltf",
    function onSuccess(gltf) { scene.add(gltf.scene) }
);
```

> 注：虽然 `gltf_loader` 已经注入了 draco 解码器，但是不用担心解码器会对加载无压缩的模型产生性能影响，因为解码器只在加载压缩模型时才发挥作用。
>

Three.js 的官方文档中，介绍了如何使用 DRACOLoader 来纯粹的加载模型的 `BufferGeometry` 。而且 draco 解码器可以在 WASM 或 worker 上运行， DRACOLoader 的 `setDecoderConfig` 可以设置解码器是基于 JS 运行还是基于 WASM 运行， `setWorkerLimit` 可以设置解码器最多可以使用几个 worker 。

### glTF-Embedded

这种格式和 `glTF-Binary` 格式差不多，都是只有一个文件，区别是这种格式使用了 JSON ，这让它可以被编辑，当然体积也变大了。

## Add the loaded model to our scene

使用 GLTFLoader 将 `glTF` 格式的模型加载进来之后，这个模型里面包含的东西其实很复杂，它居然包含有一个 PrespectiveCamera ！而且这个相机似乎和模型的缩放、位置、旋转等等有关。

西蒙说，你可以选择把整个包含了模型mesh和相机的scene当成一个group加载进来，也可以单独只加载模型mesh，不过这样好像会导致某些关于旋转、缩放等的问题。

## When to use the Draco compression

draco 的优点是可以明显压缩模型的体积，缺点是：你需要耗费计算资源和时间来加载 DRACOLoader 和 解码器，然后需要花时间去解码压缩文件，这会导致在模型资源加载完成和显示这 2 个步骤中间会有一段停顿，哪怕你使用 WASM 或 worker 也无法改变这个事实。

如果你只有百来 kb 的模型，那就没必要使用 draco 压缩模型了，如果你的模型资源是 MB 级别的，那就有必要使用 draco 了，不过你也要考虑一下「加载停顿」带来的影响。

## Animations

## Three.js editor

[Three.js editor](https://threejs.org/editor/) 是一个在线的轻量的 3D 软件，它好方便啊！甚至还可以导出模型来用！调试的时候快用起来！！！



# 24 - Custom models with Blender

我用 blender 制作了一个汉堡包模型，导出了普通版本和 draco 版本，普通版本 8MB ， draco 版本 741KB。

我使用 gltf-pipeline 对普通版本进行了 draco 压缩，获得了另一个 draco 版本，它更小，是 322KB。无法使用 gltf-pipeline 对已经做过 draco 压缩的模型进行二次压缩。

它们仨都能正常显示。



# 25 - Realistic render

## Lights

three.js 的光源的 intensity 在默认情况下是没有单位的，单纯的 1、2、3 等，激活 WebGLRenderer 的 `physicallyCorrectLights` 模式后，所有光源的 intensity 将使用符合真实的光照的单位，它的定义是：在 physically correct 模式下， color 和 intensity 的乘积被解析为以坎德拉为单位的发光强度，默认值时 -1.0 。

```js
renderer.physicallyCorrectLights = true;
```

## Environment map

材质可以通过使用 `envMap` 属性来模拟对周围环境的反射，使用该技术可以提高模型的真实感。一种思路是，为场景粘贴环境贴图，然后为模型粘贴环境贴图，这让模型看起来就好像真的受到了周围环境的影响，模型的表面似乎就像是受到了周遭环境的光线照射，然后在表面反射出了相应的色泽。这种做法的最大好处就在于给场景增加了一个非常真实的环境光，不同于 ambientLight 那种均匀的环境光，这个环境光是完全根据 scene 的环境贴图来制造的。

示例中，首先使用 `CubeTextureLoader` 导入了环境贴图：

```js
const cube_texture_loader = new three.CubeTextureLoader();
const environment_map = cube_texture_loader.load([
		"px.jpg",
  	"nx.jpg",
  	"py.jpg",
  	"ny.jpg",
  	"pz.jpg",
  	"nz.jpg",
]);
```

然后，给场景粘贴环境贴图：

```js
scene.background = environment_map;
```

最后，给模型粘贴上环境贴图，对于复杂的模型而言，模型会由很多个部分组合而成，那么就需要给每个部分都应用上环境贴图。但是要怎样拿到模型的每个部分呢？直接遍历模型的 children 属性会很麻烦，因为模型的 children 可能还会有 children ，如果要用这种办法就要写深度遍历。简单的解决办法是使用 three.js 的 Object3D 的内建方法 `traverse` ，比如从 scene 开始 traverse 就简单多了：

```js
scene.traverse( child => {

  	// 排除掉场景中的camera和light，它们不需要应用环境贴图
  	// 排除掉场景中的group，它们只是拿来做容器而已
  	// 排除掉不使用MeshStandardMaterial的物体，因为示例中的模型都使用这种材质
		if ( child instanceof three.Mesh === false ) return;
	  if ( child.material instanceof three.MeshStandardMaterial === false ) return;

  	child.material.envMap = environment_map;
  	child.material.envMapIntensity = 2; // 增加强度，可以更清楚的看见效果
  	

} );
```

其实使用 scene 的 `environment` 属性可以一键更换场景中的所有物体的环境贴图，因为 scene 的 `environment` 属性的默认值为 null ，它接受一个 texture 实例，然后它会将场景中所有的物理材质的环境贴图都更换为该实例（如果 MeshStandardMaterial 的 envMap 已经分配了贴图了，则会忽略这个材质）。

这个方法很简洁，但是唯一的缺点是，不能设置环境贴图的强度。

## Renderer

### Output encoding

renderer 的 `outputEncoding` 属性控制渲染编码，默认值是 `three.LinearEncoding` ，它看起来还 ok ，但还不够真实。

如果想让场景渲染的更加真实，推荐使用 `three.sRGBEncoding` ：

```js
renderer.outputEncoding = three.sRGBEncoding;
```

另一个推荐值是 `three.GammaEncoding` ，但是它的上手难度很高，所以本文不介绍/使用它，其实 `sRGBEncoding` 是 `GammaEncoding` 的一种。如果你想了解更多 `GammaEncoding` 可以参看：

- https://www.donmccurdy.com/2020/06/17/color-management-in-threejs/
- https://medium.com/@tomforsyth/the-srgb-learning-curve-773b7f68cf7a

### Textures encoding

原本场景的 environment map 的颜色和图片资源的颜色是一致的，但是在改变了 renderer  的 output encoding 后（改为 `sRGBEncoding` ），就会发现整个场景的颜色都变的更亮的，这意味着场景的 environment map 的颜色出错了（尽管错误的色调看起来还是挺顺眼的......）。

这是由于 renderer 的 `outputEncoding` 更改为了 `sRGBEncoding` 后，环境贴图纹理的输出编码仍然在使用 `LinearEncoding` 。

当改变了 renderer 的输出编码之后，为了修复上述错误，我们还需要相应的修改场景中的纹理的颜色，修改遵循这样一条原则：如果纹理是肉眼可见的，比如 `map` 、 `envMap` 一类，我们就需要将它们的 `encoding` 改成 renderer 的 `outputEncoding` ，其余的纹理则继续使用 `LinearEncoding` 就好了。

```js
environment_map.encoding = three.sRGBEncoding;
```

从外部导入的模型，它们往往也会使用一些肉眼可见的纹理，按理来说也要改变这些纹理的 `encoding` ，不过好消息是 `GLTFLoader` 帮我们做好了这些事情，尽管我不知道他具体怎么实现的，但它就是会自动的让纹理拥有正确的 encoding 。

### Tone mapping

 `toneMapping` 属性用于控制色调映射，它用来将 HDR （高动态渲染）转换为 LDR （低动态渲染）。

> 一般的显示器只能显示 8 位色，即从 0 ～ 255 ，但是真实世界的颜色范围非常大，远不止 256 级，比如几十万级。如果一张图像的颜色有几十万级，我们将它的颜色区间线性的缩放至 [0, 255] ，就会产生色带问题（ color banding ），而且还有可能存在一大片黑或者一大片白的情况。
>
> HDR 就是为了解决这个问题，它是指根据明暗对比，把高动态范围光照范围（ HDR ）非线性的 ToneMapping 映射至显示器能显示的低动态光照范围（ LDR ），尽可能的保留明暗对比的细节，使效果比线性处理的更加逼真。

虽然示例中所使用的图片资源不是 HDR 的，但是改变 `toneMapping ` 也可以使结果看起来更逼真， `toneMapping` 有多个可选的值：

- `three.NoToneMapping` （默认）
- `three.LinearToneMapping`
- `three.ReinhardToneMapping`
- `three.CineonToneMapping`
- `three.ACESFilmicToneMapping`

```js
renderer.toneMapping = three.LinearToneMapping;
```

renderer 的 `toneMappingExposure` 可以更改色调映射的曝光级别，默认值是 1 。我也不懂曝光级别是啥。

```js
renderer.toneMappingExposure = 1;
```

### Antialiasing

`aliasing` （锯齿）是一种阶梯状的形状，它通常出现在几何图形的边缘，当几何体的边缘不是垂直或水平的时候，就会看到 `aliasing` 。

一种简单的抗锯齿的方法就是增加渲染的分辨率，打个比方，假如设置渲染分辨率的倍率为 2 ，就意味着对于一块 100 * 100 像素的屏幕，渲染器会渲染出一张 200 * 200 的图片，然后用 4 个像素的平均值作为 1 个像素的值，最终得到一张 100 * 100 的图片，然后渲染到屏幕上。这被称为 `super sampling(SSAA)` 或 `fullscreen sampling(FSAA)` ，这种办法简单有效，但是会带来成倍的性能负荷。

另一种和 `super sampling` 类似的技术是 `multi sampling(MSAA)` ，区别是后者只会对几何图形的边缘部分执行 SSAA 操作。这种技术已经在新型的 GPU 平台中自动实现了，我们只需要在示例化 renderer 的时候激活 `antialias` 属性就行了， three.js 会自动决定调用 MSAA 还是 SSAA 。（在 renderer 示例化之后再改变 `antialias` 是无效的）。

当屏幕的像素分辨率大于等于 2 的时候，锯齿现象就很不明显了，这个时候再激活 `antialias` 虽然是有效的，但没有太大必要，因为原来的显示效果就看不太出锯齿了，没有必要再执行抗锯齿，因为抗锯齿需要耗费不少额外的计算资源。如果屏幕的像素分辨率是 1 ，则有必要使用抗锯齿，因为这时候的锯齿现象会非常明显。

## 阴影粉刺

将上节课制作的汉堡包模型加载进场景后，近距离观看，将会发现汉堡包的面包的表面上居然出现了波纹，这些被称为阴影痤疮/粉刺。

阴影粉刺可能会出现在光滑和平坦的表面上，它产生的原因是 three.js 在计算表面是否位于阴影之中时计算精度的问题，具体来讲就是 three.js 计算后认为汉堡包在它自己的面包表面上投下了阴影。

设置光源的 `shadow` 属性的 `bias` 和 `normalBias` 属性可以解决这个问题。其中 `bias` 用于解决发生在平面上的阴影粉刺， `normalBias` 用于解决发生在曲面上的阴影粉刺，对于汉堡包我们只需要使用后者。无论使用哪一个，使用方法都是，一点点增加属性的值，一次一次的调试，直至不再出现阴影粉刺。比如，这个值对汉堡包是有效的：

```js
light.shadow.normalBias = 0.05;
```



# 27 - Shaders
