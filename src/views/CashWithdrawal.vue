<template>
    <div class="content">
        <header class="cashTitle">
            <p>可以提现的金额是: <span> {{toCash.toFixed(2)}} </span> 元</p>
            <van-field
                    v-model="cash"
                    placeholder="你要提现的金额"
                    class="inputCash"
            />
            <van-button type="danger" @touchstart="tocash">提现</van-button>
        </header>
        <section class="cashTitle">
            <p>提现规则：</p>
            <div class="toCashRules">
                <p>1、提现金额必须大于10元</p>
                <p>2、每天仅可提现一次</p>
                <p>3、支付宝账户不可更换</p>
            </div>
        </section>
        <section class="Alipay" :style="ifAlipay?displayBlock:displayNone">
            <p>支付宝信息：</p>
            <div class="AlipayUserInfo">
                <p>真实姓名：{{AlipayRealName}}</p>
                <p>支付宝账户：{{AlipayID}}</p>
            </div>
        </section>
        <section :style="ifAlipay?displayNone:displayBlock" class="addAlipay">
            <van-button type="info" :style="ifBindAlipay?displayBlock:displayNone" @touchstart="toBindAlipay" class="bindAlipayBtn">绑定支付宝账户</van-button>
            <div id="bindAlipayInfo" :style="ifBindAlipay?displayNone:displayBlock">
                <van-field
                        v-model="AlipayRealName"
                        required
                        clearable
                        label="真实姓名"
                        placeholder="请输入您的真实姓名"
                        :error-message="errRealName"
                />
                <van-field
                        v-model="AlipayID"
                        label="支付宝账户"
                        placeholder="请输入您的支付账户"
                        required
                        :error-message="errID"
                />
                <p id="tips">支付宝账户绑定后不可更改</p>
                <van-button type="info" style="margin-top: 20px" @touchstart="bind">确认绑定</van-button>
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
                AlipayRealName:"",
                AlipayID:"",
                ifAlipay:true,
                ifBindAlipay:true,
                displayNone:{
                    'display':'none'
                },
                displayBlock:{
                    'display':'block',
                },
                errRealName:"",
                errID:"",
            }
        },
        methods:{
            toBindAlipay(){
                this.ifBindAlipay=false;
            },
            bind(){
                this.errRealName="";
                this.errID="";
                if(this.AlipayRealName==""){
                    this.errRealName="请输入正确的姓名";
                }else if(this.AlipayID==""){
                    this.errID="请输入正确的支付宝账户";
                }else if(this.AlipayRealName!="" || this.AlipayID!=""){
                    this.axios.post('/api/u/pay?payAccount='+this.AlipayID+'&payName='+this.AlipayRealName).then(res=>{
                        if(res.data.code=200){
                            let that =this;
                            this.$toast({message:'支付宝绑定成功！',onClose() {
                                    that.ifAlipay=true;
                                    that.errRealName="";
                                    that.errID="";
                                },duration:1000});
                        }else{
                            this.$toast({message:res.data.message})
                        }
                    })

                }
            },
            tocash(){
                this.axios.post('/api/bill/apply/withdraw?amount='+this.cash).then(res=>{
                    if(res.data.code==200){
                        this.$toast({message:'提现成功!'})
                    }else{
                        this.$toast({message:res.data.message})
                    }
                })
            }
        },
        created(){
            this.axios.get('/api/u/info').then(res=>{
                this.toCash=Number(res.data.data.detail.balance);
                if(!res.data.data.detail.payAccount){
                    this.ifAlipay=false;
                }else{
                    this.ifAlipay=true;
                    this.AlipayRealName=res.data.data.detail.payName;
                    this.AlipayID=res.data.data.detail.payAccount;
                }
            })
        }
    }
</script>

<style scoped>
    .content{
        width: 90%;
        margin:0 auto;
    }
    .cashTitle p{
        padding-top:20px;
        text-align: left;
        margin-bottom:20px;
    }
    .Alipay p{
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
        border:1px solid #26a2ff;
        margin-bottom:20px;
    }
    .toCashRules p{
        padding-left:2em;
        font-size: 14px;
        line-height: 30px;
        margin:0;
        padding-top:0px;
    }
    .AlipayUserInfo p{
        padding-left:2em;
        font-size: 14px;
        line-height: 30px;
        margin:0;
        padding-top:0px;
    }
    .addAlipay{
        margin-top:20px;
    }
    .bindAlipayBtn{
        margin:0 auto;
    }
    #tips{
        margin-top:10px;
        text-align: right;
        color: red;
        font-size: 12px;
    }
</style>