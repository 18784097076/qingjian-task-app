<template>
  <div>
    <header>
      <section>
        <van-popup v-model="date" style="width:100%">
          <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  :max-date="new Date()"
                  @confirm="sureSelectDate"
                  @cancel="cancelSelectDate"
          />
        </van-popup>
      </section>
      <div id="pinfo">
        <div id="left">
          <div class="personalInfo">
            <p>{{username}}</p>
            <p>余额：</p>
            <p><span>￥{{balance}}</span></p>
          </div>
        </div>
        <div id="right">
          <div class="time">
            <van-button type="info" class="timeSelector" @click="start" size="mini" >{{new Date(startDate).toLocaleDateString()}}</van-button>
            <span style="color: white;font-size: 24px"> - </span>
            <van-button type="info" @click="end" size="mini" class="timeSelector">{{new Date(endDate).toLocaleDateString()}}</van-button>
          </div>
          <div class="team">
            <div class="taskInfo">
              <p v-show="ifAgent"><span style="color: white">个人：</span></p>
              <p>任务总数: {{taskInfo.total}}</p>
              <p>进行: {{taskInfo.running}}</p>
              <p>成功: {{taskInfo.success}}</p>
              <p>成功率: {{(taskInfo.success/taskInfo.total).toFixed(2)*100 | successRate}}</p>
            </div>
            <div class="taskInfo" v-show="ifAgent">
              <p><span style="color: white">团队：</span></p>
              <p>任务总数: {{teamInfo.total}}</p>
              <p>进行: {{teamInfo.running}}</p>
              <p>成功: {{teamInfo.success}}</p>
              <!--<p>失败: {{teamInfo.failure}}</p>-->
              <!--<p>超时: {{teamInfo.timeout}}</p>-->
              <p>成功率: {{(teamInfo.success/teamInfo.total).toFixed(2)*100 | successRate}}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
    <section>
      <ul>
        <li @touchstart="income"><span>收入</span> <van-icon name="arrow" class="icons" /></li>
        <li @touchstart="pay"><span>提现记录</span> <van-icon name="arrow" class="icons" /></li>
        <li @touchstart="cashWithdrawal"><span>提现</span> <van-icon name="arrow" class="icons" /></li>
        <!--<li @touchstart="alipayInfo"><span>支付宝账户</span> <van-icon name="arrow" class="icons" /></li>-->
        <li @touchstart="next"><span>下级信息</span> <van-icon name="arrow" class="icons" /></li>
        <li><span>上级信息 : &nbsp;&nbsp;{{previewUser}} </span></li>
        <li><span>邀请码 : &nbsp;&nbsp;{{invitationCode}}</span><van-button  class="icons copy" v-clipboard:copy="'http://localhost:8080/#/register?code='+invitationCode"  v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</van-button></li>
        <li @click="updatePassword">修改密码</li>
        <li @touchstart="loginOut">退出登录</li>
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
      ifOldPasswordCorrect:"",
      invitationCode:"",
      taskInfo:{},
      previewUser:"",
      ifAgent:true,
      date:false,
      startDate:'',
      endDate:'',
      teamInfo:{},
      currentDate: new Date(),
      dateType:1,
    }
  },
  methods:{
    sureSelectDate(val){
      if(this.dateType===1){
        if(val.toLocaleDateString().toString()===new Date().toLocaleDateString().toString()){
          this.startDate=new Date(new Date().toLocaleDateString()).getTime();
        }else{
          this.startDate=val.getTime();
        }
        this.axios.get('/api/task/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
          this.taskInfo=res.data.data.statistic;
          if(this.ifAgent){
          this.axios.get('/api/team/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
              this.teamInfo=res.data.data.statistic;
            })
          }
        })
      }else{
        this.endDate=val.getTime();
        this.axios.get('/api/task/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
          this.taskInfo=res.data.data.statistic;
          if(this.ifAgent) {
            this.axios.get('/api/team/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
              this.teamInfo=res.data.data.statistic;
            })
          }
        })
      }
      this.date=false;
    },
    cancelSelectDate(){
      this.date=false;
    },
    start(){
      this.dateType=1;
      this.date=true;
    },
    end(){
      this.dateType=2;
      this.date=true;
    },
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
        this.axios.post('/api/u/sign_out').then(res=>{
          if(res.data.code===200){
            localStorage.removeItem('token');
            this.$router.push('/login');
          }else{
            this.$toast({message:res.data.message})
          }
        })
      })
    },
    checkPassword(){
      this.msg="";
      if(this.password!==this.verifyPassword){
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
      // let params='op='+op+'&np='+np;
      if(this.ifClose){
        if(this.msg===""){
          //this.axios.post('http://www.smctask.cn:8080/user/password',params).then(res=>{
          this.axios.post('/api/u/password?np='+this.password+'&op='+this.oldPassword).then(res=>{
            if(res.data.code===200){
              let that =this;
              this.$toast({message:'修改密码成功，请重新登录！',onClose() {
                  this.msg="";
                  this.oldPassword="";
                  this.verifyPassword="";
                  this.password="";
                  that.$router.push('/login');
                },duration:2000});
              done();
            }else if(res.data.code===500){
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
    },
    cashWithdrawal(){
      this.$router.push('/cashWithdrawal')
    },
    preview(){
      this.$router.push('/previewUser');
    },
    next() {
      this.$router.push('/nextUser');
    },
    copySuccess(e){
      // console.log('copy',e.text)
    },
    copyError(e){
      // console.log('failed',e)
    },
    // alipayInfo(){
    //   this.$router.push('/alipayInfo');
    // }
  },
  activated() {
    this.endDate=new Date().getTime();
    this.startDate=new Date(new Date().toLocaleDateString()).getTime();
    let roleId=localStorage.getItem('roleId');
    if(roleId==3){
      this.ifAgent=true;
    }else{
      this.ifAgent=false;
    }
    //this.axios.get('http://www.smctask.cn:8080/user/detail').then(res=>{
    this.axios.get('/api/u/info').then(res=>{
      if(res.data.code===200){
        this.invitationCode=res.data.data.detail.inviteCode;
        this.username=res.data.data.detail.nickname;
        this.balance=res.data.data.detail.balance.toFixed(2);
        this.axios.get('/api/task/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
          this.taskInfo=res.data.data.statistic;
          if(this.ifAgent){
            this.axios.get('/api/team/member?pn=1&ps=10').then(res=>{
                this.previewUser=res.data.data.pname;
              }).then(this.axios.get('/api/team/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
                this.teamInfo=res.data.data.statistic;
              }))
          }
        })
      }else{
        let that=this;
        this.$toast({message:'您的身份已过期,请重新登陆!',onClose() {
            that.$router.push('/login');
          },duration:2000});
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  header{
    background: #26a2ff;
    display:flex;
  }
  .timeSelector{
    background: #26a2ff;
    border: 1px solid white;
    padding:0 4px;
  }
  header div{
    flex: 1;
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
  li:nth-child(7){
    margin-top:20px;
  };
  .copy{
    color:#26a2ff;
    border:none;
  }
  #pinfo{
    display: flex;
  }
  #right{
    flex: 3;
    display: flex;
    flex-direction: column;
  }
  #right .team{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .taskInfo p{
    color: white;
    font-size: 12px;
    text-align: left;
    padding-left: 20%;
  }
  #left{
    flex: 2;
  }
  .personalInfo{
    margin-top: 20px;
  }
  .personalInfo p{
    color:white;
    line-height: 24px;
  }
  .time{
    margin-bottom: 6px;
  }
</style>
