// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import 'babel-polyfill'

FastClick.attach(document.body);

Vue.config.productionTip = false;

/*---------------------------------------------------*/
//判断是否是生产环境，生产环境下，将console方法重写
if (process.env.NODE_ENV === 'production') {
    window.console.log = () => {};
    window.console.info = () => {};
    //window.console.error = () => {};
    Vue.config.silent = true;
}

//全局安装promise
import { install } from 'promise-es6'
install();

//全局安装fetch
import 'whatwg-fetch'

//安装自定义组件
import GaPlugin from './script/GaPlugin'
Vue.use(new GaPlugin());

//应用全局样式
import './style/public.scss';

//安装vux全局插件
import VuxRegister from './script/VuxRegister'
Vue.use(new VuxRegister());
/*---------------------------------------------------*/

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box')
