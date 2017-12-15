/**
 * Created by Administrator on 2017/4/10 0010.
 */
//安装vux全局组件
import { AlertPlugin, ToastPlugin, XInput, XButton, Toast, ConfirmPlugin } from 'vux'


export default class {

    constructor() {

    }

    install(Vue, options) {
        Vue.use(AlertPlugin);
        Vue.use(ToastPlugin);
        Vue.use(ConfirmPlugin);
        Vue.component("XInput", XInput);
        Vue.component("XButton", XButton);
        Vue.component("Toast", Toast);
    }
}
