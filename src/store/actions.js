//异步请求需要修改state的时候用到action
//一般2种场景 ，一种是异步请求回调里通过mutation修改state,一种是对多个mutations进行操作封装

import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

//两个参数：第一个参数是:解构为commit方法,state 这应该是一个固定写法
//第二个参数是:是一个payload(载荷)
export const selectPlay = function({commit,state},{list,index}){
   commit(types.SET_SEQUENCE_LIST,list) //播放顺序列表
  //如果改变模式为随机播放，播放列表重新排，这个时候再换别的歌曲就对不上了
  if(state.mode === playMode.random){
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST,randomList)  //播放列表
    index = findIndex(randomList,list[index])
  }
  else{
    commit(types.SET_PLAYLIST,list)  //播放列表
  }



  commit(types.SET_CURRENT_INDEX,index) //当前播放歌曲的索引
  commit(types.SET_FULL_SCREEN,true) //打开播放器
  commit(types.SET_PLAYING_STATE,true) //播放状态
}


export const randomPlay =  function({commit,state},{list}){
  commit(types.SET_PLAY_MODE,playMode.random)
  commit(types.SET_SEQUENCE_LIST,list)
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST,randomList)
  commit(types.SET_CURRENT_INDEX,0)
  commit(types.SET_FULL_SCREEN,true) //打开播放器
  commit(types.SET_PLAYING_STATE,true) //播放状态


}


function findIndex(list,song){
  return list.findIndex((item)=>{
    return item.id === song.id
  })
}
