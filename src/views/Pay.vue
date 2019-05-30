<template>
    <div>
        <p id="noPay">{{noPay}}</p>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                pay:[],
                noPay:""
            }
        },
        methods:{

        },
        mounted(){
            if(this.pay.length==0){
                this.noPay="您暂时还没有支出！";
            }
        }
    }
</script>

<style scoped>
    #noPay{
        line-height: 200px;
        color:red;
    }
</style>