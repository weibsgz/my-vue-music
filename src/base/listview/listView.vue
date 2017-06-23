<template>
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <uL>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </uL>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">{{item}}

        </li>
      </ul>
    </div>
    <!-- 顶部固定 -->
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'
  //标题，A,B,C,D这些的高度
  const TITLE_HEIGHT = 30
  //右侧每个锚点高度是18
  const ANCHOR_HEIGHT = 18

  export default {
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          //因为‘热门’是俩字，只取第一个字，其他都是A,B,C,D。。。
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1//diff表示fix title向上滚动的时候滚动差
      }
    },
    created() {
      //这个东西用在两个方法内共享的一个数据，为什么不写data里,
      //因为data的东西vue都会给加getter,setter用来绑定数据，这个没必要
      this.probeType = 3
      this.listenScroll = true
      this.touch = {}
      this.listHeight = []
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
           //获取第一次触碰手指的位置
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex

        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
         //计算手指在y轴拖动的偏移量偏移了几个锚点 |0是向下取整 和math.floor一样
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      _scrollTo(index) {
        //排除点击bar的上下边缘部分
        if (!index && index !== 0) {
          return
        }
        //滑动到顶部 index变负值
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        //scrollToElement,第二个参数是缓动时间
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 观察当左边内容滑动的时候 右边索引列表应该变化，给不同的item加样式
      // 思路是，左边滑动的时候取得他到底落到哪个区间（listHeight是一个数组包含左侧每个元素占的高度），从而取得index使索引高亮
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="less">
  @import '~common/css/variables.less';
  .listview{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background:@color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size:@font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
       }
       .list-group-item{
         display: flex;
         align-items: center;
         padding: 20px 0 0 30px;
         .avatar{
           width: 50px;
           height: 50px;
           border-radius: 50%;
         }
         .name{
           margin-left: 20px;
           color: @color-text-l;
           font-size: @font-size-medium;
         }
        }
     }
     .list-shortcut{
       position: absolute;
       z-index: 30;
       right: 0;
       top: 50%;
       transform: translateY(-50%);
       width: 20px;
       padding: 20px 0;
       border-radius: 10px;
       text-align: center;
       background: @color-background-d;
       font-family: Helvetica;
       .item{
         padding: 3px;
         line-height: 1;
         color: @color-text-l;
         font-size: @font-size-small;
         &.current{
           color: @color-theme;
         }
       }
     }
     .list-fixed{
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       .fixed-title{
         height: 30px;
         line-height: 30px;
         padding-left: 20px;
         font-size: @font-size-small;
         color: @color-text-l;
         background: @color-highlight-background;
       }

     }
     .loading-container{
       position: absolute;
       width: 100%;
       top: 50%;
       transform: translateY(-50%);
     }
  }




</style>
