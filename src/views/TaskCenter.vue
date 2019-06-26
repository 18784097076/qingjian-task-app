<template>
  <div class="task-center">
    <van-tabs v-model="active" @click="handleClick" title-active-color="#1989fa" color="#1989fa">
      <van-tab title="进行中">
        <div class="task-list" v-if="ongoingTask.length > 0" style="padding-bottom:20px;">
          <div  class="task-list-item" v-for="(item,i) in ongoingTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
          <p class="addMore" @click="loadMoreRunningTask" v-show="goingMore">加载更多...</p>
        </div>
        <div style="padding-top:100px;" v-else>
          暂时还没有进行中的任务
        </div>
      </van-tab>
      <van-tab title="成功">
        <div class="task-list" v-if="successTask.length > 0" style="padding-bottom:20px;">
          <div  class="task-list-item" v-for="(item,i) in successTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
          <p class="addMore" @click="loadMoreSuccessTask" v-show="successMore">加载更多...</p>
        </div>
        <div style="padding-top:100px;" v-else>
          暂时还没有成功的任务
        </div>
      </van-tab>
      <van-tab title="失败">
        <div class="task-list" v-if="failTask.length > 0" style="padding-bottom:20px;">
          <div  class="task-list-item" v-for="(item,i) in failTask" :key="i">
            <p>创建时间:{{item.createTime|dateTime}}</p>
            <div class="task-desc">
              <span>任务ID:{{item.id}}</span>
              <van-button type="info" size="small" @click="taskDetail(item.status,item.qrUrl)">查看详情</van-button>
            </div>
          </div>
          <p @click="loadMoreFailTask"  class="addMore" v-show="failMore">加载更多...</p>
        </div>
        <div style="padding-top:100px;" v-else>
          暂时还没有失败的任务
        </div>
      </van-tab>
    </van-tabs>
    <van-dialog confirmButtonText="关闭" v-model="showTaskDetail" style="text-align:center">
      <div class="card">
        <div class="card-header" style="display:flex;justify-content:space-between;padding:10px 15px;">
            <span>任务详情</span>
            <span :style="{color:getColor(taskStatus)}">{{taskStatus | status}}</span>
        </div>
        <div class="card-content">
            <img :src="qrcodeData">
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
      pnR:1,
      totalPageR:0,
      pnS:1,
      totalPageS:0,
      pnF:1,
      totalPageF:0,
      goingMore:true,
      successMore:true,
      failMore:true,
    }
  },
  methods:{
    handleClick(index,title){
      /*switch (index+1) {
        case 1:
          if(!this.ongoingTask.length>0){
            this.axios.get(`/api/task/claimed?pn=1&ps=10&status=1`).then(res=>{
              this.ongoingTask = res.data.data.list.list;
              this.totalPageR = Math.ceil(res.data.data.list.total/10);
              if(this.ongoingTask.length<res.data.data.list.total){
                this.goingMore=true;
              }else{
                this.goingMore=false;
              }
            });
          }
          break;
        case 2:
          if(!this.successTask.length>0){
            this.axios.get(`/api/task/claimed?pn=1&ps=10&status=2`).then(res=>{
              this.successTask = res.data.data.list.list;
              this.totalPageS = Math.ceil(res.data.data.list.total/10);
              if(this.successTask.length<res.data.data.list.total){
                this.successMore=true;
              }else{
                this.successMore=false;
              }
            });
          }
          break;
        case 3:
          if(!this.failTask.length>0){
            this.axios.get(`/api/task/claimed?pn=1&ps=10&status=3`).then(res=>{
              this.failTask = res.data.data.list.list;
              this.totalPageF = Math.ceil(res.data.data.list.total/10);
              if(this.failTask.length<res.data.data.list.total){
                this.failMore=true;
              }else{
                this.failMore=false;
              }
            });
          }
          break;
      }*/
    },
    taskDetail(status,qrurl){
      this.showTaskDetail = true;
      this.taskStatus = status;
      this.qrcodeUrl = qrurl;
      var qrcode = require('qrcode');
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
        this.pnR++;
        this.axios.get(`/api/task/claimed?pn=${this.pnR}&ps=10&status=1`).then(res=>{
          this.ongoingTask = this.ongoingTask.concat(res.data.data.list.list);
          if(this.ongoingTask.length<res.data.data.list.total){
            this.goingMore=true;
          }else{
            this.goingMore=false;
          }
        })
      }
    },
    loadMoreSuccessTask(){
      //加载更多成功的任务
      if(this.pnS<this.totalPageS){
        this.pnS++;
        this.axios.get(`/api/task/claimed?pn=${this.pnS}&ps=10&status=2`).then(res=>{
          this.successTask = this.successTask.concat(res.data.data.list.list);
          if(this.successTask.length<res.data.data.list.total){
            this.successMore=true;
          }else{
            this.successMore=false;
          }
        })
      }
    },
    loadMoreFailTask(){
      //加载更多失败的任务
      if(this.pnF<this.totalPageF){
        this.pnF++;
        this.axios.get(`/api/task/claimed?pn=${this.pnF}&ps=10&status=3`).then(res=>{
          this.failTask = this.failTask.concat(res.data.data.list.list);
          if(this.failTask.length<res.data.data.list.total){
            this.failMore=true;
          }else{
            this.failMore=false;
          }
        })
      }
    }
  },
  mounted(){
    //进行中的任务
    /*this.axios.get(`/api/task/claimed?pn=1&ps=10&status=1`).then(res=>{
      this.ongoingTask = res.data.data.list.list;
      this.totalPageR = Math.ceil(res.data.data.list.total/10);
      if(this.ongoingTask.length<res.data.data.list.total){
        this.goingMore=true;
      }else{
        this.goingMore=false;
      }
    });*/
    this.axios.get(`/api/task/claimed?pn=1&ps=10&status=1`).then(res=>{
      this.ongoingTask = res.data.data.list.list;
      this.totalPageR = Math.ceil(res.data.data.list.total/10);
      if(this.ongoingTask.length<res.data.data.list.total){
        this.goingMore=true;
      }else{
        this.goingMore=false;
      }
    });
    this.axios.get(`/api/task/claimed?pn=1&ps=10&status=2`).then(res=>{
      this.successTask = res.data.data.list.list;
      this.totalPageS = Math.ceil(res.data.data.list.total/10);
      if(this.successTask.length<res.data.data.list.total){
        this.successMore=true;
      }else{
        this.successMore=false;
      }
    });
    this.axios.get(`/api/task/claimed?pn=1&ps=10&status=3`).then(res=>{
      this.failTask = res.data.data.list.list;
      this.totalPageF = Math.ceil(res.data.data.list.total/10);
      if(this.failTask.length<res.data.data.list.total){
        this.failMore=true;
      }else{
        this.failMore=false;
      }
    });
  },
}
</script>task

<style lang="scss" scoped>
.van-button--large {
    width: 90%;
    height: 30px;
    line-height: 30px;
    margin-top: 10px;
}
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
.addMore{
  font-size: 12px;
  padding:4px 0;
}
</style>
