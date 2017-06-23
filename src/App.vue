<template>
  <div id="app">
    <MHeader></Mheader>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!-- 播放器组件 不属于任何路由，切换路由可自由播放所以写这里 -->
    <Player></Player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'
export default {
  name: 'app',
  components:{
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>
/*导入css 在index.css里包含其他CSS,在build/webpack.base.conf.js里配置了别名，
也可以用 'common/csss/index.css找到'*/
/*@import './common/css/index.css'*/
</style>
