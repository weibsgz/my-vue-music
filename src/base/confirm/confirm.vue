<template>
  <transition name="confirm-fade">
    <div class="confirm" v-show="showFlag" @click.stop>
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <p class="text">{{text}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data() {
      return {
        showFlag : false
      }
    },
    methods: {
      show(){
        this.showFlag = true;
      },
      hide(){
        this.showFlag = false;
      },
      confirm(){
        this.hide();
        this.$emit('confirm')
      },
      cancel(){
        this.hide();
        this.$emit('cancel')
      }
    }
  }
</script>

<style scoped lang="less">
   @import '~common/css/variables.less';
   @import '~common/css/mixins.less';
    
   .confirm-fade-enter-active{
     /*  transition: all .3s;
       opacity:1; 这样也可以*/  
      animation: confirm-fadein 0.3s;    
     .confirm-content{
        animation: confirm-zoom-in 0.3s;
      }  
   }

   .confirm-fade-leave-active{
      animation: confirm-fadeOut 0.3s; 
   }

   
   
  
    
   
   .confirm{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 998;
    background-color: @color-background-d;
   
      
      .confirm-wrapper{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        .confirm-content{
          width: 270px;
          border-radius: 13px;
          background: @color-highlight-background;
          .text{
            padding: 19px 15px;
            line-height: 22px;
            text-align: center;
            font-size: @font-size-large;
            color: @color-text-l;
          }
            
          .operate{

            display: flex;
            align-items: center;
            text-align: center;
            font-size: @font-size-large;
            .operate-btn{
              flex: 1;
              line-height: 22px;
              padding: 10px 0;
              border-top: 1px solid @color-background-d;
              color: @color-text-d;
              &.left{
                border-right: 1px solid @color-background-d
              }
              
          
      
            }
          }
        }
      }
    }


  
    
  @keyframes confirm-fadein{
     0%{ opacity: 0}
     
    100%{
      opacity: 1
    }
  }

  @keyframes confirm-fadeOut{
     0%{ opacity: 1}
     
    100%{
      opacity: 0
    }
  }
   
  @keyframes confirm-zoom-in{
    0%{
      transform: scale(0)
    }
    50%{
      transform: scale(1.1)
    }
    100%{
      transform: scale(1)
    }
  }

  @keyframes confirm-zoom-out{
    0%{
      transform: scale(1)
    }
    50%{
      transform: scale(1.1)
    }
    100%{
      transform: scale(0)
    }
  }
    
</style>