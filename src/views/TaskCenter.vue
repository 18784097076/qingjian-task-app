<template>
  <div class="task-center">
    <div class="query-btn">
      <van-button plain type="info" size="small">{{queryTime}}</van-button>
    </div>
    <van-tabs v-model="active" @click="handleClick" title-active-color="#1989fa" color="#1989fa">
      <van-tab title="进行中">
        <div class="task-list" v-if="ongoingTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in ongoingTask" :key="i">
            <div>
              <p>任务ID:{{item.id}}</p>
              <p>创建时间:{{item.createTime}}</p>
            </div>
            <van-button type="info" size="small">查看详情</van-button>
          </div>
        </div>
        <div style="padding-top:100px;" v-else>
          暂时还没有进行中的任务
        </div>
      </van-tab>
      <van-tab title="成功">
        <div class="task-list" v-if="successTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in successTask" :key="i">
            <span>任务ID:{{item.id}}</span>
            <van-button type="info" size="small">查看详情</van-button>
          </div>
        </div>
        <div v-else>
          暂时还没有成功的任务
        </div>
      </van-tab>
      <van-tab title="失败">
        <div class="task-list" v-if="failTask.length > 0">
          <div  class="task-list-item" v-for="(item,i) in failTask" :key="i">
            <span>任务ID:{{item.id}}</span>
            <van-button type="info" size="small">查看详情</van-button>
          </div>
        </div>
        <div v-else>
          暂时还没有失败的任务
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data(){
    return {
      queryTime:new Date().toLocaleDateString(),
      active:0,
      ongoingTask:[],
      successTask:[],
      failTask:[]
    }
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
    }
  }
}
</script>task

<style lang="scss" scoped>
.task-center{
  .query-btn{
    margin:20px 0;
  }
  .task-list{
    .task-list-item{
      display: flex;
      justify-content: space-between;
      border-bottom:1px solid #eee;
      padding:5px 15px;
      line-height: 30px;
    }
  }
}
</style>
