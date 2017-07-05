<template>
  <div class="search">
    <div class="search-box-wrapper">
        <SearchBox ref="searchBox" @query = 'onQueryChange'></SearchBox>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <Scroll ref="shortcut" class="shortcut" :data="shortcut">
            <div>
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotkey">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
                 <div class="search-history" v-show="searchHistory.length">
                    <h1 class="title">
                      <span class="text">搜索历史</span>
                      <span @click="showConfirm" class="clear">
                        <i class="icon-clear"></i>
                      </span>
                    </h1>
                    <search-list @delete="deleteOne" @select="addQuery" :searches="searchHistory"></search-list>
                </div>
            </div>
        </Scroll>        
    </div>    
    <div ref="searchResult" class="search-result" v-show="query">
            <Suggest :query='query' @listScroll="blurInput" @select="saveSearch"></Suggest>
    </div>
    <Confirm ref="confirm" text="是否清空所有搜索历史" @confirm="clearSearchHistory"></Confirm>
    <router-view></router-view>
  </div>
</template>

<script>
    import SearchBox from 'base/search-box/search-box'
    import {getHotKey} from 'api/search'
    import {ERR_OK} from 'api/config'
    import Suggest from 'components/suggest/suggest'
    import {mapActions,mapGetters} from 'vuex'
    import SearchList from 'base/search-list/search-list'
    import Confirm from 'base/confirm/confirm'
    import Scroll from 'base/scroll/scroll'
    import {playlistMixin} from 'common/js/mixin'
    export default {
        mixins:[playlistMixin],
        created(){
            this._getHotKey();
            let test = {a:1,b:2}
            let arr = []
            
            arr.push(...test)
            console.log(arr)
        },
        data(){
            return {
                hotkey:[],
                query:''
            }
        },
        computed:{
            ...mapGetters([
                'searchHistory'
            ]),
            //scroll组件中包含了 hotKey 和 searchHistory 两个值绑定的内容，因为scroll组件需要
            //绑定一个data 动态监测里边值变化 才能计算高度 ，所以将这俩值合并哪个改变都触发
            shortcut(){
                return this.hotkey.concat(this.searchHistory);
            }
        },
        watch:{
            query(newQuery){
                //如果是从suggest组件切过来的 query 是一个从无到有的过程 
                if(!newQuery){
                    this.$refs.shortcut.refresh()
                }
            }
        },
        methods:{    
            ...mapActions([
                'saveSearchHistory',
                'deleteSearchHistory',
                'clearSearchHistory'
            ]),   
            handlePlaylist(playlist){
                //处理滚动条底部遮挡  
                 const bottom = playlist.length > 0 ? "60px" : " ";
                  this.$refs.shortcutWrapper.style.bottom = bottom;
                  this.$refs.searchResult.style.bottom = bottom;
                  this.$refs.shortcut.refresh()
            }, 
            _getHotKey(){
                getHotKey().then((res) =>{
                    if(res.code === ERR_OK){
                        console.log(res.data.hotkey)
                        this.hotkey = res.data.hotkey.slice(0,10)
                    }
                })
            },
            addQuery(query){
                this.$refs.searchBox.setQuery(query)
            },
            onQueryChange(query){
                this.query = query
            },
            blurInput(){
                //这个方法要让search-box里的input 失去焦点，因为输入搜索条件后软键盘出来了
                //这个时候滑动列表要收起键盘  从scroll组件派发 到suggest组件 再派发到这里

                this.$refs.searchBox.blur()
            },
            saveSearch(){
                //保存查找历史
               this.saveSearchHistory(this.query)
            },
            deleteOne(item){
                this.deleteSearchHistory(item)
            },
            showConfirm(){
                this.$refs.confirm.show()
                //this.clearSearchHistory()
            }
        },
        components:{
            SearchBox,
            Suggest,
            SearchList,
            Confirm,
            Scroll
        }
    }
</script>

<style scoped lang="less">
  @import '~common/css/variables.less';
  @import '~common/css/mixins.less';
  
  .search{
    .search-box-wrapper{
      margin: 20px
    }
    .shortcut-wrapper{
      position: fixed;
      top: 178px;
      bottom: 0;
      width: 100%;
      .shortcut{
        height: 100%;
        overflow: hidden;
        .hot-key{
            margin: 0 20px 20px 20px;
          .title{
             margin-bottom: 20px;
            font-size: @font-size-medium;
            color: @color-text-l;
          }           
          .item{
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: @color-highlight-background;
            font-size: @font-size-medium;
            color: @color-text-d;
          }
            
        }
          
        .search-history{
            position: relative;
          margin: 0 20px;
          .title{
             display: flex;
            align-items: center;
            height: 40px;
            font-size: @font-size-medium;
            color: @color-text-l;
            .text{
              flex: 1;
            }
            .clear{
              .extend-click() ;
              .icon-clear{
                 font-size: @font-size-medium;
                color: @color-text-d ;
              }
               
            }
          }
        }
          
           
              
      }        
    }
     
    .search-result{
        position: fixed;
      width: 100%;
      top: 178px;
      bottom: 0 ;
    }
     
  }
    


  
</style>
