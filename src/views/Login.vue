<template>
  <div class="login">
    <h3>任务平台</h3>
    <div class="login-info">
      <van-field label="用户名" v-model="uname" placeholder="请输入用户名" @blur="unameBlur" autofocus/>
      <van-field type="password" label="密码" v-model="upwd" placeholder="请输入密码"  @blur="upwdBlur"/>
      <van-button type="info" size="large" round style="margin-top:20px;" @click="loginSubmit">登录</van-button>
      <van-button size="large" round style="margin-top:10px;" @click="toRegister">注册</van-button>
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
        let safeUpwd = sha256(this.upwd)   //加密后的秘密
        // this.axios.post('http://www.smctask.cn:8080/user/login',{account:this.uname,password:safeUpwd,role:3})
        this.axios.post('/api/u/sign_in?password='+this.upwd+'&phone='+this.uname)
                   .then(res=>{
                     if(res.data.code == 200){
                       //登录成功以后将token存在localStorage中
                       localStorage.setItem('token',res.data.data.user.token);
                       localStorage.setItem('roleId',res.data.data.user.roleId);
                       this.$router.push('/home')
                     }else if(res.data.code == 500){
                       this.$toast(res.data.msg)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  padding:0 10%;
  .login-info{
    margin:40px 0;
  }
}
</style>
