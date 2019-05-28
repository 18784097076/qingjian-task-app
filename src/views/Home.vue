<template>
  <div class="home">
    <van-nav-bar class="header-bg" title="任务平台" left-text="返回" left-arrow  @click-left="onClickLeft"/>
    <router-view></router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item replace  to="/taskList" icon="home-o">
        抢单列表
      </van-tabbar-item>
      <van-tabbar-item  replace  to="/taskCenter"  icon="search">
        任务中心
      </van-tabbar-item>
      <van-tabbar-item  replace  to="/userCenter"  icon="contact">
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
