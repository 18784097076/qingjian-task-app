<template>
  <div class="task-center">
    <div class="query-btn">
      <span>选择日期 : </span><van-button plain type="info" size="small" @click="queryTask">{{queryTime.toLocaleDateString()}}</van-button>
    </div>
    <van-popup v-model="showDatePicker" style="width:100%;">
      <van-datetime-picker @confirm="confirmDate" @cancel="cancelDate" v-model="currentDate" type="date" :min-date="minDate"/>
    </van-popup>
    <table>
      <tr>
          <td>类别</td>
          <td>总数</td>
          <td>进行中</td>
          <td>成功</td>
          <td>失败</td>
          <td>超时</td>
          <td>成功率</td>
      </tr>
      <tr>
        <td>个人</td>
        <td>{{individual.total}}</td>
        <td>{{individual.running}}</td>
        <td>{{individual.success}}</td>
        <td>{{individual.failure}}</td>
        <td>{{individual.timeout}}</td>
        <td>{{isNaN(individual.success/individual.total)?'--':(individual.success/individual.total).toFixed(2)+'%'}}</td>
      </tr>
      <tr>
        <td>团队</td>
        <td>{{team.total}}</td>
        <td>{{team.running}}</td>
        <td>{{team.success}}</td>
        <td>{{team.failure}}</td>
        <td>{{team.timeout}}</td>
        <td>{{ isNaN(team.success/team.total)?'--':(team.success/team.total).toFixed(2)+'%'}}</td>
      </tr>
  </table>
    <van-tabs v-model="active" @click="handleClick" title-active-color="#1989fa" color="#1989fa">
      <van-tab title="进行中">
        <div class="task-list" v-if="ongoingTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in ongoingTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
        </div>
        <div style="padding-top:100px;" v-else>
          暂时还没有进行中的任务
        </div>
      </van-tab>
      <van-tab title="成功">
        <div class="task-list" v-if="successTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in successTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
        </div>
        <div v-else>
          暂时还没有成功的任务
        </div>
      </van-tab>
      <van-tab title="失败">
        <div class="task-list" v-if="failTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in failTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
        </div>
        <div v-else>
          暂时还没有失败的任务
        </div>
      </van-tab>
    </van-tabs>
    <van-dialog v-model="showTaskDetail" style="text-align:center">
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;padding:10px 15px;">
            <span>任务详情</span>
            <span :style="{color:getColor(taskStatus)}">{{taskStatus | status}}</span>
        </div>
        <div class="card-content">
            <img :src="qrcodeData">
        </div>
        <div class="card-footer">
            {{qrcodeUrl}}
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return {
      queryTime:new Date(),
      active:0,
      ongoingTask:[],
      successTask:[],
      failTask:[],
      showDatePicker:false,
      minDate:new Date(2019,0,1),
      currentDate:new Date(),
      showTaskDetail:false,
      qrcodeData:'',
      taskStatus:'',
      qrcodeUrl:'',
      individual:{},   //个人统计
      team:{}     //团队统计
    }
  },
  mounted(){
    let start = new Date().getTime()
    let end = start + 86400000 - 1
    this.axios.get('http://www.smctask.cn:8080/user/team?start='+start+'&end='+end).then(res=>{
      console.log('团队统计',res.data.data.statistic)
      this.individual = res.data.data.statistic
    })
    this.axios.get('http://www.smctask.cn:8080/task/statistic?start='+start+'&end='+end).then(res=>{
      console.log('个人统计',res.data.data.statistic)
      this.team = res.data.data.statistic
    })
  },
  methods:{
    handleClick(index,title){
      if(index==0){
        this.axios.get('http://www.smctask.cn:8080/task/claimed?pn=1&status=1').then(res=>{
          console.log(res.data.data.list.list)
          this.ongoingTask = res.data.data.list.list
        })
      }else if(index==1){
        console.log('点击了成功')
        this.axios.get('http://www.smctask.cn:8080/task/claimed?pn=1&status=2').then(res=>{
          console.log(res.data.data.list.list)
          this.successTask = res.data.data.list.list
        })
      }else if(index==2){
        console.log('点击了失败')
        this.axios.get('http://www.smctask.cn:8080/task/claimed?pn=1&status=3').then(res=>{
          console.log(res.data.data.list.list)
          this.failTask = res.data.data.list.list
        })
      }
    },
    queryTask(){
      //点击按钮，弹出日期选择
      this.showDatePicker = true
    },
    confirmDate(value){
      //点击确定,获取到选中的日期,查询选中的日期的任务统计
      this.showDatePicker = false
      let start = new Date(value).getTime()
      let end = start + 86400000 - 1
      //console.log(start,end)
      //团队 http://www.smctask.cn:8080/user/team?start=1551369600000&end=1559059199000
      //个人 http://www.smctask.cn:8080/task/statistic?start=1551369600000&end=1559059199000
      this.axios.get('http://www.smctask.cn:8080/user/team?start='+start+'&end='+end).then(res=>{
        console.log('团队统计',res.data.data.statistic)
        this.individual = res.data.data.statistic
      })
      this.axios.get('http://www.smctask.cn:8080/task/statistic?start='+start+'&end='+end).then(res=>{
        console.log('个人统计',res.data.data.statistic)
        this.team = res.data.data.statistic
      })
    },
    cancelDate(){
      this.showDatePicker = false
      console.log('点击了取消')
    },
    taskDetail(status,qrurl){
      console.log('查看任务详情')
      this.showTaskDetail = true
      this.taskStatus = status
      this.qrcodeUrl = qrurl
      var qrcode = require('qrcode')
        qrcode.toDataURL(qrurl,{
            errorCorrectionLevel:'H'
        },(err,url)=>{
            this.qrcodeData = url
        })
    },
    getColor(status){
        if(status == 3 ){
            return 'red'
        }else if(status == 2){
            return 'green'
        }else if(status == 1){
          return 'blue'
        }
    },
  }
}
</script>task

<style lang="scss" scoped>
.task-center{
  .query-btn{
    margin:20px 0;
  }
  .van-tabs--line{
    padding-bottom: 45px;
  }
  table{
        border-collapse:collapse;
        font-size: 14px;
        width:100%;
        text-align:center;
        th, td{
        border: 1px solid #e8e8e8;
        padding:5px;
        }
    }
  .task-list{
    .task-list-item{    
      font-size:14px; 
      text-align:left;
      border-bottom:1px solid #eee;
      padding:5px 15px;
      line-height: 30px;
      .task-desc{
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
