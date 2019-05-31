import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import TaskList from './views/TaskList.vue'
import TaskCenter from './views/TaskCenter.vue'
import UserCenter from './views/UserCenter.vue'
import Register from './views/Register.vue';
import Income from './views/Income.vue';
import Pay from './views/Pay';
import CashWithdrawal from './views/CashWithdrawal';
import PreviewUser from './views/PreviewUser';
import NextUser from './views/NextUser';
import AlipayInfo from './views/AlipayInfo';
import NextUserDetail from './views/NextUserDetail';
import FindPwd from './views/FindPwd'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path:'/Register',component:Register},
        { path:'/findPwd',component:FindPwd},
        {
            path: '/home',
            component: Home,
            children:[
                {path:'/',redirect:'/taskList'},
                {path:'/taskList',component:TaskList},
                {path:'/taskCenter',component:TaskCenter},
                {path:'/userCenter',component:UserCenter},
                { path:'/income',component:Income},
                { path:'/pay',component:Pay},
                { path:'/cashWithdrawal',component:CashWithdrawal},
                { path:'/previewUser',component:PreviewUser},
                { path:'/nextUser',component:NextUser},
                { path:'/alipayInfo',component:AlipayInfo},
                { path:'/nextUserDetail/:index',component:NextUserDetail},
            ]
        }
    ]
})