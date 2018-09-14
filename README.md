# vue-video
 A versatile video player package by vue
## arg
| 名称       | 类型      | 说明          | 可选值        | 默认值   | 必填   |
| --------- | ------- | ---------------------------   | ---------- | ----- | ----  |
| el      | domElement  | video元素                     |  domElement | null | 必填  |
| option      | Object  | 配置项                     |  Object | defaultOption | 非必填  |
| env      | Object  | 环境                     |  Object | {} | 非必填  |
##option
| 名称       | 类型      | 说明          | 可选值        | 默认值   | 必填   |
| --------- | ------- | ---------------------------   | ---------- | ----- | ----  |
| crossOrigin      | Boolean  | 允许跨越                     |  true | true | 非必填  |
| src      | String  | 视频源                     |  string | '' | 非必填  |
| preload      | String  | 预加载   |   auto,meta,none     | null | 非必填 |
| playsinline     | Boolean  | 是否屏幕内部播放                | true,false         | true |  非必填 |
| totalProgress | Number  | 进度条总进度   | int         | 100 | 非必填 |
| autoPlay | Boolean  | 是否自动播放   | true,false          | false | 非必填 |
| autoPlayTimeout | Number  |  自动播放超时时间  |         number  | 10000 | 非必填 |
| controls | Boolean  |  是否展示控制栏  |         true,fale  | false | 非必填 |
| progress | Function  |  进度条回调  |         Function  | null | 非必填 |
| catchError | Function  |  错误回调  |         Function  | null | 非必填 |
| onFullscreenchange | Function  |  全屏函数切换,参数为是否全屏  |         Function（newStatus）  | null | 非必填 |
| videoPlayTimeout | Function  |  自动播放超时回调  |         Function  | null | 非必填 |