<style scoped lang="scss">
    img {
        height: 100%;
        width: 100%;
    }
</style>

<template>
    <img :src="cover">
</template>

<script>
    import index from "../../static/index/index.jpg";

    //其他页面的资源
    import body from "../../static/form/body.jpg";
    import header from "../../static/form/header.jpg";
    import start from "../../static/form/start.png";

    import gameBackground from "../../static/game/game_background.jpg";
    import gameWindow from "../../static/game/game_window.jpg";

    import image001 from "../../static/game/image001.png";
    import image002 from "../../static/game/image002.png";
    import image003 from "../../static/game/image003.png";
    import image004 from "../../static/game/image004.png";
    import image005 from "../../static/game/image005.png";
    import image006 from "../../static/game/image006.png";

    import rule_worker from "../../static/rule/rule_worker.jpg";
    import rule_tourist from "../../static/rule/rule_tourist.jpg";

    import scoreBackground from "../../static/score/score_background.jpg";
    import scoreBox from "../../static/score/score_box.png";
    import qrcode from "../../static/score/qrcode.jpg";

    export default {
        data() {
            return {
                cover: index,
            }
        },

        created() {
            setTimeout(() => {
                this.$router.push("/form")
            }, 2000)
        },

        mounted() {

            let ua = navigator.userAgent.toLowerCase()
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                this.wxConfig();
            }

        },

        methods: {
            wxConfig() {
                const URL = window.location.href; //.split('#')[0]

                this.post("jsapi/getJsapiSignature?local_url=" + URL,//encodeURIComponent(location.href.split('#')[0]), //URL, // encodeURIComponent(URL),
                    {}, {
                        interfaceType: "weichat"
                    }).then(response => {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: response.appid, // 必填，公众号的唯一标识
                        timestamp: parseInt(response.timestamp), // 必填，生成签名的时间戳
                        nonceStr: response.noncestr, // 必填，生成签名的随机串
                        signature: response.signature, // 必填，签名，见附录1
                        jsApiList: [
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'onMenuShareQZone']// 必填，需要使用的JS接口列表
                    });
                    wx.ready(() => {
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
                    })
                });
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
            }
        },

        components: {}
    }
</script>
