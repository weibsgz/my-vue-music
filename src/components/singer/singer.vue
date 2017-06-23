<template>
  <div class="singer" ref="singer">
     <!-- select 是 listView组件emit 过来的 -->
    <ListView v-on:select="selectSinger" :data="singers" ref="list"></Listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  //引入vuex
  import {mapMutations} from 'vuex'
  import {playlistMixin} from 'common/js/mixin'

  const HOT_NAME = '热门';
  const HOT_SINGER_LEN = 10;
  export default{
    mixins:[playlistMixin],
    data(){
      return {
          singers:[]
      }
    },
    created(){
      this._getSingerList()
    },
    methods:{
      //mixins中处理scroll被底部遮挡的问题,playlist在mixins中getters定义了
      handlePlaylist(playlist){
        const bottom = playlist.length > 0 ? '60px' : ' ';
        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.refresh();
      },
      //VUEX官网：你可以在组件中使用 this.$store.commit('xxx') 提交 mutation，
      //或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）。
      ...mapMutations({
        //SET_SINGER 对应mutation-types.js里的
        //映射一个方法 this.setSinger() 为 this.$store.commit('SET_SINGER')
        setSinger:"SET_SINGER"
      }),
      selectSinger(item){
        this.$router.push({
          path:`/singer/${item.id}`
        });
        //因为在mapMutations里做了映射，相当于this.$store.commit('SET_SINGER'，item)
        //执行了 mutations.js里对应的函数
        this.setSinger(item);
      },
      _getSingerList(){
        getSingerList().then((res)=>{
          if(res.code === ERR_OK){
          //  console.log(this._normalizeSinger(this.singers))
            this.singers = this._normalizeSinger(res.data.list);

          }
        })
      },
      //改造默认的数据接口
      // [{"Farea":"1","Fattribute_3":"3","Fattribute_4":"0","Fgenre":"0","Findex":"X",
      // "Fother_name":"Joker","Fsinger_id":"5062","Fsinger_mid":"002J4UUk29y8BY",
      // "Fsinger_name":"薛之谦","Fsinger_tag":"541,555","Fsort":"1","Ftrend":"0","Ftype":"0","voc":"0"}]
      _normalizeSinger(list){
        let map = {
          hot:{
            title:HOT_NAME,
            items:[]
          }
        }

        list.forEach((item,index) =>{
          if(index < HOT_SINGER_LEN){ //热门只取10条
            //这里用了定义class的方法
            map.hot.items.push(new Singer({
              id:item.Fsinger_mid,
              name:item.Fsinger_name
            }))
          }

          const key = item.Findex;
          if(!map[key]){
            map[key] = {
              title:key,
              items:[]
            }
          }
          map[key].items.push(new Singer({
            id:item.Fsinger_mid,
            name:item.Fsinger_name
          }))
        })
      //  console.log(map)
        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          //console.log('1111'+JSON.stringify(val))
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        //排序 A,B,C,D...
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
          //console.log(JSON.stringify(hot.concat(ret)))
        return hot.concat(ret)

      }

    },
    components:{
      ListView
    }
  }
</script>

<style scoped lang="less">
  .singer{
    position: fixed;
    top: 88px;
    bottom:0;
    width: 100%;
  }
</style>
