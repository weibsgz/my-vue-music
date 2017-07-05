//异步请求需要修改state的时候用到action
//一般2种场景 ，一种是异步请求回调里通过mutation修改state,一种是对多个mutations进行操作封装

import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {saveSearch,deleteSearch,clearSearch} from 'common/js/cache'


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

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}


export const saveSearchHistory = function ({commit, state}, query){
  //提交mutations 并存入缓存  saveSearch函数返回 存储的对象数组 并存储入缓存
  commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}


export const deleteSearchHistory = function ({commit,state},query){
  commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}


export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}