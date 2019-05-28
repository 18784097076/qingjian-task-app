<template>
  <div class="task-list">
    <van-progress :percentage="progress" color="green" :show-pivot="false"/>
    <van-button @click="replayTaskList" size="large" type="info" round style="margin:20px auto;height:30px;line-height:30px;width:80%">
      <van-icon name="replay"/> 
      <span>刷新任务</span>  
    </van-button>
    <div class="all-task-list" v-if="taskList.length > 0">
      <van-panel v-for="(item,i) of taskList" :key="i" class="task-item" :title="'任务ID:'+item.id" 
      :desc="item.createTime|dateTime" status="赏金">
        <div style="display:flex;padding:15px;justify-content:space-between">
          <div>倒计时</div>
          <div>
            <van-button type="primary" size="small" @click="getTask(item.id)">领取任务</van-button>
          </div>
        </div>
      </van-panel>
    </div>
    <div v-else style="margin-top:100px">
        暂时还没有任务,点击按钮刷新
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      taskList:[],
      progress:0
    }
  },
  mounted(){
    this.axios.get('http://www.smctask.cn:8080/task/claimable?pn=1&ps=10').then((res)=>{    
            this.taskList = res.data.data.list.list
            console.log(this.taskList)
        })
  },
  methods:{
    replayTaskList(){
      //点击刷新
      this.axios.get('http://www.smctask.cn:8080/task/claimable?pn=1&ps=10').then((res)=>{    
            this.taskList = res.data.data.list.list
            console.log(this.taskList)
        })
      let timer=window.setInterval(()=>{
        this.progress += 1
        if(this.progress >= 100){
          this.progress = 0
          window.clearInterval(timer)
        }
      },30)
    },
    getTask(tid){
      //领取任务
      this.axios.put('http://www.smctask.cn:8080/task/claim?tid='+tid).then(res=>{
        if(res.code == 200){
          console.log('领取任务成功')
        }else{
          Toast({
            message: '领取失败',
            duration: 1000
            });  
        }
      })
    }
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
</style>
