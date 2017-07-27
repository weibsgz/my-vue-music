# vue-music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


歌词滑动
//这里分两种情况，
//1向左滑动： 首先middle-r在屏幕右侧，左滑动的translate3d x轴就是left(0) + deltaX ，左滑的时候deltaX是一个负数，一定不能大于 -window.innerWidth

//右滑动 ： 这个时候middle-r在屏幕中了，他距离右边屏幕的距离就是 -window.innnerWidth，这个时候
//deltaX是一个正值，右滑的时候他的translate3d X轴偏移量就该是-window.innerwidth + deltx

 //这个值是小于0的 如果是左滑动 他相对于他初始位置（在屏幕右侧）应该是往左 translate3d X轴是负的
 //如果是往右 他的translate3d x 已经是 -375了 慢慢变大但也是负数
