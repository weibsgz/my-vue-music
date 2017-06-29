import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
import topList from 'components/top-list/top-list'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend' //重定向解决默认的路由
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:':id',  //根据id不同区分歌手
          component:SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
        {
          path:':id',  //根据id不同区分歌手
          component:topList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children:[
          {
            path:':id',  //根据id不同区分歌手
            component:SingerDetail
          }
        ]
    },
  ]
})
