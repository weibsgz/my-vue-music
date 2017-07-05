//处理本地缓存相关 需要安装good-storage
//为什么不直接用localstorage ? 因为localstorage需要存的是字符串 这个插件直接做了转换 
import storage from 'good-storage'

const SEARCH_KEY = '__search__'  //定义搜索列表的key
const SEARCH_MAX_LEN = 15   //定义最大的存储条数

export function saveSearch(query){
    //第二个参数是娶不到key默认的值 默认一个空数组
    console.log(`query是 ${query}`) //你点击的名字 比如 A
    let searches = storage.get(SEARCH_KEY,[])
    console.log(`searches是  ${searches}`) //之前保存的点击的  比如 [B,C] 第一次点的话是个 空数组
    insertArray(searches, query, (item) => {
        return item === query
  }, SEARCH_MAX_LEN)
    console.log(`searches是  ${searches}`) //合并后的 [A,B,C]
  storage.set(SEARCH_KEY, searches)
  return searches
}


function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}


export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}


function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}
