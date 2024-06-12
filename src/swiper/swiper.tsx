interface SwiperOptions {
    url?: string;
    speed?: number;
    duration?: number;
    data?: (string | { [key: string]: string })[];
    success?: (data: (string | { [key: string]: string })[]) => string[];
}


/**
 * Swiper 背景轮播图
 * @param options url: 图片服务器请求地址，数据最好是数组 [imgurl1,imgurl2,...]
 * @param options speed: 图片切换时间(毫秒)
 * @param options duration: 淡入淡出时间(秒)，默认 speed - 2
 * @param options data: 外部传入的图片数组(优先执行)[imgurl1,imgurl2,...]
 * @param options success: url请求成功后的操作，如果url响应的是数组，则无需重写此方法
 * @param options{{
 *     url: "图片url请求地址",
 *     speed: 4000,
 *     duration: 2000,
 *     data: [],
 *     success: Function
 * }}
 */
const Swiper = (options: SwiperOptions = { url: "", speed: 6000, duration: 4, data: [], success: undefined }): void => {
    let dataIndex: number = 0
    let swiperIndex: number = 0
    let cursorIndex: number = 0
    let isStart: boolean = false
    const bg: HTMLDivElement[] = []
    shuffleArray(options.data)

    const { url = '', speed = 6000, duration = _duration(), data = [] } = options;

    // 图片乱序
    function shuffleArray(array: (string | {})[] | undefined) {
        if (array === undefined) {
            array = []
        }

        let _array: (string | {})[] = array
        // URL GET请求
        if (!options.data || options.data.length === 0) {
            const xhr: XMLHttpRequest = new XMLHttpRequest()
            xhr.open('GET', url, false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    try {
                        _array = JSON.parse(xhr.responseText)
                    } catch (e) {
                        console.warn(
                            `\n%c 背景图片请求内URL: %c ${options.url} \n%c 背景图片请求内容为: %c\n${xhr.responseText}\n%c 背景图片错误信息为: %c\n${e}`,
                            "color: #fff; background: #5f5f5f", "",
                            "color: #fff; background: #5f5f5f", "",
                            "color: #fff; background: #5f5f5f", ""
                        )
                    }
                }
            };
            xhr.send();
        }

        if (options.success) {
            if (typeof options.success === "string") {
                _array = eval(options.success)(_array)
            } else {
                _array = options.success(_array)
            }
        }
        try {
            for (let i: number = _array.length - 1; i > 0; i--) {
                const j: number = Math.floor(Math.random() * (i + 1));
                [_array[i], _array[j]] = [_array[j], _array[i]];
            }
            options.data = _array;
        }  catch (e) {
            console.error(`转入的图片数组为: ${array},请传入图片数组,错误信息为: ${e}`)
            options.data = [];
        }
    }

    // 计算淡入淡出时间，默认比循环时间少2秒
    function _duration(): number {
        let duration_: number = speed / 1000 - 2
        if (duration_ <= 0) {
            duration_ = 2
        }
        return duration_
    }

    // 创建背景DOM
    function createDOM(container: HTMLDivElement, index: number): HTMLDivElement {
        let swiperDiv: HTMLDivElement = createElementDiv()
        changeBackground(swiperDiv, index)
        container.appendChild(swiperDiv)
        return swiperDiv
    }

    // 计算下一张图片所索引
    function nextIndex(): number {
        dataIndex = dataIndex >= data.length - 1 ? 0 : dataIndex + 1
        return dataIndex
    }

    // 创建轮播容器和轮播item
    function createElementDiv(): HTMLDivElement {
        const el: HTMLDivElement = document.createElement("div")
        el.style.setProperty("width", "100%")
        el.style.setProperty("height", "100%")
        el.style.setProperty("position", "fixed")
        el.style.setProperty("left", "0")
        el.style.setProperty("top", "0")
        return el
    }

    // 更新背景URL
    function changeBackground(el: HTMLDivElement, index: number): void {
        el.style.setProperty("background", `url("${data[index]}") center center / cover no-repeat`)
    }

    // 创建轮播容器
    function containerEl(): HTMLDivElement {
        const container: HTMLDivElement = createElementDiv()
        container.style.setProperty("z-index", "-999")
        document.body.appendChild(container)
        return container
    }

    // 获取下一个轮播的index
    function swiperNextIndex(): number {
        swiperIndex = swiperIndex >= bg.length - 1 ? 0 : swiperIndex + 1
        return swiperIndex
    }

    // 获取不在当前和下一个背景的索引
    function swiperBgIndex(): number {
        let indexes: Set<number> = new Set([cursorIndex, swiperIndex])
        return Array.from(new Set([...new Set([0, 1, 2])].filter(element => !indexes.has(element))))[0];
    }

    // 背景透明度，淡入淡出使用
    function changeTransition(el: HTMLDivElement, opacity: number, transition: string): HTMLDivElement {
        el.style.setProperty("opacity", `${opacity}`)
        el.style.setProperty("transition", transition)
        return el
    }

    // 一个循环的开始
    function swiperBackground(): void {
        changeTransition(bg[cursorIndex], 1, `opacity ${duration}s ease-in`)
        const bg2: HTMLDivElement = changeTransition(bg[swiperNextIndex()], 0, "")
        changeTransition(bg[swiperBgIndex()], 0, `opacity ${duration}s ease-out`)

        if (isStart) {
            changeBackground(bg2, nextIndex())
        }
        cursorIndex = swiperIndex
        isStart = true
    }

    // 判断元素是否存在
    if (!document.getElementById("#body-swiper") && data.length > 0) {
        const container: HTMLDivElement = containerEl()
        container.setAttribute("id", "#body-swiper")
        bg.push(createDOM(container, dataIndex))
        bg.push(createDOM(container, nextIndex()))
        bg.push(createDOM(container, nextIndex()))

        // 开启轮播
        swiperBackground()
        setInterval(swiperBackground, speed)
    }
}

export default Swiper