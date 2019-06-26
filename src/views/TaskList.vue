<template>
  <div class="task-list">
   <!-- <van-progress :percentage="progress" color="green" :show-pivot="false"/> -->
    <van-button :disabled="!canReplay" @click="replayTaskList" size="large" type="info" round style="margin:20px auto;height:30px;line-height:30px;width:80%">
      <!--<van-icon name="replay"/> -->
      <span v-if="canReplay" >刷新任务</span>
      <span v-else>{{num}}s后可再次刷新</span>
    </van-button>
    <div class="all-task-list" v-if="taskList.length > 0" style="padding-bottom:60px">
      <van-panel v-for="(item,i) of taskList" :key="i" class="task-item" :title="'任务ID:'+item.number" 
      :desc="item.createTime|dateTime">
        <div style="display:flex;padding:15px;justify-content:space-between;align-items:center">
          <div v-if="item.createTime+300000-nowTime>0" style="color:red;font-weight:bold">{{(item.createTime+300000 - nowTime)|countdown}}</div>
          <div v-else><van-button size="small" style="background:#ff976a;color:#fff"> 任务失效</van-button></div>
          <div>
            <van-button :disabled="!(item.createTime+300000-nowTime>0)" type="primary" size="small" @click="getTask(item.id)">领取任务</van-button>
          </div>
        </div>
      </van-panel>
        <p v-show="taskList.length >= 10?true:false" @click="addMore" id="addMore">加载更多...</p>
    </div>
    <div v-else style="margin-top:100px">
        暂时还没有任务,点击按钮刷新
    </div>

    <van-dialog confirmButtonText="关闭" @confirm="refresh" v-model="showTaskDetail" style="text-align:center">
      <div class="card">
        <div class="card-header" style="text-align:left;padding:10px 15px;font-size:14px;display:flex;justify-content:space-between">
            <p>发布人:{{taskDetail.publisher}}</p>
            <p>{{taskDetail.createTime | dateTime}}</p>
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
      taskList:[],
      progress:0,
      pn:1,
      totalPage:0,     //一共有多少页
      taskDetail:{},
      showTaskDetail:false,
      qrcodeData:'',
      nowTime:new Date().getTime(),
      timer1:'',
      canReplay:true,
      num:4
    }
  },
  mounted(){
    this.axios.get(`/api/task/claimable?pn=1&ps=10`).then((res)=>{
            this.taskList = res.data.data.list.list;
            this.totalPage = Math.ceil(res.data.data.list.total/10)
        })
    this.timer1 = window.setInterval(()=>{
      this.nowTime = new Date().getTime()
      this.num--;
      if(this.num<=0){
        this.num = 4
        this.canReplay = true
      }
    },1000)
  },
  methods:{
    replayTaskList(){
      this.pn=1;
      this.canReplay = false;
        this.axios.get(`/api/task/claimable?pn=1&ps=10`).then((res)=>{
              this.taskList = res.data.data.list.list;
          })
      let timer=window.setInterval(()=>{
        this.progress += 1;
        if(this.progress >= 100){
          this.progress = 0;
          window.clearInterval(timer)
        }
      },30)
    },
      addMore(){
          this.pn++;
          this.axios.get(`/api/task/claimable?pn=${this.pn}&ps=10`).then((res)=>{
              this.taskList = res.data.data.list.list;
          })
      },
    refresh(){
        this.axios.get(`/api/task/claimable?pn=${this.pn}&ps=10`).then((res)=>{
            this.taskList = res.data.data.list.list;
            this.totalPage = Math.ceil(res.data.data.list.total/10)
        })
        this.timer1 = window.setInterval(()=>{
            this.nowTime = new Date().getTime()
            this.num--
            if(this.num<=0){
                this.num = 4
                this.canReplay = true
            }
        },1000)
    },
    getTask(tid){
      //领取任务
      this.axios.post('/api/task/claim?tid='+tid).then(res=>{
        if(res.data.code == 200){
          this.taskDetail = res.data.data.info;
          var qrcode = require('qrcode');
          qrcode.toDataURL(this.taskDetail.qrUrl,{
              errorCorrectionLevel:'H'
          },(err,url)=>{
              this.qrcodeData = url
          });
          this.showTaskDetail = true
        }else{
          this.$toast(res.data.message)
        }
      })
    }
  },
  destroyed(){
    this.timer1 = null 
  }
}
</script>

<style lang="scss" scoped>
 
.task-list{
  .all-task-list{
    .task-item{
      margin-top: 10px;
      width: 95%;
      margin-left: auto;
      margin-right: auto;
      border-radius: 4px;
      box-shadow: 0 5px 10px rgba(0,0,0,.15);
      .van-cell__title{
        text-align: left;
      }
    }
  }
}
    #addMore{
        font-size: 12px;
        color: gray;
        padding-top:6px;
    }
</style>
