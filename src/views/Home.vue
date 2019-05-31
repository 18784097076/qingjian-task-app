<template>
  <div class="home">
    <van-nav-bar class="header-bg" title="任务平台" left-text="返回" left-arrow  @click-left="onClickLeft" />
    <router-view></router-view>
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/taskList" icon="home-o">
        抢单列表
      </van-tabbar-item>
      <van-tabbar-item to="/taskCenter"  icon="search">
        任务中心
      </van-tabbar-item>
      <van-tabbar-item to="/userCenter"  icon="contact">
        个人中心
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>

export default {
  data(){
    return {
      active:0
    }
  },
  methods:{
    onClickLeft(){
      if(this.$route.path!='/taskList'){
        this.$router.go(-1)
      }
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
  },
  mounted(){
    if(this.$route.path=='/taskList'){
          this.active = 0
    }else if(this.$route.path=='/taskCenter'){
      this.active = 1
    }else if(this.$route.path=='/userCenter'||this.$route.path=='/income'||this.$route.path=='/pay'||
    this.$route.path=='/cashWithdrawal'||this.$route.path=='/previewUser'||this.$route.path=='/nextUser'||this.$route.path=='/alipayInfo'){
      this.active = 2
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
.van-nav-bar__left{
  left:10px;
}
</style>
