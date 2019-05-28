import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import TaskList from './views/TaskList.vue'
import TaskCenter from './views/TaskCenter.vue'
import UserCenter from './views/UserCenter.vue'
import Register from './views/Register.vue'

Vue.use(Router)

export default new Router({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path:'/Register',component:Register},
        {
            path: '/home',
            component: Home,
            children:[
                {path:'/',redirect:'/taskList'},
                {path:'/taskList',component:TaskList},
                {path:'/taskCenter',component:TaskCenter},
                {path:'/userCenter',component:UserCenter}
            ]
        }
    ]
})