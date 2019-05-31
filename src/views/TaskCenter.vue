<template>
  <div class="task-center">
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
          <van-button size="large" type="info" @click="loadMoreRunningTask" round>加载更多</van-button>
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
          <van-button size="large" type="info" @click="loadMoreSuccessTask" round>加载更多</van-button>
        </div>
        <div style="padding-top:100px;" v-else>
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
          <van-button size="large" type="info" @click="loadMoreFailTask" round>加载更多</van-button>
        </div>
        <div style="padding-top:100px;" v-else>
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
      failTask:[
        {"id":703251,"phone":null,"qrUrl":"https://weixin110.qq.com/s/59e6f8fc689","createTime":1558939556238,"updateTime":1558939863865,"status":3,"publisher":"QAQ","receiver":null},
        {"id":703246,"phone":"18026526927","qrUrl":"https://weixin110.qq.com/s/f6ef13f2780","createTime":1558939544950,"updateTime":1558940028259,"status":3,"publisher":"w002","receiver":null},
        {"id":703234,"phone":"15302871064","qrUrl":"https://weixin110.qq.com/s/5f13997f9e0","createTime":1558939519754,"updateTime":1558940004323,"status":3,"publisher":"w001","receiver":null},
        {"id":703228,"phone":"18925250409","qrUrl":"https://weixin110.qq.com/s/679d6efe1c4","createTime":1558939492846,"updateTime":1558939976911,"status":3,"publisher":"w002","receiver":null}
      ],
      showDatePicker:false,
      minDate:new Date(2019,0,1),
      currentDate:new Date(),
      showTaskDetail:false,
      qrcodeData:'',
      taskStatus:'',
      qrcodeUrl:'',
      pnR:1,
      totalPageR:0,
      pnS:1,
      totalPageS:0,
      pnF:1,
      totalPageF:0
    }
  },
  mounted(){
    //进行中的任务
    this.axios.get(`/api/task/claimed?pn=${this.pnR}&ps=10&status=1`).then(res=>{
      //console.log(res.data.data.list)
      this.ongoingTask = res.data.data.list.list
      this.totalPageR = Math.ceil(res.data.data.list.total/10)
    })
    this.axios.get(`/api/task/claimed?pn=${this.pnS}&ps=10&status=2`).then(res=>{
      console.log(res.data.data.list.list)
      this.successTask = res.data.data.list.list
      this.totalPageS = Math.ceil(res.data.data.list.total/10)
    })
    // this.axios.get(`/api/task/claimed?pn=${this.pnF}&ps=10&status=3`).then(res=>{
    //   console.log(res.data.data.list.list)
    //   this.failTask = res.data.data.list.list
    // })
  },
  methods:{
    handleClick(index,title){
      // if(index==1){
      //   console.log('点击了成功')
      //   this.axios.get(`/api/task/claimed?pn=${this.pnS}&ps=10&status=2`).then(res=>{
      //     console.log(res.data.data.list.list)
      //     this.successTask = res.data.data.list.list
      //     this.totalPageS = Math.ceil(res.data.data.list.total/10)
      //   })
      // }else if(index==2){
      //   console.log('点击了失败')
      //   this.axios.get(`/api/task/claimed?pn=${this.pnF}&ps=10&status=3`).then(res=>{
      //     console.log(res.data.data.list.list)
      //     this.failTask = res.data.data.list.list
      //   })
      // }
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
    loadMoreRunningTask(){
      //加载更多进行中的任务
      if(this.pnR<this.totalPageR){
        this.pnR++
        this.axios.get(`/api/task/claimed?pn=${this.pnR}&ps=10&status=1`).then(res=>{
          console.log(res.data.data.list.list)
          this.ongoingTask = this.ongoingTask.concat(res.data.data.list.list)
        })
      }
    },
    loadMoreSuccessTask(){
      //加载更多成功的任务
      if(this.pnS<this.totalPageS){
        this.pnS++
        this.axios.get(`/api/task/claimed?pn=${this.pnS}&ps=10&status=2`).then(res=>{
          console.log(res.data.data.list.list)
          this.successTask = this.ongoingTask.concat(res.data.data.list.list)
        })
      }
    },
    loadMoreFailTask(){
      //加载更多失败的任务
      if(this.pnF<this.totalPageF){
        this.pnF++
        this.axios.get(`/api/task/claimed?pn=${this.pnF}&ps=10&status=3`).then(res=>{
          console.log(res.data.data.list.list)
          this.failTask = this.ongoingTask.concat(res.data.data.list.list)
        })
      }
    }
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
