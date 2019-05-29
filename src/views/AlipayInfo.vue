<template>
    <div>
        <header>
            添加支付宝账户
        </header>
        <section>
            <div>
                <p>姓名： {{realName}}</p>
                <p>支付宝账户：{{alipayId}}</p>
            </div>

        </section>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                realName:"smallFat",
                alipayId:"15982706431",
            }
        }
    }
</script>

<style scoped>
    header{
        line-height: 28px;
        background: rgba(38,162,255,.5);
        /*color:white;*/
    }
    section{
        width: 280px;
        margin:100px auto;
        border: 1px solid #eee;
        background: rgba(38,162,255,.5);
        /*border-radius: 50%;*/
        height:280px;
        position: relative;
        display: flex;
        align-items: center;
    }
    section p{
        text-align: center;
        line-height: 40px;
        font-size:14px;
        color:black;
    }
    section div{
        flex:1;

    }
</style>