<template>
    <div id="container">
        <header id="head">
            <span><van-icon name="arrow-left" @click="returnToLogin"/></span>
            注册
        </header>
        <section class="container">
            <van-field
                    v-model="phone"
                    placeholder="请输入手机号"
            />
            <div id="verify">
                <van-field
                        v-model="verifyCode"
                        placeholder="请输入验证码"
                />
                <van-button class="getVerifyCode" @touchstart="getVerifyCode" :disabled="ifDisabled">获取验证码</van-button>
            </div>

            <van-field
                    v-model="password"
                    type="password"
                    placeholder="请输入密码"
            />
            <van-field
                    v-model="verifyPassword"
                    type="password"
                    placeholder="请确认密码"
                    :error-message="msg"
                    @blur="checkPassword"
            />
            <van-field
                    v-model="code"
                    type="text"
                    value="code"
                    placeholder="请输入推荐码"
                    class="inventionCode"
            />
        </section>
        <footer>
            <van-button type="info" @click="register" size="large" round class="registerCommit" style="background: #62d3cc;border:none">注册</van-button>
        </footer>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                phone:'',
                password:'',
                code:'W47JCD7FAA',
                verifyCode:'',
                verifyPassword:'',
                num:60,
                msg:"",//第二次输入密码与第一次输入密码不同的错误信息
                ifDisabled:false
            }
        },
        methods:{
            getVerifyCode(ev){
                let phone=this.phone;
                this.axios.post('/api/code/phone?number='+phone+'&type=1').then(res=>{
                    if(res.data.code==200){
                        this.ifDisabled=true;
                        ev.target.innerText=this.num+'s后重新获取';
                        let that=this;
                        let timer=setInterval(function () {
                            if(that.num>1){
                                parseInt(that.num--);
                                ev.target.innerText=that.num+'s后重新获取';
                            } else if(that.num==1){
                                that.ifDisabled=false;
                                ev.target.innerText='重新获取';
                                that.num=60;
                                clearInterval(timer)
                            }
                        },1000);
                    } else{
                        this.$toast({message:`${res.data.message}`})
                    }
                })

            },
            checkPassword(){
                this.msg="";
                if(this.password!=this.verifyPassword){
                    this.msg="两次输入密码不匹配！";
                }
            },
            returnToLogin(){
                this.$router.push('/login');
            },
            register(){
                this.axios.post(`/api/u/sign_up?inviteCode=${this.code}&password=${this.password}&phone=${this.phone}&phoneCode=${this.verifyCode}`).then(res=>{
                    if(res.data.code==200){
                        let that=this;
                        this.$toast({message:'注册成功! 即将前往登录!',onClose() {
                                that.$router.push('/login');
                            },duration:2000});
                    }else{
                        this.$toast({message:`${res.data.message}`})
                    }
                })
            }
        },
        mounted(){
            this.code=this.$route.query.code;
        }
    }

</script>

<style scoped>
    #container{
        /*margin-right: 14px;*/
    }
    header{
        text-align: center;
        line-height:50px;
        /*color: #ccc;*/
        font-weight: bold;
        font-size: 1.17em;
    }
    header span{
        position: absolute;
        left:10px;
        top:4px;
        color: #62d3cc;
    }
    #verify{
        position: relative;
    }
    .getVerifyCode{
        position: absolute;
        top:0px;
        right:0px;
        background: none;
        border: none;
        color: #62d3cc;
    }
    foot{
        position:relative;
        width: 100%;
    }
    footer .registerCommit{
        height: 40px;
        line-height: 40px;
        margin: 30px 14px 20px 14px;
        width: 92%;
    }
    footer>span{
        color: #62d3cc;
        font-size:14px;
        position:absolute;
        right:20px;
        top:330px;
    }
    .inventionCode{
        border-bottom:1px solid #eee;
        width: 96%;
        margin-left: 14px;
        padding-left: 0;
    }
    #head{
        border-bottom: 1px solid #eee;
        margin:0;
        width: 100%;
    }
    .container{
        margin-right: 14px;
    }
</style>