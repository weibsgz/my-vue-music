<template>
      <div class="player" v-show="playlist.length > 0">
        <transition name="normal">
          <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img :src="currentSong.image"  width="100%" height="100%" alt="">
            </div>
            <div class="top">
              <div class="back" @click="back">
                 <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle" @touchstart.prevent = "middleTouchStart"
                                @touchmove.prevent = "middleTouchMove"
                                @touchend = "middleTouchEnd">
              <div class="middle-l" ref= "middleL">
                <div class="cd-wrapper">
                  <div class="cd" :class="cdCls">
                    <img :src="currentSong.image" class="image" alt="">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                  <div class="playing-lyric">
                    {{playingLyric}}
                  </div>
                </div>
              </div>
              <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric" class="">
                    <p ref="lyricLine" class="text" :class="{'current':currentLineNum === index}"
                      v-for="(line,index) in currentLyric.lines"
                    >{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
            </div>
            <div class="bottom">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
                <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{currentTime | formatTime}}</span>
                <div class="progress-bar-wrapper">
                  <ProgressBar :percent="percent"   @percentChange="onProgressBarChange"></ProgressBar>
                </div>
                <span class="time time-r">{{currentSong.duration | formatTime}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left" @click="changeMode">
                  <i :class="iconMode"></i>
                </div>
                <div class="icon i-left">
                  <i @click="prev" class="icon-prev"></i>
                </div>
                <div class="icon i-center">
                  <i @click="togglePlay" :class="playIcon"></i>
                </div>
                <div class="icon i-right">
                  <i @click="next" class="icon icon-next"></i>
                </div>
                <div class="icon i-right">
                  <i class="icon icon-not-favorite"></i>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <transition name="mini">
          <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
               <img :class="cdCls" :src="currentSong.image" alt="" width="40" height="40">
            </div>
            <div class="text">
               <h2 class="name" v-html="currentSong.name"></h2>
               <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
              <i :class='miniIcon' @click.stop="togglePlay"></i>
            </div>
            <div class="control">
              <i class="icon-playlist"></i>
            </div>
          </div>
        </transition>
        <!-- H5 audio  API 在播放的时候出发canplay方法（这里处理多次点击问题），错误触发error方法
        timeupdate 播放器播放触发事件更改-->
        <audio ref="audio" :src = "currentSong.url" @canPlay="ready" @error="error"
         @timeupdate="updateTime" @ended="end"></audio>
      </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters,mapMutations} from 'vuex'
import ProgressBar from 'base/progress-bar/progress-bar'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
export default{
  data(){
    return {
      //防止多次点击
      songReady:false,
      currentTime:0,
      currentLyric:null,
      currentLineNum:0,   //当前歌词所在的行，需要高亮
      currentShow:'cd',   //默认歌曲还是歌词显示
      playingLyric:""
    }
  },
  created(){
    //创建一个touch对象 这个没必要加getter,setter,直接在这定义了
    //用来创建 歌曲，歌词左右滑动的对象
    this.touch = {}
  },
  computed:{
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'

    ]),
    iconMode(){
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    playIcon(){
      return this.playing? 'icon-pause' : 'icon-play'
    },
    miniIcon(){
      return this.playing? 'icon-pause-mini' : 'icon-play-mini'
    },
    cdCls(){
      return this.playing? 'play' : 'play pause'
    },
    percent(){
      //歌曲播放进度
      return this.currentTime / this.currentSong.duration;
    }

  },
  watch:{
    //每次点击currentSong改变的时候执行 audio的play
    //如果不加nextTick会报错，DOM还没加载完
    //如果点击更换播放顺序会触发currentsong改变 ，但我们暂停的时候不想改变他就被播放了 所以判断下ID
    currentSong(newSong,oldSong){
      if(newSong.id === oldSong.id) return ;
      this.$nextTick(()=>{
        this.$refs.audio.play();
        this.getLyric()
      })

    },
    //仅仅在方法里this.setPlayingState(!this.playing) 是不能暂停的，要用audio控制播放暂停
    playing(newPlay){
      console.log(newPlay)
      this.$nextTick(()=>{
        newPlay ?　this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }

  },

  filters: {
           formatTime:function(value){
               // currentTime是一个类似时间戳要进行处理成时间格式
               // |0 代表向下取整，代替 Math.floor
               //console.log(`value: ${value}`)
               let newValue = value | 0;
               let minute = newValue / 60 | 0;
               let second = newValue % 60;
               //秒数默认只取到1位 需要补0，从1-9秒 len都是1
               let len = second.toString().length;
               //console.log(`len: ${len}`)
               while(len < 2)
               {
                 second = '0' + second;
                 //不写len++程序卡死不能进行下一步
                 len++;
               }
               return `${minute}:${second}`
           }
   },
  methods:{
    ...mapMutations({
      setFullScreen:'SET_FULL_SCREEN',
      setPlayingState:'SET_PLAYING_STATE',
      setCurrentIndex:'SET_CURRENT_INDEX',
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST'
    }),
    getLyric(){
      console.log(111111)
      //获取歌词
      this.currentSong.getLyric().then((lyric)=>{
         this.currentLyric = new Lyric(lyric, this.handleLyric)
        if(this.playing)
        {
          this.currentLyric.play()
        }

        console.log(this.currentLyric);
      })
    },
    //歌词每播放一行的回调
    handleLyric({lineNum,txt}){
      this.currentLineNum = lineNum;
      // if(lineNum > 5){
      //   let lineEl = this.$refs.lyricLine[lineNum-5]
      //   this.$refs.lyricList.scrollToElement(lineEL,1000)
      // }
      // else{
      //   this.$refs.lyricList.scrollTo(0,0,1000)
      // }
      this.playingLyric = txt
    },
    changeMode(){
      //this.mode从getter.js取出来的 对应state里3种状态 0 ，1 ，2
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if(mode === playMode.random){
          list = shuffle(this.sequenceList);
      }
      else{
        //顺序播放
        list = this.sequenceList;
      }
      //改变播放顺序前重置下 当前播放的歌曲的顺序，保证当前歌曲不会被打断
      this.resetCurrentIndex(list)
      //改变播放列表
      this.setPlayList(list);
    },
    resetCurrentIndex(list){
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id;
      })
      this.setCurrentIndex(index);
    },
    open(){
      this.setFullScreen(true)
    },
    back(){
    //  this.fullScreen = false; 不能这样写
      this.setFullScreen(false)
    },
    //播放/暂停 提交mutations 改变state  在watch里改变
    togglePlay(){
        // if(!this.songReady){
        //   return
        // }
        this.setPlayingState(!this.playing)
    },
    prev(){
      // if(!this.songReady){
      //   return
      // }
      let index = this.currentIndex-1
      if(index === -1){
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index)
      if(!this.playing){
        this.togglePlay()
      }
    },
    next(){
      // if(!this.songReady){
      //   return
      // }
      let index = this.currentIndex + 1;
      if(index === this.playlist.length){
        index = 0;
      }
      this.setCurrentIndex(index)
      //如果先暂停了 ，在播放下一首，改变播放器状态
      if(!this.playing){
        this.togglePlay()
      }
      this.songReady = false;
    },
    ready(){
      this.songReady = true;
    },
    error(){

    },
    updateTime(e){
      //audio 标签带有currentTime属性(取得audio的currentTime属性)
      this.currentTime = e.target.currentTime;
    },
    onProgressBarChange(percent){
      //操作audio audio原生API有currentTime属性(设置audio的currentTime属性)
      this.$refs.audio.currentTime = this.currentSong.duration * percent;
      //如果暂停状态 拖动 期待他继续播放
      if(!this.playing){
        this.togglePlay()
      }
    },
    end(){
      console.log('播放结束')
      if(this.mode === playMode.loop){
        this.loop()
      }
      else{
        this.next();
      }
    },
    loop(){
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
    },
    middleTouchStart(e){
      this.touch.initated = true;
      let touch = e.touches[0]
      //这里要维护横轴和纵轴的坐标，因为歌词列表是个scroll
      //可上下滑动，如果纵轴的偏移大于横轴的偏移就不让他侧滑
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e){
      if(!this.touch.initated){
        return
      }
      let touch = e.touches[0]
      //手指滑动的距离
      const deltaX = touch.pageX -  this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if(Math.abs(deltaY) > Math.abs(deltaX)){
        return
      }
      //定义歌词middle-r 距离左侧的距离 他默认在middle-l的右侧停着，有两种情况
      //如果当前是 cd 页面 就是 0 如果滑到了 歌词页面 就是 负的屏幕宽度
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth;
      //计算滑动的距离 如果当前在cd页面 往左滑动距离 = left(0) + deltaX(滑动的距离) 这个是负值 一定不能大于 window.innerWidth
      //这个值是小于0的 因为他是从右侧往左边滑动
      var width1 = Math.max(-window.innerWidth,left+deltaX)
      console.log(width1)
      const offsetWidth = Math.min(0,width1)
      //变成百分比保存起来
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      //因为lyricList 是一个scroll组件 所以要用$el
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      //设置CD页面的透明度
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
    },
    middleTouchEnd(e){
        let offsetWidth;
        let opacity;
        //从右往左滑的时候
        if(this.currentShow === 'cd'){
          //如果滑动的距离超过了10% 就让他直接靠左出来 否则就回去
          if(this.touch.percent > 0.1){
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'Lyric';
          }
          else{
            offsetWidth = 0;
            opacity = 1;
          }
        }
        //从左往右滑
        else{
          if(this.touch.percent < 0.9){
            offsetWidth = 0;
            opacity = 1;
            this.currentShow = 'cd'
          }else{
            offsetWidth = -window.innerWidth;
              opacity = 0
          }
        }
          console.log(this.currentShow)

        this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.middleL.style.opacity = opacity;
        //设置缓动
        this.$refs.lyricList.$el.style.transitionDuration = '300ms';
    }
  },
  components:{
    ProgressBar,
    Scroll
  }
}
</script>

<style scoped lang="less">
@import '~common/css/variables.less';
@import '~common/css/mixins.less';
  .player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        //filter: blur(20px);
      }
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position:absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          .no-wrap();
          font-size: @font-size-large;
          color: @color-text;
        }

        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }

      }
      .middle{
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play{
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }

          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 20px;
              line-height: 20px;
              font-size: @font-size-medium;
              color: @color-text-l;
            }
          }
        }

        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current{
                color: @color-text
              }
            }
          }
        }

      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }

        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{flex: 1}
        }

        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 30px;
            }
          }

          .i-left{  text-align: right}

          .i-center{
            padding: 0 20px;
            text-align: center;
            i{font-size: 40px}

          }

          .i-right{text-align: left}

          .icon-favorite{color: @color-sub-theme}

        }

      }
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }

      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0);
        }
        .bottom{
          transform: translate3d(0, 100px, 0);
        }
      }


    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0
      }
      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused
          }
        }
      }

      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          .no-wrap();
          font-size: @font-size-medium;
          color: @color-text;
        }

        .desc{
          .no-wrap();
          font-size: @font-size-small;
          color: @color-text-d;
        }

      }

      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: @color-theme-d;
        }

        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }

      }

    }


  }

  @keyframes rotate {
    0%{transform: rotate(0);}
    100%{transform: rotate(360deg);}
  }



</style>
