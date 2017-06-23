//mixins 选项接受一个混合对象的数组。这些混合实例对象可以像正常的实例对象一样包含选项,他们将在 Vue.extend() 里最终选择使用相同的选项合并逻辑合并。举例：如果你混合包含一个钩子而创建组件本身也有一个,两个函数将被调用。
//Mixin钩子按照传入顺序依次调用,并在调用组件自身的钩子之前被调用。
//在这里处理scroll列表 下方被小播放器遮挡的问题
//从 getters 里 取得playlist 在各种钩子里监测，执行handlePlaylist方法;
import {mapGetters} from  'vuex'

export const playlistMixin = {
  computed:{
    ...mapGetters([
      'playlist'
    ])
  },
  mounted(){
    this.handlePlaylist(this.playlist)
  },
  activated(){
    this.handlePlaylist(this.playlist)
  },
  watch:{
    playlist(newVal){
      this.handlePlaylist(newVal)
    }
  },
  methods:{
    handlePlaylist(){
      throw new Error('组件内部必须定义handlePlaylist方法处理scoll底部遮挡问题')
    }
  }
}
