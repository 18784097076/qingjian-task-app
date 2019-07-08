<template>
    <div>
        <p id="noPay" v-show="!ifNext">{{noNext}}</p>
        <div v-show="ifNext">
            <div id="nextUser">
                <p>一级人数：{{firstUserNum}}</p>
                <p>二级人数：{{secondUserNum}}</p>
            </div>
            <div id="time">
                <div id="tips">该列表只展示一级下级</div>
                <div id="timeSelector">
                    <van-button class="timeSelector" @click="showTime" size="mini">{{new
                        Date(currentDate).toLocaleDateString()}}
                    </van-button>
                </div>
            </div>
            <ul>
                <!--<li v-for="(v,i) in nextUser" :key="i" class="nextUser"><p>{{v.user}}</p><van-button type="info" size="small" :data-index="v.user" @touchstart="getNextUserDetail">查看详情</van-button></li>-->
                <li v-for="(v,i) in nextUser" :key="i" class="nextUser">
                    <div>{{v.nickname}}</div>
                    <div>
                        <p>成功 ： {{v.success}}</p>
                        <p>失败 ： {{v.failure}}</p>
                        <p>成功率 ： {{(v.success/v.total).toFixed(2)*100 | successRate}}</p>
                    </div>
                </li>
            </ul>
            <p id="more"><span @click="addMore" v-show="ifAddMore">点击加载更多</span></p>
            <div style="height: 50px"></div>
        </div>
        <van-popup v-model="date" style="width:100%" position="bottom">
            <van-datetime-picker
                    v-model="currentDate"
                    type="date"
                    :max-date="new Date()"
                    @confirm="sureSelectDate"
                    @cancel="cancelSelectDate"
            />
        </van-popup>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                nextUser: [],
                firstUserNum: 0,
                secondUserNum: 0,
                noNext: "您暂时还没有下级!",
                ifNext: false,
                ifAddMore: false,
                page: 1,
                date: false,
                startDate: '',
                endDate: '',
                currentDate: new Date().toLocaleDateString(),
            }
        },
        methods: {
            sureSelectDate(val) {
                if (val.toLocaleDateString() === new Date().toLocaleDateString()) {
                    this.startDate = new Date().setHours(0, 0, 0, 0);
                    this.endDate = new Date().setHours(23, 59, 59, 999) + 1;
                } else {
                    this.startDate = val.getTime();
                    this.endDate = val.getTime() + 24 * 3600000;
                }
                this.date = false;
            },
            cancelSelectDate() {
                this.date = false;
            },
            showTime() {
                this.date = true;
            },
            addMore() {
                this.page++;
                this.axios.get('/api/team/member?pn=' + this.page + '&ps=10').then(res => {
                    if (res.data.data.list.list.length !== 0) {
                        /*for(let i=0;i<res.data.data.list.list.length;i++){
                            this.nextUser.push(res.data.data.list.list[i]);
                        }*/
                        this.nextUser.concat(res.data.data.list.list);
                    }
                    ;
                    if (this.nextUser.length >= res.data.data.list.total) {
                        this.ifAddMore = false;
                    }
                    ;
                })
            },
        },
        mounted() {
            this.startDate = new Date().setHours(0, 0, 0, 0);
            this.endDate = new Date().getTime();
            this.axios.get('/api/team/member?pn=1&ps=10&start=' + this.startDate + '&end=' + this.endDate).then(res => {
                if (res.data.data.list.list.length === 0) {
                    this.ifNext = false;
                } else {
                    this.ifNext = true;
                    this.secondUserNum = res.data.data.pp;
                    this.firstUserNum = res.data.data.list.total;
                    this.nextUser = res.data.data.list.list;
                    if (res.data.data.list.total >= 10) {
                        this.ifAddMore = true;
                    }
                    ;
                }
            })
        }
    }
</script>

<style scoped lang="scss">
    #time {
        display: flex;
        border-bottom: 1px solid #eee;
        padding-bottom: 4px;

        div {
            flex: 1;
        }

        div:nth-child(2) {
            text-align: left;
            color: #62d3cc;
        }
    }

    #timeSelector .timeSelector {
        color: #62d3cc;
        border: 1px solid #62d3cc;
        padding: 0 10px;
    }

    .nextUser {
        display: flex;
        /*justify-content: space-between;*/
        border-bottom: 1px solid #eee;
        padding: 4px 0px;
        align-items: center;
        margin: 0px 20px;
    }

    .nextUser > div {
        flex: 1;
        color: grey;
        text-align: left;
    }

    .nextUser > div:nth-child(2) {
        margin-left: 14%;
    }

    .nextUser p {
        font-size: 12px;
        color: grey;
    }

    #nextUser {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px 20px;
    }

    #nextUser > p {
        flex: 1;
        text-align: left;
    }

    #nextUser > p:nth-child(2) {
        margin-left: 14%;
    }

    #tips {
        text-align: left;
        font-size: 12px;
        margin: 3px 20px;
        color: #62d3cc;
    }

    #noPay {
        line-height: 200px;
        color: red;
    }

    #more {
        font-size: 12px;
        color: gray;
        padding: 6px 0;
    }
</style>