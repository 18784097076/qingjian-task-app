<template>
    <div>
        <p id="user">{{this.user}}</p>
        <ul>
            <li class="taskList" v-for="(v,i) in income" :key="i"><p>{{v.createTime|dateTime}}</p><div><p>任务：{{v.id}}</p><p>+ <span class="income">{{Number(v.income).toFixed(2)}} </span></p></div></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                user:"",
                income:[{"createTime":1559184817947,"id":"242242","income":"5"},{"createTime":1559184817947,"id":"242242","income":"5"},{"createTime":1559184817947,"id":"242242","income":"5"}],
            }
        },
        mounted(){
            this.user=this.$route.params.index;
            console.log(this.$route.params.index);
        }
    }
</script>

<style scoped>
    .taskList{
        border-bottom:1px solid #eee;
        padding:10px 20px;
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
    #user{
        line-height: 40px;
    }
</style>