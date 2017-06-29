import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'
const state = {
  singer:{},  //歌手信息
  playing:false,  //播放器播放状态，true是播放 false是暂停
  fullScreen:false, //全屏
  playlist:[],   //播放列表,修改mode要重新排列播放列表
  sequenceList:[],  //顺序列表  如果是随机播放，顺序和playList不一样了
  mode: playMode.sequence, //播放模式，默认顺序播放
  currentIndex: -1,   //当前播放是哪个歌曲
  disc:{},  //歌单详情页
  topList:{},
  searchHistory:loadSearch()  //搜索历史 , 直接调取cache.js的取缓存的方法，因为如果只给默认
  //是空数组，那么每次点击都会这个状态都是个空数组
}

export default state
