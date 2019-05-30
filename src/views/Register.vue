<template>
    <div>
        <header>
            <span><van-icon name="arrow-left" @click="returnToLogin"/></span>
            注册
        </header>
        <section>
            <van-field
                    v-model="phone"
                    label="手机号"
                    placeholder="请输入手机号"
            />
            <div id="verify">
                <van-field
                        v-model="verifyCode"
                        label="验证码"
                />
                <van-button type="info" class="getVerifyCode" @touchstart="getVerifyCode" :disabled="ifDisabled">获取验证码</van-button>
            </div>

            <van-field
                    v-model="password"
                    type="password"
                    label="密码"
                    placeholder="请输入密码"
            />
            <van-field
                    v-model="verifyPassword"
                    type="password"
                    label="确认密码"
                    placeholder="请确认密码"
                    :error-message="msg"
                    @blur="checkPassword"
            />
            <van-field
                    v-model="code"
                    type="text"
                    label="推荐码"
                    value="code"
                    disabled
            />
        </section>
        <footer>
            <van-button type="info" class="registerCommit" @touchstart="register">注册</van-button>
            <span @click="returnToLogin">返回登录</span>
        </footer>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                phone:'',
                password:'',
                code:'AJQNS28ABO',
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
                    console.log(res)
                })
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
                    // console.log(res.data);
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
            // this.code=this.$route.query.code;
        }
    }

</script>

<style scoped>
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
        color: #26a2ff;
    }
    #verify{
        position: relative;
    }
    .getVerifyCode{
        position: absolute;
        top:0px;
        right:0px;
    }
    foot{
        position:relative;
        width: 100%;
    }
    footer .registerCommit{
        position:absolute;
        left:50%;
        width:120px;
        margin-top:30px;
        margin-left:-60px;
        border-radius: 20px;
    }
    footer>span{
        color: #26a2ff;
        font-size:14px;
        position:absolute;
        right:20px;
        top:330px;
    }
</style>