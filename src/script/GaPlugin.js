/**
 * Created by Administrator on 2017/4/10 0010.
 */

import { config } from '../config';

//保存所有的广播事件
window.EVENT_STORAGE = window.EVENT_STORAGE === undefined ? {} : window.EVENT_STORAGE;

export default class {

    constructor() {

    }

    install(Vue, options) {
        this.installMixin(Vue);

        this.installExtendsFunction();

        this.installComponent(Vue);

        this.installPrototype(Vue);

        this.installFilter(Vue);
    }

    /*------------------安装扩展方法------------------*/
    installMixin(Vue) {
        Vue.mixin({

            created(){

            },

            mounted() {
                //让页面加载好后滚动到顶部
                window.scrollTo(0, 0);
            },

            methods: {

            },
        })
    }

    installExtendsFunction() {
        /**
         * 扩展时间对象，增加Format方法
         */
        (function() {
            /*对Date的扩展，将 Date 转化为指定格式的String
             月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
             年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
             例子：
             (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
             (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
             支持时间格式化*/
            Date.prototype.Format = function(fmt) { //author: meizz
                let o = {
                    "M+": this.getMonth() + 1, //月份
                    "d+": this.getDate(), //日
                    "h+": this.getHours(), //小时
                    "m+": this.getMinutes(), //分
                    "s+": this.getSeconds(), //秒
                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                    "S": this.getMilliseconds() //毫秒
                };
                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                for (let k in o)
                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                return fmt;
            }
        }())
    }

    /*------------------添加vue组件------------------*/
    installComponent(Vue) {
    }

    /*------------------添加vue过滤器------------------*/
    installFilter(Vue) {

    }

    /*------------------添加vue实例方法------------------*/
    installPrototype(Vue) {
        //定义storage里面的key
        Vue.prototype.KEYS = {
            //记录当前登录的用户信息
            USER_INFO: 'USER_INFO',
        };

        //定义全局事件
        Vue.prototype.EVENTS = {

        };

        /**
         * 获取session中的对象
         * @param key
         */
        Vue.prototype.getSession = key => {
            let value = window.sessionStorage.getItem(key);
            if (value === "") {
                return null;
            }
            try {
                value = JSON.parse(value);
            } catch (e) {
                //console.error(e, key, value);
                return value;
            }

            return value;
        };

        /**
         * 设置、清空session中的对象
         * @param key
         * @param value
         */
        Vue.prototype.setSession = (key, value) => {
            if (value === undefined) {
                window.sessionStorage.removeItem(key);
            } else {

                if (typeof value === "object") {
                    value = JSON.stringify(value)
                }

                window.sessionStorage.setItem(key, value);
            }
        };

        /**
         * 获取storage中的对象
         * @param key
         */
        Vue.prototype.getStorage = key => {
            let value = window.localStorage.getItem(key);
            if (value === "") {
                return {};
            }
            try {
                value = JSON.parse(value);
            } catch (e) {
                //console.error(e, key, value);
                return value;
            }

            return value || {};
        };

        /**
         * 设置、清空Storage中的对象
         * @param key
         * @param value
         */
        Vue.prototype.setStorage = (key, value) => {
            if (value === undefined) {
                window.localStorage.removeItem(key);
            } else {

                if (typeof value === "object") {
                    value = JSON.stringify(value)
                }

                window.localStorage.setItem(key, value);
            }
        };

        /**
         * get请求
         * @param url
         * @param opinion
         * @returns {Promise.<TResult>}
         */
        Vue.prototype.get = function(url) {
            return fetch(config.INTERFACE + url, {
                method: 'get',
                headers: { "Content-Type": "application/json"},
            }).then(function(response) {
                return response.json();
            }).then(function(res) {
                console.group(`请求接口：${url}`);
                console.log("响应结果：", JSON.parse(JSON.stringify(res)));
                console.groupEnd();
                return res;
            }).catch(function(e) {
                console.error(e);
            })
        };

        /**
         * post请求
         * @param url
         * @param data
         * @param opinion
         * @returns {Promise.<TResult>}
         */
        Vue.prototype.post = function(url, data = {}, opinion = {
            interfaceType: ""
        }) {
            let requestUrl = config.INTERFACE;

            switch (opinion.interfaceType) {
                case "weichat":
                    requestUrl = config.WECHAT + url;
                    break;
                default:
                    break;
            }

            console.group(`请求接口：${url}`);
            console.log("求情参数：", data);

            return fetch(requestUrl + url, {
                method: 'post',
                headers: { "Content-Type": "application/json"},
                body: new Blob([JSON.stringify(data)], { type: 'application/json' }),
            }).then(function(response) {
                return response.json();
            }).then((res) => {

                console.log("响应结果：", JSON.parse(JSON.stringify(res)));
                console.groupEnd();
                return res;
            }).catch(function(e) {
                console.error(e);
                console.groupEnd();
            })
        };

        /**
         * 获取展示文件的url
         * @param fileName
         * @param w
         * @param h
         * @returns {string}
         */
        Vue.prototype.concatFileUrl = (fileName, w, h) => {
            let size = "";
            if (w !== undefined && h !== undefined) {
                size = `?imageView2/0/w/${w}/h/${h}`;
            }
            return config.IMAGE_PATH + `${fileName}${size}`;
        };

        /**
         * 新增一条订阅记录（用于组件间通信）
         *
         * @param eventName
         * @param owner
         * @param cb
         */
        Vue.prototype.subscribe = (eventName, owner, cb) => {
            let queue = window.EVENT_STORAGE[eventName];

            if (queue === undefined) {
                queue = [];
            }

            queue.push({
                owner: owner,
                cb: cb,
            });

            window.EVENT_STORAGE[eventName] = queue;
        };

        /**
         * 订阅者取消订阅消息（用于组件间通信）
         *
         * @param eventName
         * @param owner
         * @returns {boolean}
         */
        Vue.prototype.unsubscribe = (eventName, owner) => {
            let queue = window.EVENT_STORAGE[eventName];

            if (queue === undefined) {

                console.error(`取消订阅事件失败：${eventName},事件不存在`);
                return false;
            }

            window.EVENT_STORAGE[eventName] = queue.filter(obj => {
                return obj.owner !== owner;
            });
        };

        /**
         * 推送一条全局消息（用于组件间通信）
         *
         * @param eventName
         * @param sender
         * @param parameter
         * @param cb
         */
        Vue.prototype.broadcast = (eventName, sender, parameter, cb) => {
            let queue = window.EVENT_STORAGE[eventName];
            console.group("广播消息：", eventName);

            if (queue === undefined　 || queue.length === 0) {
                console.error(`推送事件：${eventName},不存在订阅者`);
                console.groupEnd();
                return false;
            }

            queue.map(obj => {
                obj.cb(parameter);
                console.log(`推送人：${sender},推送事件：${eventName},参数：${parameter},接收者：${obj.owner}`);
            });

            if (cb) {
                cb();
            }

            console.log(`接收者共：${queue.length}`);
            console.groupEnd();
        };

        /**
         * 下载一个文件
         *
         * @param url
         */
        Vue.prototype.downloadFile = (url) => {
            //默认在新窗口打开图片
            window.open(url);

            //开始下载
            let anchor = document.createElement("a");
            anchor.href = url;
            anchor.setAttribute("download", "");
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            setTimeout(function() {
                anchor.click();
                document.body.removeChild(anchor);
            }, 66);
        }

        /**
         * 文件上传拦截
         * @param file
         * @param type :  图片（pic）, 文档(file)
         */
        Vue.prototype.fileFilter = function(file, type = "pic") {
            let name = file.name;
            let arr = [];

            switch (type) {
                case "pic":
                    arr = ['.jpeg', '.jpg', '.png'];
                    break;
                case "file":
                    arr = ['.doc', '.docx', '.xls', '.xlsx', '.pdf', '.jpeg', '.png', '.jpg'];
                    break;
            }

            let ext = name.toLowerCase().split(".")[1];
            return arr.indexOf(`.${ext}`) !== -1;
        }

        /**
         * 校验客户是否是登录状态
         * @param login 是否需要跳转到登录页面
         * @param options 跳转到登录页面的附加参数
         * @returns {boolean}
         */
        Vue.prototype.verifyLogin = function(login = true, options = {
                query: "",
            }) {
                //不为空则为登录状态
                if (!!this.getStorage(this.KEYS.USER_TOKEN)) {
                    return true
                }
                if (login) {
                    window.location.href = config.LOGIN_PAGE_URL() //+ options.query;
                }

                return false;
            }
            /**
             * 判断是否是在微信端
             */
        Vue.prototype.isECTouch = function() {
            var ua = navigator.userAgent.toLowerCase(); //获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                //在微信中打开
                return true;
            } else {
                return false;
            }
        }

    }
}
