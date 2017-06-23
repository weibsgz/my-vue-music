<template>
<div class="music-list">
  <div class="back">
    <i class="icon-back" @click="back"></i>
  </div>
  <h1 class="title" v-html="title"></h1>
  <div class="bg-image" :style="bgStyle" ref="bgImage">
    <div class="play-wrapper">
      <div class="play" v-show="songs.length>0" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
    </div>
    <div class="filter" ref="filter"></div>
  </div>
  <div class="bg-layer" ref="layer"></div>
  <Scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list" ref="list">
    <div class="song-list-wrapper">
      <song-list :rank="rank" :songs="songs" v-on:select="selectItem"></song-list>
    </div>
    <div class="loading-container" v-show="!songs.length">
      <Loading></Loading>
    </div>
  </Scroll>
</div>
</template>
<script type="text/javascript">
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import Loading from 'base/loading/loading'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
export default{
  mixins:[playlistMixin],
  props:{
    bgImage:{
      type:String,
      default:''
    },
    songs:{
      type:Array,
      default:[]
    },
    title:{
      type:String,
      default:''
    },
    rank:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      scrollY:0
    }
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },
  created(){
    this.prototype = 3;
    this.listenScroll = true;
  },
  mounted(){
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight;
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  methods:{
    //mixins中处理scroll被底部遮挡的问题,playlist在mixins中getters定义了
    handlePlaylist(playlist){
      const bottom = playlist.length > 0 ? "60px" : " ";
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh();

    },
    //拖动歌曲列表  这个方法是scroll组件emit 来的
    scroll(pos){
      this.scrollY = pos.y;
    },
    back(){
      this.$router.back()
    },
    //子组件song-list 出派发过来的方法
    //这里没用item,因为点击一个后要播放整个歌曲列表
    selectItem(item,index){
        this.selectPlay({
          list:this.songs,
          index:index
        })
    },
    random(){
      this.randomPlay({
        list:this.songs
      })
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  //滚动的时候监听scrollY
  watch:{
    scrollY(newY){
      let translateY = Math.max(this.minTranslateY,newY)
      this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
      this.$refs.layer.style['-webkit-transform'] = `translate3d(0,${translateY}px,0)`
    }
  },
  components:{
    SongList,
    Scroll,
    Loading
  }
}

</script>
<style scoped lang="less">
  @import '~common/css/variables.less';
  @import '~common/css/mixins.less';
  .music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
    .back{
      position:absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back{
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }

    }
    .title{
      position: absolute;
      top: 0;
      left: 10%;
      z-index: 40;
      width: 80%;
      .no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: @font-size-large;
      color: @color-text;
    }
    .bg-image{
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 70%;
      transform-origin: top;
      background-size: cover;
      .play-wrapper{
        position: absolute;
        bottom: 20px;
        z-index: 50;
        width: 100%;
        .play{
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid @color-theme;
          color: @color-theme;
          border-radius: 100px;
          font-size: 0;
          .icon-play{
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: @font-size-medium-x;
          }
          .text{
            display: inline-block;
            vertical-align: middle;
            font-size: @font-size-small;
          }
        }
      }


      .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }

    }
    .bg-layer{
      position: relative;
      height: 100%;
      background: @color-background;
    }
    .list{
      position: fixed;
      top: 0;
      bottom: 0;
      width: 100%;
      overflow: hidden;
      background: @color-background;
      .song-list-wrapper{
        padding: 20px 30px;
      }
    .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
      }

    }
  }
</style>
