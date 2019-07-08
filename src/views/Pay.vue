<template>
    <div>
        <p id="noPay" v-show="!ifPay">{{noPay}}</p>
        <ul v-show="ifPay">
            <li class="taskList" v-for="(v,i) in pay" :key="i">
                <div id="pay">
                    <p>{{v.createTime|dateTime}}</p>
                    <p class="status">{{v.status| getStatus}}</p>
                </div>
                <div>
                    <p style="font-size:12px">提现</p>
                    <p>
                        <span class="income"> {{ v.status === 2 ? '+'+Number(v.amount).toFixed(2) : '-'+Number(v.amount).toFixed(2)}} </span>
                    </p>
                </div>
            </li>
        </ul>
        <p id="more"><span @click="addMore" v-show="ifAddMore">点击加载更多</span></p>
        <div style="height: 50px"></div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                pay:[],
                noPay:"您暂时还没有提现记录!",
                ifPay:false,
                ifAddMore:false,
                page:1,
            }
        },
        methods:{
            addMore(){
                let end=new Date().getTime();
                this.page++;
                this.axios.get('/api/bill/apply/list?end='+end+'&pn='+this.page+'&ps=10&start=0').then(res=>{
                    if(res.data.data.list.list.length!=0){
                        for(let i=0;i<res.data.data.list.list.length;i++){
                            this.pay.push(res.data.data.list.list[i]);
                        }
                    };
                    if(this.pay.length>=res.data.data.list.total){
                        this.ifAddMore=false;
                    }
                })
            }
        },
        activated(){
            let end= new Date().getTime();
            this.axios.get('/api/bill/apply/list?end='+end+'&pn=1&ps=10&start=0').then(res=>{
                if(res.data.data.list.list.length === 0){
                    this.ifPay=false;
                }else{
                    this.ifPay=true;
                    this.pay=res.data.data.list.list;
                    if(res.data.data.list.total>=10){
                        this.ifAddMore=true;
                    }
                }
            })
        }
    }
</script>

<style scoped>
    #pay{
        display: flex;
        justify-content: space-between;
    }
    #noPay{
        line-height: 200px;
        color:red;
    }
    .taskList{
        border-bottom:1px solid #eee;
        padding:10px 0px;
        margin:0 20px;
    }
    .taskList p{
        text-align: left;
        font-size:14px;
        line-height:24px;
    }
    .taskList div{
        display: flex;
        justify-content: space-between;
    }
    .income{
        color:red;
        font-weight: bold;
        font-style: italic;
    }
    #more{
        font-size: 12px;
        color:gray;
        padding:6px 0;
    }
    .status{
        font-size: 12px;
        color: red;
    }
</style>