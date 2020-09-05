import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
// import '../static/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import store from './vuex/app-store.js'

import './assets/iconfont/iconfont.css'//iconfont
import gcoord from 'gcoord'



// import FileSaver from 'file-save';//导出excel
// import XLSX from 'xlsx';//导出excel

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;
Vue.prototype.$gcoord=gcoord;

// Vue.prototype.$FileSaver = FileSaver;
// Vue.prototype.$XLSX = XLSX;

//格式化时间
Vue.prototype.formatTime = function (time, type, doubleNum) {
    /**time:需要转换的时间；
     * type：需要格式化的类型y(y)、y-m(m)、y-m-d(d)/y-m-d h:m:s(默认)；
     * doubleNum：月日时分秒的类型，例如2017-6('1') or 2017-06(默认)**/
    let mydate = time ? new Date(time) : new Date();
    let year = mydate.getFullYear();
    let month = mydate.getMonth() + 1;
    let day = mydate.getDate();
    let hour = mydate.getHours();
    let minute = mydate.getMinutes();
    let second = mydate.getSeconds();
    if (!doubleNum) {
      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;
      hour = hour < 10 ? '0' + hour : hour;
      minute = minute < 10 ? '0' + minute : minute;
      second = second < 10 ? '0' + second : second;
    }
    if (type == 'y') {
      return year;
    } else if (type == "m") {
      return year + '-' + month;
    } else if (type == 'd') {
      return year + '-' + month + '-' + day;
    } else {
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ":" + second;
    }
}

Vue.prototype.newuuid=function() {
  var guid = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid1 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid2 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid3 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid5 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid6 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  var guid7 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (guid + guid1 + "-" + guid2 + "-" + guid3 + "-" + guid4 + "-" + guid5 + guid6 + guid7);
}

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = localStorage.getItem('ms_username');
    if(!role && to.path !== '/login'){
        next('/login');
    }else if(to.meta.permission){
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    }else{
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        }else{
            next();
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');