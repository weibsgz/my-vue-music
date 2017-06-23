<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active:currentPageIndex===index}" v-for="(item,index) in dots"></span>
    </div>
  </div>
</template>
<script>
   import Bscroll from 'better-scroll'
   import {addClass} from 'common/js/dom'
   export default{
     data(){
       return {
         dots:'',
         currentPageIndex:0
       }
     },
     props:{
       loop:{
         type:Boolean,
         default:true
       },
       autoPlay:{
         type:Boolean,
         default:true
       },
       interval:{
         type:Number,
         default:4000
       }
     },
     mounted(){
       setTimeout(()=>{
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        if(this.autoPlay){
          this._play()
        }

       },20)
       window.addEventListener('resize',()=>{
          if(!this.slider) return ;
          this._setSliderWidth(true);
          this.slider.refresh();
       })
     },
     //确保slider不被keep-alive的时候仍然能清除timer 老师改的issue
     activated() {
       if (this.autoPlay) {
         this._play()
       }
     },
     //组件切换的时候 销毁定时器
     destoryed(){
       clearTimeout(this.timer)
     },
     methods:{
       //isResize参数 加这个的目的是为了防止窗口缩放的时候无限叠加宽度
       _setSliderWidth(isResize){
         this.children = this.$refs.sliderGroup.children;
         console.log(this.children.length)
         let width = 0;
         let sliderWidth = this.$refs.slider.clientWidth;
         for(let i=0; i<this.children.length; i++){
            let child = this.children[i];
            //为每一个元素添加class , 在子组件完成，高内聚
            addClass(child,'slider-item');
            // 每个元素的宽度就是容器宽度
            child.style.width = sliderWidth + 'px';
            //总宽度是所有元素宽度相加
            width +=  sliderWidth;
         }
          //如果循环播放，左右两边各克隆两个DOM
         if(this.loop && !isResize){
           width += 2*sliderWidth;
         }
         this.$refs.sliderGroup.style.width = width + 'px'
       },

       _initDots(){
         console.log(this.children.length)
         this.dots = new Array(this.children.length)
       },
       _initSlider(){
          this.slider = new Bscroll(this.$refs.slider,{
            scrollX: true,
             scrollY: false,
             momentum: false,//惯性
             snap: true, //该属性是给 slider 组件使用的，普通的列表滚动不需要配置
             snapLoop: this.loop,// 是否可以无缝循环轮播
             snapThreshold: 0.3,
             snapSpeed: 400//轮播图切换的动画时间,

          })
          this.slider.on('scrollEnd',()=>{
            //better-scroll 取得当前活动页的方法
            let pageIndex = this.slider.getCurrentPage().pageX;
            if(this.loop){
              pageIndex = pageIndex - 1;
            }
            this.currentPageIndex = pageIndex;
            if(this.autoPlay){
              clearTimeout(this.timer);
              this._play();
            }
          })
       },
       _play(){
         let pageIndex = this.currentPageIndex + 1;
         if(this.loop){
           pageIndex = pageIndex + 1;
         }

         this.timer = setTimeout(()=>{
            this.slider.goToPage(pageIndex,0,400)
         },this.interval)
       }
     }
   }
</script>
<style scoped lang="less">
  @import '~common/css/variables.less';
  .slider{
    min-height: 1px;
    .slider-group{
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-item{
        float: left;
        box-sizing: border-box;
        overflow: hidden;
        text-align: center;
        a{
          display: block;
          width: 100%;
          overflow: hidden;
          text-decoration: none;
        }
        img{
          display: block;
          width: 100%;
        }
      }
    }
    .dots{
      position: absolute;
      right: 0;
      left: 0;
      bottom: 12px;
      text-align: center;
      font-size: 0;
      .dot{
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        &.active{
          width: 20px;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.8);
        }
      }


    }


  }


</style>


</style>
