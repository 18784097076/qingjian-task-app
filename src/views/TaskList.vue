<template>
    <div class="task-list">
        <!-- <van-progress :percentage="progress" color="green" :show-pivot="false"/> -->
        <van-button :disabled="!canReplay" @click="replayTaskList" size="large" type="info" round
                    style="border:none;background:#62d3cc;margin:20px auto;height:30px;line-height:30px;width:80%">
            <!--<van-icon name="replay"/> -->
            <span v-if="canReplay">刷新任务</span>
            <span v-else>{{num}}s后可再次刷新</span>
        </van-button>
        <div class="all-task-list" v-if="taskList.length > 0" style="padding-bottom:60px">
            <van-panel v-for="(item,i) of taskList" :key="i" class="task-item" :title="'ID:'+item.number"
                       :desc="item.createTime|dateTime" :status="'佣金 : '+item.receivePrice"
            v-show="item.createTime+300000-nowTime>0">
                <div style="display:flex;padding:6px 14px;justify-content:space-between;align-items:center">
                    <div v-if="item.createTime+300000-nowTime>0" style="color:#07c160;font-weight:bold">
                        {{(item.createTime+300000 - nowTime)|countdown}}
                    </div>
                    <div v-else>
                        <van-button size="small" style="background:#ff976a;color:#fff"> 任务失效</van-button>
                    </div>
                    <div>
                        <van-button :disabled="!(item.createTime+300000-nowTime>0)" type="primary" size="small"
                                    @click="getTask(item.id)" class="get-task">领取任务
                        </van-button>
                    </div>
                </div>
            </van-panel>
            <!--<p v-show="taskList.length >= 10?true:false" @click="addMore" id="addMore">加载更多...</p>-->
        </div>
        <div v-else style="margin-top:100px">
            暂时还没有任务,点击按钮刷新
        </div>
        <van-dialog confirmButtonText="关闭" @confirm="refreshTask" v-model="showTaskDetail" style="text-align:center">
            <div class="card">
                <div class="card-header"
                     style="text-align:left;padding:10px 15px;font-size:14px;display:flex;justify-content:space-between">
                    <p>发布人:{{taskDetail.publisher}}</p>
                    <p>{{taskDetail.createTime | dateTime}}</p>
                </div>
                <p class="small">任务id:{{taskDetail.number}}</p>
                <div class="card-content">
                    <img :src="qrcodeData">
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                taskList: [],
                progress: 0,
                pn: 1,
                totalPage: 0,     //一共有多少页
                taskDetail: {},
                showTaskDetail: false,
                qrcodeData: '',
                nowTime: new Date().getTime(),
                timer1: '',
                canReplay: true,
                num: 3,
                autoRefresh: true,
                refresh: null,
            }
        },
        activated() {
            this.axios.get(`/api/task/claimable?pn=1&ps=20`).then((res) => {
                if(res.data.code === 200){
                    this.taskList = res.data.data.list.list;
                    this.totalPage = Math.ceil(res.data.data.list.total / 20);
                    if(this.totalPage > 3){
                        let num = 0;
                        for(let i = 0 ; i< this.taskList.length ; i++){
                            if( this.nowTime - this.taskList[i].createTime >= 150000 ){
                                num++;
                            }
                        }
                        if(num >= 20){
                            this.axios.get(`/api/task/claimable?pn=${this.totalPage - 1}&ps=20`).then((res)=>{
                                this.taskList = res.data.data.list.list;
                            })
                        }
                    }
                }else{
                    this.$toast({message : res.data.message})
                }

            });
            setInterval(() => {
                this.nowTime = new Date().getTime();
            },1000);
            this.refresh = setInterval( () => {
                this.axios.get(`/api/task/claimable?pn=1&ps=20`).then((res) => {
                    this.taskList = res.data.data.list.list;
                });
            }, 10000);
        },
        methods: {
            refreshTask() {
                this.axios.get(`/api/task/claimable?pn=1&ps=20`).then((res) => {
                    if(res.data.code === 200){
                        this.taskList = res.data.data.list.list;
                        this.totalPage = Math.ceil(res.data.data.list.total / 20)
                    }else{
                        this.$toast({message : res.data.message})
                    }
                });
            },
            replayTaskList() {
                clearInterval(this.timer1);
                clearInterval(this.refresh);
                this.canReplay = false;
                this.num = 3;
                this.timer1 = setInterval(() => {
                    this.num--;
                    if (this.num <= 0) {
                        clearInterval(this.timer1);
                        this.num = 3;
                        this.canReplay = true;
                    }
                }, 1000);
                this.axios.get(`/api/task/claimable?pn=1&ps=20`).then((res) => {
                    if(res.data.code === 200){
                        this.taskList = res.data.data.list.list;
                    }else{
                        this.$toast({message : res.data.message})
                    }
                });
                this.refresh = setInterval( () => {
                    this.axios.get(`/api/task/claimable?pn=1&ps=20`).then((res) => {
                        this.taskList = res.data.data.list.list;
                    });
                }, 10000);
                /*
                    let u = navigator.userAgent;
                    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
                */
                this.pn = 1;
                this.autoRefresh = true;
                this.canReplay = false;
            },
            addMore() {
                this.pn++;
                this.axios.get(`/api/task/claimable?pn=${this.pn}&ps=20`).then((res) => {
                    if(res.data.code === 200){
                        this.taskList = res.data.data.list.list;
                    }else{
                        this.$toast({message : res.data.message});
                    }

                })
            },
            getTask(tid) {
                //领取任务
                this.axios.post('/api/task/claim?tid=' + tid).then(res => {
                    if (res.data.code === 200) {
                        this.taskDetail = res.data.data.info;
                        var qrcode = require('qrcode');
                        qrcode.toDataURL(this.taskDetail.qrUrl, {
                            width: '250',
                            height: '250',
                            margin:1,
                        }, (err, url) => {
                            this.qrcodeData = url
                        });
                        this.showTaskDetail = true
                    } else {
                        this.$toast(res.data.message);
                        this.refreshTask();
                    }
                })
            }
        },
        deactivated(){
            clearInterval(this.refresh);
        },
        destroyed() {
            setInterval(this.timer1);
            setInterval(this.refresh);
        }
    }
</script>

<style lang="scss" scoped>
    .get-task {
        background: #62d3cc;
        border: none;
    }

    .van-panel__header-value {
        color: #62d3cc;
    }

    .van-panel__header-value[data-v-24c1087d] {
        color: #62d3cc;
        padding-top: 10px;
        font-size: 16px;
    }
    .task-list {
        .all-task-list {
            .task-item {
                margin-top: 4px;
                width: 95%;
                margin-left: auto;
                margin-right: auto;
                border-radius: 4px;
                box-shadow: 0 4px 4px rgba(0, 0, 0, .1);

                .van-panel__header {
                    padding: 6px 14px;
                }

                .van-cell__title {
                    text-align: left;

                    .van-cell__label {
                        margin-top: 0px;
                    }
                }
            }
        }
    }

    #addMore {
        font-size: 12px;
        color: gray;
        padding-top: 6px;
    }


    .small {
        font-size: 12px;
        text-align: left;
        padding-left: 14px;
    }
</style>
