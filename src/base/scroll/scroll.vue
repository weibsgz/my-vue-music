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
        this._initScroll();
      },20)
    }
  },
  methods:{
    _initScroll(){
      if(!this.$refs.wrapper){
        return
      }
      this.scroll = new Bscroll(this.$refs.wrapper,{
        probeType:this.probeType,
        click:this.click
      })
    },
    enable(){
      this.scoll && this.scroll.enable()
    },
    disable(){
      this.scoll && this.scroll.disable()
    },
    refresh(){
      this.scroll && this.scroll.refresh()
    }
  }
}
</script>

<style lang="css">
</style>
