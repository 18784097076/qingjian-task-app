import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.axios = axios

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

import 'vant/lib/index.css'
import {Button,Field,Toast,NavBar,Tabbar, TabbarItem,Icon,Panel,Tab,Tabs,List} from 'vant'
Vue.use(Button)
Vue.use(Field);
Vue.use(Toast);
Vue.use(NavBar);
Vue.use(Tabbar).use(TabbarItem);
Vue.use(Icon);
Vue.use(Panel);
Vue.use(Tab).use(Tabs);
Vue.use(List)

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
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
