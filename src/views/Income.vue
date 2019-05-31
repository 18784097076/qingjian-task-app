<template>
    <div>
        <ul>
            <li class="taskList" v-for="(v,i) in income" :key="i"><p>{{v.createTime|dateTime}}</p><div><p  style="font-size:12px">来源：{{v.title}}</p><p>+ <span class="income">{{Number(v.amount).toFixed(2)}} </span></p></div></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                income:[],
            }
        },
        methods:{

        },
        mounted(){
            let end=new Date().getTime();
            this.axios.get('/api/bill/list?end='+end+'&pn=1&ps=10&start=0&type=1').then(res=>{
                this.income=res.data.data.list.list
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
</style>