<style scoped lang="scss">
    img {
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <img :src="rule" alt="" @click="begin">
</template>

<script>
    import rule_worker from "../../static/rule/rule_worker.jpg";
    import rule_tourist from "../../static/rule/rule_tourist.jpg";

    export default {
        data() {
            let type = this.getStorage("userInfo").user_type;
            return {
                rule: !type ? rule_tourist : rule_worker,
            }
        },

        created() {

        },

        mounted() {
            let ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.wxConfig();
            }
        },

        methods: {
            wxConfig() {
                return;
                // const URL = window.location.href; //.split('#')[0]
                //
                // this.post("jsapi/getJsapiSignature?local_url=" + URL,//encodeURIComponent(location.href.split('#')[0]), //URL, //encodeURIComponent()
                //     {}, {
                //         interfaceType: "weichat"
                //     }).then(response => {
                //     wx.config({
                //         debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                //         appId: response.appid, // 必填，公众号的唯一标识
                //         timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
                //         nonceStr: response.noncestr, // 必填，生成签名的随机串
                //         signature: response.signature, // 必填，签名，见附录1
                //         jsApiList: [
                //             'onMenuShareTimeline',
                //             'onMenuShareAppMessage',
                //             'onMenuShareQQ',
                //             'onMenuShareWeibo',
                //             'onMenuShareQZone']// 必填，需要使用的JS接口列表
                //     });
                //     wx.ready(() => {
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/newyear/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {
                                this.addGameTimes("ShareAppMessage")
                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });
                        // 分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "迎元旦 贴窗花", //标题
                            desc: "新年伊始是元旦，万象更新又一年，国安科技控股真诚答谢活动，欢迎您的参与。", //描述
                            link: "http://act.guoanfamily.com/staticWeb/newyear/#/",
                            imgUrl: "https://img.guoanfamily.com/www/newyearShare.jpg", //图片
                            trigger: (res) => {
                            },
                            success: (res) => {
                                this.addGameTimes("ShareTimeline")
                            },
                            cancel: (res) => {
                            },
                            fail: (res) => {
                            }
                        });

                        wx.error(function (res) {
                            console.error(res)
                        });
                //     })
                // });
            },

            addGameTimes(type){
                let userInfo = Object.assign(this.getStorage("userInfo"), {
                    share_type: type,
                });

                if(!userInfo.wx_id){
                    return;
                }

                this.post("addGameTimes", userInfo).then(res => {
                    if(res.Code === 0){
                        alert("分享成功")
                    }
                });
            },

            begin() {
                this.$router.push("/game");
            }
        },

        components: {}
    }
</script>
