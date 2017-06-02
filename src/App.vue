<template>
  <div id="app">
    <MHeader></Mheader>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>

  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
export default {
  name: 'app',
  components:{
    MHeader,
    Tab
  }
}
</script>

<style>
/*导入css 在index.css里包含其他CSS,在build/webpack.base.conf.js里配置了别名，
也可以用 'common/csss/index.css找到'*/
@import './common/css/index.css'
</style>
