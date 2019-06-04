<template>
    <div>
        <p id="noPay" v-show="!ifIncome">{{noIncome}}</p>
        <ul v-show="ifIncome">
            <li class="taskList" v-for="(v,i) in income" :key="i"><p>{{v.createTime|dateTime}}</p><div><p  style="font-size:12px">来源：{{v.title}}</p><p>+ <span class="income">{{Number(v.amount).toFixed(2)}} </span></p></div></li>
        </ul>
        <p id="more"><span @click="addMore" v-show="ifAddMore">点击加载更多</span></p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                income:[],
                page:1,
                ifAddMore:false,
                ifIncome:false,
                noIncome:"您暂时还没有收入!",
            }
        },
        methods:{
            addMore(){
                let end=new Date().getTime();
                this.page++;
                this.axios.get('/api/bill/list?end='+end+'&pn='+this.page+'&ps=10&start=0&type=1').then(res=>{
                    if(res.data.data.list.list.length!=0){
                        for(let i=0;i<res.data.data.list.list.length;i++){
                            this.income.push(res.data.data.list.list[i]);
                        }
                    };
                    if(this.income.length>=res.data.data.list.total){
                        this.ifAddMore=false;
                    }
                })
            }
        },
        mounted(){
            let end=new Date().getTime();
            this.axios.get('/api/bill/list?end='+end+'&pn=1&ps=10&start=0&type=1').then(res=>{
                if(res.data.data.list.list.length==0){
                    this.ifIncome=false;
                }else{
                    this.ifIncome=true;
                    this.income=res.data.data.list.list;
                        if(res.data.data.list.total>=10){
                            this.ifAddMore=true;
                        }
                }
            })
        }
    }
</script>

<style scoped>
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
    #noPay{
        line-height: 200px;
        color:red;
    }
</style>