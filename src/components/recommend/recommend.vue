<template>
  <div class="recommend">
    <!-- 直接封装了一个better-scroll的组件，里边是一个slot插槽，同时watch了props的data
    页面在刚加载后高度为很小 很可能滚动不了，watch方法里会调用refresh,
    重新计算高度，这样可以滚动了 -->
    <Scroll class="recommend-content" :data="discList">
        <!-- better-scroll包括元素 -->
       <div class="">
         <!-- 这里注意要写v-if 要在数据确保渲染上再加载，因为数据是异步过来的，
         在slider组件中mounted里要计算容器宽度，这里可能会没有渲染完那边就计算了
         增加v-if 确保slider组件中slot插槽里有东西
          -->
         <div v-if="recommends.length" class="slider-wrapper">
             <Slider>
                 <div v-for="(item, index) in recommends">
                   <a :href = "item.linkUrl">
                     <img :src="item.picUrl" alt="">
                   </a>
                 </div>
             </Slider>
         </div>
         <div class="recommend-list">
             <h1 class="list-title">热门歌单推荐</h1>
             <ul>
               <li v-for="(item,index) in discList" class="item">
                 <div class = "icon">
                   <img width="60" height="60" :src="item.imgurl"/>
                 </div>
                 <div class="text">
                    <h2 class="name" v-html="item.creator.name"></h2>
                    <p class="desc" v-html='item.dissname'></p>
                 </div>
               </li>
             </ul>
         </div>
       </div>
    </Scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import {getRecommend,getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'
  export default{
    data(){
      return {
        recommends:[],
        discList:[]
      }
    },
    created(){
       this._getRecommend()
       this._getDiscList()
    },
    methods:{
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
     }
   },
   components:{
     Slider,
     Scroll
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
