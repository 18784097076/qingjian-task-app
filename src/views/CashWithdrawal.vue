<template>
    <div class="content">
        <header class="cashTitle">
            <p>可以提现的金额是: <span> {{toCash.toFixed(2)}} </span> 元</p>
            <van-field
                    v-model="cash"
                    placeholder="你要提现的金额"
                    class="inputCash"
            />
        </header>
        <section class="cashTitle">
            <p>提现规则：</p>
            <div class="toCashRules">
                <p>1、提现金额必须大于10元</p>
                <p>2、每天仅可提现一次</p>
                <p></p>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                toCash:0,
                cash:"",
            }
        }
    }
</script>

<style scoped>
    .content{
        width: 90%;
        margin:0 auto;
    }
    header{

    }
    .cashTitle p{
        padding-top:20px;
        text-align: left;
        margin-bottom:20px;
    }
    header p span{
        color:red;
        font-style: italic;
        font-weight: bold;
    }
    .inputCash{
        border:1px solid #26a2ff
    }
    .toCashRules p{
        padding-left:2em;
        font-size: 14px;
        line-height: 20px;
        margin:0;
    }
</style>