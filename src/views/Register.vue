<template>
    <div>
        <header>
            <span><van-icon name="arrow-left" @click="returnTo"/></span>
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
                <van-button type="info" class="getVerifyCode" @click="getVerifyCode">获取验证码</van-button>
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
            <van-button type="info" class="registerCommit">注册</van-button>
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
                code:'W3D23',
                verifyCode:'',
                verifyPassword:'',
                num:60,
                msg:"",
            }
        },
        methods:{
            getVerifyCode(ev){
                ev.target.innerText=this.num+'s后重新获取';
                let that=this;
                let timer=setInterval(function () {
                    if(that.num>0){
                        parseInt(that.num--);
                        ev.target.innerText=that.num+'s后重新获取';
                    }
                    else if(that.num==0){
                        ev.target.innerText='重新获取';
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
            returnTo(){
                this.$router.go(-1);
            },
            returnToLogin(){
                this.$router.push('/login');
            }
        }
    }

</script>

<style scoped>
    header{
        text-align: center;
        line-height:50px;
        color: deepskyblue;
    }
    header span{
        position: absolute;
        left:10px;
        top:4px;
        color: deepskyblue;
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
        color: deepskyblue;
        font-size:14px;
        position:absolute;
        right:20px;
        top:330px;
    }
</style>