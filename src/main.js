import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueClipboard   from 'vue-clipboard2'
import 'vant/lib/index.css'
import {Button,Field,Toast,NavBar,Tabbar,TabbarItem,Icon,Panel,Tab,Tabs,List,Popup,DatetimePicker,Dialog,Progress,CellGroup} from 'vant';

Vue.config.productionTip = false
Vue.prototype.axios = axios

axios.defaults.withCredentials = true



/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
Vue.prototype.axios.interceptors.request.use(config => {
  // iView.LoadingBar.start();
  // iView.Spin.show();
  const token = localStorage.getItem('token');
  token && (config.headers.token = token);
  return config;
}, error => Promise.error(error));
/* 响应拦截器 */
 
Vue.prototype.axios.interceptors.response.use(function (response) { // ①10010 token过期（30天） ②10011 token无效  
  if (response.data.code === 401) { 
      window.localStorage.removeItem('token') // 删除已经失效或过期的token（不删除也可以，因为登录后覆盖） 
      Toast.fail('验证已失效,请重新登录')
      router.replace({
          path: '/login' // 到登录页重新获取token
      }) 
  }
      return response 
  }, function (error) {
      return Promise.reject(error)
  })
Vue.use(VueClipboard);
Vue.use(Button);
Vue.use(Field);
Vue.use(Toast);
Vue.use(NavBar);
Vue.use(Tabbar).use(TabbarItem);
Vue.use(Icon);
Vue.use(Panel);
Vue.use(Tab).use(Tabs);
Vue.use(List);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(Dialog);
Vue.use(Progress);
Vue.use(CellGroup);

Vue.filter('dateTime', (val) => {
  var date = new Date(val);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var f = date.getMinutes();
  var s = date.getSeconds();
  h < 10 && (h = '0' + h);
  f < 10 && (f = '0' + f);
  s < 10 && (s = '0' + s);
  return `${y}-${m}-${d} ${h}:${f}:${s}`
});
Vue.filter('successRate',val=>{
  if(isNaN(val)){
    return '0%';
  }else{
    return val+'%';
  }
})

Vue.filter('status', (val) => {
  if (val == 3) {
      return '失败'
  } else if (val == 2) {
      return '成功'
  }else if(val ==1 ){
      return '进行中'
  }
})

//倒计时过滤器
Vue.filter('countdown',(val)=>{
  console.log(val)
  var ts = parseInt(val/1000)
  console.log(ts)
  var m = parseInt(ts/60)<10?'0'+parseInt(ts/60):parseInt(ts/60)
  var s = ts%60<10?'0'+ts%60:ts%60
  return `${m}:${s}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
