//处理本地缓存相关 需要安装good-storage
//为什么不直接用localstorage ? 因为localstorage需要存的是字符串 这个插件直接做了转换 
import storage from 'good-storage'

const SEARCH_KEY = '__search__'  //定义搜索列表的key
const SEARCH_MAX_LEN = 15   //定义最大的存储条数

export function saveSearch(query){
    //第二个参数是娶不到key默认的值 默认一个空数组
    let searches = storage.get(SEARCH_KEY,[])
    insertArray(searches, query, (item) => {
        return item === query
  }, SEARCH_MAX_LEN)
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


