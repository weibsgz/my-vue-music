<template>
  <!-- progress-bar是整体进度条 -->
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <!-- progress是已经走过的进度条 -->
      <div class="progress" ref="progress"></div>
      <!-- progress-btn-wrapper是进度条进度圆点 -->
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent = "progressTouchStart"
            @touchmove.prevent = "progressTouchMove"
            @touchend = "progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
//定义小球的宽度
const progressBtnWidh = 16;
export default {
  props:{
    //percent属性的作用是当前播放的进度占进度条的百分比，这个属性就可以描绘出进度走了多少
    percent:{
      type:Number,
      default: 70
    }
  },
  created(){
    //滑动进度条时候的touchstart touchmove touchend 的共享对象
    this.touch = {}
  },
  watch:{
    //改变进度的时候实际是改变 this.$refs.progress的宽度(百分比) 及 this.$refs.progressBtn的left
    percent(newPercent){
      //如果在拖动的时候 歌曲还在播放会干扰计算，所以条件是 歌曲在拖动的时候不watch percent的变化
      if(newPercent >= 0 && !this.touch.initiated){
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidh
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  },
  methods:{
    progressTouchStart(e){
      this.touch.initiated = true;
      //第一次点击的时候
      this.touch.startX = e.touches[0].pageX;
      //已经偏移的宽度
      this.touch.left = this.$refs.progress.clientWidth;
      console.log(this.touch.left)
    },
    progressTouchMove(e){
      if(!this.touch.initiated) return
      //计算刨去开始的进度点到拖动的距离的偏移量
      const deltaX = e.touches[0].pageX - this.touch.startX;
      //拖动的偏移量 + 已经存在的歌曲进度偏移量 不能超过bar的总宽度 ，且需大于0 这个就是歌曲拖动后应该在的位置的偏移量
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidh
      const offsetWidth = Math.min(barWidth,Math.max(0,this.touch.left + deltaX))
      //console.log(offsetWidth)
      this._offset(offsetWidth)
    },
    progressTouchEnd(e){
      this.touch.initiated = false;
      //松开手后应该通知父组件播放的位置
      this._triggerPercent();
    },
    _offset(offsetWidth){
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent(){
      //松开手后应该通知父组件播放的位置百分比
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidh;
      const percent =this.$refs.progress.clientWidth / barWidth
      console.log('派发事件')
      this.$emit('percentChange',percent)
    },
    progressClick(e){
      //这里不能用e.offsetX,如果点击到小圆点会有BUG,pageX是 点击的点到浏览器边缘的距离
      //  getBoundingClientRect()这个方法返回一个矩形对象，包含四个属性：left、top、right和bottom。
      //分别表示元素各边与页面上边和左边的距离。
      let offsetWidth = e.pageX - this.$refs.progressBar.getBoundingClientRect().left
      this._offset(offsetWidth)
      this._triggerPercent()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~common/css/variables.less';
@import '~common/css/mixins.less';
.progress-bar{
  height: 30px;
  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress{
      position: absolute;
      height: 100%;
      background: @color-theme;
    }
    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background: @color-theme;
      }

    }

  }
}


</style>
