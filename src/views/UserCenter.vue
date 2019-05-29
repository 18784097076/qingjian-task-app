<template>
  <div>
    <header>
      <p>{{username}}</p>
      <p>余额：<span>￥{{balance}}</span></p>
    </header>
    <section>
      <ul>
        <li @click="income"><span>收入</span> <van-icon name="arrow" class="icons" /></li>
        <li @click="pay"><span>支出</span> <van-icon name="arrow" class="icons" /></li>
        <li>邀请码</li>
        <li @click="updatePassword">修改密码</li>
        <li @click="loginOut">退出登录</li>
      </ul>
      <van-dialog
              v-model="show"
              title="修改密码"
              show-cancel-button
              @confirm="changePassword"
              @cancel="cancel"
              :beforeClose="beforeClose"
      >
        <div>
          <van-field
                  v-model="oldPassword"
                  type="password"
                  label="旧密码"
                  placeholder="请输入旧密码"
                  :error-message="ifOldPasswordCorrect"
          />
          <van-field
                  v-model="password"
                  type="password"
                  label="密码"
                  placeholder="请输入密码"
          />
          <van-field
                  v-model="verifyPassword"
                  type="password"
                  label="确认密码"
                  placeholder="请确认密码"
                  :error-message="msg"
                  @blur="checkPassword"
          />
        </div>
      </van-dialog>
    </section>
  </div>
</template>

<script>
  // import {Dialog} from 'vant';
export default {
  data(){
    return{
      username:"",
      balance:"",
      oldPassword:"",
      password:"",
      verifyPassword:"",
      msg:"",
      show: false,
      ifClose:true,
      ifOldPasswordCorrect:""
    }
  },
  methods:{
    income(){
      this.$router.push('/income');
    },
    pay(){
      this.$router.push('/pay');
    },
    loginOut(){
      this.$dialog.confirm({
        title: '退出登录',
        message: '你确定要退出当前账户吗？'
      }).then(() => {
        localStorage.removeItem('token');
        this.$router.push('/login');
      }).catch(() => {

      });
    },
    checkPassword(){
      this.msg="";
      if(this.password!=this.verifyPassword){
        this.msg="两次输入密码不匹配！";
      }
    },
    updatePassword(){
      this.show=true;
    },
    beforeClose(action,done){
      let sha256 = require("js-sha256").sha256;
      let op = sha256(this.oldPassword);
      let np = sha256(this.password);
      let params='op='+op+'&np='+np;
      if(this.ifClose){
        if(this.msg==""){
          this.axios.post('http://www.smctask.cn:8080/user/password',params).then(res=>{
            if(res.data.code=='200'){
              let that =this;
              this.$toast({message:'修改密码成功，请重新登录！',onClose() {
                  this.msg="";
                  this.oldPassword="";
                  this.verifyPassword="";
                  this.password="";
                  that.$router.push('/login');
                },duration:2000});
              done();
            }else if(res.data.code=='500'){
              this.ifOldPasswordCorrect="你输入的旧密码错误！";
              done(false);
            }
          })
        }else{
          done(false);
        }
      }else{
        done();
      }

    },
    changePassword(){
      this.ifClose=true;
    },
    cancel(){
      this.ifClose=false;
    }
  },
  created(){
    this.axios.get('http://www.smctask.cn:8080/user/detail').then(res=>{
      this.username=res.data.data.detail.nickname;
      this.balance=res.data.data.detail.balance.toFixed(2);
    })
  }
}


</script>

<style lang="scss" scoped>
  header{
    background: #26a2ff;
    padding:5px 0;
  }
  header p{
    color:white;
    text-align: left;
    margin-left:10px;
    font-size: 14px;
    line-height:24px;
  }
  header p span{
    font-size: 18px;
    font-style: italic;
  }
  ul{
    li{
      width: 90%;
      margin:0 auto;
      line-height:40px;
      color: grey;
      border-bottom:1px solid #eee;
      text-align: left;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

</style>
