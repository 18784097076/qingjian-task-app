<template>
    <div>
        <p id="noPay" v-show="!ifNext">{{noNext}}</p>
        <div v-show="ifNext">
            <div id="nextUser">
                <p>一级人数：{{firstUserNum}}</p>
                <p>二级人数：{{secondUserNum}}</p>
            </div>
            <p id="tips">该列表只展示一级下级</p>
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
    </div>
</template>
<script>
    export default {
        data(){
            return{
                nextUser:[],
                firstUserNum:0,
                secondUserNum:0,
                noNext:"您暂时还没有下级!",
                ifNext:false,
                ifAddMore:false,
                page:1,
            }
        },
        methods:{
            addMore(){
                this.page++;
                this.axios.get('/api/team/member?pn='+this.page+'&ps=10').then(res=>{
                    if(res.data.data.list.list.length!=0){
                        for(let i=0;i<res.data.data.list.list.length;i++){
                            this.nextUser.push(res.data.data.list.list[i]);
                        }
                    };
                    if(this.nextUser.length>=res.data.data.list.total){
                        this.ifAddMore=false;
                    };
                })
            },
        },
        mounted(){
            this.axios.get('/api/team/member?pn=1&ps=10').then(res=>{
                if(res.data.data.list.list.length==0){
                    this.ifNext=false;
                }else{
                    this.ifNext=true;
                    this.secondUserNum=res.data.data.pp;
                    this.firstUserNum=res.data.data.list.total;
                    this.nextUser=res.data.data.list.list;
                    if(res.data.data.list.total>=10){
                        this.ifAddMore=true;
                    };
                }
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
    /*#nextUser p{*/
        /*color:red;*/
    /*}*/
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
        align-items: center;
        padding:10px 0px;
        margin:0px 20px;
    }
    #nextUser>div{
        flex:1;
        text-align: left;
    }
    #tips{
        text-align: right;
        font-size:12px;
        margin:0px 20px;
        color:red;
        border-bottom:1px solid #eee;
        padding-bottom: 4px;
    }
    #noPay{
        line-height: 200px;
        color:red;
    }
    #more{
        font-size: 12px;
        color:gray;
        padding:6px 0;
    }
</style>