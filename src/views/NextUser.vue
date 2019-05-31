<template>
    <div>
        <div id="nextUser">
            <p>1级人数：{{firstUserNum}}</p>
            <p>2级人数：{{secondUserNum}}</p>
        </div>
        <ul>
            <!--<li v-for="(v,i) in nextUser" :key="i" class="nextUser"><p>{{v.user}}</p><van-button type="info" size="small" :data-index="v.user" @touchstart="getNextUserDetail">查看详情</van-button></li>-->
            <li v-for="(v,i) in nextUser" :key="i" class="nextUser">
                <div>{{v.nickname}}</div>
                <div>
                    <p>成功 ： {{v.success}}</p>
                    <p>失败 ： {{v.failure}}</p>
                    <p>成功率 ： {{(v.success/v.total).toFixed(2)*100+'%'}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
failure: (...)
id: (...)
nickname: (...)
running: (...)
success: (...)
timeout: (...)
total: (...)
unclaimed: (...)
<script>
    export default {
        data(){
            return{
                //{"user":"qwe123","code":"WE34D"},{"user":"qwe123","code":"WE34D"},{"user":"qwe123","code":"WE34D"}
                nextUser:[],
                firstUserNum:0,
                secondUserNum:0,
            }
        },
        methods:{
            getNextUserDetail(e){
                this.$router.push(`/nextUserDetail/${e.target.dataset.index}`);
            },
        },
        mounted(){
            this.axios.get('/api/team/member?pn=1&ps=10').then(res=>{
                this.secondUserNum=res.data.data.pp;
                this.firstUserNum=res.data.data.list.total;
                this.nextUser=res.data.data.list.list
            })
        }
    }
</script>

<style scoped>
    .nextUser{
        display: flex;
        /*justify-content: space-between;*/
        border-bottom:1px solid #eee;
        padding:4px 20px;
        align-items: center;
        margin:0px 20px;
    }
    #nextUser p{
        color:red;
    }
    .nextUser>div{
        flex:1;
        text-align: left;
        color:grey;
    }
    .nextUser p{
        font-size: 12px;
        color:grey;
    }
    #nextUser{
        display: flex;
        justify-content: space-around;
        border-bottom:1px solid #eee;
        align-items: center;
        padding:10px 0px;
        margin:0px 20px;
    }
    #nextUser>div{
        flex:1;
        text-align: left;
    }
</style>