<template>
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="less">
  @import '~common/css/variables.less';
  @import '~common/css/mixins.less';
  .no-result{
    text-align: center;
    .no-result-icon{
       width: 86px;
      height: 90px;
      margin: 0 auto;
      background-image:url('no-result.png');
      background-size: 86px 90px;
    }
     
    .no-result-text{
      margin-top: 30px;
      font-size: @font-size-medium;
      color: @color-text-d;
    }
  }
    
</style>