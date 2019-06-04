<template>
  <div class="login">
    <h3>任务平台</h3>
    <div class="login-info">
      <van-field label="用户名" v-model="uname" placeholder="请输入用户名" @blur="unameBlur"/>
      <van-field type="password" label="密码" v-model="upwd" placeholder="请输入密码"  @blur="upwdBlur"/>
      <van-button type="info" size="large" round style="margin:20px 0 10px;" @click="loginSubmit">登录</van-button>
      <!-- <van-button size="large" round style="margin-top:10px;" @click="toRegister">注册</van-button> -->
      <button @click="toRegister" class="register pwd">新用户注册</button>
      <button @click="findPwd" class="find-pwd pwd">找回密码</button>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      uname:'',
      upwd:'',
      validUname:false,  //用户名是否为空
      validUpwd:false
    }
  },
  methods:{
    unameBlur(){  
      if(this.uname.trim().length==0){
         this.$toast('用户名不能为空')
      }else{
         this.validUname = true
      }
    },
    upwdBlur(){  
      if(this.upwd.trim().length==0){
         this.$toast('密码不能为空')
      }else{
        this.validUpwd = true
      }
    },
    loginSubmit(){
      if(this.validUname&&this.validUpwd){
        //给upwd加密
        let sha256 = require("js-sha256").sha256
        let safeUpwd = sha256(this.upwd)   //加密后的密码
        this.axios.post('/api/u/sign_in?password='+this.upwd+'&phone='+this.uname)
                  .then(res=>{
                    if(res.data.code == 200){
                      //登录成功以后将token存在localStorage中
                      localStorage.setItem('token',res.data.data.user.token)
                      this.$router.push('/home')
                    }else if(res.data.code == 500){
                      this.$toast(res.data.message)
                    }
                  })
      }else if(!this.validUname){
        this.$toast('用户名不能为空')
      }else if(!this.validUpwd){
        this.$toast('密码不能为空')
      }
    },
    toRegister(){
      this.$router.push('/register');
    },
    findPwd(){
      this.$router.push('/findPwd');
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  padding:0 10%;
  .login-info{
    margin:40px 0;
    .register{
      float: left;
    }
    .pwd{
      border:none;
      font-size:14px;
      background: transparent;
      color:#1989fa;
      padding:10px;
    }
    .find-pwd{
      float: right;
    }
  }
}
</style>
