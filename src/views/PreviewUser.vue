<template>
    <div>
        <ul>
            <li class="previewUser"><p>上级: {{previewUser.user}}</p><p>邀请码: {{previewUser.code}}</p></li>
        </ul>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                previewUser:{"user":"15982706431","code":"DE555D"}
            }
        }
    }
</script>

<style scoped>
    .previewUser{
        display:flex;
        justify-content: space-between;
        padding:20px 20px;
        border-bottom:1px solid #eee;
    }
</style>