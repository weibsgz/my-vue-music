<template>
    <transition name="slide">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from  'vuex'
  import {getSingerDetail} from  'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  export default{
    data(){
      return {
          songs:[]
      }
    },
    computed:{
      title(){
        return this.singer.name;
      },
      bgImage(){
        return this.singer.avatar;
      },
      ...mapGetters([
        //映射store/getters.js里的singer,相当于在这个实例中挂载了singer这个属性
        'singer'
      ])
    },
    created(){
      this._getDetail();

    },
    methods:{
      _getDetail(){
        //如果在歌手详情页面刷新了 ，回到歌手列表
        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code === ERR_OK){
            console.log(res.data.list)
            this.songs = this._normalizeSongs(res.data.list)
            console.log(this.songs)
          }
        })
      },
      //处理歌曲列表数据
      _normalizeSongs(list){
          //console.log('-------'+JSON.stringify(list))
          let ret = [];
          list.forEach((item)=>{
            //ES6 解构赋值  相当于musicData = item.musicData
            let {musicData} = item;
            if(musicData.songid && musicData.albummid){
                ret.push(createSong(musicData))
            }
          })
         return ret;
      }
    },
    components:{
      MusicList
    }
  }
</script>

<style scoped lang="less">
  @import '~common/css/variables.less';
  // .singer-detail{
  //   position: fixed;
  //   z-index: 100;
  //   top: 0;
  //   left:0;
  //   right:0;
  //   bottom:0;
  //   background: @color-background;
  // }
  .slide-enter-active,.slide-leave-active{
    transition:all 0.3s
  }
  .slide-enter,.slide-leave-to {
    transform:translate3d(100%,0,0);
  }
</style>
