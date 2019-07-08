<template>
  <div>
    <header>
      <section>
        <van-popup v-model="date" style="width:100%" position="bottom">
          <van-datetime-picker
                  v-model="currentDate"
                  type="date"
                  :max-date="new Date()"
                  @confirm="sureSelectDate"
                  @cancel="cancelSelectDate"
          />
        </van-popup>
      </section>
      <div id="p-info" class="clear">
        <div id="p-info-top">
          <p :style="username===phone?'':fontSize">{{username===phone?phone:username+' ('+phone+')'}}</p>
          <p>余额 : <span class="bold">{{balance}}</span></p>
        </div>
        <div id="Bottom" ref="Bottom1">
          <div id="p-info-bottom-left">
            <div>
              <p>个人:</p>
              <div>
                <div class="task-details">
                  <p>总数: {{taskInfo.total}}</p>
                  <p>进行: {{taskInfo.running}}</p>
                </div>
                <div class="task-details">
                  <p>成功: {{taskInfo.success}}</p>
                  <p>成功率: {{((taskInfo.success/taskInfo.total)*100).toFixed(0) | successRate}}</p>
                </div>
              </div>
            </div>
            <div v-show="ifAgent">
              <p>团队:</p>
              <div>
                <div class="task-details">
                  <p>总数: {{teamInfo.total}}</p>
                  <p>进行: {{teamInfo.running}}</p></div>
                <div class="task-details">
                  <p>成功: {{teamInfo.success}}</p>
                  <p>成功率: {{((teamInfo.success/teamInfo.total)*100).toFixed(0) | successRate}}</p>
                </div>
              </div>
            </div>
          </div>
          <div id="p-info-bottom-right">
            <van-button type="info" class="timeSelector" @click="start" size="mini" :style="ifAgent?marginTop:''" >{{new Date(startDate).toLocaleDateString()}}</van-button>
          </div>
        </div>
      </div>
    </header>
    <section>
      <ul>
        <li @click="income"><span>收入</span> <van-icon name="arrow" class="icons" /></li>
        <li @click="pay"><span>提现记录</span> <van-icon name="arrow" class="icons" /></li>
        <li @click="cashWithdrawal"><span>提现</span> <van-icon name="arrow" class="icons" /></li>
        <li @click="next"><span>下级信息</span> <van-icon name="arrow" class="icons" /></li>
        <li><span>上级信息 : &nbsp;&nbsp;{{previewUser}} </span></li>
        <li><span>邀请码 : &nbsp;&nbsp;{{invitationCode}}</span><van-button  class="icons copy" v-clipboard:copy="href+'?code='+invitationCode"  v-clipboard:success="copySuccess" v-clipboard:error="copyError">复制</van-button></li>
        <li @click="updatePassword">修改密码</li>
        <li @click="loginOut">退出登录</li>
        <li></li>
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
        marginTop:{"margin-top":"76px"},
        fontSize:{"font-size":"14px","padding-top":"16px"},
        username:"",
        balance:"",
        phone:localStorage.getItem('phone'),
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
        currentDate: new Date().toLocaleDateString(),
        href:location.origin+location.pathname
      }
    },
    methods:{
      sureSelectDate(val){
        if(val.toLocaleDateString().toString() === new Date().toLocaleDateString().toString()){
          this.startDate=new Date().setHours(0,0,0,0);
          this.endDate=new Date().setHours(23,59,59,999)+1;
        }else{
          this.startDate=val.getTime();
          this.endDate=val.getTime()+24*60*60*1000;
        }
        this.axios.get('/api/task/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
          if(res.data.code === 200){
            this.taskInfo=res.data.data.statistic;
            if(this.ifAgent){
              this.axios.get('/api/team/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
                this.teamInfo=res.data.data.statistic;
              })
            }
          }else{
            this.$toast({message : res.data.message});
          }
        })
        this.date=false;
      },
      cancelSelectDate(){
        this.date=false;
      },
      start(){
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
            if(res.data.code === 200){
              localStorage.removeItem('userToken');
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
      next() {
        this.$router.push('/nextUser');
      },
      copySuccess(e){
        this.$toast({message:"复制成功！"})
      },
      copyError(e){

      },
    },
    activated() {
      this.endDate=new Date().getTime();
      this.startDate=new Date(new Date().toLocaleDateString()).getTime();
      let roleId=localStorage.getItem('roleId');
      if(roleId === '3'){
        this.ifAgent=true;
      }else{
        this.ifAgent=false;
      }
      this.axios.get('/api/u/info').then(res=>{
        if(res.data.code === 200){
          this.invitationCode=res.data.data.detail.inviteCode;
          this.username=res.data.data.detail.nickname;
          this.balance=res.data.data.detail.balance.toFixed(2);
          this.axios.get('/api/u/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
            this.taskInfo=res.data.data.statistic;
            this.axios.get('/api/team/member?pn=1&ps=10').then(res=>{
              this.previewUser=res.data.data.pname;
            })
            if(this.ifAgent){
              this.axios.get('/api/team/statistic?end='+this.endDate+'&start='+this.startDate).then(res=>{
                this.teamInfo=res.data.data.statistic;
              })
            }
          })
        }else{
          this.$toast({message : res.data.message})
        }
      });
    },
    created() {
        this.href=location.origin+location.pathname+'#/register';
    }
  }
</script>
<style lang="scss" scoped>
#p-info-top{
  display: flex;
  p{
    color: white;
    text-align: left;
    margin-left: 20px;
    font-size: 16px;
    padding:10px 0;
  }
  p:nth-child(1){
    padding-top: 14px;
    margin-left:10px;
    flex: 3;
  }
  p:nth-child(2){
    flex: 2;
    font-size: 14px;
  }
}
#Bottom{
  display: flex;
  margin-top:-8px;
  div{
    p{
      color: white;
    }
  }
}
#p-info-bottom-left{
  flex:3;
  div{
    margin: 8px;
  }
  div>p{
    text-align: left;
    font-size: 16px;
  }
}
#p-info-bottom-right{
  flex: 2;
}
#p-info-bottom-left .task-details {
  display: flex;
  p {
    flex: 1;
    text-align: left;
    font-size: 14px;
    margin-left: -10px;
  }
}
 .timeSelector{
  background: none;
  border:1px solid white;
  padding: 0px 6px;
  margin-top: 36px;
  margin-left: -34%;
}
  header{
    background: #62d3cc;
  }
  header div{
    flex: 1;
  }
  .bold{
    font-size: 20px;
    font-weight: bold;
    color: white;
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
    li:nth-child(9){
      height: 50px;
      border: none;
    }
  }
  .copy{
    color:#62d3cc;
    border:none;
  }
</style>
