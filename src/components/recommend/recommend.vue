<template>
  <div class="recommend" ref="recommend">
    <!-- 直接封装了一个better-scroll的组件，里边是一个slot插槽，同时watch了props的data
    页面在刚加载后高度为很小 很可能滚动不了，watch方法里会调用refresh,
    重新计算高度，这样可以滚动了 -->
    <Scroll class="recommend-content" :data="discList" ref="scroll">
        <!-- better-scroll包括元素 -->
       <div class="">
         <!-- 这里注意要写v-if 要在数据确保渲染上再加载，因为数据是异步过来的，
         在slider组件中mounted里要计算容器宽度，这里可能会没有渲染完那边就计算了
         增加v-if 确保slider组件中slot插槽里有东西
         @load 给图片加一个load后的方法，作用是因为轮播图在上 列表在下边这是俩接口
         如果轮播图接口慢 那么better-scroll计算高度就又不对了，给图片加loaded方法后
         确保图片加载后撑开了高度再去执行better-scroll的refresh方法

         needsclick 这个类是fastclick避免拦截better-scroll的click`
          -->
         <div v-if="recommends.length" class="slider-wrapper">
             <Slider>
                 <div v-for="(item, index) in recommends">
                   <a :href = "item.linkUrl">
                     <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="">
                   </a>
                 </div>
             </Slider>
         </div>
         <div class="recommend-list" ref = "recommendList">
             <h1 class="list-title">热门歌单推荐</h1>
             <ul>
               <li v-for="(item,index) in discList" @click="selectItem(item)" class="item">
                 <div class = "icon">
                   <img width="60" height="60" v-lazy="item.imgurl"/>
                 </div>
                 <div class="text">
                    <h2 class="name" v-html="item.creator.name"></h2>
                    <p class="desc" v-html='item.dissname'></p>
                 </div>
               </li>
             </ul>
         </div>
       </div>
        <div class="loading-container" v-show="!discList.length">
          <Loading></Loading>
        </div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
  export default{
    mixins:[playlistMixin],
    data(){
      return {
        recommends:[],
        discList:[],
        checkLoaded:false
      }
    },
    created(){
       this._getRecommend()
       this._getDiscList()
    },
    methods:{
      ...mapMutations({
        setDisc:'SET_DISC'
      }),
      selectItem(item){
        this.$router.push({
          path:`/recommend/${item.dissid}`
        })
        this.setDisc(item);
      },
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? "60px" : " ";
        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh()
      },
      _getRecommend() {
       getRecommend().then((res) => {
         if (res.code === ERR_OK) {
           console.log(res.data.slider)
           this.recommends = res.data.slider;
         }
       })
     },
     _getDiscList(){
       getDiscList().then((res) =>{
         if (res.code === ERR_OK) {
           this.discList = res.data.list;
         }
       })
     },
     loadImage(){

       //确保只加载成功一次图片就行了 避免资源浪费
       if(!this.checkLoaded){
         console.log("图片加载了")
          this.$refs.scroll.refresh();
          this.checkLoaded = true;
       }

     }
   },
   components:{
     Slider,
     Scroll,
     Loading
   }
  }
</script>

<style scoped lang="less">
@import '~common/css/variables.less';
.recommend{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content{
    height: 100%;
    overflow: hidden;
    .slider-wrapper{
      position: relative;
      width: 100%;
      overflow: hidden;
    }
    .recommend-list{
      .list-title{
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size:@font-size-medium;
        color: #ffcd32;
      }

      .item{
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .icon{
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text{
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: 12px;
          .name{
            margin-bottom: 10px;
            color: #fff;
          }

          .desc{
            color: rgba(255, 255, 255, 0.3)
          }
        }


      }

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
