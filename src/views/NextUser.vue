<template>
    <div>
        <ul>
            <li v-for="(v,i) in nextUser" :key="i" class="nextUser"><p>{{v.user}}</p><van-button type="info" size="small" :data-index="v.user" @touchstart="getNextUserDetail">查看详情</van-button></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                nextUser:[{"user":"qwe123","code":"WE34D"},{"user":"qwe123","code":"WE34D"},{"user":"qwe123","code":"WE34D"}]
            }
        },
        methods:{
            getNextUserDetail(e){
                this.$router.push(`/nextUserDetail/${e.target.dataset.index}`);
                console.log(e.target.dataset.index);
            },
        }
    }
</script>

<style scoped>
    .nextUser{
        display: flex;
        justify-content: space-between;
        border-bottom:1px solid #eee;
        padding:10px 20px;
    }
</style>