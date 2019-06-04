<template>
  <div class="find-pwd">
    <header>
        <span><van-icon name="arrow-left" @click="returnToLogin"/></span>
        找回密码
    </header>  
    <van-cell-group>
      <van-field label="手机号" v-model="phone" placeholder="请输入手机号" :error-message="phoneMsg" @blur="verifyPhone" @focus="phoneMsg=''"/>
      <van-field
        v-model="code"
        center
        clearable
        label="短信验证码"
        placeholder="请输入短信验证码"
        @blur="verifyCode"
        :error-message="codeMsg"
        @focus="codeMsg=''"
      >
      <van-button slot="button" size="small" type="info" @click="getCode" :disabled="!canGetCode">
        <span v-if="canGetCode">发送验证码</span>
        <span v-else>{{this.num}}s后重新获取</span>
      </van-button>
      </van-field>
       <van-field label="新密码" type="password" v-model="newPwd" placeholder="请输入新密码" :error-message="newPwdMsg" @blur="verifyNewPwd" @focus="newPwdMsg=''"/>
       <van-field label="确认新密码" type="password" v-model="confirmNewPwd" placeholder="确认新密码" :error-message="newConfrimPwdMsg" @blur="verifyConfirmNewPwd" @focus="newConfrimPwdMsg=''"/>
    </van-cell-group>
    <div style="padding:20px 15px;">
      <van-button type="info" size="large" round @click="resetPwd">确定</van-button>
    </div>  
  </div>
</template>

<script>
export default {
  data(){
    return {
      phone:'',
      code:'',
      codeMsg:'',
      canGetCode:true,
      num:30,
      phoneMsg:'',
      validPhone:false,
      newPwdMsg:'',
      newPwd:'',
      validCode:false, 
      validNewPwd:false,
      confirmNewPwd:'',     //确认新密码
      newConfrimPwdMsg:'',   //确认新密码的错误提示
      validConfirmNewPwd:false    //确认密码验证是否通过
    }
  },
  methods:{
    returnToLogin(){
        this.$router.push('/login');
    },
    getCode(){
      if(this.validPhone){
        this.axios.post(`/api/code/phone?number=${this.phone}&type=2`).then(res=>{
          console.log(res)
          if(res.code==200){
            this.validPhone = true
            this.canGetCode = false;
            let timer = window.setInterval(()=>{
              this.num--;
              if(this.num<=1){
                this.num=30
                this.canGetCode = true
                window.clearInterval(timer)
              }
            },1000)
          }else{
            this.validPhone = false
            this.phoneMsg = res.message
          }    
        })
      }
    },
    verifyPhone(){
      if(this.phone.trim()==""){
        this.phoneMsg = '电话号码不能为空'
        return
      }
      let regExp = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
      if(!regExp.test(this.phone)){
        this.phoneMsg = '请输入正确的手机号'
        return
      }
      this.validPhone = true
    },
    verifyCode(){
      if(this.code.trim()==''){
        this.codeMsg = '验证码不能为空'
        return 
      }
      this.validCode = true
    },
    verifyNewPwd(){
      if(this.newPwd.trim().length<6){
        this.newPwdMsg = '新密码至少包含6位'
        return
      }
      this.validNewPwd = true
    },
    verifyConfirmNewPwd(){
      if(this.confirmNewPwd.trim()!==this.newPwd){
        this.newConfrimPwdMsg = '密码不一致'
        return
      }
      this.validConfirmNewPwd = true
    },
    resetPwd(){
      if(this.validPhone&&this.validCode&&this.validNewPwd&&this.validConfirmNewPwd){
        console.log('可以发送请求了')
         this.axios.post(`/api/u/find?code=${this.code}&password=${this.newPwd}&phone=${this.phone}`).then(res=>{
           console.log(res)
           if(res.code==200){   
             this.$toast("重置密码成功")
           }else if(res.data.code==500){
             this.codeMsg=res.data.message
           }
         })
      }else{
        console.log('还不能发送请求')
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.find-pwd{
  header{
      text-align: center;
      line-height:50px;
      /*color: #ccc;*/
      font-weight: bold;
      font-size: 1.17em;
  }
  header span{
      position: absolute;
      left:10px;
      top:4px;
      color: #26a2ff;
  }
}
</style>
