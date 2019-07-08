<template>
    <div class="task-center">
        <van-tabs v-model="active" @click="handleClick" title-active-color="#62d3cc" color="#62d3cc">
            <van-tab title="进行中">
                <div class="task-list" v-if="ongoingTask.length > 0" style="padding-bottom:20px;">
                    <div class="task-list-item" v-for="(item,i) in ongoingTask" :key="i">
                        <div id="task-details">
                            <p>创建时间:{{item.createTime|dateTime}}</p>
                            <div v-if="item.createTime+300000-nowTime>0" style="color:#07c160;font-weight:bold">
                                {{(item.createTime+300000 - nowTime)|countdown}}
                            </div>
                            <div v-else style="color:#07c160;font-weight:bold">
                                等待反馈
                            </div>
                        </div>
                        <div class="task-desc">
                            <span>任务ID:{{item.number}}</span>
                            <van-button type="info" size="small"
                                        @click="taskDetail(item.status,item.qrUrl,item.publisher,item.number)"
                                        class="task-details">查看详情
                            </van-button>
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
                    <div class="task-list-item" v-for="(item,i) in successTask" :key="i">
                        <p>创建时间:{{item.createTime|dateTime}}</p>
                        <div class="task-desc">
                            <span>任务ID:{{item.number}}</span>
                            <van-button type="info" size="small"
                                        @click="taskDetail(item.status,item.qrUrl,item.publisher,item.number)"
                                        style="background: #62d3cc;border:none">查看详情
                            </van-button>
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
                    <div class="task-list-item" v-for="item in failTask" :key="item.number">
                        <p>创建时间:{{item.createTime|dateTime}}</p>
                        <div class="task-desc">
                            <span>任务ID:{{item.number}}</span>
                            <van-button type="info" size="small"
                                        @click="taskDetail(item.status,item.qrUrl,item.publisher,item.number)"
                                        style="background: #62d3cc;border:none">查看详情
                            </van-button>
                        </div>
                    </div>
                    <p @click="loadMoreFailTask" class="addMore" v-show="failMore">加载更多...</p>
                </div>
                <div style="padding-top:100px;" v-else>
                    暂时还没有失败的任务
                </div>
            </van-tab>
        </van-tabs>
        <van-dialog confirmButtonText="关闭" v-model="showTaskDetail" style="text-align:center">
            <div class="card">
                <div class="card-header" style="display:flex;justify-content:space-between;padding:10px 15px;">
                    <span>发布人:{{publisher}}</span>
                    <span :style="{color:getColor(taskStatus)}">{{taskStatus | status}}</span>
                </div>
                <p class="small">任务id:{{number}}</p>
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
                queryTime: new Date(),
                active: 0,
                ongoingTask: [],
                successTask: [],
                failTask: [],
                showDatePicker: false,
                minDate: new Date(2019, 0, 1),
                currentDate: new Date(),
                showTaskDetail: false,
                qrcodeData: '',
                taskStatus: '',
                qrcodeUrl: '',
                pnR: 1,
                totalPageR: 0,
                pnS: 1,
                totalPageS: 0,
                pnF: 1,
                totalPageF: 0,
                goingMore: true,
                successMore: true,
                failMore: true,
                publisher: '',
                number: '',
                timer1:null,
                nowTime: new Date().getTime(),
            }
        },
        methods: {
            handleClick(index, title) {
                switch (index + 1) {
                    case 1:
                        this.axios.get(`/api/task/claimed?pn=1&ps=20&status=1`).then(res => {
                            if(res.data.code === 200){
                                this.ongoingTask = res.data.data.list.list;
                                this.totalPageR = Math.ceil(res.data.data.list.total / 20);
                                if (this.ongoingTask.length < res.data.data.list.total) {
                                    this.goingMore = true;
                                } else {
                                    this.goingMore = false;
                                }
                            }else{
                                this.$toast({message:res.data.message})
                            }

                        });
                        break;
                    case 2:
                        this.axios.get(`/api/task/claimed?pn=1&ps=20&status=2`).then(res => {
                            if(res.data.code === 200){
                                this.successTask = res.data.data.list.list;
                                this.totalPageS = Math.ceil(res.data.data.list.total / 20);
                                if (this.successTask.length < res.data.data.list.total) {
                                    this.successMore = true;
                                } else {
                                    this.successMore = false;
                                }
                            }else{
                                this.$toast({message: res.data.message})
                            }

                        });
                        break;
                    case 3:
                        this.axios.get(`/api/task/claimed?pn=1&ps=20&status=3`).then(res => {
                            if(res.data.code === 200){
                                this.failTask = res.data.data.list.list;
                                this.totalPageF = Math.ceil(res.data.data.list.total / 20);
                                if (this.failTask.length < res.data.data.list.total) {
                                    this.failMore = true;
                                } else {
                                    this.failMore = false;
                                }
                            }else{
                                this.$toast({message : res.data.code})
                            }

                        });
                        break;
                }
            },
            taskDetail(status, qrurl, publisher, number) {
                this.showTaskDetail = true;
                this.taskStatus = status -1;
                this.qrcodeUrl = qrurl;
                this.publisher = publisher;
                this.number = number;
                var qrcode = require('qrcode');
                qrcode.toDataURL(qrurl, {
                    width: '250',
                    height: '250',
                    margin:1,
                }, (err, url) => {
                    this.qrcodeData = url
                })
            },
            getColor(status) {
                if (status === 2) {
                    return 'red'
                } else if (status === 1) {
                    return 'green'
                } else if (status === 0) {
                    return 'blue'
                }
            },
            loadMoreRunningTask() {
                //加载更多进行中的任务
                if (this.pnR < this.totalPageR) {
                    this.pnR++;
                    this.axios.get(`/api/task/claimed?pn=${this.pnR}&ps=10&status=1`).then(res => {
                        if(res.data.code === 200){
                            this.ongoingTask = this.ongoingTask.concat(res.data.data.list.list);
                            if (this.ongoingTask.length < res.data.data.list.total) {
                                this.goingMore = true;
                            } else {
                                this.goingMore = false;
                            }
                        }else{
                            this.$toast({message : res.data.message})
                        }

                    })
                }
            },
            loadMoreSuccessTask() {
                //加载更多成功的任务
                if (this.pnS < this.totalPageS) {
                    this.pnS++;
                    this.axios.get(`/api/task/claimed?pn=${this.pnS}&ps=20&status=2`).then(res => {
                        if(res.data.code === 200){
                            this.successTask = this.successTask.concat(res.data.data.list.list);
                            if (this.successTask.length < res.data.data.list.total) {
                                this.successMore = true;
                            } else {
                                this.successMore = false;
                            }
                        }else{
                            this.$toast({message : res.data.message})
                        }

                    })
                }
            },
            loadMoreFailTask() {
                //加载更多失败的任务
                if (this.pnF < this.totalPageF) {
                    this.pnF++;
                    this.axios.get(`/api/task/claimed?pn=${this.pnF}&ps=20&status=3`).then(res => {
                        if(res.data.code === 200){
                            this.failTask = this.failTask.concat(res.data.data.list.list);
                            if (this.failTask.length < res.data.data.list.total) {
                                this.failMore = true;
                            } else {
                                this.failMore = false;
                            }
                        }else{
                            this.$toast({message : res.data.message})
                        }
                    })
                }
            }
        },
        mounted() {
            //进行中的任务
            this.axios.get(`/api/task/claimed?pn=1&ps=20&status=1`).then(res => {
                if(res.data.code === 200){
                    this.ongoingTask = res.data.data.list.list;
                    this.totalPageR = Math.ceil(res.data.data.list.total / 20);
                    if (this.ongoingTask.length < res.data.data.list.total) {
                        this.goingMore = true;
                    } else {
                        this.goingMore = false;
                    }
                }else{
                    this.$toast({message:res.data.message})
                }

            });
            this.timer1 = window.setInterval(() => {
                this.nowTime = new Date().getTime();
                this.num--;
                if (this.num <= 0) {
                    this.timer1 = null;
                    this.num = 3;
                    this.canReplay = true
                }
            }, 1000)
        },
    }
</script>

<style lang="scss" scoped>
    #task-details{
        display: flex;
        justify-content: space-between;
    }
    .task-details{
        background: #62d3cc;
        border:none;
        border-radius: 5px;
    }
    .van-button--large {
        width: 90%;
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
    }

    .task-center {
        .query-btn {
            margin: 20px 0;
        }

        .van-tabs--line {
            padding-bottom: 45px;
        }

        table {
            border-collapse: collapse;
            font-size: 14px;
            width: 100%;
            text-align: center;

            th, td {
                border: 1px solid #e8e8e8;
                padding: 5px;
            }
        }

        .task-list {
            .task-list-item {
                font-size: 14px;
                text-align: left;
                border-bottom: 1px solid #eee;
                padding: 5px 15px;
                line-height: 30px;

                .task-desc {
                    display: flex;
                    justify-content: space-between;

                    span {
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .addMore {
        font-size: 12px;
        padding: 4px 0;
    }

    .small {
        font-size: 12px;
        text-align: left;
        padding-left: 14px;
    }
</style>
