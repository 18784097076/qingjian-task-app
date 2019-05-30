<template>
  <div class="home">
    <van-nav-bar class="header-bg" title="任务平台" left-text="返回" left-arrow  @click-left="onClickLeft" />
    <router-view></router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item   to="/taskList" icon="home-o">
        抢单列表
      </van-tabbar-item>
      <van-tabbar-item    to="/taskCenter"  icon="search">
        任务中心
      </van-tabbar-item>
      <van-tabbar-item    to="/userCenter"  icon="contact">
        个人中心
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// @ is an alias to /src


export default {
  data(){
    return {
      active:0
    }
  },
  methods:{
    onClickLeft(){
      this.$router.go(-1)
    }
  },
  watch:{
    '$route'(){
        if(this.$route.path=='/taskList'){
          this.active = 0
        }else if(this.$route.path=='/taskCenter'){
          this.active = 1
        }else if(this.$route.path=='/userCenter'){
          this.active = 2
        }
    }
    
  }
}
</script>

<style lang="scss" scoped>
.home{
  .header-bg{
    background:#26a2ff;
    .van-nav-bar__text,.van-icon,.van-nav-bar__title{
      color: #fff;
    }
  }
}
</style>
