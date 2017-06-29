<template>
   <div class="魏彬" ref="wrapper">
     <slot></slot>
   </div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
  props:{
    probeType:{
      type:Number,
      default:1
    },
    click:{
      type:Boolean,
      default:true
    },
    data:{
      type:Array,
      default:null
    },
    listenScroll:{
      type:Boolean,
      default:false
    },
    pullUp:{
      type:Boolean,
      default:false
    },
    beforeScroll:{
      type:Boolean,
      default:false
    }
  },
  mounted(){
    setTimeout(()=>{
      this._initScroll();
    },20)
  },
  watch:{
    data(){
      setTimeout(()=>{
        this.refresh();
      },20)
    }
  },
  methods:{
    _initScroll(){
      //初始化时找不到DOM 会报错
      if(!this.$refs.wrapper){
        return
      }
      this.scroll = new Bscroll(this.$refs.wrapper,{
        probeType:this.probeType,
        click:this.click
      })
      if(this.listenScroll){
        let me = this;
        this.scroll.on('scroll',(pos) =>{
          me.$emit('scroll',pos)
        })
      }
      //上拉加载
      if(this.pullUp){       
        this.scroll.on('scrollEnd',()=>{
          console.log(this.scroll)
          if(this.scroll.y <= this.scroll.maxScrollY + 50){
            console.log('scroll组件派发scrollToEnd方法')
            this.$emit('scorllToEnd')
          }
        })
      }
      //滚动开始前，这里为了处理滚动前让遮挡的键盘消失的问题
      if(this.beforeScroll){
        this.scroll.on('beforeScrollStart',()=>{
          this.$emit('beforeScroll')
        })
      }
    },
    enable(){
      this.scoll && this.scroll.enable()
    },
    disable(){
      this.scoll && this.scroll.disable()
    },
    refresh(){
      this.scroll && this.scroll.refresh()
    },
    scrollTo(){
      this.scroll && this.scrollTo.apply(this.scroll,arguments)
    },
    scrollToElement(){
      this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
    }

  }
}
</script>

<style lang="css">
</style>
