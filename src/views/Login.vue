<template>
  <div class="login">
    <h3>任务平台</h3>
    <div class="login-info">
      <div id="login-margin-left">
        <van-field  v-model="uname" placeholder="请输入用户名" @blur="unameBlur" right-icon="cross" @click-right-icon="uname=''"/>
        <van-field type="password"  v-model="upwd" placeholder="请输入密码"  @blur="upwdBlur"/>
        <button @click="toRegister" class="register pwd">新用户注册</button>
        <button @click="findPwd" class="find-pwd pwd">找回密码</button>
      </div>
      <van-button type="info" size="large" round @click="loginSubmit" id="login" style="background:#62d3cc;border:none">登录</van-button>
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
        let sha256 = require("js-sha256").sha256;
        let safeUpwd = sha256(this.upwd) ;  //加密后的密码
        this.axios.post('/api/u/sign_in?password='+this.upwd+'&phone='+this.uname)
                   .then(res=>{
                     if(res.data.code == 200){
                       localStorage.setItem('userToken',res.data.data.user.token);
                       localStorage.setItem('roleId',res.data.data.user.roleId);
                       localStorage.setItem('phone',this.uname);
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
    },
  },
  mounted(){
    let token=localStorage.getItem('userToken');
    if(token){
      this.$router.push('/home');
    }
  }
}
</script>

<style lang="scss" scoped>
  #login-margin-left{
    margin-left: -15px;
  }
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
      color:#62d3cc;
      padding:10px 0px 0px 14px;
    }
    .find-pwd{
      float: right;
    }
  }
}
  h3{
    padding-top:40px;
  }
  #login{
    margin:30px 0px;
    height: 40px;
    line-height: 40px;
  }
</style>
