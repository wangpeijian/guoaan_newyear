<style lang="scss">

</style>

<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                show: true
            }
        },

        created() {
            //默认为云之家来源
            let source = -1;

            let ua = navigator.userAgent.toLowerCase();

            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                source = 0;
            } else if (ua.indexOf("qing") >= 0) {
                source = 1;
            }

            if (source === -1) {
                window.location.href = "http://act.guoanfamily.com/openweixin/user/getCode?redirect_url=" + window.location.href;
            }

            let userInfo = Object.assign(this.getStorage("userInfo"), {
                source: source,
            });
            this.setStorage("userInfo", userInfo);

            if (source === 0) {
                if (!userInfo.wx_id) {
                    let headimgurl = this.getQueryString("headimgurl");
                    let openid = this.getQueryString("openid");
                    if (openid) {
                        let userInfo = Object.assign(this.getStorage("userInfo"), {
                            source: source,

                            wx_id: openid,
                            wx_head: headimgurl,

                            yun_id: "",
                            yun_name: "",
                            yun_phone: "",
                        });
                        this.setStorage("userInfo", userInfo);
                        window.location.href = "http://act.guoanfamily.com/staticWeb/newyear/"
                    } else {
                        //跳转到微信授权链接
                        window.location.href = "http://act.guoanfamily.com/openweixin/user/getCode?redirect_url=" + window.location.href;
                    }
                }
            } else if (source === 1) {
                XuntongJSBridge.call('getPersonInfo', {}, result => {
                    let {name, userName, openId} = result.data;

                    let userInfo = Object.assign(this.getStorage("userInfo"), {
                        source: source,

                        yun_id: openId,
                        yun_name: name,
                        yun_phone: userName,

                        wx_id: "",
                        wx_head: "",
                        //wx_name: "",
                        //wx_phone: "",
                    });

                    this.setStorage("userInfo", userInfo);
                })
            }

        },

        mounted() {
            this.$router.replace("/")
        },

        methods: {
            getQueryString(name) {
                let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                let r = window.location.search.substr(1).match(reg);
                if (r != null) return decodeURIComponent(r[2]);
                return null;
            }
        },

        watch: {},

        components: {}
    }
</script>

