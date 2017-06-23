
import * as types from './mutation-types'

//mutaiton是一些修改方法 ['types.SET_SINGER']是ES6的计算属性名 因为types.SET_SINGER
//是一个变量（虽然他引用了一个常量）所以要用中括号
//接受2个参数，state,   singer是提交mutation时传的参数
 const mutations = {
  [types.SET_SINGER](state,singer){
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  },
  [types.SET_DISC](state,disc){
    state.disc = disc
  },
  [types.SET_TOP_LIST](state,topList){
    state.topList = topList
  }

}

export default mutations
