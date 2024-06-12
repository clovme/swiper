# Swiper 背景轮播图

## 配置信息

```ts
import Swiper from "./swiper/swiper.ts";

/**
 * Swiper 背景轮播图
 * @param options url: 图片服务器请求地址，数据是数组 [imgurl1,imgurl2,...]
 * @param options speed: 图片切换时间(毫秒)
 * @param options duration: 淡入淡出时间(秒)，默认 speed - 2
 * @param options data: 外部传入的图片数组(优先执行)[imgurl1,imgurl2,...]
 * @param options success: url请求成功后的操作，如果url响应的是图片数组，则无需重写此方法
 */

// 完整的参数
Swiper({
    url: "图片url请求地址",
    speed: 4000,
    duration: 2000,
    data: [],
    success: Function
})
```

## data 数组使用

```ts
    Swiper({
        speed: 4000,
        duration: 2000,
        data: []
    })
```

## 图片 URL 使用

```ts
    Swiper({
        url: "图片url请求地址",
        speed: 4000,
        duration: 2000
    })
```

## success 回调函数的使用

```ts
    Swiper({
        url: "图片url请求地址",
        success: function (data) {
            // 处理 data 逻辑 
            console.log(data)
            return Array
        }
    })
```
或者

```ts
    Swiper({
        data: [
            {url: 'http://localhost/img1.jpg'}, 
            {url: 'http://localhost/img2.jpg'}
        ],
        success: function (data) {
            let temp = []
            data.forEach(item => {
                temp.push(item.url)
            })
            return temp
        }
    })
```