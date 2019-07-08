<template>
    <div class="content">
        <header class="cashTitle">
            <p>可以提现的金额是: <span> {{toCash.toFixed(2)}} </span> 元</p>
            <van-field
                    v-model="cash"
                    placeholder="你要提现的金额"
                    class="inputCash"
            />
            <van-button type="danger" size="small" @click="tocash" class="toCash" round>提现</van-button>
        </header>
        <section class="cashTitle">
            <p>提现规则：</p>
            <div class="toCashRules">
                <!--<p>1、提现金额必须大于10元</p>-->
                <p>1、每天仅可提现一次</p>
                <p>2、支付宝账户不可更换</p>
                <!--<p>4、每次提现平台收取一元手续费</p>-->
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
            <van-button type="info" v-show="ifBindAlipay" round size="small" @click="toBindAlipay" class="bindAlipayBtn"
                        style="background: #62d3cc;border:none">绑定支付宝账户
            </van-button>
            <div id="bindAlipayInfo" v-show="!ifBindAlipay">
                <van-field
                        v-model="AlipayRealName"
                        required
                        clearable
                        label="真实姓名"
                        placeholder="请输入您的真实姓名"
                        :error-message="errRealName"
                        @focus="nameFocus"
                />
                <van-field
                        v-model="AlipayID"
                        label="支付宝账户"
                        placeholder="请输入您的支付账户"
                        required
                        :error-message="errID"
                        @focus="idFocus"
                />
                <p id="tips">支付宝账户绑定后不可更改</p>
                <van-button type="info" class="bind" @click="bind" size="small" round
                            style="background: #62d3cc;border:none">确认绑定
                </van-button>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                toCash: 0,
                cash: "",
                AlipayRealName: "",
                AlipayID: "",
                ifAlipay: true,
                ifBindAlipay: true,
                displayNone: {
                    'display': 'none'
                },
                displayBlock: {
                    'display': 'block',
                },
                errRealName: "",
                errID: "",
            }
        },
        methods: {
            nameFocus(){
                this.errRealName = "";
            },
            idFocus(){
                this.errID = "";
            },
            toBindAlipay() {
                this.ifBindAlipay = false;
            },
            bind() {
                this.errRealName = "";
                this.errID = "";
                let name = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,6}$/.test(this.AlipayRealName);
                let phone = /^1[3456789]\d{9}$/.test(this.AlipayID);
                if (!name) {
                    this.errRealName = "请输入正确的姓名";
                } else if (!phone) {
                    this.errID = "请输入正确的支付宝账户";
                }else {
                    this.axios.post('/api/u/pay?payAccount=' + this.AlipayID + '&payName=' + this.AlipayRealName).then(res => {
                        if (res.data.code === 200) {
                            let that = this;
                            this.$toast({
                                message: '支付宝绑定成功！', onClose() {
                                    that.ifAlipay = true;
                                    that.errRealName = "";
                                    that.errID = "";
                                }, duration: 1000
                            });
                        } else {
                            this.$toast({message: res.data.message})
                        }
                    })
                }
                /*if (this.AlipayRealName === "" && !/[\u4E00-\u9FA5\uF900-\uFA2D]/.test(this.AlipayRealName)) {
                    this.errRealName = "请输入正确的姓名";
                } else if (this.AlipayID === "" && /^1[3456789]\d{9}$/.test(this.AlipayID)) {
                    this.errID = "请输入正确的支付宝账户";
                } else if (this.AlipayRealName !== "" && this.AlipayID !== "" && /^1[3456789]\d{9}$/.test(this.AlipayID) && /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(this.AlipayRealName)) {
                    this.axios.post('/api/u/pay?payAccount=' + this.AlipayID + '&payName=' + this.AlipayRealName).then(res => {
                        if (res.data.code === 200) {
                            let that = this;
                            this.$toast({
                                message: '支付宝绑定成功！', onClose() {
                                    that.ifAlipay = true;
                                    that.errRealName = "";
                                    that.errID = "";
                                }, duration: 1000
                            });
                        } else {
                            this.$toast({message: res.data.message})
                        }
                    })
                }*/
            },
            tocash() {
                if (Number(this.cash) > 0) {
                    this.axios.post('/api/bill/apply/withdraw?amount=' + this.cash).then(res => {
                        if (res.data.code === 200) {
                            this.$toast({message: '提现成功!'});
                            this.cash = '';
                        } else {
                            this.$toast({message: res.data.message});
                        }
                    })
                } else {
                    this.$toast({message: '提现金额必须大于0元'});
                    this.cash = '';
                }
            }
        },
        created() {
            this.axios.get('/api/u/info').then(res => {
                this.toCash = Number(res.data.data.detail.balance);
                if (!res.data.data.detail.payAccount) {
                    this.ifAlipay = false;
                } else {
                    /*this.ifAlipay = true;*/
                    this.ifAlipay = false;
                    this.AlipayRealName = res.data.data.detail.payName;
                    this.AlipayID = res.data.data.detail.payAccount;
                }
            })
        }
    }
</script>

<style scoped>
    .bind {
        width: 130px;
        margin: 20px 0;
    }

    .toCash {
        width: 130px;
        background: #62d3cc;
        border: none;
    }

    .content {
        width: 90%;
        margin: 0 auto;
        padding-bottom: 60px;
    }

    .cashTitle p {
        padding-top: 20px;
        text-align: left;
        margin-bottom: 20px;
    }

    .Alipay p {
        padding-top: 20px;
        text-align: left;
        margin-bottom: 20px;
    }

    header p span {
        color: red;
        font-style: italic;
        font-weight: bold;
    }

    .inputCash {
        border: 1px solid #eee;
        margin-bottom: 20px;
        height: 40px;
        padding: 8px 10px;
    }

    .toCashRules p {
        padding-left: 2em;
        font-size: 14px;
        line-height: 30px;
        margin: 0;
        padding-top: 0px;
    }

    .AlipayUserInfo p {
        padding-left: 2em;
        font-size: 14px;
        line-height: 30px;
        margin: 0;
        padding-top: 0px;
    }

    .addAlipay {
        margin-top: 20px;
    }

    .bindAlipayBtn {
        margin: 0 auto;
        width: 130px;
    }

    #tips {
        margin-top: 10px;
        text-align: right;
        color: red;
        font-size: 12px;
    }
</style>