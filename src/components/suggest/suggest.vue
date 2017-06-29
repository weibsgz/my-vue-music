<template>
   <Scroll class="suggest" :data="result" :pullUp="pullUp" :beforeScroll="beforeScroll" @scorllToEnd="searchMore" @beforeScroll="listScroll" ref="suggestItem">
     <ul class="suggest-list">
       <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result">
         <div class="icon">
           <i :class="getIconClass(item)"></i>
         </div>
         <div class="name">
           <p class="text" v-html="getDiosplayName(item)"></p>
         </div>
       </li>
       <Loading v-show="hasMore" title=""></Loading>
     </ul> 
     <div class="no-result-wrapper" v-show="!hasMore && !result.length">
       <NoResult title="暂无数据"></NoResult>
     </div>    
   </Scroll>
</template>

<script>
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {filterSinger} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations,mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'

  export default {
    props:{
      query:{
        type:String,
        default:""
      },
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    //query每次变化请求服务端
    watch:{
      query() {
        this.search()
      }
    },
    data(){
      return {
        page:1,
        result:[],
        pullUp:true,
        hasMore:true, //是否有更多数据，上拉用
        beforeScroll:true  //滑动开始前要处理的事件
      }
    },

    methods:{
      ...mapMutations({
        setSinger:'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      search(){
        this.page = 1;
        this.hasMore = true;        
        //保证每次输入新的查询条件的时候保证scroll回到顶部
        //this.$refs.suggestItem.scrollTo(0,0)
        //传入查询条件，当前页码，是否显示歌手
        search(this.query,this.page,this.showSinger).then((res)  =>{
            if(res.code === ERR_OK){
              this.result = this.genResult(res.data)
              this._checkMore(res.data)
            }
        })
      },
      //上拉加载更多
      searchMore(){
        console.log('上拉加载')
        if(!this.hasMore) return

        this.page++;
        search(this.query,this.page,this.showSinger).then((res) =>{
          console.log(res)
           if(res.code === ERR_OK){
              this.result =this.result.concat(this.genResult(res.data)) 
              this._checkMore(res.data)
            }
        })

      },
      //查看是否还能下一页能否继续上拉
       _checkMore(data){
          const song = data.song;
          if(!song.list.length || (song.curnum + song.curpage * 20) >= song.totalnum){
            this.hasMore = false;
          }
       },
       //滚动列表开始前的函数，，这里为了在唤出软键盘后 让他收起，这个组件没有输入框，还要派发到
       //上一级 search.vue
       listScroll(){
          this.$emit('listScroll')
       },
      genResult(data){
        let ret = []
        console.log('data.zhida' +JSON.stringify( data.zhida))
        if(data.zhida && data.zhida.singerid){
          ret.push({
            ...data.zhida,...{type:TYPE_SINGER}
          })
        }
        
        if(data.song) {
          ret = ret.concat(data.song.list)
        }
        console.log(ret)
        return ret;
      },
      getIconClass(item){
        if(item.type === TYPE_SINGER){
          return 'icon-mine'
        }
        else
        {
          return 'icon-music'
        }
      },
      getDiosplayName(item){
        if(item.type === TYPE_SINGER)
          return item.singername
        else
          return `${item.songname}-${filterSinger(item.singer)}`
      },
      selectItem(item){
        //如果点击了歌手
        if(item.type === TYPE_SINGER){
            const singer = new Singer({
              id:item.singermid,
              name:item.singername
            })
            this.$router.push({
              path:`/search/${singer.id}`
            })
            //存入vuex singer 上边子路由配置的是singerDetail页，在singerDetail里getters会取得
            //state下的singer
            this.setSinger(singer)
        }
        else{
          //点击了歌曲列表
          this.insertSong(item)
        }
        //派发记录历史事件给父级search组件完成
        this.$emit('select')
      }
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }
</script>


<style scoped lang="less">
 @import '~common/css/variables.less';
  @import '~common/css/mixins.less';
  .suggest{
    height: 100%;
    overflow: hidden;
    .suggest-list{
       padding: 0 30px;
      .suggest-item{
        display: flex;
        align-items: center;
        padding-bottom: 20px;
      }
        
      .icon{
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"]{
           font-size: 14px;
          color: @color-text-d;
        }         
      }        
      .name{
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text{
          .no-wrap();
        }
      }        
    }
     
    .no-result-wrapper{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);      
     }
  }
  </style>  
   
